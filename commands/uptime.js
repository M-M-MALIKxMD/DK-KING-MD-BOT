const { formatDuration } = require('../lib/functions');
const config = require('../config');

module.exports = {
  name: 'uptime',
  alias: ['runtime'],
  description: 'Show bot uptime',
  async execute({ sock, msg, jid }) {
    const up = formatDuration(process.uptime() * 1000);
    const mem = (process.memoryUsage().heapUsed / 1048576).toFixed(1);
    await sock.sendMessage(jid, {
      text: `⏱️ *Bot Uptime*\n\n🤖 Bot: ${config.botName}\n🕐 Uptime: *${up}*\n💾 Memory: ${mem} MB\n🟢 Status: Online\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
