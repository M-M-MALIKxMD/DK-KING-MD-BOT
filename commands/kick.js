const config = require('../config');

module.exports = {
  name: 'kick',
  alias: ['remove', 'ban'],
  description: 'Kick a member from the group',
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, msg, jid, mentioned, args, isBotAdmin }) {
    if (!isBotAdmin) return sock.sendMessage(jid, { text: `❌ Bot must be an *admin* to kick members.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    const targets = mentioned.length ? mentioned : args.map(a => a.replace(/[^0-9]/g, '') + '@s.whatsapp.net').filter(Boolean);
    if (!targets.length) return sock.sendMessage(jid, { text: `❌ Mention someone to kick.\n\nUsage: ${config.prefix}kick @person\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    for (const target of targets) {
      try {
        await sock.groupParticipantsUpdate(jid, [target], 'remove');
        await sock.sendMessage(jid, { text: `✅ @${target.split('@')[0]} has been *kicked!* 👢\n\n> *Powered by Marco Malik*`, mentions: [target] }, { quoted: msg });
      } catch (e) {
        await sock.sendMessage(jid, { text: `❌ Could not kick @${target.split('@')[0]}: ${e.message}\n\n> *Powered by Marco Malik*`, mentions: [target] }, { quoted: msg });
      }
    }
  },
};
