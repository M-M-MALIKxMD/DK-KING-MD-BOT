const config = require('../config');
const { fetchBuffer } = require('../lib/functions');
const axios = require('axios');

module.exports = {
  name: 'fox',
  alias: ['foxpic', 'redfox'],
  description: 'Get a random fox image',
  async execute({ sock, msg, jid }) {
    try {
      const { data } = await axios.get('https://randomfox.ca/floof/', { timeout: 10000 });
      const buffer   = await fetchBuffer(data.image);
      await sock.sendMessage(jid, {
        image: buffer,
        caption: `🦊 *Fox!* 🦊\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    } catch {
      await sock.sendMessage(jid, { text: `❌ Could not fetch fox image.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
