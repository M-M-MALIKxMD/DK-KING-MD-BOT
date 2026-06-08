const axios  = require('axios');
const config = require('../config');
const { fetchBuffer } = require('../lib/functions');

module.exports = {
  name: 'tiktok',
  alias: ['tt', 'tiktokdl'],
  description: 'Download TikTok video without watermark',
  async execute({ sock, msg, jid, body }) {
    if (!body || !body.includes('tiktok')) {
      return sock.sendMessage(jid, {
        text: `❌ Usage: ${config.prefix}tiktok <TikTok URL>\n\nExample: ${config.prefix}tiktok https://www.tiktok.com/@user/video/123\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }

    await sock.sendMessage(jid, { text: '⬇️ _Downloading TikTok video..._' }, { quoted: msg });

    try {
      let videoUrl = '';
      let title    = 'TikTok Video';

      const apis = [
        async () => {
          const { data } = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(body)}`, { timeout: 20000 });
          return { url: data?.video?.noWatermark || data?.url, title: data?.title };
        },
        async () => {
          const { data } = await axios.post('https://ssstik.io/abc?url=dl', new URLSearchParams({ id: body, locale: 'en', tt: 'Z3J0dA' }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 });
          const match = data.match(/href="(https?:\/\/[^"]+)" download/);
          return { url: match?.[1], title: 'TikTok Video' };
        },
      ];

      for (const fn of apis) {
        try {
          const res = await fn();
          if (res?.url) { videoUrl = res.url; title = res.title || title; break; }
        } catch {}
      }

      if (!videoUrl) {
        return sock.sendMessage(jid, {
          text: `❌ Could not download TikTok video. Make sure the link is valid.\n\n> *Downloaded by Marco Malik MD Bot*`,
        }, { quoted: msg });
      }

      const buffer = await fetchBuffer(videoUrl);
      await sock.sendMessage(jid, {
        video: buffer,
        caption: `✅ *TikTok Downloaded!*\n\n📝 ${title}\n\n> *Downloaded by Marco Malik MD Bot*`,
        mimetype: 'video/mp4',
        gifPlayback: false,
      }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(jid, {
        text: `❌ Download failed: ${err.message}\n\n> *Downloaded by Marco Malik MD Bot*`,
      }, { quoted: msg });
    }
  },
};
