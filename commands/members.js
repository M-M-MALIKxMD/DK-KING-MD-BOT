const config = require('../config');

module.exports = {
  name: 'members',
  alias: ['memberlist', 'participants'],
  description: 'List all group members',
  groupOnly: true,
  async execute({ sock, msg, jid }) {
    try {
      const meta    = await sock.groupMetadata(jid);
      const members = meta.participants;
      const admins  = members.filter(m => m.admin);
      const regular = members.filter(m => !m.admin);

      let text = `👥 *Members of ${meta.subject}*\n\n`;
      text += `👑 *Admins (${admins.length}):*\n`;
      admins.forEach(m => { text += `• @${m.id.split('@')[0]}\n`; });
      text += `\n👤 *Members (${regular.length}):*\n`;
      regular.slice(0, 30).forEach(m => { text += `• @${m.id.split('@')[0]}\n`; });
      if (regular.length > 30) text += `_...and ${regular.length - 30} more_\n`;
      text += `\n📊 Total: ${members.length}\n\n> *Powered by Marco Malik*`;

      await sock.sendMessage(jid, {
        text,
        mentions: members.map(m => m.id),
      }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(jid, { text: `❌ Failed: ${e.message}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
