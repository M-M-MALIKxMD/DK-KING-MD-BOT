const axios  = require('axios');
const config = require('../config');

module.exports = {
  name: 'wiki',
  alias: ['wikipedia', 'search'],
  description: 'Search Wikipedia',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}wiki <topic>\n\nExample: ${config.prefix}wiki Pakistan\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    try {
      const { data: search } = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(body)}`,
        { timeout: 15000 }
      );

      if (search.type === 'disambiguation') {
        return sock.sendMessage(jid, {
          text: `⚠️ *Disambiguation:* "${body}" has multiple meanings.\n\nBe more specific (e.g., "${body} country").\n\n> *Powered by Marco Malik*`,
        }, { quoted: msg });
      }

      const text  = search.extract?.substring(0, 800) + (search.extract?.length > 800 ? '...' : '');
      const image = search.thumbnail?.source;

      if (image) {
        const { fetchBuffer } = require('../lib/functions');
        const buffer = await fetchBuffer(image).catch(() => null);
        if (buffer) {
          return sock.sendMessage(jid, {
            image: buffer,
            caption: `📖 *${search.title}*\n\n${text}\n\n🔗 ${search.content_urls?.desktop?.page || ''}\n\n> *Powered by Marco Malik*`,
          }, { quoted: msg });
        }
      }

      await sock.sendMessage(jid, {
        text: `📖 *${search.title}*\n\n${text}\n\n🔗 ${search.content_urls?.desktop?.page || ''}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });

    } catch {
      await sock.sendMessage(jid, {
        text: `❌ No Wikipedia article found for *${body}*\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }
  },
};
