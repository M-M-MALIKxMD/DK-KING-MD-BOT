const config = require('../config');

module.exports = {
  name: 'time',
  alias: ['date', 'clock', 'datetime'],
  description: 'Get current date & time',
  async execute({ sock, msg, jid, args }) {
    const timezone = args[0] || 'Asia/Karachi';
    try {
      const now = new Date();
      const opts = { timeZone: timezone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
      const formatted = now.toLocaleString('en-US', opts);

      await sock.sendMessage(jid, {
        text: `🕐 *Date & Time*\n\n📅 ${formatted}\n🌍 Timezone: ${timezone}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    } catch {
      await sock.sendMessage(jid, {
        text: `❌ Invalid timezone. Try: Asia/Karachi, America/New_York, Europe/London\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }
  },
};
