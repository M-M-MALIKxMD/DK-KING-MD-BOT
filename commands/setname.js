const config = require('../config');

module.exports = {
  name: 'setname',
  alias: ['setgroupname', 'rename'],
  description: 'Set group name',
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, msg, jid, body, isBotAdmin }) {
    if (!isBotAdmin) return sock.sendMessage(jid, { text: `❌ Bot must be admin.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}setname <new name>\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    try {
      await sock.groupUpdateSubject(jid, body);
      await sock.sendMessage(jid, { text: `✅ *Group name updated to:* ${body}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(jid, { text: `❌ Failed: ${e.message}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
