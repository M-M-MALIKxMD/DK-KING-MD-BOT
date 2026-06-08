const crypto = require('crypto');
const config = require('../config');

module.exports = {
  name: 'hash',
  alias: ['encrypt', 'md5', 'sha'],
  description: 'Hash a string using various algorithms',
  async execute({ sock, msg, jid, args, body }) {
    const algo = args[0]?.toLowerCase();
    const text = args.slice(1).join(' ');

    const supported = ['md5', 'sha1', 'sha256', 'sha512', 'sha224', 'sha384'];

    if (!algo || !text) {
      return sock.sendMessage(jid, {
        text: `❌ Usage: ${config.prefix}hash <algorithm> <text>\n\nAlgorithms: ${supported.join(', ')}\n\nExample: ${config.prefix}hash sha256 hello world\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }

    if (!supported.includes(algo)) {
      return sock.sendMessage(jid, { text: `❌ Unsupported algorithm. Use: ${supported.join(', ')}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }

    const hashed = crypto.createHash(algo).update(text).digest('hex');
    await sock.sendMessage(jid, {
      text: `🔒 *Hash (${algo.toUpperCase()})*\n\n📝 Input: ${text}\n🔑 Hash: \`\`\`${hashed}\`\`\`\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
