const config = require('../config');
const { fetchBuffer } = require('../lib/functions');
const axios = require('axios');

module.exports = {
  name: 'dog',
  alias: ['puppy', 'woof'],
  description: 'Get a random dog image',
  async execute({ sock, msg, jid }) {
    try {
      const { data } = await axios.get('https://dog.ceo/api/breeds/image/random', { timeout: 10000 });
      const buffer   = await fetchBuffer(data.message);
      await sock.sendMessage(jid, {
        image: buffer,
        caption: `🐶 *Woof!* 🐾\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    } catch {
      await sock.sendMessage(jid, { text: `❌ Could not fetch dog image.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
