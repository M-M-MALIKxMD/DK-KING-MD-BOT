const config = require('../config');

module.exports = {
  name: 'donate',
  alias: ['support', 'sponsor'],
  description: 'Support the bot developer',
  async execute({ sock, msg, jid }) {
    await sock.sendMessage(jid, {
      text: `❤️ *Support ${config.botName}!*\n\n🙏 If you enjoy using this bot, consider supporting the developer!\n\n📢 *Join our Channel:*\n${config.channelLink}\n\n💝 Your support keeps this bot alive!\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
