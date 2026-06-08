const config = require('../config');

module.exports = {
  name: 'steal',
  alias: ['takesticker', 'rebrand'],
  description: 'Steal and rebrand a sticker',
  async execute({ sock, msg, jid, quoted, args }) {
    const q = quoted?.message || msg.message;
    if (!q?.stickerMessage) {
      return sock.sendMessage(jid, {
        text: `❌ Reply to a *sticker* to steal it.\n\nUsage: ${config.prefix}steal [PackName] | [Author]\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }

    const parts      = args.join(' ').split('|').map(s => s.trim());
    const packName   = parts[0] || config.botName;
    const authorName = parts[1] || config.ownerName;

    try {
      const { default: Sticker, StickerTypes } = require('wa-sticker-formatter');
      const buffer = await sock.downloadMediaMessage(quoted || msg);

      const sticker = new Sticker(buffer, {
        pack:    packName,
        author:  authorName,
        type:    StickerTypes.FULL,
        quality: 50,
      });

      const stickerBuffer = await sticker.toBuffer();
      await sock.sendMessage(jid, { sticker: stickerBuffer }, { quoted: msg });
      await sock.sendMessage(jid, {
        text: `✅ *Sticker stolen!*\n\n📦 Pack: ${packName}\n✍️ Author: ${authorName}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(jid, {
        text: `❌ Failed: ${err.message}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }
  },
};
