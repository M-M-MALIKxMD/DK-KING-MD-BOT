const config = require('../config');
const { getReactionGif, fetchBuffer } = require('../lib/functions');

module.exports = {
  name: 'love',
  alias: ['iloveyou', 'ily'],
  description: 'Send a love reaction GIF',
  async execute({ sock, msg, jid, args, mentioned, senderNum }) {
    const target = mentioned[0] ? '@' + mentioned[0].split('@')[0] : args.join(' ') || 'everyone';
    await sock.sendMessage(jid, { text: '❤️ _Sending love..._' }, { quoted: msg });

    try {
      const gifUrl = await getReactionGif('kiss') || await getReactionGif('cuddle');
      if (gifUrl) {
        const buffer = await fetchBuffer(gifUrl);
        await sock.sendMessage(jid, {
          video: buffer,
          caption: `❤️ *@${senderNum} loves ${target}!* ❤️\n\n> *Powered by Marco Malik*`,
          gifPlayback: true,
          mentions: mentioned,
        }, { quoted: msg });
        return;
      }
    } catch {}

    await sock.sendMessage(jid, {
      text: `❤️ *@${senderNum} loves ${target}!* ❤️\n\n💕 You are loved! 💕\n\n> *Powered by Marco Malik*`,
      mentions: mentioned,
    }, { quoted: msg });
  },
};
