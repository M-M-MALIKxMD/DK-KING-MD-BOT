const axios  = require('axios');
const config = require('../config');

module.exports = {
  name: 'trivia',
  alias: ['quiz'],
  description: 'Answer a trivia question',
  async execute({ sock, msg, jid }) {
    try {
      const { data } = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple', { timeout: 10000 });
      const q = data.results?.[0];
      if (!q) throw new Error('No data');

      const unescape = s => s.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      const answers  = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5).map(unescape);
      const labels   = ['A', 'B', 'C', 'D'];

      const text = `🧠 *Trivia Question!*\n\n📚 Category: ${unescape(q.category)}\n⭐ Difficulty: ${q.difficulty.toUpperCase()}\n\n❓ ${unescape(q.question)}\n\n${answers.map((a, i) => `${labels[i]}) ${a}`).join('\n')}\n\n||✅ Answer: ${unescape(q.correct_answer)}||\n\n> *Powered by Marco Malik*`;

      await sock.sendMessage(jid, { text }, { quoted: msg });
    } catch {
      await sock.sendMessage(jid, {
        text: `❌ Could not load trivia. Try again!\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }
  },
};
