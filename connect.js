const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  jidNormalizedUser,
  downloadMediaMessage,
  getAggregateVotesInPollMessage,
} = require('@whiskeysockets/baileys');

const pino           = require('pino');
const path           = require('path');
const fs             = require('fs');
const config         = require('./config');
const logger         = require('./lib/logger');
const { handleMessage } = require('./handler');
const { storeDeletedMsg, getDeletedMessage } = require('./lib/database');
const { randomEmojis, pickRandom } = require('./lib/functions');

const SESSION_DIR = path.join(__dirname, 'session');
if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true });

// In-memory store for recent messages (needed for anti-delete)
const store = makeInMemoryStore({ logger: pino({ level: 'silent' }) });

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
  const { version } = await fetchLatestBaileysVersion();

  logger.info(`Starting ${config.botName} on WA v${version.join('.')}`);

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    browser: [config.botName, 'Chrome', '3.0.0'],
    syncFullHistory: false,
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    downloadMediaMessage,
  });

  store.bind(sock.ev);

  // ── Connection updates ─────────────────────────────────────────────────────
  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) logger.info('Scan QR code ↑');

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = code !== DisconnectReason.loggedOut;
      logger.warn(`Connection closed (code ${code}). Reconnect: ${shouldReconnect}`);
      if (shouldReconnect) setTimeout(startBot, 5000);
    }

    if (connection === 'open') {
      logger.info(`✅ ${config.botName} connected as ${sock.user?.id}`);
    }
  });

  sock.ev.on('creds.update', saveCreds);

  // ── Message upsert ─────────────────────────────────────────────────────────
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      try {
        if (!msg.message) continue;

        const jid        = msg.key.remoteJid;
        const isStatus   = jid === 'status@broadcast';

        // Store for anti-delete
        if (msg.key.id) storeDeletedMsg(msg.key.id, msg);

        // ── Auto status view & reply ───────────────────────────────────────
        if (isStatus) {
          if (config.autoStatusView) {
            await sock.readMessages([msg.key]).catch(() => {});
          }
          if (config.autoStatusReply && !msg.key.fromMe) {
            await sock.sendMessage(msg.key.participant || jid, {
              text: config.statusReplyMsg,
            }).catch(() => {});
          }
          continue;
        }

        // ── Auto read ──────────────────────────────────────────────────────
        if (config.autoRead && !msg.key.fromMe) {
          await sock.readMessages([msg.key]).catch(() => {});
        }

        // ── Auto react ────────────────────────────────────────────────────
        if (config.autoReact && !msg.key.fromMe) {
          const emoji = config.reactMode === 'fixed'
            ? config.fixedEmoji
            : pickRandom(randomEmojis);
          await sock.sendMessage(jid, {
            react: { text: emoji, key: msg.key },
          }).catch(() => {});
        }

        // ── View Once reader ──────────────────────────────────────────────
        if (config.viewOnce) {
          const viewOnceMsg = msg.message?.viewOnceMessage || msg.message?.viewOnceMessageV2;
          if (viewOnceMsg) {
            const innerMsg = viewOnceMsg.message;
            const type     = Object.keys(innerMsg || {})[0];
            if (type) {
              try {
                const buffer = await downloadMediaMessage(
                  { ...msg, message: innerMsg }, 'buffer', {},
                  { logger: pino({ level: 'silent' }), reuploadRequest: sock.updateMediaMessage }
                );
                const mediaType = type.includes('video') ? 'video' : type.includes('audio') ? 'audio' : 'image';
                await sock.sendMessage(sock.user.id.split(':')[0] + '@s.whatsapp.net', {
                  [mediaType]: buffer,
                  caption: `👁️ *View Once received from* @${(msg.key.participant || msg.key.remoteJid).split('@')[0]}`,
                });
              } catch {}
            }
          }
        }

        // ── Route to command handler ──────────────────────────────────────
        await handleMessage(sock, msg, store);
      } catch (err) {
        logger.error('Message handling error:', err.message);
      }
    }
  });

  // ── Anti-call ──────────────────────────────────────────────────────────────
  sock.ev.on('call', async ([call]) => {
    if (!config.antiCall) return;
    if (call.status === 'offer') {
      await sock.rejectCall(call.id, call.from).catch(() => {});
      await sock.sendMessage(call.from, {
        text: `❌ *Calls are not accepted by ${config.botName}.*\n\nPlease message instead.`,
      }).catch(() => {});
    }
  });

  // ── Anti-delete ────────────────────────────────────────────────────────────
  sock.ev.on('messages.delete', async (item) => {
    if (!config.antiDelete) return;
    const keys = item.keys || [];
    for (const key of keys) {
      const jid = key.remoteJid;
      if (!jid || jid === 'status@broadcast') continue;
      const deleted = getDeletedMessage(key.id);
      if (!deleted?.message) continue;
      const sender = key.participant || key.remoteJid;
      const senderNum = sender.split('@')[0];
      try {
        await sock.sendMessage(jid, {
          text: `🗑️ *Anti-Delete Alert!*\n\n👤 @${senderNum} deleted a message!`,
          mentions: [sender],
        });
        await sock.sendMessage(jid, { forward: deleted });
      } catch {}
    }
  });

  // ── Welcome / Goodbye ──────────────────────────────────────────────────────
  sock.ev.on('group-participants.update', async ({ id, participants, action }) => {
    const { getGroup } = require('./lib/database');
    const grp = getGroup(id);
    let metadata;
    try { metadata = await sock.groupMetadata(id); } catch { return; }

    for (const jid of participants) {
      const num = jid.split('@')[0];
      if (action === 'add' && grp.welcome) {
        await sock.sendMessage(id, {
          text: `👋 *Welcome to ${metadata.subject}!*\n\n🎉 @${num}, glad you joined!\n\n_Type ${config.prefix}help for commands._`,
          mentions: [jid],
        }).catch(() => {});
      }
      if (action === 'remove' && grp.goodbye) {
        await sock.sendMessage(id, {
          text: `👋 *Goodbye @${num}!*\n\n_We'll miss you in ${metadata.subject}._`,
          mentions: [jid],
        }).catch(() => {});
      }
    }
  });

  return sock;
}

module.exports = { startBot };
