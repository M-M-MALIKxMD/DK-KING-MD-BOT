const config = require('../config');

module.exports = {
  name: 'leave',
  alias: ['leavegroup'],
  description: 'Leave the current group',
  ownerOnly: true,
  groupOnly: true,
  async execute({ sock, msg, jid }) {
    await sock.sendMessage(jid, { text: `👋 *Leaving group... Goodbye!*\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    await sock.groupLeave(jid).catch(() => {});
  },
};
