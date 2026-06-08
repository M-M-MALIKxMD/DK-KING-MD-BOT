const config = require('../config');
const { fetchBuffer } = require('../lib/functions');

module.exports = {
  name: 'tts',
  alias: ['speak', 'voice'],
  description: 'Convert text to speech',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}tts <text>\n\nExample: ${config.prefix}tts Hello World\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    await sock.sendMessage(jid, { text: '🔊 _Generating voice..._' }, { quoted: msg });

    try {
      const gTTS = require('google-tts-api');
      const url  = gTTS.getAudioUrl(body.substring(0, 200), { lang: 'en', slow: false });
      const buffer = await fetchBuffer(url);

      await sock.sendMessage(jid, {
        audio: buffer,
        mimetype: 'audio/mpeg',
        ptt: true,
      }, { quoted: msg });

      await sock.sendMessage(jid, { text: `✅ *Text-to-Speech done!*\n\n📝 Text: ${body.substring(0, 50)}${body.length > 50 ? '...' : ''}\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(jid, {
        text: `❌ TTS failed: ${err.message}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }
  },
};
