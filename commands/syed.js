const { fetchBuffer } = require('../lib/functions');
const config = require('../config');

module.exports = {
  name: 'syed',
  description: 'Generate AI image — Syed style',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}syed <prompt>\n\nExample: ${config.prefix}syed futuristic city at dawn\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    await sock.sendMessage(jid, { text: '🚀 _Syed AI is generating your image..._' }, { quoted: msg });

    const styled = `futuristic, sci-fi, ultra realistic, ${body}, octane render, unreal engine 5, 8k resolution`;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(styled)}?nologo=true&width=768&height=768&seed=${Date.now()}`;

    try {
      const buffer = await fetchBuffer(url);
      await sock.sendMessage(jid, {
        image: buffer,
        caption: `🚀 *Syed AI*\n\n📝 Prompt: ${body}\n🎨 Style: Sci-Fi Futuristic\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    } catch {
      await sock.sendMessage(jid, { text: `❌ Image generation failed. Please try again.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
