const config = require('../config');

module.exports = {
  name: 'broadcast',
  alias: ['bc', 'announce'],
  description: 'Broadcast a message to all groups',
  ownerOnly: true,
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}broadcast <message>\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    try {
      const groups = await sock.groupFetchAllParticipating();
      const groupJids = Object.keys(groups);
      let sent = 0;

      await sock.sendMessage(jid, { text: `📢 Broadcasting to *${groupJids.length}* groups...` }, { quoted: msg });

      for (const gJid of groupJids) {
        try {
          await sock.sendMessage(gJid, {
            text: `📢 *Broadcast from ${config.botName}*\n\n${body}\n\n> *Powered by Marco Malik*`,
          });
          sent++;
          await new Promise(r => setTimeout(r, 500));
        } catch {}
      }

      await sock.sendMessage(jid, { text: `✅ Broadcast sent to *${sent}/${groupJids.length}* groups!\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(jid, { text: `❌ Broadcast failed: ${e.message}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
