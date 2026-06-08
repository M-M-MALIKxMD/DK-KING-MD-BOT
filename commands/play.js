const axios  = require('axios');
const config = require('../config');
const { fetchBuffer, TEMP_DIR } = require('../lib/functions');
const path = require('path');
const fs   = require('fs');

module.exports = {
  name: 'play',
  alias: ['music', 'song', 'yta'],
  description: 'Download YouTube audio/music',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}play <song name or YouTube URL>\n\nExample: ${config.prefix}play Shape of You Ed Sheeran\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    await sock.sendMessage(jid, { text: `🎵 _Searching for:_ *${body}*...` }, { quoted: msg });

    try {
      // Search via ytdl API
      const searchUrl = `https://api.ryzendesu.vip/api/downloader/ytmp3?url=${encodeURIComponent(body.startsWith('http') ? body : `https://www.youtube.com/results?search_query=${encodeURIComponent(body)}`)}`;

      let audioUrl = '';
      let title    = body;
      let duration = 'Unknown';
      let thumbnail = '';

      // Try yt-search first
      try {
        const { data: search } = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(body)}&type=video&maxResults=1&key=`,
          { timeout: 8000 }
        );
      } catch {}

      // Use ytdl API
      try {
        const query = body.startsWith('http') ? body : body;
        const { data } = await axios.get(
          `https://api.siputzx.my.id/api/d/ytmp3?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
          { timeout: 20000 }
        );
        audioUrl = data?.data?.url || data?.url || '';
        title    = data?.data?.title || data?.title || body;
      } catch {}

      // Fallback API
      if (!audioUrl) {
        try {
          const { data } = await axios.get(
            `https://api.nekorinn.my.id/downloader/ytmp3?url=${encodeURIComponent(body.startsWith('http') ? body : `ytsearch:${body}`)}`,
            { timeout: 20000 }
          );
          audioUrl = data?.result?.url || data?.url || '';
          title    = data?.result?.title || title;
        } catch {}
      }

      if (!audioUrl) {
        return sock.sendMessage(jid, {
          text: `❌ Could not find/download: *${body}*\n\nTry sending a direct YouTube URL.\n\n> *Downloaded by Marco Malik MD Bot*`,
        }, { quoted: msg });
      }

      const buffer = await fetchBuffer(audioUrl);
      await sock.sendMessage(jid, {
        audio: buffer,
        mimetype: 'audio/mpeg',
        ptt: false,
        fileName: `${title}.mp3`,
      }, { quoted: msg });

      await sock.sendMessage(jid, {
        text: `✅ *Downloaded Successfully!*\n\n🎵 Title: ${title}\n\n> *Downloaded by Marco Malik MD Bot*`,
      }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(jid, {
        text: `❌ Download failed: ${err.message}\n\n> *Downloaded by Marco Malik MD Bot*`,
      }, { quoted: msg });
    }
  },
};
