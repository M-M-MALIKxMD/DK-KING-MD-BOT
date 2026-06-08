const config = require('../config');
const { getReactionGif, fetchBuffer, pickRandom } = require('../lib/functions');

module.exports = {
  name: 'kill',
  alias: ['murder', 'stab'],
  description: 'Send a playful kill reaction GIF',
  async execute({ sock, msg, jid, args, mentioned, senderNum }) {
    const target = mentioned[0] ? '@' + mentioned[0].split('@')[0] : args.join(' ') || 'someone';
    const methods = [
      'tickled to death',
      'hit with a pillow',
      'bored to death',
      'hugged too tight',
      'destroyed with kindness',
    ];

    try {
      const gifUrl = await getReactionGif('kill') || await getReactionGif('punch');
      if (gifUrl) {
        const buffer = await fetchBuffer(gifUrl);
        await sock.sendMessage(jid, {
          video: buffer,
          caption: `⚔️ *@${senderNum} killed ${target} by ${pickRandom(methods)}!* 💀\n\n_(Relax, it's just a joke! 😂)_\n\n> *Powered by Marco Malik*`,
          gifPlayback: true,
          mentions: mentioned,
        }, { quoted: msg });
        return;
      }
    } catch {}

    await sock.sendMessage(jid, {
      text: `⚔️ *@${senderNum} killed ${target} by ${pickRandom(methods)}!* 💀\n\n😂 Lol jk, it's just a fun command!\n\n> *Powered by Marco Malik*`,
      mentions: mentioned,
    }, { quoted: msg });
  },
};
