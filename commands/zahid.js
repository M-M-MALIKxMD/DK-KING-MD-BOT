const { fetchBuffer } = require('../lib/functions');
const config = require('../config');

module.exports = {
  name: 'zahid',
  description: 'Generate AI image — Zahid style',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}zahid <prompt>\n\nExample: ${config.prefix}zahid colorful abstract art\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    await sock.sendMessage(jid, { text: '🎨 _Zahid AI is generating your image..._' }, { quoted: msg });

    const styled = `vibrant colors, abstract art, modern digital painting, ${body}, highly detailed, trending on artstation`;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(styled)}?nologo=true&width=768&height=768&seed=${Date.now()}`;

    try {
      const buffer = await fetchBuffer(url);
      await sock.sendMessage(jid, {
        image: buffer,
        caption: `🎨 *Zahid AI*\n\n📝 Prompt: ${body}\n🎨 Style: Digital Art\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    } catch {
      await sock.sendMessage(jid, { text: `❌ Image generation failed. Please try again.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
