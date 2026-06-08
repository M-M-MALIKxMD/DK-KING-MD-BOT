const config = require('../config');
const { getRandomInt } = require('../lib/functions');

module.exports = {
  name: 'roll',
  alias: ['dice', 'rolldice'],
  description: 'Roll a dice',
  async execute({ sock, msg, jid, args }) {
    const faces  = parseInt(args[0]) || 6;
    const result = getRandomInt(1, faces);
    const emojis = ['', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣'];
    const display = faces === 6 && result <= 6 ? emojis[result] : `**${result}**`;

    await sock.sendMessage(jid, {
      text: `🎲 *Dice Roll (d${faces})!*\n\n${display} You rolled: *${result}*\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
