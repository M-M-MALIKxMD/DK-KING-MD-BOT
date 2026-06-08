const axios  = require('axios');
const config = require('../config');
const { fetchBuffer } = require('../lib/functions');

module.exports = {
  name: 'instagram',
  alias: ['ig', 'igdl', 'insta'],
  description: 'Download Instagram photo/video/reel',
  async execute({ sock, msg, jid, body }) {
    if (!body || !body.includes('instagram')) {
      return sock.sendMessage(jid, {
        text: `❌ Usage: ${config.prefix}instagram <Instagram URL>\n\nExample: ${config.prefix}instagram https://www.instagram.com/p/xxxx/\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }

    await sock.sendMessage(jid, { text: '⬇️ _Downloading from Instagram..._' }, { quoted: msg });

    try {
      let mediaUrl = '';
      let isVideo  = false;

      const apis = [
        async () => {
          const { data } = await axios.get(`https://api.siputzx.my.id/api/d/instagram?url=${encodeURIComponent(body)}`, { timeout: 20000 });
          const item = data?.data?.[0];
          return { url: item?.url, isVideo: item?.type === 'video' };
        },
        async () => {
          const { data } = await axios.get(`https://api.tiklydown.eu.org/api/download/instagram?url=${encodeURIComponent(body)}`, { timeout: 20000 });
          return { url: data?.url || data?.video_url, isVideo: !!data?.video_url };
        },
      ];

      for (const fn of apis) {
        try {
          const res = await fn();
          if (res?.url) { mediaUrl = res.url; isVideo = res.isVideo; break; }
        } catch {}
      }

      if (!mediaUrl) {
        return sock.sendMessage(jid, {
          text: `❌ Could not download from Instagram. Make sure the post is public.\n\n> *Downloaded by Marco Malik MD Bot*`,
        }, { quoted: msg });
      }

      const buffer = await fetchBuffer(mediaUrl);
      if (isVideo) {
        await sock.sendMessage(jid, {
          video: buffer,
          caption: `✅ *Instagram Video Downloaded!*\n\n> *Downloaded by Marco Malik MD Bot*`,
          mimetype: 'video/mp4',
        }, { quoted: msg });
      } else {
        await sock.sendMessage(jid, {
          image: buffer,
          caption: `✅ *Instagram Photo Downloaded!*\n\n> *Downloaded by Marco Malik MD Bot*`,
        }, { quoted: msg });
      }

    } catch (err) {
      await sock.sendMessage(jid, {
        text: `❌ Download failed: ${err.message}\n\n> *Downloaded by Marco Malik MD Bot*`,
      }, { quoted: msg });
    }
  },
};
