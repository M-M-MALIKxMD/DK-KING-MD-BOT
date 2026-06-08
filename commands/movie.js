const axios  = require('axios');
const config = require('../config');
const { fetchBuffer } = require('../lib/functions');

module.exports = {
  name: 'movie',
  alias: ['film', 'imovie'],
  description: 'Search and get movie info/download link',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}movie <movie name>\n\nExample: ${config.prefix}movie Avengers Endgame\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    await sock.sendMessage(jid, { text: `🎬 _Searching for movie:_ *${body}*...` }, { quoted: msg });

    try {
      // Search TMDB (free tier)
      const { data: search } = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=8265bd1679663a7ea12ac168da84d2e8&language=en-US&query=${encodeURIComponent(body)}&page=1`,
        { timeout: 15000 }
      );

      const movie = search.results?.[0];
      if (!movie) {
        return sock.sendMessage(jid, { text: `❌ No movie found for: *${body}*\n\n> *Powered by Marco Malik*` }, { quoted: msg });
      }

      const details = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=8265bd1679663a7ea12ac168da84d2e8&language=en-US`,
        { timeout: 10000 }
      ).then(r => r.data).catch(() => movie);

      const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null;

      const text = `🎬 *${details.title || movie.title}*

📅 Year: ${movie.release_date?.split('-')[0] || 'N/A'}
⭐ Rating: ${movie.vote_average?.toFixed(1) || 'N/A'}/10 (${movie.vote_count?.toLocaleString() || '0'} votes)
🎭 Genre: ${details.genres?.map(g => g.name).join(', ') || 'N/A'}
⏱️ Runtime: ${details.runtime ? details.runtime + ' min' : 'N/A'}
🌍 Language: ${movie.original_language?.toUpperCase() || 'N/A'}
📊 Popularity: ${Math.round(movie.popularity)}

📝 *Overview:*
${movie.overview || 'No overview available.'}

🔗 TMDB: https://www.themoviedb.org/movie/${movie.id}

> *Downloaded by Marco Malik MD Bot*`;

      if (posterUrl) {
        const buffer = await fetchBuffer(posterUrl).catch(() => null);
        if (buffer) {
          return sock.sendMessage(jid, { image: buffer, caption: text }, { quoted: msg });
        }
      }

      await sock.sendMessage(jid, { text }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(jid, {
        text: `❌ Movie search failed: ${err.message}\n\n> *Downloaded by Marco Malik MD Bot*`,
      }, { quoted: msg });
    }
  },
};
