const config = require('../config');
const { getReactionGif, fetchBuffer, pickRandom } = require('../lib/functions');

module.exports = {
  name: 'goodmorning',
  alias: ['gm', 'morning'],
  description: 'Send a good morning GIF/message',
  async execute({ sock, msg, jid, mentioned, senderNum }) {
    const wishes = [
      'May your day be as bright as the morning sun! ☀️',
      'Rise and shine! Another beautiful day ahead! 🌅',
      'Start your day with a smile and make it great! 😊',
      'Good morning! May success follow you all day! 🌟',
    ];

    try {
      const gifUrl = await getReactionGif('smile') || await getReactionGif('happy');
      if (gifUrl) {
        const buffer = await fetchBuffer(gifUrl);
        await sock.sendMessage(jid, {
          video: buffer,
          caption: `🌅 *Good Morning from @${senderNum}!* 🌅\n\n☀️ ${pickRandom(wishes)}\n\n> *Powered by Marco Malik*`,
          gifPlayback: true,
          mentions: mentioned,
        }, { quoted: msg });
        return;
      }
    } catch {}

    await sock.sendMessage(jid, {
      text: `🌅 *Good Morning!* 🌅\n\n☀️ ${pickRandom(wishes)}\n\nSent by @${senderNum} ❤️\n\n> *Powered by Marco Malik*`,
      mentions: mentioned,
    }, { quoted: msg });
  },
};
