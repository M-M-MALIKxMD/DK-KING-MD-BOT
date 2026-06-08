const config = require('../config');
const { getUser } = require('../lib/database');

module.exports = {
  name: 'myinfo',
  alias: ['me', 'profile'],
  description: 'View your own bot profile',
  async execute({ sock, msg, jid, senderJid, senderNum, isOwner, isAdmin }) {
    const user = getUser(senderJid);
    await sock.sendMessage(jid, {
      text: `👤 *Your Profile*\n\n📱 Number: +${senderNum}\n👑 Role: ${isOwner ? 'Owner 👑' : isAdmin ? 'Admin 🛡️' : 'Member 👤'}\n⚠️ Warnings: ${user.warnings || 0}/3\n🚫 Banned: ${user.banned ? 'Yes ❌' : 'No ✅'}\n💎 Premium: ${user.premium ? 'Yes ✅' : 'No ❌'}\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
