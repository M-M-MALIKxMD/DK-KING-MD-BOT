const config = require('../config');
const { getAllUsers } = require('../lib/database');

module.exports = {
  name: 'warnlist',
  alias: ['warnings', 'warncount'],
  description: 'List all warned members',
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, msg, jid }) {
    const users = getAllUsers();
    const warned = Object.values(users).filter(u => (u.warnings || 0) > 0);

    if (!warned.length) {
      return sock.sendMessage(jid, { text: `✅ No warned members!\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }

    const list = warned.map(u => `• @${u.jid?.split('@')[0]} — ⚠️ ${u.warnings}/3 warnings`).join('\n');
    await sock.sendMessage(jid, {
      text: `⚠️ *Warned Members*\n\n${list}\n\n> *Powered by Marco Malik*`,
      mentions: warned.map(u => u.jid).filter(Boolean),
    }, { quoted: msg });
  },
};
