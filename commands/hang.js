const config = require('../config');
const { getReactionGif, fetchBuffer } = require('../lib/functions');

module.exports = {
  name: 'hang',
  alias: ['hangout', 'chill'],
  description: 'Send a hang/chill reaction GIF',
  async execute({ sock, msg, jid, args, mentioned, senderNum }) {
    const target = mentioned[0] ? '@' + mentioned[0].split('@')[0] : args.join(' ') || 'everyone';

    try {
      const gifUrl = await getReactionGif('wave') || await getReactionGif('smile');
      if (gifUrl) {
        const buffer = await fetchBuffer(gifUrl);
        await sock.sendMessage(jid, {
          video: buffer,
          caption: `😎 *@${senderNum} wants to hang out with ${target}!*\n\nLet's chill! 🎉\n\n> *Powered by Marco Malik*`,
          gifPlayback: true,
          mentions: mentioned,
        }, { quoted: msg });
        return;
      }
    } catch {}

    await sock.sendMessage(jid, {
      text: `😎 *@${senderNum} wants to hang out with ${target}!*\n\nLet's chill and have fun! 🎉😊\n\n> *Powered by Marco Malik*`,
      mentions: mentioned,
    }, { quoted: msg });
  },
};
