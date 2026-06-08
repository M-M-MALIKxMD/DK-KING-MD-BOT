const config = require('../config');
const { fetchBuffer } = require('../lib/functions');

module.exports = {
  name: 'groupinfo',
  alias: ['ginfo', 'group'],
  description: 'Get group information',
  groupOnly: true,
  async execute({ sock, msg, jid }) {
    try {
      const meta = await sock.groupMetadata(jid);
      const admins  = meta.participants.filter(p => p.admin).length;
      const members = meta.participants.length;
      const created = new Date(meta.creation * 1000).toLocaleDateString();

      const text = `📋 *Group Information*\n\n👥 Name: ${meta.subject}\n👤 Members: ${members}\n👑 Admins: ${admins}\n📅 Created: ${created}\n🔗 Invite: https://chat.whatsapp.com/${await sock.groupInviteCode(jid).catch(() => 'N/A')}\n\n📝 Description:\n${meta.desc || 'No description set'}\n\n> *Powered by Marco Malik*`;

      // Try to get group picture
      try {
        const pp = await sock.profilePictureUrl(jid, 'image');
        const buffer = await fetchBuffer(pp);
        return sock.sendMessage(jid, { image: buffer, caption: text }, { quoted: msg });
      } catch {}

      await sock.sendMessage(jid, { text }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(jid, { text: `❌ Failed: ${e.message}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
