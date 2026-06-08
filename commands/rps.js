const config = require('../config');
const { pickRandom } = require('../lib/functions');

module.exports = {
  name: 'rps',
  alias: ['rockpaperscissors', 'rock'],
  description: 'Play Rock Paper Scissors',
  async execute({ sock, msg, jid, args }) {
    const choices = ['rock', 'paper', 'scissors'];
    const user    = args[0]?.toLowerCase();
    if (!choices.includes(user)) {
      return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}rps rock|paper|scissors\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }

    const bot   = pickRandom(choices);
    const emoji = { rock: '🪨', paper: '📄', scissors: '✂️' };
    let result  = '🤝 *Draw!*';

    if ((user === 'rock' && bot === 'scissors') ||
        (user === 'scissors' && bot === 'paper') ||
        (user === 'paper' && bot === 'rock')) {
      result = '🎉 *You Win!*';
    } else if (user !== bot) {
      result = '🤖 *Bot Wins!*';
    }

    await sock.sendMessage(jid, {
      text: `🎮 *Rock Paper Scissors!*\n\n👤 You: ${emoji[user]} ${user}\n🤖 Bot: ${emoji[bot]} ${bot}\n\n${result}\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
