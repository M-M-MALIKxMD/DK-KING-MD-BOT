const config = require('../config');

module.exports = {
  name: 'revoke',
  alias: ['resetlink', 'newlink'],
  description: 'Revoke and reset group invite link',
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, msg, jid, isBotAdmin }) {
    if (!isBotAdmin) return sock.sendMessage(jid, { text: `❌ Bot must be admin.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    try {
      await sock.groupRevokeInvite(jid);
      const newCode = await sock.groupInviteCode(jid);
      await sock.sendMessage(jid, {
        text: `✅ *Old link revoked!*\n\n🔗 New link: https://chat.whatsapp.com/${newCode}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(jid, { text: `❌ Failed: ${e.message}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
