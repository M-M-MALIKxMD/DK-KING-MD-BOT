const config = require('../config');
const { getUser, saveUser } = require('../lib/database');

module.exports = {
  name: 'warn',
  alias: ['warning'],
  description: 'Warn a member (3 warnings = kick)',
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, msg, jid, mentioned, args, isBotAdmin }) {
    const target = mentioned[0] || (args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);
    if (!target) return sock.sendMessage(jid, { text: `❌ Mention someone to warn.\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    const reason = (mentioned.length ? args : args.slice(1)).join(' ') || 'No reason given';
    const user = getUser(target);
    user.warnings = (user.warnings || 0) + 1;
    saveUser(target, user);

    await sock.sendMessage(jid, {
      text: `⚠️ *Warning issued to @${target.split('@')[0]}!*\n\n📝 Reason: ${reason}\n⚠️ Warnings: *${user.warnings}/3*\n\n${user.warnings >= 3 ? '🚨 Max warnings reached! Consider kicking this user.' : ''}\n\n> *Powered by Marco Malik*`,
      mentions: [target],
    }, { quoted: msg });

    if (user.warnings >= 3 && isBotAdmin) {
      await sock.groupParticipantsUpdate(jid, [target], 'remove').catch(() => {});
      await sock.sendMessage(jid, { text: `👢 @${target.split('@')[0]} was *auto-kicked* after 3 warnings!\n\n> *Powered by Marco Malik*`, mentions: [target] }, { quoted: msg });
    }
  },
};
