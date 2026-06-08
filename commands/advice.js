const axios  = require('axios');
const config = require('../config');
const { pickRandom } = require('../lib/functions');

module.exports = {
  name: 'advice',
  alias: ['tip', 'suggest'],
  description: 'Get random life advice',
  async execute({ sock, msg, jid }) {
    let adviceText = '';
    try {
      const { data } = await axios.get('https://api.adviceslip.com/advice', { timeout: 8000 });
      adviceText = data.slip.advice;
    } catch {
      const tips = [
        'Drink more water. Most people are mildly dehydrated.',
        'Always back up your data. You\'ll thank yourself later.',
        'Call a friend you haven\'t spoken to in a while.',
        'Learn something new every day — even just one thing.',
        'Rest is not laziness. It is part of the process.',
      ];
      adviceText = pickRandom(tips);
    }

    await sock.sendMessage(jid, {
      text: `💡 *Life Advice*\n\n"${adviceText}"\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
