const axios  = require('axios');
const config = require('../config');

module.exports = {
  name: 'currency',
  alias: ['convert', 'forex'],
  description: 'Convert currency',
  async execute({ sock, msg, jid, args }) {
    if (args.length < 3) {
      return sock.sendMessage(jid, {
        text: `❌ Usage: ${config.prefix}currency <amount> <from> <to>\n\nExample: ${config.prefix}currency 100 USD PKR\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }

    const amount = parseFloat(args[0]);
    const from   = args[1].toUpperCase();
    const to     = args[2].toUpperCase();

    if (isNaN(amount)) return sock.sendMessage(jid, { text: `❌ Invalid amount.\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    try {
      const { data } = await axios.get(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`,
        { timeout: 12000 }
      );

      const result = data.rates[to];
      await sock.sendMessage(jid, {
        text: `💱 *Currency Conversion*\n\n💵 ${amount} ${from} = *${result?.toFixed(4)} ${to}*\n\n📅 Rate date: ${data.date}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    } catch {
      await sock.sendMessage(jid, {
        text: `❌ Currency conversion failed. Check the currency codes.\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }
  },
};
