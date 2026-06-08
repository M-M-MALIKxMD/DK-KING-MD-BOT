const config = require('../config');

module.exports = {
  name: 'setbio',
  alias: ['setstatus', 'updatebio'],
  description: 'Update bot WhatsApp status/bio',
  ownerOnly: true,
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}setbio <new status text>\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    try {
      await sock.updateProfileStatus(body);
      await sock.sendMessage(jid, { text: `✅ *Status updated!*\n\n_${body}_\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(jid, { text: `❌ Failed: ${e.message}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
