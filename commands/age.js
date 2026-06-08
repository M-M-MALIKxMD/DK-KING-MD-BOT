const config = require('../config');

module.exports = {
  name: 'age',
  alias: ['birthday', 'howold'],
  description: 'Calculate age from birth date',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}age <YYYY-MM-DD>\n\nExample: ${config.prefix}age 1999-05-15\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    const birth = new Date(body);
    if (isNaN(birth)) return sock.sendMessage(jid, { text: `❌ Invalid date. Use YYYY-MM-DD format.\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    const now   = new Date();
    const years = Math.floor((now - birth) / (365.25 * 24 * 3600 * 1000));
    const nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < now) nextBirthday.setFullYear(now.getFullYear() + 1);
    const daysLeft = Math.ceil((nextBirthday - now) / (24 * 3600 * 1000));

    await sock.sendMessage(jid, {
      text: `🎂 *Age Calculator*\n\n📅 Born: ${body}\n🎈 Age: *${years} years old*\n🎊 Next Birthday: ${daysLeft} days away!\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
