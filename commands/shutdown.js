const config = require('../config');

module.exports = {
  name: 'shutdown',
  alias: ['stop', 'turnoff'],
  description: 'Shut down the bot',
  ownerOnly: true,
  async execute({ sock, msg, jid }) {
    await sock.sendMessage(jid, { text: `🛑 *Shutting down ${config.botName}...*\n\nGoodbye! 👋\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    setTimeout(() => process.exit(1), 2000);
  },
};
