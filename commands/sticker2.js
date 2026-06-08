const config = require('../config');

// Animated GIF to sticker
module.exports = {
  name: 'animatedsticker',
  alias: ['gifsticker', 'asticker'],
  description: 'Convert animated GIF to animated sticker',
  async execute({ sock, msg, jid, quoted }) {
    const q = quoted?.message || msg.message;
    const hasGif = q?.videoMessage?.gifPlayback || q?.imageMessage?.gifPlayback;

    if (!hasGif) {
      return sock.sendMessage(jid, {
        text: `❌ Reply to an *animated GIF* to convert it.\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }

    await sock.sendMessage(jid, { text: '🎭 _Creating animated sticker..._' }, { quoted: msg });

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
      await sock.sendMessage(jid, { text: `✅ *Animated sticker created!*\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(jid, {
        text: `❌ Failed: ${err.message}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }
  },
};
