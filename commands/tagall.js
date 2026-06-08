const config = require('../config');

module.exports = {
  name: 'tagall',
  alias: ['mentionall', 'everyone'],
  description: 'Tag/mention all group members',
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, msg, jid, body, groupMeta }) {
    const message = body || '📢 Attention everyone!';
    try {
      const meta = groupMeta || await sock.groupMetadata(jid);
      const members = meta.participants.map(p => p.id);
      const mentions = members.map(m => `@${m.split('@')[0]}`).join(' ');

      await sock.sendMessage(jid, {
        text: `📢 *${message}*\n\n${mentions}\n\n> *Powered by Marco Malik*`,
        mentions: members,
      }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(jid, { text: `❌ Failed: ${e.message}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
