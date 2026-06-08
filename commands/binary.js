const config = require('../config');

module.exports = {
  name: 'binary',
  alias: ['bin', 'tobinary'],
  description: 'Convert text to/from binary',
  async execute({ sock, msg, jid, args, body }) {
    const mode = args[0]?.toLowerCase();
    const text = args.slice(1).join(' ');

    if (!mode || !text) {
      return sock.sendMessage(jid, {
        text: `❌ Usage:\n${config.prefix}binary encode Hello\n${config.prefix}binary decode 01001000 01100101\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }

    if (mode === 'encode') {
      const binary = text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
      await sock.sendMessage(jid, { text: `🔢 *Binary Encoded:*\n\n\`\`\`${binary}\`\`\`\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    } else if (mode === 'decode') {
      try {
        const decoded = text.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('');
        await sock.sendMessage(jid, { text: `🔤 *Binary Decoded:*\n\n${decoded}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
      } catch {
        await sock.sendMessage(jid, { text: `❌ Invalid binary string.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
      }
    } else {
      await sock.sendMessage(jid, { text: `❌ Mode must be *encode* or *decode*.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
