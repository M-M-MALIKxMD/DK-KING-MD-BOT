const config = require('../config');

module.exports = {
  name: 'poll',
  alias: ['vote', 'createpoll'],
  description: 'Create a poll in the group',
  groupOnly: true,
  async execute({ sock, msg, jid, body }) {
    if (!body) {
      return sock.sendMessage(jid, {
        text: `❌ Usage: ${config.prefix}poll Question | Option1 | Option2 | Option3\n\nExample: ${config.prefix}poll Best color? | Red | Blue | Green\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }

    const parts = body.split('|').map(p => p.trim());
    if (parts.length < 3) {
      return sock.sendMessage(jid, {
        text: `❌ Need at least 2 options.\n\nUsage: ${config.prefix}poll Question | Option1 | Option2\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }

    const question = parts[0];
    const options  = parts.slice(1).slice(0, 12);

    try {
      await sock.sendMessage(jid, {
        poll: {
          name: question,
          values: options,
          selectableCount: 1,
        },
      }, { quoted: msg });
      await sock.sendMessage(jid, { text: `📊 *Poll created!*\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    } catch {
      // Fallback: text-based poll
      const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '1️⃣1️⃣', '1️⃣2️⃣'];
      const text = `📊 *Poll: ${question}*\n\n${options.map((o, i) => `${emojis[i]} ${o}`).join('\n')}\n\nReact with the emoji to vote!\n\n> *Powered by Marco Malik*`;
      await sock.sendMessage(jid, { text }, { quoted: msg });
    }
  },
};
