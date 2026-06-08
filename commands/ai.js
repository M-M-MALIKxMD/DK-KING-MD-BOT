const axios  = require('axios');
const config = require('../config');

module.exports = {
  name: 'ai',
  alias: ['chat', 'ask', 'bot'],
  description: 'Chat with AI',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}ai <your question>\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    await sock.sendMessage(jid, { text: '🤖 _Thinking..._' }, { quoted: msg });

    let reply = '';

    // Try Gemini first
    if (config.geminiKey) {
      try {
        const { data } = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${config.geminiKey}`,
          { contents: [{ parts: [{ text: body }] }] },
          { timeout: 20000 }
        );
        reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } catch {}
    }

    // Free fallback
    if (!reply) {
      try {
        const { data } = await axios.get(
          `https://api.simsimi.vn/v1/simtalk?text=${encodeURIComponent(body)}&lc=en`,
          { timeout: 15000 }
        );
        reply = data.success || data.message || '';
      } catch {}
    }

    // Final fallback
    if (!reply) {
      try {
        const { data } = await axios.get(
          `https://chatbot.thequan.net/api?text=${encodeURIComponent(body)}`,
          { timeout: 15000 }
        );
        reply = data.response || data.text || data.message || 'I couldn\'t process that request.';
      } catch {
        reply = '⚠️ AI service is temporarily unavailable. Please try again later.';
      }
    }

    await sock.sendMessage(jid, {
      text: `🤖 *AI Response*\n\n💬 *You:* ${body}\n\n🧠 *Bot:* ${reply}\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
