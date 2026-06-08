const config = require('../config');
const { saveGroup } = require('../lib/database');

module.exports = {
  name: 'mute',
  alias: ['groupmute', 'silence'],
  description: 'Mute the group (only admins can send)',
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, msg, jid, isBotAdmin }) {
    if (!isBotAdmin) return sock.sendMessage(jid, { text: `❌ Bot must be an *admin* to mute the group.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    try {
      await sock.groupSettingUpdate(jid, 'announcement');
      saveGroup(jid, { muted: true });
      await sock.sendMessage(jid, { text: `🔇 *Group muted!*\n\nOnly admins can send messages now.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(jid, { text: `❌ Failed to mute: ${e.message}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
