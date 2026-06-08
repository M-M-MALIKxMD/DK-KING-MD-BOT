const config = require('../config');

module.exports = {
  name: 'toimage',
  alias: ['stickertoimage', 'toimg', 'simage'],
  description: 'Convert sticker to image',
  async execute({ sock, msg, jid, quoted }) {
    const q = quoted?.message || msg.message;
    if (!q?.stickerMessage) {
      return sock.sendMessage(jid, {
        text: `❌ Reply to a *sticker* to convert it to an image.\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }

    try {
      const buffer = await sock.downloadMediaMessage(quoted || msg);
      const sharp  = require('sharp');
      const imgBuf = await sharp(buffer).png().toBuffer();

      await sock.sendMessage(jid, {
        image: imgBuf,
        caption: `✅ *Sticker converted to image!*\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(jid, {
        text: `❌ Conversion failed: ${err.message}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }
  },
};
