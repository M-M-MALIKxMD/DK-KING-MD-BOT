const config = require('../config');
const { getGroup, saveGroup } = require('../lib/database');

module.exports = {
  name: 'goodbye',
  alias: ['setgoodbye', 'bye'],
  description: 'Toggle goodbye messages for leaving members',
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, msg, jid, args }) {
    const grp = getGroup(jid);
    grp.goodbye = args[0] !== 'off';
    saveGroup(jid, grp);
    await sock.sendMessage(jid, {
      text: `👋 *Goodbye Messages: ${grp.goodbye ? 'ON ✅' : 'OFF ❌'}*\n\n${grp.goodbye ? 'A goodbye message will be sent when members leave.' : 'Goodbye messages disabled.'}\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
