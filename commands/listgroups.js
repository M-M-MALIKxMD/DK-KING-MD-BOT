const config = require('../config');

module.exports = {
  name: 'listgroups',
  alias: ['groups', 'mygrouplist'],
  description: 'List all groups the bot is in',
  ownerOnly: true,
  async execute({ sock, msg, jid }) {
    try {
      const groups = await sock.groupFetchAllParticipating();
      const list   = Object.values(groups);

      if (!list.length) {
        return sock.sendMessage(jid, { text: `📋 Bot is not in any groups.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
      }

      const text = `📋 *Groups (${list.length})*\n\n` +
        list.slice(0, 30).map((g, i) => `${i + 1}. ${g.subject} (${g.participants.length} members)`).join('\n') +
        (list.length > 30 ? `\n_...and ${list.length - 30} more_` : '') +
        `\n\n> *Powered by Marco Malik*`;

      await sock.sendMessage(jid, { text }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(jid, { text: `❌ Failed: ${e.message}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
