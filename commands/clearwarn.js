const config = require('../config');
const { saveUser } = require('../lib/database');

module.exports = {
  name: 'clearwarn',
  alias: ['resetwarn', 'unwarn'],
  description: 'Clear all warnings for a user',
  adminOnly: true,
  async execute({ sock, msg, jid, mentioned, args }) {
    const target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);
    if (!target) return sock.sendMessage(jid, { text: `❌ Mention someone to clear warnings.\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    saveUser(target, { warnings: 0 });
    await sock.sendMessage(jid, {
      text: `✅ *Warnings cleared for @${target.split('@')[0]}!*\n\n> *Powered by Marco Malik*`,
      mentions: [target],
    }, { quoted: msg });
  },
};
