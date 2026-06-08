const config = require('../config');
const { getReactionGif, fetchBuffer, pickRandom } = require('../lib/functions');
const axios = require('axios');

module.exports = {
  name: 'gift',
  alias: ['present', 'sendgift'],
  description: 'Send an animated gift to someone',
  async execute({ sock, msg, jid, args, mentioned, senderNum }) {
    const target = mentioned[0] ? '@' + mentioned[0].split('@')[0] : args.join(' ') || 'you';
    const gifts  = ['🎁', '🎀', '🎊', '🎉', '💝', '🎈'];
    const giftEmoji = pickRandom(gifts);

    await sock.sendMessage(jid, { text: `${giftEmoji} _Wrapping gift for ${target}..._` }, { quoted: msg });

    // Try to get a gift/celebration animated GIF
    try {
      const gifUrl = await getReactionGif('handholding') || await getReactionGif('smile');
      if (gifUrl) {
        const buffer = await fetchBuffer(gifUrl);
        await sock.sendMessage(jid, {
          video: buffer,
          caption: `🎁 *@${senderNum} sends a special gift to ${target}!*\n\n🎀 ${giftEmoji} A gift for you! ${giftEmoji} 🎀\n\n🎉 Hope it brings you joy!\n💝 With love from Marco Malik Bot!\n\n> *Powered by Marco Malik*`,
          gifPlayback: true,
          mentions: mentioned,
        }, { quoted: msg });
        return;
      }
    } catch {}

    // Fallback: try Giphy gif
    try {
      const { data } = await axios.get(
        'https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=gift+celebrate&limit=10&rating=g',
        { timeout: 10000 }
      );
      const gifs = data?.data || [];
      if (gifs.length) {
        const gif = pickRandom(gifs);
        const gifBuffer = await fetchBuffer(gif.images?.original?.url || gif.url);
        await sock.sendMessage(jid, {
          video: gifBuffer,
          caption: `🎁 *@${senderNum} sends a special gift to ${target}!*\n\n🎀 ${giftEmoji} A gift for you! ${giftEmoji} 🎀\n\n💝 With love!\n\n> *Powered by Marco Malik*`,
          gifPlayback: true,
          mentions: mentioned,
        }, { quoted: msg });
        return;
      }
    } catch {}

    // Text fallback
    await sock.sendMessage(jid, {
      text: `🎁 *@${senderNum} sends a special gift to ${target}!*\n\n┌─────────────────┐\n│ ${giftEmoji}  GIFT FOR YOU  ${giftEmoji} │\n│                 │\n│  🎊  SURPRISE!  🎊  │\n│                 │\n└─────────────────┘\n\n🎀 Open your gift!\n💝 With love from @${senderNum}!\n\n> *Powered by Marco Malik*`,
      mentions: mentioned,
    }, { quoted: msg });
  },
};
