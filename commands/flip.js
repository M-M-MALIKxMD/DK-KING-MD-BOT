const config = require('../config');
const { pickRandom } = require('../lib/functions');

module.exports = {
  name: 'flip',
  alias: ['coinflip', 'coin'],
  description: 'Flip a coin',
  async execute({ sock, msg, jid }) {
    const result = pickRandom(['Heads', 'Tails']);
    const emoji  = result === 'Heads' ? '👑' : '🦅';
    await sock.sendMessage(jid, {
      text: `🪙 *Coin Flip!*\n\n${emoji} *${result}!* ${emoji}\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
