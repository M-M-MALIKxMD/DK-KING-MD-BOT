const config = require('../config');
const { pickRandom } = require('../lib/functions');

const dares = [
  'Text your crush "I think about you a lot" right now!',
  'Do 20 push-ups before the next message.',
  'Change your WhatsApp status to "I\'m a potato" for 1 hour.',
  'Send a voice note singing any song for at least 30 seconds.',
  'Text someone you haven\'t talked to in 6 months.',
  'Do your best impression of a famous celebrity in a voice note.',
  'Send an embarrassing photo from your camera roll.',
  'Do a full minute of dancing and send a video.',
  'Call someone random from your contacts and say "I love you" before hanging up.',
  'Post an embarrassing selfie on your status for 10 minutes.',
  'Speak in a different accent for the next 5 minutes.',
  'Tell the funniest joke you know via voice note.',
  'Set a silly song as your ringtone for the rest of the day.',
  'Send the last 3 photos from your gallery.',
];

module.exports = {
  name: 'dare',
  alias: ['d', 'challenge'],
  description: 'Get a random dare',
  async execute({ sock, msg, jid }) {
    await sock.sendMessage(jid, {
      text: `🎯 *DARE!*\n\n${pickRandom(dares)}\n\nDo you accept the dare? 😏\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
