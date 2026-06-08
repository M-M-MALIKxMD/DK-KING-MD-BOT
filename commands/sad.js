const config = require('../config');
const { getReactionGif, fetchBuffer } = require('../lib/functions');

module.exports = {
  name: 'sad',
  alias: ['crying', 'cry'],
  description: 'Send a sad/crying reaction GIF',
  async execute({ sock, msg, jid, mentioned, senderNum }) {

    try {
      const gifUrl = await getReactionGif('cry') || await getReactionGif('sad');
      if (gifUrl) {
        const buffer = await fetchBuffer(gifUrl);
        await sock.sendMessage(jid, {
          video: buffer,
          caption: `😢 *@${senderNum} is feeling sad...* 😢\n\nHope things get better soon! 🫂\n\n> *Powered by Marco Malik*`,
          gifPlayback: true,
          mentions: mentioned,
        }, { quoted: msg });
        return;
      }
    } catch {}

    await sock.sendMessage(jid, {
      text: `😢 *@${senderNum} is feeling sad...*\n\n😢 It's okay to feel sad sometimes. Things will get better! 💙\n\n> *Powered by Marco Malik*`,
      mentions: mentioned,
    }, { quoted: msg });
  },
};
