const config = require('../config');

module.exports = {
  name: 'setdesc',
  alias: ['setgroupdesc', 'description'],
  description: 'Set group description',
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, msg, jid, body, isBotAdmin }) {
    if (!isBotAdmin) return sock.sendMessage(jid, { text: `❌ Bot must be admin.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}setdesc <description>\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    try {
      await sock.groupUpdateDescription(jid, body);
      await sock.sendMessage(jid, { text: `✅ *Group description updated!*\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(jid, { text: `❌ Failed: ${e.message}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
