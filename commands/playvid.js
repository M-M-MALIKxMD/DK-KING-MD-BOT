const axios  = require('axios');
const config = require('../config');
const { fetchBuffer } = require('../lib/functions');

module.exports = {
  name: 'playvid',
  alias: ['ytv', 'ytvideo', 'ytmp4'],
  description: 'Download YouTube video',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}playvid <YouTube URL or title>\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    await sock.sendMessage(jid, { text: `🎬 _Downloading video:_ *${body}*...` }, { quoted: msg });

    try {
      let videoUrl = '';
      let title = body;

      const apis = [
        `https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(body.startsWith('http') ? body : `ytsearch:${body}`)}`,
        `https://api.nekorinn.my.id/downloader/ytmp4?url=${encodeURIComponent(body)}`,
      ];

      for (const api of apis) {
        try {
          const { data } = await axios.get(api, { timeout: 25000 });
          videoUrl = data?.data?.url || data?.result?.url || data?.url || '';
          title    = data?.data?.title || data?.result?.title || data?.title || body;
          if (videoUrl) break;
        } catch {}
      }

      if (!videoUrl) {
        return sock.sendMessage(jid, {
          text: `❌ Could not download video.\n\nTip: Send a direct YouTube URL.\n\n> *Downloaded by Marco Malik MD Bot*`,
        }, { quoted: msg });
      }

      const buffer = await fetchBuffer(videoUrl);
      await sock.sendMessage(jid, {
        video: buffer,
        caption: `✅ *${title}*\n\n> *Downloaded by Marco Malik MD Bot*`,
        mimetype: 'video/mp4',
      }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(jid, {
        text: `❌ Video download failed: ${err.message}\n\n> *Downloaded by Marco Malik MD Bot*`,
      }, { quoted: msg });
    }
  },
};
