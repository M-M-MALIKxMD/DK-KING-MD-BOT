const config = require('../config');

module.exports = {
  name: 'sendmsg',
  alias: ['send', 'dm'],
  description: 'Send a message to a specific number/group',
  ownerOnly: true,
  async execute({ sock, msg, jid, args, body }) {
    const target = args[0]?.replace(/[^0-9@.]/g, '') + (args[0]?.includes('@g') ? '' : '@s.whatsapp.net');
    const text   = args.slice(1).join(' ');
    if (!target || !text) {
      return sock.sendMessage(jid, {
        text: `❌ Usage: ${config.prefix}sendmsg <number> <message>\n\nExample: ${config.prefix}sendmsg 923001234567 Hello!\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }

    try {
      await sock.sendMessage(target, { text: text + '\n\n> *Powered by Marco Malik*' });
      await sock.sendMessage(jid, { text: `✅ Message sent to *${target.split('@')[0]}*!\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(jid, { text: `❌ Failed: ${e.message}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
