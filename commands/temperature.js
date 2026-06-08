const config = require('../config');

module.exports = {
  name: 'temperature',
  alias: ['temp', 'celsius', 'fahrenheit'],
  description: 'Convert temperature between C, F, and K',
  async execute({ sock, msg, jid, args }) {
    const value = parseFloat(args[0]);
    const unit  = args[1]?.toLowerCase();

    if (isNaN(value) || !unit) {
      return sock.sendMessage(jid, {
        text: `❌ Usage: ${config.prefix}temperature <value> <c|f|k>\n\nExample: ${config.prefix}temperature 100 c\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }

    let c, f, k;
    if (unit === 'c') { c = value; f = c * 9 / 5 + 32; k = c + 273.15; }
    else if (unit === 'f') { f = value; c = (f - 32) * 5 / 9; k = c + 273.15; }
    else if (unit === 'k') { k = value; c = k - 273.15; f = c * 9 / 5 + 32; }
    else return sock.sendMessage(jid, { text: `❌ Unit must be c, f, or k.\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    await sock.sendMessage(jid, {
      text: `🌡️ *Temperature Converter*\n\n🌡️ Celsius: *${c.toFixed(2)}°C*\n🌡️ Fahrenheit: *${f.toFixed(2)}°F*\n🌡️ Kelvin: *${k.toFixed(2)}K*\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
