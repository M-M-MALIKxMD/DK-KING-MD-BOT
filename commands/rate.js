const config = require('../config');
const { getRandomInt } = require('../lib/functions');

module.exports = {
  name: 'rate',
  alias: ['rateme', 'score'],
  description: 'Rate someone out of 10',
  async execute({ sock, msg, jid, args, mentioned }) {
    const target = mentioned[0] ? '@' + mentioned[0].split('@')[0] : args.join(' ') || 'you';
    const rating = getRandomInt(1, 10);
    const stars  = '⭐'.repeat(rating) + '☆'.repeat(10 - rating);
    const comments = {
      10: 'Literally perfect! 🏆',
      9: 'Almost perfect! 🌟',
      8: 'Really great! 😍',
      7: 'Pretty good! 👍',
      6: 'Above average! 😊',
      5: 'Average — room to grow! 😐',
      4: 'Could do better! 😅',
      3: 'Needs improvement! 😬',
      2: 'Yikes... 😬',
      1: 'Rock bottom... 💀',
    };

    await sock.sendMessage(jid, {
      text: `⭐ *Rating ${target}...*\n\n${stars}\n🔢 Score: *${rating}/10*\n💬 Verdict: ${comments[rating]}\n\n> *Powered by Marco Malik*`,
      mentions: mentioned,
    }, { quoted: msg });
  },
};
