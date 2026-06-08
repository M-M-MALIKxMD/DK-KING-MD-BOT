const axios  = require('axios');
const config = require('../config');
const { pickRandom } = require('../lib/functions');

const fallbackFacts = [
  'Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still edible.',
  'A group of flamingos is called a "flamboyance".',
  'Bananas are technically berries, but strawberries are not.',
  'The shortest war in history was between Britain and Zanzibar in 1896. It lasted only 38-45 minutes.',
  'Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.',
  'Octopuses have three hearts and blue blood.',
  'The human brain generates about 70,000 thoughts per day.',
  'A day on Venus is longer than a year on Venus.',
];

module.exports = {
  name: 'fact',
  alias: ['facts', 'funfact'],
  description: 'Get a random interesting fact',
  async execute({ sock, msg, jid }) {
    let factText = '';
    try {
      const { data } = await axios.get('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en', { timeout: 8000 });
      factText = data.text;
    } catch {
      try {
        const { data } = await axios.get('https://api.api-ninjas.com/v1/facts?limit=1', { headers: { 'X-Api-Key': '' }, timeout: 8000 });
        factText = data?.[0]?.fact || '';
      } catch {
        factText = pickRandom(fallbackFacts);
      }
    }

    await sock.sendMessage(jid, {
      text: `💡 *Random Fact!*\n\n📖 ${factText}\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
