const config = require('../config');
const { pickRandom } = require('../lib/functions');

const lines = [
  'Are you a magician? Because whenever I look at you, everyone else disappears.',
  'Do you have a map? I keep getting lost in your eyes.',
  'Is your name Google? Because you have everything I\'ve been searching for.',
  'Do you believe in love at first text, or should I send another message?',
  'Are you a keyboard? Because you\'re just my type.',
  'Are you a Wi-Fi signal? Because I feel a strong connection.',
  'Are you a camera? Because every time I see you, I smile.',
  'Do you have a name or can I call you mine?',
  'If you were a vegetable, you\'d be a cute-cumber! 🥒',
  'Are you a bank loan? Because you have my interest.',
];

module.exports = {
  name: 'pickup',
  alias: ['pickupline', 'flirt'],
  description: 'Get a cheesy pickup line',
  async execute({ sock, msg, jid }) {
    await sock.sendMessage(jid, {
      text: `😏 *Pickup Line!*\n\n${pickRandom(lines)}\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
