const QRCode = require('qrcode');
const config = require('../config');

module.exports = {
  name: 'qr',
  alias: ['qrcode', 'qrgen'],
  description: 'Generate QR code from text/URL',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}qr <text or URL>\n\nExample: ${config.prefix}qr https://google.com\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    try {
      const buffer = await QRCode.toBuffer(body, {
        errorCorrectionLevel: 'H',
        type: 'png',
        width: 512,
        color: { dark: '#000000', light: '#ffffff' },
      });

      await sock.sendMessage(jid, {
        image: buffer,
        caption: `📱 *QR Code Generated!*\n\n📝 Content: ${body.substring(0, 60)}${body.length > 60 ? '...' : ''}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(jid, {
        text: `❌ QR generation failed: ${err.message}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }
  },
};
