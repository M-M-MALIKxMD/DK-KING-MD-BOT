const axios  = require('axios');
const config = require('../config');

module.exports = {
  name: 'gemini',
  alias: ['gemi', 'bard'],
  description: 'Chat with Google Gemini AI',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}gemini <question>\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    await sock.sendMessage(jid, { text: '✨ _Gemini is thinking..._' }, { quoted: msg });

    let reply = '';

    if (config.geminiKey) {
      try {
        const { data } = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${config.geminiKey}`,
          { contents: [{ parts: [{ text: body }] }] },
          { timeout: 25000 }
        );
        reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      } catch (e) {
        reply = `❌ Gemini API Error: ${e.message}`;
      }
    } else {
      // Free fallback via public proxy
      try {
        const { data } = await axios.post(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDJC5a882ruG1UiOPMrGl2e-rRyQ-FEMpE',
          { contents: [{ parts: [{ text: body }] }] },
          { timeout: 20000 }
        );
        reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
      } catch {
        reply = '⚠️ Gemini API key not set. Add GEMINI_API_KEY to your .env file.\n\nGet a free key at: https://aistudio.google.com/';
      }
    }

    await sock.sendMessage(jid, {
      text: `✨ *Google Gemini AI*\n\n💬 *Q:* ${body}\n\n🧠 *A:* ${reply}\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
