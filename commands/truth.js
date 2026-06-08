const config = require('../config');
const { pickRandom } = require('../lib/functions');

const truths = [
  'What is the most embarrassing thing you\'ve ever done in public?',
  'Have you ever lied to your best friend? What about?',
  'Who is your secret crush right now?',
  'What is the biggest lie you\'ve ever told your parents?',
  'Have you ever cheated on a test?',
  'What is your most embarrassing memory from school?',
  'Have you ever ghosted someone? Why?',
  'What is the most childish thing you still do?',
  'Have you ever talked behind a friend\'s back?',
  'What is one thing you\'re ashamed of but never told anyone?',
  'What\'s the most embarrassing thing on your phone right now?',
  'Have you ever had a crush on a teacher?',
  'What is the weirdest thing you\'ve ever eaten?',
  'If you could change one thing about your past, what would it be?',
];

module.exports = {
  name: 'truth',
  alias: ['t', 'truthq'],
  description: 'Get a random truth question',
  async execute({ sock, msg, jid }) {
    await sock.sendMessage(jid, {
      text: `🤔 *TRUTH!*\n\n${pickRandom(truths)}\n\nAnsw honestly! 😇\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
