const config = require('../config');
const { getRandomInt } = require('../lib/functions');

module.exports = {
  name: 'password',
  alias: ['genpass', 'passwd'],
  description: 'Generate a secure random password',
  async execute({ sock, msg, jid, args }) {
    const length = Math.min(parseInt(args[0]) || 16, 64);
    const chars  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let pass = '';
    for (let i = 0; i < length; i++) pass += chars[getRandomInt(0, chars.length - 1)];

    const strength = length >= 16 && /[A-Z]/.test(pass) && /[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass) ? '🟢 Strong' : length >= 8 ? '🟡 Medium' : '🔴 Weak';

    await sock.sendMessage(jid, {
      text: `🔐 *Generated Password (${length} chars)*\n\n\`\`\`${pass}\`\`\`\n\n💪 Strength: ${strength}\n\n⚠️ _Store it safely!_\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
