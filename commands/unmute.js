const config = require('../config');
const { saveGroup } = require('../lib/database');

module.exports = {
  name: 'unmute',
  alias: ['groupunmute', 'unsilence'],
  description: 'Unmute the group (everyone can send)',
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, msg, jid, isBotAdmin }) {
    if (!isBotAdmin) return sock.sendMessage(jid, { text: `❌ Bot must be an *admin* to unmute the group.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    try {
      await sock.groupSettingUpdate(jid, 'not_announcement');
      saveGroup(jid, { muted: false });
      await sock.sendMessage(jid, { text: `🔊 *Group unmuted!*\n\nEveryone can send messages now.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(jid, { text: `❌ Failed to unmute: ${e.message}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
