const config = require('../config');
const { getGroup, saveGroup } = require('../lib/database');

module.exports = {
  name: 'antispam',
  alias: ['nospam'],
  description: 'Toggle anti-spam in group',
  groupOnly: true,
  adminOnly: true,
  async execute({ sock, msg, jid, args }) {
    const grp = getGroup(jid);
    grp.antiSpam = args[0] !== 'off';
    saveGroup(jid, grp);
    await sock.sendMessage(jid, {
      text: `🛡️ *Anti-Spam: ${grp.antiSpam ? 'ON ✅' : 'OFF ❌'}*\n\n${grp.antiSpam ? 'Spammers will be warned automatically.' : 'Anti-spam disabled.'}\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
