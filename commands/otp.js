const config = require('../config');
const { getRandomInt } = require('../lib/functions');

module.exports = {
  name: 'otp',
  alias: ['generateotp', 'code'],
  description: 'Generate a random OTP code',
  async execute({ sock, msg, jid, args }) {
    const length = Math.min(parseInt(args[0]) || 6, 12);
    const otp    = String(getRandomInt(Math.pow(10, length - 1), Math.pow(10, length) - 1));

    await sock.sendMessage(jid, {
      text: `🔐 *Generated OTP (${length} digits)*\n\n\`\`\`${otp}\`\`\`\n\n⏰ Valid for: 5 minutes\n⚠️ _Do not share this code!_\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
