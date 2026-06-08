const config = require('../config');

module.exports = {
  name: 'promote',
  alias: ['makeadmin'],
  description: 'Promote a member to admin',
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, msg, jid, mentioned, isBotAdmin }) {
    if (!isBotAdmin) return sock.sendMessage(jid, { text: `❌ Bot must be an *admin* to promote.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    if (!mentioned.length) return sock.sendMessage(jid, { text: `❌ Mention someone to promote.\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    for (const target of mentioned) {
      try {
        await sock.groupParticipantsUpdate(jid, [target], 'promote');
        await sock.sendMessage(jid, { text: `⬆️ @${target.split('@')[0]} has been *promoted to admin!* 👑\n\n> *Powered by Marco Malik*`, mentions: [target] }, { quoted: msg });
      } catch (e) {
        await sock.sendMessage(jid, { text: `❌ Could not promote: ${e.message}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
      }
    }
  },
};
