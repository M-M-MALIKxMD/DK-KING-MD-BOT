const config = require('../config');
const { fetchBuffer } = require('../lib/functions');
const axios = require('axios');

module.exports = {
  name: 'cat',
  alias: ['kitty', 'meow'],
  description: 'Get a random cat image',
  async execute({ sock, msg, jid }) {
    try {
      const { data } = await axios.get('https://api.thecatapi.com/v1/images/search', { timeout: 10000 });
      const buffer   = await fetchBuffer(data[0].url);
      await sock.sendMessage(jid, {
        image: buffer,
        caption: `🐱 *Meow!* 🐾\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    } catch {
      await sock.sendMessage(jid, { text: `❌ Could not fetch cat image.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
