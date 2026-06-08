const axios  = require('axios');
const config = require('../config');

module.exports = {
  name: 'translate',
  alias: ['tr', 'tl'],
  description: 'Translate text to another language',
  async execute({ sock, msg, jid, args, body }) {
    if (!body) return sock.sendMessage(jid, {
      text: `❌ Usage: ${config.prefix}translate <lang code> <text>\n\nExamples:\n${config.prefix}translate ur Hello World\n${config.prefix}translate en مرحبا بالعالم\n\nCommon codes: en, ur, ar, fr, de, es, zh, ja, ko, hi\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });

    const lang = args[0]?.toLowerCase() || 'en';
    const text = args.slice(1).join(' ');

    if (!text) return sock.sendMessage(jid, { text: `❌ Provide text after the language code.\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    try {
      const { data } = await axios.get(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`,
        { timeout: 15000 }
      );

      const translated = data[0].map(r => r[0]).join('');
      const sourceLang = data[2] || 'auto';

      await sock.sendMessage(jid, {
        text: `🌐 *Translation*\n\n📥 Original (${sourceLang}): ${text}\n📤 Translated (${lang}): ${translated}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(jid, {
        text: `❌ Translation failed: ${err.message}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }
  },
};
