const config = require('../config');

module.exports = {
  name: 'hidetag',
  alias: ['htag', 'silentping'],
  description: 'Tag all members silently (no visible mentions)',
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, msg, jid, body, groupMeta }) {
    const message = body || '📢 Important announcement!';
    try {
      const meta = groupMeta || await sock.groupMetadata(jid);
      const members = meta.participants.map(p => p.id);

      await sock.sendMessage(jid, {
        text: message + '\n\n> *Powered by Marco Malik*',
        mentions: members,
      }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(jid, { text: `❌ Failed: ${e.message}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
