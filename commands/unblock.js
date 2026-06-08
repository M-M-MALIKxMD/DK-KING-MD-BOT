const config = require('../config');

module.exports = {
  name: 'unblock',
  alias: ['unblockuser'],
  description: 'Unblock a contact',
  ownerOnly: true,
  async execute({ sock, msg, jid, mentioned, args }) {
    const target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);
    if (!target) return sock.sendMessage(jid, { text: `❌ Mention or provide number to unblock.\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    try {
      await sock.updateBlockStatus(target, 'unblock');
      await sock.sendMessage(jid, { text: `✅ *+${target.split('@')[0]} unblocked!*\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(jid, { text: `❌ Failed: ${e.message}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
