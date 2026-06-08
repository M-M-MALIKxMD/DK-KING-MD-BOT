const config = require('../config');
const { getReactionGif, fetchBuffer } = require('../lib/functions');

module.exports = {
  name: 'sorry',
  alias: ['apologize', 'apology'],
  description: 'Send a sorry/apology reaction GIF',
  async execute({ sock, msg, jid, args, mentioned, senderNum }) {
    const target = mentioned[0] ? '@' + mentioned[0].split('@')[0] : args.join(' ') || 'everyone';

    try {
      const gifUrl = await getReactionGif('baka') || await getReactionGif('cry');
      if (gifUrl) {
        const buffer = await fetchBuffer(gifUrl);
        await sock.sendMessage(jid, {
          video: buffer,
          caption: `🙏 *@${senderNum} is sorry to ${target}!*\n\nI'm truly sorry, please forgive me! 😔\n\n> *Powered by Marco Malik*`,
          gifPlayback: true,
          mentions: mentioned,
        }, { quoted: msg });
        return;
      }
    } catch {}

    await sock.sendMessage(jid, {
      text: `🙏 *@${senderNum} is sorry to ${target}!*\n\n😔 I'm truly sorry, please forgive me!\n💙 Everyone makes mistakes...\n\n> *Powered by Marco Malik*`,
      mentions: mentioned,
    }, { quoted: msg });
  },
};
