const config = require('../config');
const { pickRandom } = require('../lib/functions');

const roasts = [
  'You\'re not stupid, you just have bad luck thinking.',
  'I\'d explain it to you but I left my crayons at home.',
  'You are the reason God created the middle finger.',
  'I would roast you but my mum told me not to burn trash.',
  'If you were a spice, you\'d be flour.',
  'You\'re not ugly, you\'re just... creatively challenged.',
  'I\'d say you\'re full of it, but you\'re also kind of empty.',
  'You\'re like a cloud — when you disappear, it\'s a beautiful day.',
  'I\'d give you a nasty look but you already have one.',
  'Your birth certificate is an apology letter from the condom factory.',
  'If laughter is the best medicine, your face is curing diseases.',
];

module.exports = {
  name: 'roast',
  alias: ['burn', 'dis'],
  description: 'Roast someone (all in fun!)',
  async execute({ sock, msg, jid, mentioned, args, senderNum }) {
    const target = mentioned[0] ? '@' + mentioned[0].split('@')[0] : args.join(' ') || 'you';
    await sock.sendMessage(jid, {
      text: `🔥 *Roasting ${target}...*\n\n${pickRandom(roasts)}\n\n😂 _All in good fun!_\n\n> *Powered by Marco Malik*`,
      mentions: mentioned,
    }, { quoted: msg });
  },
};
