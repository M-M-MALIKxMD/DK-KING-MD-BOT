const { fetchBuffer } = require('../lib/functions');
const config = require('../config');

module.exports = {
  name: 'waqar',
  description: 'Generate AI image — Waqar style',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}waqar <prompt>\n\nExample: ${config.prefix}waqar beautiful landscape at night\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    await sock.sendMessage(jid, { text: '🌙 _Waqar AI is generating your image..._' }, { quoted: msg });

    const styled = `cinematic, dramatic lighting, professional photography, ${body}, ultra detailed, 8k, award winning`;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(styled)}?nologo=true&width=768&height=768&seed=${Date.now()}`;

    try {
      const buffer = await fetchBuffer(url);
      await sock.sendMessage(jid, {
        image: buffer,
        caption: `🌙 *Waqar AI*\n\n📝 Prompt: ${body}\n🎨 Style: Cinematic\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    } catch {
      await sock.sendMessage(jid, { text: `❌ Image generation failed. Please try again.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
