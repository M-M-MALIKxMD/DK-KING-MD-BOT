const axios  = require('axios');
const config = require('../config');
const { fetchBuffer } = require('../lib/functions');

module.exports = {
  name: 'facebook',
  alias: ['fb', 'fbdl'],
  description: 'Download Facebook video',
  async execute({ sock, msg, jid, body }) {
    if (!body || (!body.includes('facebook') && !body.includes('fb.watch'))) {
      return sock.sendMessage(jid, {
        text: `❌ Usage: ${config.prefix}facebook <Facebook video URL>\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }

    await sock.sendMessage(jid, { text: '⬇️ _Downloading Facebook video..._' }, { quoted: msg });

    try {
      let videoUrl = '';

      const apis = [
        async () => {
          const { data } = await axios.get(`https://api.siputzx.my.id/api/d/facebook?url=${encodeURIComponent(body)}`, { timeout: 20000 });
          return data?.data?.hd || data?.data?.sd || '';
        },
        async () => {
          const { data } = await axios.get(`https://api.nekorinn.my.id/downloader/fbvideo?url=${encodeURIComponent(body)}`, { timeout: 20000 });
          return data?.result?.hd || data?.result?.sd || data?.url || '';
        },
      ];

      for (const fn of apis) {
        try { const url = await fn(); if (url) { videoUrl = url; break; } }
        catch {}
      }

      if (!videoUrl) {
        return sock.sendMessage(jid, {
          text: `❌ Could not download Facebook video. Make sure the video is public.\n\n> *Downloaded by Marco Malik MD Bot*`,
        }, { quoted: msg });
      }

      const buffer = await fetchBuffer(videoUrl);
      await sock.sendMessage(jid, {
        video: buffer,
        caption: `✅ *Facebook Video Downloaded!*\n\n> *Downloaded by Marco Malik MD Bot*`,
        mimetype: 'video/mp4',
      }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(jid, {
        text: `❌ Download failed: ${err.message}\n\n> *Downloaded by Marco Malik MD Bot*`,
      }, { quoted: msg });
    }
  },
};
