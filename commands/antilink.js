const config = require('../config');
const { getGroup, saveGroup } = require('../lib/database');

module.exports = {
  name: 'antilink',
  alias: ['nolink'],
  description: 'Toggle anti-link in group',
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, msg, jid, args }) {
    const grp = getGroup(jid);
    grp.antiLink = args[0] !== 'off';
    saveGroup(jid, grp);
    await sock.sendMessage(jid, {
      text: `🔗 *Anti-Link: ${grp.antiLink ? 'ON ✅' : 'OFF ❌'}*\n\n${grp.antiLink ? 'Members who send links will be kicked.' : 'Members can now send links.'}\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
