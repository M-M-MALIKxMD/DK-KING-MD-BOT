const config = require('../config');
const { getReactionGif, fetchBuffer } = require('../lib/functions');

module.exports = {
  name: 'kiss',
  alias: ['kissu', 'smooches'],
  description: 'Send a kiss reaction GIF',
  async execute({ sock, msg, jid, args, mentioned, senderNum }) {
    const target = mentioned[0] ? '@' + mentioned[0].split('@')[0] : args.join(' ') || 'you';

    try {
      const gifUrl = await getReactionGif('kiss');
      if (gifUrl) {
        const buffer = await fetchBuffer(gifUrl);
        await sock.sendMessage(jid, {
          video: buffer,
          caption: `😘 *@${senderNum} kisses ${target}!* 😘\n\n> *Powered by Marco Malik*`,
          gifPlayback: true,
          mentions: mentioned,
        }, { quoted: msg });
        return;
      }
    } catch {}

    await sock.sendMessage(jid, {
      text: `😘 *@${senderNum} kisses ${target}!*\n\n💋💋💋\n\n> *Powered by Marco Malik*`,
      mentions: mentioned,
    }, { quoted: msg });
  },
};
