const config = require('../config');

module.exports = {
  name: 'base64',
  alias: ['b64', 'encode64'],
  description: 'Encode or decode Base64',
  async execute({ sock, msg, jid, args, body }) {
    const mode = args[0]?.toLowerCase();
    const text = args.slice(1).join(' ');

    if (!mode || !text) {
      return sock.sendMessage(jid, {
        text: `❌ Usage:\n${config.prefix}base64 encode Hello World\n${config.prefix}base64 decode SGVsbG8gV29ybGQ=\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }

    if (mode === 'encode') {
      const encoded = Buffer.from(text).toString('base64');
      await sock.sendMessage(jid, { text: `🔒 *Base64 Encoded:*\n\n\`\`\`${encoded}\`\`\`\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    } else if (mode === 'decode') {
      try {
        const decoded = Buffer.from(text, 'base64').toString('utf8');
        await sock.sendMessage(jid, { text: `🔓 *Base64 Decoded:*\n\n${decoded}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
      } catch {
        await sock.sendMessage(jid, { text: `❌ Invalid Base64 string.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
      }
    } else {
      await sock.sendMessage(jid, { text: `❌ Mode must be *encode* or *decode*.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
