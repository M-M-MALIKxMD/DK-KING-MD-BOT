const config = require('../config');

module.exports = {
  name: 'eval',
  alias: ['run', 'exec'],
  description: 'Execute JavaScript code (OWNER ONLY)',
  ownerOnly: true,
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}eval <JS code>\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    try {
      // eslint-disable-next-line no-eval
      let result = await eval(`(async () => { ${body} })()`);
      if (typeof result !== 'string') result = JSON.stringify(result, null, 2);
      if (!result) result = 'undefined';
      if (result.length > 3000) result = result.substring(0, 3000) + '...';

      await sock.sendMessage(jid, {
        text: `💻 *Eval Result*\n\n📥 Input:\n\`\`\`${body}\`\`\`\n\n📤 Output:\n\`\`\`${result}\`\`\`\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(jid, {
        text: `❌ *Error:*\n\`\`\`${e.message}\`\`\`\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }
  },
};
