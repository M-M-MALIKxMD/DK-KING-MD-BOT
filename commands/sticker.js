const config = require('../config');

module.exports = {
  name: 'sticker',
  alias: ['s', 'stiker'],
  description: 'Convert image/video to sticker',
  async execute({ sock, msg, jid, quoted }) {
    const q = quoted?.message || msg.message;
    const hasMedia = q?.imageMessage || q?.videoMessage || q?.documentMessage;

    if (!hasMedia) {
      return sock.sendMessage(jid, {
        text: `❌ Reply to an *image* or *video* to convert it to a sticker.\n\nUsage: Reply to media then type *${config.prefix}sticker*\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }

    await sock.sendMessage(jid, { text: '🎭 _Creating sticker..._' }, { quoted: msg });

    try {
      const { default: Sticker, StickerTypes } = require('wa-sticker-formatter');
      const buffer = await sock.downloadMediaMessage(quoted || msg);

      const sticker = new Sticker(buffer, {
        pack:    config.botName,
        author:  config.ownerName,
        type:    StickerTypes.FULL,
        quality: 50,
      });

      const stickerBuffer = await sticker.toBuffer();
      await sock.sendMessage(jid, { sticker: stickerBuffer }, { quoted: msg });
      await sock.sendMessage(jid, { text: `✅ *Sticker created!*\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(jid, {
        text: `❌ Failed to create sticker: ${err.message}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }
  },
};
