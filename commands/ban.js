const config = require('../config');
const { getUser, saveUser } = require('../lib/database');

module.exports = {
  name: 'ban',
  alias: ['banuser'],
  description: 'Ban a user from using the bot',
  ownerOnly: true,
  async execute({ sock, msg, jid, mentioned, args }) {
    const target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);
    if (!target) return sock.sendMessage(jid, { text: `❌ Mention or provide a number to ban.\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    saveUser(target, { banned: true });
    await sock.sendMessage(jid, {
      text: `🚫 *@${target.split('@')[0]} has been banned!*\n\nThey can no longer use the bot.\n\n> *Powered by Marco Malik*`,
      mentions: [target],
    }, { quoted: msg });
  },
};
