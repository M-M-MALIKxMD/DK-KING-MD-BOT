const axios  = require('axios');
const config = require('../config');
const { pickRandom } = require('../lib/functions');

const fallbackQuotes = [
  { q: 'Be yourself; everyone else is already taken.', a: 'Oscar Wilde' },
  { q: 'Two things are infinite: the universe and human stupidity; and I\'m not sure about the universe.', a: 'Albert Einstein' },
  { q: 'You only live once, but if you do it right, once is enough.', a: 'Mae West' },
  { q: 'Be the change that you wish to see in the world.', a: 'Mahatma Gandhi' },
  { q: 'In the middle of every difficulty lies opportunity.', a: 'Albert Einstein' },
];

module.exports = {
  name: 'quote',
  alias: ['quotes', 'inspire'],
  description: 'Get an inspirational quote',
  async execute({ sock, msg, jid }) {
    let quoteText = '';
    let author = '';

    try {
      const { data } = await axios.get('https://zenquotes.io/api/random', { timeout: 8000 });
      quoteText = data[0]?.q;
      author    = data[0]?.a;
    } catch {
      const q = pickRandom(fallbackQuotes);
      quoteText = q.q;
      author    = q.a;
    }

    await sock.sendMessage(jid, {
      text: `✨ *Inspirational Quote*\n\n"${quoteText}"\n\n— *${author}*\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
