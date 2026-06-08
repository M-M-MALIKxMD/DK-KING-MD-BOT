const config = require('../config');
const { getReactionGif, fetchBuffer, pickRandom } = require('../lib/functions');

module.exports = {
  name: 'goodnight',
  alias: ['gn', 'night', 'sleep'],
  description: 'Send a good night GIF/message',
  async execute({ sock, msg, jid, mentioned, senderNum }) {
    const wishes = [
      'Sweet dreams and rest well! 🌙',
      'May the stars guide you to beautiful dreams! ✨',
      'Sleep tight, don\'t let the bedbugs bite! 😴',
      'Rest now and wake up refreshed tomorrow! 🌙',
    ];

    try {
      const gifUrl = await getReactionGif('sleep') || await getReactionGif('smile');
      if (gifUrl) {
        const buffer = await fetchBuffer(gifUrl);
        await sock.sendMessage(jid, {
          video: buffer,
          caption: `🌙 *Good Night from @${senderNum}!* 🌙\n\n💤 ${pickRandom(wishes)}\n\n> *Powered by Marco Malik*`,
          gifPlayback: true,
          mentions: mentioned,
        }, { quoted: msg });
        return;
      }
    } catch {}

    await sock.sendMessage(jid, {
      text: `🌙 *Good Night!* 🌙\n\n💤 ${pickRandom(wishes)}\n\nSent by @${senderNum} 🌟\n\n> *Powered by Marco Malik*`,
      mentions: mentioned,
    }, { quoted: msg });
  },
};
