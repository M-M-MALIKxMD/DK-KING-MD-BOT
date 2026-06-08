const axios  = require('axios');
const config = require('../config');
const { pickRandom } = require('../lib/functions');

module.exports = {
  name: 'dadjoke',
  alias: ['dad', 'papadad'],
  description: 'Get a dad joke',
  async execute({ sock, msg, jid }) {
    let joke = '';
    try {
      const { data } = await axios.get('https://icanhazdadjoke.com/', { headers: { Accept: 'application/json' }, timeout: 8000 });
      joke = data.joke;
    } catch {
      const jokes = [
        'Why do cows wear bells? Because their horns don\'t work! 🐄',
        'What do you call cheese that isn\'t yours? Nacho cheese! 🧀',
        'Why don\'t scientists trust atoms? Because they make up everything!',
        'I told my wife she was drawing her eyebrows too high. She looked surprised!',
        'Want to hear a joke about paper? Never mind, it\'s tearable! 📄',
      ];
      joke = pickRandom(jokes);
    }

    await sock.sendMessage(jid, {
      text: `👨 *Dad Joke!*\n\n${joke} 😄\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
