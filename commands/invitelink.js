const config = require('../config');

module.exports = {
  name: 'invitelink',
  alias: ['link', 'grouplink', 'invite'],
  description: 'Get group invite link',
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, msg, jid }) {
    try {
      const code = await sock.groupInviteCode(jid);
      await sock.sendMessage(jid, {
        text: `🔗 *Group Invite Link*\n\nhttps://chat.whatsapp.com/${code}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(jid, { text: `❌ Failed: ${e.message}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
