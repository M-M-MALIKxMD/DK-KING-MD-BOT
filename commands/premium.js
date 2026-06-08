const config = require('../config');
const { getUser, saveUser } = require('../lib/database');

module.exports = {
  name: 'premium',
  alias: ['vip', 'premiumuser'],
  description: 'Check or grant premium status',
  async execute({ sock, msg, jid, senderJid, mentioned, args, isOwner }) {
    // Owner granting premium
    if (isOwner && mentioned.length && args[0] === 'add') {
      for (const t of mentioned) {
        saveUser(t, { premium: true });
        await sock.sendMessage(jid, { text: `💎 @${t.split('@')[0]} is now *Premium!*\n\n> *Powered by Marco Malik*`, mentions: [t] }, { quoted: msg });
      }
      return;
    }

    if (isOwner && mentioned.length && args[0] === 'remove') {
      for (const t of mentioned) {
        saveUser(t, { premium: false });
        await sock.sendMessage(jid, { text: `✅ Premium removed from @${t.split('@')[0]}\n\n> *Powered by Marco Malik*`, mentions: [t] }, { quoted: msg });
      }
      return;
    }

    const user = getUser(senderJid);
    await sock.sendMessage(jid, {
      text: user.premium
        ? `💎 *Premium Status: ACTIVE*\n\n✅ You have premium access!\n🎁 Enjoy exclusive features!\n\n> *Powered by Marco Malik*`
        : `💎 *Premium Status: NOT ACTIVE*\n\n📩 Contact the owner to get premium:\n${config.channelLink}\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
