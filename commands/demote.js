const config = require('../config');

module.exports = {
  name: 'demote',
  alias: ['removeadmin'],
  description: 'Demote an admin to member',
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, msg, jid, mentioned, isBotAdmin }) {
    if (!isBotAdmin) return sock.sendMessage(jid, { text: `❌ Bot must be an *admin* to demote.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    if (!mentioned.length) return sock.sendMessage(jid, { text: `❌ Mention someone to demote.\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    for (const target of mentioned) {
      try {
        await sock.groupParticipantsUpdate(jid, [target], 'demote');
        await sock.sendMessage(jid, { text: `⬇️ @${target.split('@')[0]} has been *demoted to member.*\n\n> *Powered by Marco Malik*`, mentions: [target] }, { quoted: msg });
      } catch (e) {
        await sock.sendMessage(jid, { text: `❌ Could not demote: ${e.message}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
      }
    }
  },
};
