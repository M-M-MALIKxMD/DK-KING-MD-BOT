const axios  = require('axios');
const config = require('../config');
const { pickRandom } = require('../lib/functions');

const fallbackJokes = [
  'Why don\'t scientists trust atoms?\n\nBecause they make up everything! 😂',
  'Why do cows wear bells?\n\nBecause their horns don\'t work! 🐄',
  'What do you call a sleeping dinosaur?\n\nA dino-snore! 🦕',
  'Why did the scarecrow win an award?\n\nBecause he was outstanding in his field! 🌾',
  'I told my wife she was drawing her eyebrows too high.\n\nShe looked surprised! 😮',
  'Why can\'t you give Elsa a balloon?\n\nBecause she\'ll let it go! ❄️',
  'What do you call cheese that isn\'t yours?\n\nNacho cheese! 🧀',
];

module.exports = {
  name: 'joke',
  alias: ['jokes', 'funny'],
  description: 'Get a random funny joke',
  async execute({ sock, msg, jid }) {
    let joke = '';
    try {
      const { data } = await axios.get('https://official-joke-api.appspot.com/random_joke', { timeout: 8000 });
      joke = `${data.setup}\n\n${data.punchline} 😂`;
    } catch {
      try {
        const { data } = await axios.get('https://icanhazdadjoke.com/', { headers: { Accept: 'application/json' }, timeout: 8000 });
        joke = data.joke + ' 😄';
      } catch {
        joke = pickRandom(fallbackJokes);
      }
    }

    await sock.sendMessage(jid, {
      text: `😂 *Random Joke!*\n\n${joke}\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
