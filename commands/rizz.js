const config = require('../config');
const { getRandomInt } = require('../lib/functions');

module.exports = {
  name: 'rizz',
  alias: ['rizzometer', 'charm'],
  description: 'Check your rizz level',
  async execute({ sock, msg, jid, senderNum, mentioned, args }) {
    const target = mentioned[0] ? '@' + mentioned[0].split('@')[0] : args.join(' ') || senderNum;
    const level  = getRandomInt(0, 100);
    const bars   = '█'.repeat(Math.floor(level / 10)) + '░'.repeat(10 - Math.floor(level / 10));
    const label  = level >= 90 ? 'GOD TIER RIZZ 👑' : level >= 70 ? 'High Rizz 🔥' : level >= 50 ? 'Mid Rizz 😎' : level >= 30 ? 'Low Rizz 😅' : 'No Rizz 💀';

    await sock.sendMessage(jid, {
      text: `😎 *Rizz Meter*\n\n👤 ${target}\n\n[${bars}] ${level}%\n\n${label}\n\n> *Powered by Marco Malik*`,
      mentions: mentioned,
    }, { quoted: msg });
  },
};
