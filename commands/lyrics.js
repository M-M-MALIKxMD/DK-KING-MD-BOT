const axios  = require('axios');
const config = require('../config');

module.exports = {
  name: 'lyrics',
  alias: ['lyric', 'songlyrics'],
  description: 'Get song lyrics',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}lyrics <song name> - <artist>\n\nExample: ${config.prefix}lyrics Shape of You - Ed Sheeran\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    await sock.sendMessage(jid, { text: `🎵 _Searching lyrics for:_ *${body}*...` }, { quoted: msg });

    const parts  = body.split(' - ');
    const title  = parts[0]?.trim();
    const artist = parts[1]?.trim() || '';

    try {
      const { data } = await axios.get(
        `https://api.lyrics.ovh/v1/${encodeURIComponent(artist || 'any')}/${encodeURIComponent(title)}`,
        { timeout: 15000 }
      );

      let lyricsText = data.lyrics || '';
      if (lyricsText.length > 3000) lyricsText = lyricsText.substring(0, 3000) + '\n\n_...lyrics truncated_';

      await sock.sendMessage(jid, {
        text: `🎵 *${title}*${artist ? ` — ${artist}` : ''}\n\n${lyricsText}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });

    } catch {
      try {
        const { data } = await axios.get(
          `https://api.vagalume.com.br/search.php?q=${encodeURIComponent(body)}&apikey=`,
          { timeout: 10000 }
        );
        const lyric = data?.mus?.[0]?.text;
        if (lyric) {
          return sock.sendMessage(jid, {
            text: `🎵 *${title}*\n\n${lyric.substring(0, 3000)}\n\n> *Powered by Marco Malik*`,
          }, { quoted: msg });
        }
      } catch {}

      await sock.sendMessage(jid, {
        text: `❌ Lyrics not found for *${body}*.\n\nTip: Use format: .lyrics Song Name - Artist Name\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }
  },
};
