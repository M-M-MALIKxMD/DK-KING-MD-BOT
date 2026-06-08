const config = require('../config');
const { formatDuration } = require('../lib/functions');

module.exports = {
  name: 'info',
  alias: ['botinfo', 'about'],
  description: 'Show bot information',
  async execute({ sock, msg, jid }) {
    const up = formatDuration(process.uptime() * 1000);
    await sock.sendMessage(jid, {
      text: `╔══════════════════╗
║   ${config.botName}   ║
╚══════════════════╝

🤖 *Bot Information*

📛 Name: ${config.botName}
👑 Owner: ${config.ownerName}
⚡ Prefix: ${config.prefix}
🌐 Mode: ${config.mode.toUpperCase()}
⏱️ Uptime: ${up}
💻 Runtime: Node.js ${process.version}
📡 Platform: WhatsApp MD

📢 *Channel:* ${config.channelLink}

> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
