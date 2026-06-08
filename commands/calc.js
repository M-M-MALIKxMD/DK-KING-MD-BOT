const config = require('../config');

module.exports = {
  name: 'calc',
  alias: ['calculate', 'math'],
  description: 'Calculate a math expression',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}calc <expression>\n\nExample: ${config.prefix}calc (25 * 4) / 2 + 10\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    try {
      // Safe eval — only allow math chars
      if (!/^[\d\s+\-*/().%^]+$/.test(body.replace(/\s/g, ''))) {
        return sock.sendMessage(jid, { text: `❌ Invalid expression. Only use numbers and +, -, *, /, (, ).\n\n> *Powered by Marco Malik*` }, { quoted: msg });
      }
      // eslint-disable-next-line no-new-func
      const result = Function('"use strict"; return (' + body + ')')();
      if (!isFinite(result)) throw new Error('Math error (division by zero?)');

      await sock.sendMessage(jid, {
        text: `🔢 *Calculator*\n\n📝 Expression: ${body}\n✅ Result: *${result}*\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    } catch (err) {
      await sock.sendMessage(jid, { text: `❌ Calculation error: ${err.message}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
