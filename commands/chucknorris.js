const axios  = require('axios');
const config = require('../config');

module.exports = {
  name: 'chucknorris',
  alias: ['chuck', 'norris'],
  description: 'Get a Chuck Norris fact',
  async execute({ sock, msg, jid }) {
    let fact = '';
    try {
      const { data } = await axios.get('https://api.chucknorris.io/jokes/random', { timeout: 8000 });
      fact = data.value;
    } catch {
      fact = 'Chuck Norris can divide by zero.';
    }

    await sock.sendMessage(jid, {
      text: `💪 *Chuck Norris Fact!*\n\n${fact}\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
