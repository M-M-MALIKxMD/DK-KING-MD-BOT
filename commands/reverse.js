const config = require('../config');

module.exports = {
  name: 'reverse',
  alias: ['rev', 'mirror'],
  description: 'Reverse a text string',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}reverse <text>\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    const reversed = [...body].reverse().join('');
    await sock.sendMessage(jid, {
      text: `🔄 *Reversed Text*\n\n📝 Original: ${body}\n🔁 Reversed: ${reversed}\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
