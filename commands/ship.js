const config = require('../config');
const { getRandomInt } = require('../lib/functions');

module.exports = {
  name: 'ship',
  alias: ['couple', 'lovematch'],
  description: 'Ship two people together',
  async execute({ sock, msg, jid, args, mentioned }) {
    let p1, p2;
    if (mentioned.length >= 2) {
      p1 = '@' + mentioned[0].split('@')[0];
      p2 = '@' + mentioned[1].split('@')[0];
    } else if (args.length >= 2) {
      const mid = Math.ceil(args.length / 2);
      p1 = args.slice(0, mid).join(' ');
      p2 = args.slice(mid).join(' ');
    } else {
      return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}ship @person1 @person2\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }

    const percent = getRandomInt(1, 100);
    const bar = '█'.repeat(Math.floor(percent / 10)) + '░'.repeat(10 - Math.floor(percent / 10));
    let status = percent >= 80 ? '💘 Perfect Match!' : percent >= 60 ? '💕 Great Couple!' : percent >= 40 ? '💛 Could work!' : percent >= 20 ? '🤔 Needs effort' : '💔 Not compatible';

    await sock.sendMessage(jid, {
      text: `💕 *Shipping...*\n\n👤 ${p1}\n💞 + 💞\n👤 ${p2}\n\n📊 Compatibility: ${percent}%\n[${bar}]\n\n${status}\n\n> *Powered by Marco Malik*`,
      mentions: mentioned,
    }, { quoted: msg });
  },
};
