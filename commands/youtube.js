const axios  = require('axios');
const config = require('../config');

module.exports = {
  name: 'youtube',
  alias: ['ytsearch', 'yt'],
  description: 'Search YouTube and get video info',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}youtube <search query>\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    await sock.sendMessage(jid, { text: `🔍 _Searching YouTube for:_ *${body}*...` }, { quoted: msg });

    try {
      const { data } = await axios.get(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(body)}`,
        { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000 }
      );

      const match = data.match(/var ytInitialData = ({.*?});<\/script>/s);
      let results = [];

      if (match) {
        try {
          const json = JSON.parse(match[1]);
          const contents = json?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
          results = contents
            .filter(c => c.videoRenderer)
            .slice(0, 5)
            .map(c => ({
              title: c.videoRenderer.title?.runs?.[0]?.text || 'Unknown',
              videoId: c.videoRenderer.videoId,
              channel: c.videoRenderer.ownerText?.runs?.[0]?.text || 'Unknown',
              duration: c.videoRenderer.lengthText?.simpleText || 'Live',
              views: c.videoRenderer.viewCountText?.simpleText || '0 views',
            }));
        } catch {}
      }

      if (!results.length) {
        return sock.sendMessage(jid, { text: `❌ No results found for: *${body}*\n\n> *Powered by Marco Malik*` }, { quoted: msg });
      }

      const text = `🎬 *YouTube Search Results*\n\n🔍 Query: ${body}\n\n` +
        results.map((r, i) =>
          `*${i + 1}.* ${r.title}\n📺 ${r.channel} | ⏱️ ${r.duration} | 👁️ ${r.views}\n🔗 https://youtu.be/${r.videoId}`
        ).join('\n\n') +
        `\n\n> *Powered by Marco Malik*`;

      await sock.sendMessage(jid, { text }, { quoted: msg });

    } catch {
      await sock.sendMessage(jid, {
        text: `❌ YouTube search failed. Try again later.\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }
  },
};
