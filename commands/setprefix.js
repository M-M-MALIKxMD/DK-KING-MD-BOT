const config = require('../config');

module.exports = {
  name: 'setprefix',
  alias: ['prefix', 'changeprefix'],
  description: 'Change the bot command prefix',
  ownerOnly: true,
  async execute({ sock, msg, jid, args }) {
    const newPrefix = args[0];
    if (!newPrefix || newPrefix.length > 3) {
      return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}setprefix <new prefix>\n\nExample: ${config.prefix}setprefix !\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
    config.prefix = newPrefix;
    await sock.sendMessage(jid, {
      text: `✅ *Prefix changed to:* \`${newPrefix}\`\n\nAll commands now start with *${newPrefix}*\n\n⚠️ Note: Restart the bot to make this permanent (update your .env)\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
