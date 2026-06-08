const axios  = require('axios');
const config = require('../config');

module.exports = {
  name: 'gpt',
  alias: ['chatgpt', 'openai'],
  description: 'Chat with GPT AI',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}gpt <question>\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    await sock.sendMessage(jid, { text: '🤖 _GPT is processing..._' }, { quoted: msg });

    let reply = '';

    if (config.openaiKey) {
      try {
        const { data } = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          { model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: body }], max_tokens: 1000 },
          { headers: { Authorization: `Bearer ${config.openaiKey}`, 'Content-Type': 'application/json' }, timeout: 30000 }
        );
        reply = data.choices?.[0]?.message?.content || '';
      } catch (e) {
        reply = `❌ OpenAI Error: ${e.message}`;
      }
    }

    // Free fallback
    if (!reply) {
      try {
        const { data } = await axios.get(
          `https://api.ryzendesu.vip/api/ai/chatgpt?text=${encodeURIComponent(body)}`,
          { timeout: 20000 }
        );
        reply = data.response || data.answer || data.text || '';
      } catch {}
    }

    if (!reply) {
      try {
        const { data } = await axios.get(
          `https://api.nekorinn.my.id/ai/gpt?text=${encodeURIComponent(body)}`,
          { timeout: 15000 }
        );
        reply = data.result || data.response || 'Unable to get a response.';
      } catch {
        reply = '⚠️ GPT service is unavailable. Add OPENAI_API_KEY in .env for best results.';
      }
    }

    await sock.sendMessage(jid, {
      text: `🤖 *ChatGPT*\n\n💬 *Q:* ${body}\n\n🧠 *A:* ${reply}\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
