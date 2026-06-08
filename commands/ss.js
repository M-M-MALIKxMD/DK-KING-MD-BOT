const axios  = require('axios');
const config = require('../config');
const { fetchBuffer } = require('../lib/functions');

module.exports = {
  name: 'ss',
  alias: ['screenshot', 'webss', 'capture'],
  description: 'Take a website screenshot',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}ss <URL>\n\nExample: ${config.prefix}ss https://google.com\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    let url = body;
    if (!url.startsWith('http')) url = 'https://' + url;

    await sock.sendMessage(jid, { text: `📸 _Capturing screenshot of:_ ${url}...` }, { quoted: msg });

    try {
      const ssApis = [
        `https://api.apiflash.com/v1/urltoimage?access_key=free&url=${encodeURIComponent(url)}&format=jpeg&width=1280&height=720`,
        `https://api.screenshotone.com/take?url=${encodeURIComponent(url)}&format=jpg&viewport_width=1280&viewport_height=720`,
        `https://s0.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1280&h=720`,
        `https://mini.s-shot.ru/1280x720/JPEG/1280/${encodeURIComponent(url)}`,
      ];

      let buffer = null;
      for (const api of ssApis) {
        try { buffer = await fetchBuffer(api); if (buffer?.length > 5000) break; }
        catch {}
      }

      if (!buffer || buffer.length < 5000) {
        return sock.sendMessage(jid, {
          text: `❌ Screenshot failed. The URL may be unreachable.\n\n> *Powered by Marco Malik*`,
        }, { quoted: msg });
      }

      await sock.sendMessage(jid, {
        image: buffer,
        caption: `📸 *Screenshot of:* ${url}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(jid, {
        text: `❌ Screenshot error: ${err.message}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }
  },
};
