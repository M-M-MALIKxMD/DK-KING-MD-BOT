const axios  = require('axios');
const config = require('../config');
const { fetchBuffer } = require('../lib/functions');

module.exports = {
  name: 'anime',
  alias: ['animesearch', 'mal'],
  description: 'Search anime info',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}anime <anime name>\n\nExample: ${config.prefix}anime Naruto\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    try {
      const { data } = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(body)}&limit=1`, { timeout: 15000 });
      const a = data.data?.[0];
      if (!a) throw new Error('Not found');

      const text = `🎌 *${a.title}*\n\n📺 Type: ${a.type || 'N/A'}\n📊 Episodes: ${a.episodes || 'Ongoing'}\n⭐ Score: ${a.score || 'N/A'}/10\n🏆 Rank: #${a.rank || 'N/A'}\n📅 Aired: ${a.aired?.string || 'N/A'}\n🎭 Genres: ${a.genres?.map(g => g.name).join(', ') || 'N/A'}\n📌 Status: ${a.status || 'N/A'}\n\n📝 Synopsis:\n${a.synopsis?.substring(0, 400) || 'No synopsis'}...\n\n🔗 ${a.url}\n\n> *Powered by Marco Malik*`;

      const buffer = a.images?.jpg?.image_url ? await fetchBuffer(a.images.jpg.image_url).catch(() => null) : null;
      if (buffer) return sock.sendMessage(jid, { image: buffer, caption: text }, { quoted: msg });

      await sock.sendMessage(jid, { text }, { quoted: msg });
    } catch {
      await sock.sendMessage(jid, {
        text: `❌ Anime *${body}* not found.\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }
  },
};
