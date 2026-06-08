const config = require('../config');
const { fetchBuffer } = require('../lib/functions');

module.exports = {
  name: 'emojimix',
  alias: ['mixemoji', 'emojimerge'],
  description: 'Mix two emojis together (Google Emoji Kitchen)',
  async execute({ sock, msg, jid, args }) {
    const [e1, e2] = args;
    if (!e1 || !e2) {
      return sock.sendMessage(jid, {
        text: `❌ Usage: ${config.prefix}emojimix 😂 🔥\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }

    const codePoint = e => [...e].map(c => c.codePointAt(0).toString(16)).join('-');
    const c1 = codePoint(e1);
    const c2 = codePoint(e2);

    const urls = [
      `https://www.gstatic.com/android/keyboard/emojikitchen/20201001/${c1}/${c1}_${c2}.png`,
      `https://www.gstatic.com/android/keyboard/emojikitchen/20201001/${c2}/${c2}_${c1}.png`,
    ];

    for (const url of urls) {
      try {
        const buffer = await fetchBuffer(url);
        const { default: Sticker, StickerTypes } = require('wa-sticker-formatter');
        const sticker = new Sticker(buffer, { pack: config.botName, author: config.ownerName, type: StickerTypes.FULL, quality: 50 });
        const buf = await sticker.toBuffer();
        await sock.sendMessage(jid, { sticker: buf }, { quoted: msg });
        await sock.sendMessage(jid, { text: `✅ *Emoji Mix:* ${e1} + ${e2}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
        return;
      } catch {}
    }

    await sock.sendMessage(jid, {
      text: `❌ Could not mix ${e1} + ${e2}. Try different emojis!\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
