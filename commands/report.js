const config = require('../config');

module.exports = {
  name: 'report',
  alias: ['feedback', 'bug'],
  description: 'Send feedback or report a bug to the owner',
  async execute({ sock, msg, jid, senderNum, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}report <your feedback>\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    await sock.sendMessage(`${config.ownerNumber}@s.whatsapp.net`, {
      text: `📋 *New Report*\n\n👤 From: +${senderNum}\n📝 Message: ${body}\n⏰ Time: ${new Date().toLocaleString()}\n\n> *Powered by Marco Malik*`,
    }).catch(() => {});

    await sock.sendMessage(jid, {
      text: `✅ *Report sent to the owner!*\n\nThank you for your feedback! 🙏\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
