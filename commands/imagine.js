const axios  = require('axios');
const config = require('../config');
const { fetchBuffer } = require('../lib/functions');

module.exports = {
  name: 'imagine',
  alias: ['generate', 'draw', 'dalle'],
  description: 'Generate AI image from text',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}imagine <prompt>\n\nExample: ${config.prefix}imagine a beautiful sunset over mountains\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    await sock.sendMessage(jid, { text: `🎨 _Generating image for: "${body}"..._` }, { quoted: msg });

    const encodedPrompt = encodeURIComponent(body);
    const urls = [
      `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&width=768&height=768`,
      `https://image.pollinations.ai/prompt/${encodedPrompt}?model=flux&width=768&height=768`,
    ];

    let buffer = null;
    for (const url of urls) {
      try { buffer = await fetchBuffer(url); break; }
      catch {}
    }

    if (!buffer) {
      return sock.sendMessage(jid, { text: `❌ Image generation failed. Try a different prompt.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }

    await sock.sendMessage(jid, {
      image: buffer,
      caption: `🎨 *AI Generated Image*\n\n📝 Prompt: ${body}\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
