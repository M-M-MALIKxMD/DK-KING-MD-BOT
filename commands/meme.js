const axios  = require('axios');
const config = require('../config');
const { fetchBuffer } = require('../lib/functions');

module.exports = {
  name: 'meme',
  alias: ['memes', 'funny'],
  description: 'Get a random meme',
  async execute({ sock, msg, jid }) {
    try {
      const { data } = await axios.get('https://meme-api.com/gimme', { timeout: 10000 });
      if (!data?.url) throw new Error('No meme URL');
      const buffer = await fetchBuffer(data.url);
      await sock.sendMessage(jid, {
        image: buffer,
        caption: `😂 *${data.title}*\n\n👍 ${data.ups?.toLocaleString() || 0} upvotes\n📌 r/${data.subreddit}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    } catch {
      await sock.sendMessage(jid, { text: `❌ Could not fetch meme. Try again!\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
