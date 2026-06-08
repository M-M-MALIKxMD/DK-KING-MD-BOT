const config = require('../config');
const { fetchBuffer } = require('../lib/functions');

module.exports = {
  name: 'getpp',
  alias: ['pfp', 'dp', 'profilepic'],
  description: 'Get someone\'s profile picture',
  async execute({ sock, msg, jid, mentioned, args, senderJid }) {
    const target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : senderJid);

    try {
      const pp     = await sock.profilePictureUrl(target, 'image');
      const buffer = await fetchBuffer(pp);
      await sock.sendMessage(jid, {
        image: buffer,
        caption: `🖼️ *Profile Picture*\n\n👤 @${target.split('@')[0]}\n\n> *Powered by Marco Malik*`,
        mentions: [target],
      }, { quoted: msg });
    } catch {
      await sock.sendMessage(jid, {
        text: `❌ No profile picture found for @${target.split('@')[0]}. It may be private.\n\n> *Powered by Marco Malik*`,
        mentions: [target],
      }, { quoted: msg });
    }
  },
};
