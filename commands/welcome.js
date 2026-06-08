const config = require('../config');
const { getGroup, saveGroup } = require('../lib/database');

module.exports = {
  name: 'welcome',
  alias: ['setwelcome'],
  description: 'Toggle welcome messages for new members',
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, msg, jid, args }) {
    const grp = getGroup(jid);
    grp.welcome = args[0] !== 'off';
    saveGroup(jid, grp);
    await sock.sendMessage(jid, {
      text: `👋 *Welcome Messages: ${grp.welcome ? 'ON ✅' : 'OFF ❌'}*\n\n${grp.welcome ? 'New members will receive a welcome message.' : 'Welcome messages disabled.'}\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
