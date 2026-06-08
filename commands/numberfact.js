const axios  = require('axios');
const config = require('../config');
const { getRandomInt } = require('../lib/functions');

module.exports = {
  name: 'numberfact',
  alias: ['nfact', 'numfact'],
  description: 'Get an interesting fact about a number',
  async execute({ sock, msg, jid, args }) {
    const num = args[0] || getRandomInt(1, 10000);
    try {
      const { data } = await axios.get(`http://numbersapi.com/${num}/trivia`, { timeout: 10000 });
      await sock.sendMessage(jid, {
        text: `🔢 *Number Fact: ${num}*\n\n${data}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    } catch {
      await sock.sendMessage(jid, {
        text: `🔢 *Number Fact: ${num}*\n\n${num} is an interesting number!\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }
  },
};
