const config = require('../config');

module.exports = {
  name: 'add',
  alias: ['addmember'],
  description: 'Add a member to the group',
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, msg, jid, args, isBotAdmin }) {
    if (!isBotAdmin) return sock.sendMessage(jid, { text: `❌ Bot must be an *admin* to add members.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    const number = args[0]?.replace(/[^0-9]/g, '');
    if (!number) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}add <number>\n\nExample: ${config.prefix}add 923001234567\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    try {
      const jidToAdd = number + '@s.whatsapp.net';
      const res = await sock.groupParticipantsUpdate(jid, [jidToAdd], 'add');
      const status = res?.[0]?.status;
      if (status === '200') {
        await sock.sendMessage(jid, { text: `✅ *+${number}* has been added to the group!\n\n> *Powered by Marco Malik*` }, { quoted: msg });
      } else {
        await sock.sendMessage(jid, { text: `⚠️ Couldn't add *+${number}* (status: ${status}). They may have privacy settings enabled.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
      }
    } catch (e) {
      await sock.sendMessage(jid, { text: `❌ Failed to add: ${e.message}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
