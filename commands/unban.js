const config = require('../config');
const { saveUser } = require('../lib/database');

module.exports = {
  name: 'unban',
  alias: ['unbanuser'],
  description: 'Unban a user',
  ownerOnly: true,
  async execute({ sock, msg, jid, mentioned, args }) {
    const target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);
    if (!target) return sock.sendMessage(jid, { text: `❌ Mention or provide a number to unban.\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    saveUser(target, { banned: false });
    await sock.sendMessage(jid, {
      text: `✅ *@${target.split('@')[0]} has been unbanned!*\n\nThey can use the bot again.\n\n> *Powered by Marco Malik*`,
      mentions: [target],
    }, { quoted: msg });
  },
};
