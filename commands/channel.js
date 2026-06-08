const config = require('../config');

module.exports = {
  name: 'channel',
  alias: ['channels', 'officialchannel', 'joinchannel'],
  description: 'Show official WhatsApp channel link',
  async execute({ sock, msg, jid }) {
    await sock.sendMessage(jid, {
      text: `📢 *Official ${config.botName} Channel!*\n\n🔗 Join here:\n${config.channelLink}\n\n✅ Get bot updates, tips, and support!\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
