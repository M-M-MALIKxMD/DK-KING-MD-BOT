const config = require('../config');
const { fetchBuffer } = require('../lib/functions');

module.exports = {
  name: 'aisticker',
  alias: ['ais', 'gensticker'],
  description: 'Generate AI image and convert to sticker',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}aisticker <prompt>\n\nExample: ${config.prefix}aisticker cute anime cat\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    await sock.sendMessage(jid, { text: `🎨 _Generating AI sticker for: "${body}"..._` }, { quoted: msg });

    try {
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(body + ', sticker style, transparent background, cartoon')}?nologo=true&width=512&height=512&seed=${Date.now()}`;
      const buffer = await fetchBuffer(url);

      const { default: Sticker, StickerTypes } = require('wa-sticker-formatter');
      const sticker = new Sticker(buffer, {
        pack:    config.botName,
        author:  config.ownerName,
        type:    StickerTypes.FULL,
        quality: 70,
      });

      const stickerBuffer = await sticker.toBuffer();
      await sock.sendMessage(jid, { sticker: stickerBuffer }, { quoted: msg });
      await sock.sendMessage(jid, { text: `✅ *AI Sticker Generated!*\n\n📝 Prompt: ${body}\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(jid, {
        text: `❌ Failed to generate sticker: ${err.message}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }
  },
};
