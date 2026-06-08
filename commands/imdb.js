const axios  = require('axios');
const config = require('../config');
const { fetchBuffer } = require('../lib/functions');

module.exports = {
  name: 'imdb',
  alias: ['moviesearch'],
  description: 'Search IMDB / movie database',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}imdb <movie name>\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    await sock.sendMessage(jid, { text: `🎬 _Searching IMDB for:_ *${body}*...` }, { quoted: msg });

    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=8265bd1679663a7ea12ac168da84d2e8&query=${encodeURIComponent(body)}`,
        { timeout: 15000 }
      );

      const movie = data.results?.[0];
      if (!movie) return sock.sendMessage(jid, { text: `❌ No results for *${body}*\n\n> *Powered by Marco Malik*` }, { quoted: msg });

      const text = `🎬 *${movie.title}* (${movie.release_date?.split('-')[0] || 'N/A'})\n\n⭐ Rating: ${movie.vote_average?.toFixed(1)}/10\n👁️ Votes: ${movie.vote_count?.toLocaleString()}\n🌍 Language: ${movie.original_language?.toUpperCase()}\n\n📝 ${movie.overview?.substring(0, 400) || 'No overview'}...\n\n🔗 https://www.themoviedb.org/movie/${movie.id}\n\n> *Powered by Marco Malik*`;

      if (movie.poster_path) {
        const buffer = await fetchBuffer(`https://image.tmdb.org/t/p/w500${movie.poster_path}`).catch(() => null);
        if (buffer) return sock.sendMessage(jid, { image: buffer, caption: text }, { quoted: msg });
      }

      await sock.sendMessage(jid, { text }, { quoted: msg });
    } catch {
      await sock.sendMessage(jid, { text: `❌ IMDB search failed.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
