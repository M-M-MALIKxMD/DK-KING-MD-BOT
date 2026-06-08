const { fetchBuffer } = require('../lib/functions');
const config = require('../config');

module.exports = {
  name: 'devil',
  description: 'Generate AI image — Devil dark style',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}devil <prompt>\n\nExample: ${config.prefix}devil dark fantasy warrior with fire\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    await sock.sendMessage(jid, { text: '😈 _Devil AI is generating your image..._' }, { quoted: msg });

    const styled = `dark fantasy, evil aesthetic, dramatic shadows, fire and darkness, ${body}, sinister mood, ultra detailed, gothic art`;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(styled)}?nologo=true&width=768&height=768&seed=${Date.now()}`;

    try {
      const buffer = await fetchBuffer(url);
      await sock.sendMessage(jid, {
        image: buffer,
        caption: `😈 *Devil AI*\n\n📝 Prompt: ${body}\n🎨 Style: Dark Fantasy\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    } catch {
      await sock.sendMessage(jid, { text: `❌ Image generation failed. Please try again.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
