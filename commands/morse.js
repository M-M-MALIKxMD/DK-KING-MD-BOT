const config = require('../config');

const MORSE_MAP = { A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',0:'-----',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.' };
const REVERSE   = Object.fromEntries(Object.entries(MORSE_MAP).map(([k,v])=>[v,k]));

module.exports = {
  name: 'morse',
  alias: ['morseencode', 'morsecode'],
  description: 'Encode or decode Morse code',
  async execute({ sock, msg, jid, args, body }) {
    const mode = args[0]?.toLowerCase();
    const text = args.slice(1).join(' ');

    if (!mode || !text) {
      return sock.sendMessage(jid, {
        text: `❌ Usage:\n${config.prefix}morse encode Hello\n${config.prefix}morse decode .... . .-.. .-.. ---\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }

    if (mode === 'encode') {
      const encoded = text.toUpperCase().split('').map(c => MORSE_MAP[c] || (c === ' ' ? '/' : c)).join(' ');
      await sock.sendMessage(jid, { text: `📡 *Morse Encoded:*\n\n\`\`\`${encoded}\`\`\`\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    } else if (mode === 'decode') {
      const decoded = text.split(' ').map(c => REVERSE[c] || (c === '/' ? ' ' : c)).join('');
      await sock.sendMessage(jid, { text: `📡 *Morse Decoded:*\n\n${decoded}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    } else {
      await sock.sendMessage(jid, { text: `❌ Mode must be *encode* or *decode*.\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
