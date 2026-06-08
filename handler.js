const fs     = require('fs');
const path   = require('path');
const config = require('./config');
const logger = require('./lib/logger');
const { getUser, saveUser, getGroup, saveGroup } = require('./lib/database');

// ── Load all commands from commands/ ─────────────────────────────────────────
const commands = new Map();
const aliases  = new Map();

const CMD_DIR = path.join(__dirname, 'commands');
const files   = fs.readdirSync(CMD_DIR).filter(f => f.endsWith('.js'));

for (const file of files) {
  try {
    const cmd = require(path.join(CMD_DIR, file));
    if (!cmd?.name) { logger.warn(`commands/${file}: missing name, skipped`); continue; }
    commands.set(cmd.name.toLowerCase(), cmd);
    if (Array.isArray(cmd.alias)) {
      cmd.alias.forEach(a => aliases.set(a.toLowerCase(), cmd.name.toLowerCase()));
    }
    logger.info(`Loaded command: ${cmd.name}`);
  } catch (err) {
    logger.error(`Failed to load commands/${file}: ${err.message}`);
  }
}

logger.info(`Total commands loaded: ${commands.size}`);

// ── Spam tracker ─────────────────────────────────────────────────────────────
const spamMap = new Map();
function isSpamming(jid) {
  const now  = Date.now();
  const last = spamMap.get(jid) || { count: 0, time: now };
  if (now - last.time > 5000) { spamMap.set(jid, { count: 1, time: now }); return false; }
  last.count++;
  spamMap.set(jid, last);
  return last.count > 6;
}

// ── Main handler ──────────────────────────────────────────────────────────────
async function handleMessage(sock, msg, store) {
  const jid    = msg.key.remoteJid;
  const isGroup = jid?.endsWith('@g.us');
  const msgObj  = msg.message;
  if (!msgObj) return;

  // Unwrap ephemeral / forwarded wrappers
  const content = msgObj.ephemeralMessage?.message
    || msgObj.viewOnceMessage?.message
    || msgObj.documentWithCaptionMessage?.message
    || msgObj;

  const type = Object.keys(content)[0];
  const body =
    content?.conversation ||
    content?.extendedTextMessage?.text ||
    content?.imageMessage?.caption ||
    content?.videoMessage?.caption ||
    content?.documentMessage?.caption ||
    '';

  if (!body.startsWith(config.prefix)) return;

  const args    = body.slice(config.prefix.length).trim().split(/\s+/);
  const cmdName = args.shift().toLowerCase();
  const cmdBody = args.join(' ');

  if (!cmdName) return;

  const resolvedName = aliases.get(cmdName) || cmdName;
  const cmd = commands.get(resolvedName);
  if (!cmd) return;

  // ── Sender info ────────────────────────────────────────────────────────────
  const senderJid = isGroup
    ? (msg.key.participant || msg.key.remoteJid)
    : msg.key.remoteJid;
  const senderNum = senderJid.split('@')[0];
  const isOwner   = senderNum === config.ownerNumber || senderNum === config.ownerNumber.replace(/^0/, '92');

  // ── Group info ─────────────────────────────────────────────────────────────
  let isAdmin = false;
  let isBotAdmin = false;
  let groupMeta = null;

  if (isGroup) {
    try {
      groupMeta = store?.chats?.get(jid) || await sock.groupMetadata(jid);
      const admins = groupMeta.participants.filter(p => p.admin).map(p => p.id);
      isAdmin    = admins.includes(senderJid);
      isBotAdmin = admins.includes(jidNormalizedUser(sock.user.id));
    } catch {}
  }

  // ── Permission checks ──────────────────────────────────────────────────────
  if (cmd.ownerOnly && !isOwner) {
    return sock.sendMessage(jid, { text: `❌ This command is *Owner Only.*\n> *Powered by Marco Malik*` }, { quoted: msg });
  }
  if (cmd.adminOnly && !isAdmin && !isOwner) {
    return sock.sendMessage(jid, { text: `❌ This command is *Admin Only.*\n> *Powered by Marco Malik*` }, { quoted: msg });
  }
  if (cmd.groupOnly && !isGroup) {
    return sock.sendMessage(jid, { text: `❌ This command can only be used in *groups.*\n> *Powered by Marco Malik*` }, { quoted: msg });
  }
  if (cmd.privateOnly && isGroup) {
    return sock.sendMessage(jid, { text: `❌ This command can only be used in *private chat.*\n> *Powered by Marco Malik*` }, { quoted: msg });
  }
  if (config.mode === 'private' && !isOwner) {
    return sock.sendMessage(jid, { text: `🔒 Bot is in *private mode.*\n> *Powered by Marco Malik*` }, { quoted: msg });
  }

  // ── Anti-spam ──────────────────────────────────────────────────────────────
  if (config.antiSpam && !isOwner && isSpamming(senderJid)) {
    return sock.sendMessage(jid, { text: `⏳ *Slow down!* You're sending commands too fast.\n> *Powered by Marco Malik*` }, { quoted: msg });
  }

  // ── User ban check ─────────────────────────────────────────────────────────
  const user = getUser(senderJid);
  if (user.banned && !isOwner) {
    return sock.sendMessage(jid, { text: `🚫 You are *banned* from using this bot.\n> *Powered by Marco Malik*` }, { quoted: msg });
  }

  // ── Quoted message helper ──────────────────────────────────────────────────
  const quotedObj = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
    ? {
        message: msg.message.extendedTextMessage.contextInfo.quotedMessage,
        key: {
          remoteJid: jid,
          fromMe: false,
          id: msg.message.extendedTextMessage.contextInfo.stanzaId,
          participant: msg.message.extendedTextMessage.contextInfo.participant,
        },
      }
    : null;

  const mentioned = (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || []);

  // ── Execute ────────────────────────────────────────────────────────────────
  try {
    await cmd.execute({
      sock,
      msg,
      jid,
      args,
      body:       cmdBody,
      quoted:     quotedObj,
      senderJid,
      senderNum,
      isOwner,
      isAdmin,
      isBotAdmin,
      isGroup,
      groupMeta,
      mentioned,
      store,
      prefix:     config.prefix,
    });
  } catch (err) {
    logger.error(`Command ${cmd.name} error: ${err.message}`);
    await sock.sendMessage(jid, {
      text: `❌ *Error running command:* ${err.message}\n> *Powered by Marco Malik*`,
    }, { quoted: msg }).catch(() => {});
  }
}

// needed for group metadata in handler
const { jidNormalizedUser } = require('@whiskeysockets/baileys');

module.exports = { handleMessage };
