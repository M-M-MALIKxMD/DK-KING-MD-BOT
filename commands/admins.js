const config = require('../config');

module.exports = {
  name: 'admins',
  alias: ['adminlist', 'listadmins'],
  description: 'List all group admins',
  groupOnly: true,
  async execute({ sock, msg, jid }) {
    try {
      const meta   = await sock.groupMetadata(jid);
      const admins = meta.participants.filter(p => p.admin);

      const list = admins.map(a => `• @${a.id.split('@')[0]} (${a.admin === 'superadmin' ? '👑 Super Admin' : '🛡️ Admin'})`).join('\n');

      await sock.sendMessage(jid, {
        text: `👑 *Admins of ${meta.subject}*\n\n${list}\n\n📊 Total: ${admins.length} admin(s)\n\n> *Powered by Marco Malik*`,
        mentions: admins.map(a => a.id),
      }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(jid, { text: `❌ Failed: ${e.message}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
