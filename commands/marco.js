const { fetchBuffer } = require('../lib/functions');
const config = require('../config');

module.exports = {
  name: 'marco',
  description: 'Generate AI image — Marco style',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}marco <prompt>\n\nExample: ${config.prefix}marco hacker in dark room with code\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    await sock.sendMessage(jid, { text: '🖤 _Marco AI is generating your image..._' }, { quoted: msg });

    const styled = `dark hacker aesthetic, neon lights, ${body}, cyberpunk, ultra realistic, 4k`;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(styled)}?nologo=true&width=768&height=768&seed=${Date.now()}`;

    try {
      const buffer = await fetchBuffer(url);
      await sock.sendMessage(jid, {
        image: buffer,
        caption: `🖤 *Marco AI*\n\n📝 Prompt: ${body}\n🎨 Style: Dark Hacker\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    } catch {
      await sock.sendMessage(jid, { text: `❌ Image generation failed. Please try again.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
