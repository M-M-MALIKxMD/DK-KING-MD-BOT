const axios  = require('axios');
const config = require('../config');

module.exports = {
  name: 'shorturl',
  alias: ['shorten', 'bitly', 'tinyurl'],
  description: 'Shorten a long URL',
  async execute({ sock, msg, jid, body }) {
    if (!body || !body.startsWith('http')) {
      return sock.sendMessage(jid, {
        text: `❌ Usage: ${config.prefix}shorturl <URL>\n\nExample: ${config.prefix}shorturl https://google.com/search?q=something+long\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }

    try {
      const apis = [
        async () => {
          const { data } = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(body)}`, { timeout: 10000 });
          return typeof data === 'string' && data.startsWith('http') ? data : null;
        },
        async () => {
          const { data } = await axios.get(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(body)}`, { timeout: 10000 });
          return typeof data === 'string' && data.startsWith('http') ? data : null;
        },
      ];

      let shortUrl = null;
      for (const fn of apis) {
        try { shortUrl = await fn(); if (shortUrl) break; } catch {}
      }

      if (!shortUrl) throw new Error('All shortening services failed');

      await sock.sendMessage(jid, {
        text: `🔗 *URL Shortened!*\n\n📎 Original: ${body.substring(0, 60)}...\n✅ Short URL: ${shortUrl}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(jid, {
        text: `❌ URL shortening failed: ${err.message}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }
  },
};
