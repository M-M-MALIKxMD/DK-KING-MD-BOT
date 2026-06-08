const config = require('../config');

module.exports = {
  name: 'restart',
  alias: ['reboot'],
  description: 'Restart the bot',
  ownerOnly: true,
  async execute({ sock, msg, jid }) {
    await sock.sendMessage(jid, { text: `🔄 *Restarting ${config.botName}...*\n\nBe back in a moment! ⏳\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    setTimeout(() => process.exit(0), 2000);
  },
};
