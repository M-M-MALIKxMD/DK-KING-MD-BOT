const config = require('../config');

module.exports = {
  name: 'join',
  alias: ['joingroup'],
  description: 'Join a group via invite link',
  ownerOnly: true,
  async execute({ sock, msg, jid, body }) {
    if (!body || !body.includes('chat.whatsapp.com/')) {
      return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}join <invite link>\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }

    try {
      const code = body.split('chat.whatsapp.com/')[1]?.split(' ')[0];
      await sock.groupAcceptInvite(code);
      await sock.sendMessage(jid, { text: `✅ *Joined group successfully!*\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(jid, { text: `❌ Failed to join: ${e.message}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
