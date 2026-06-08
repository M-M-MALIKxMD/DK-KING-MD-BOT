const axios  = require('axios');
const config = require('../config');

module.exports = {
  name: 'google',
  alias: ['search', 'gsearch'],
  description: 'Search Google (via DuckDuckGo)',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}google <query>\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    await sock.sendMessage(jid, { text: `🔍 _Searching for:_ *${body}*...` }, { quoted: msg });

    try {
      const { data } = await axios.get(
        `https://api.duckduckgo.com/?q=${encodeURIComponent(body)}&format=json&no_html=1&skip_disambig=1`,
        { timeout: 15000 }
      );

      let results = '';
      if (data.AbstractText) results += `📖 ${data.AbstractText}\n\n`;
      if (data.RelatedTopics?.length) {
        results += data.RelatedTopics.slice(0, 3)
          .filter(t => t.Text)
          .map((t, i) => `${i + 1}. ${t.Text?.substring(0, 200)}`)
          .join('\n\n');
      }

      if (!results) {
        results = `No direct answer found. Try: https://www.google.com/search?q=${encodeURIComponent(body)}`;
      }

      await sock.sendMessage(jid, {
        text: `🔍 *Google: ${body}*\n\n${results}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    } catch {
      await sock.sendMessage(jid, {
        text: `🔍 *Search:* ${body}\n\n🔗 https://www.google.com/search?q=${encodeURIComponent(body)}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }
  },
};
