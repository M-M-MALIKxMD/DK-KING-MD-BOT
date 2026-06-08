const config = require('../config');
const { pickRandom } = require('../lib/functions');

const responses = [
  '✅ It is certain.',
  '✅ It is decidedly so.',
  '✅ Without a doubt.',
  '✅ Yes, definitely.',
  '✅ You may rely on it.',
  '✅ As I see it, yes.',
  '✅ Most likely.',
  '✅ Outlook good.',
  '✅ Yes.',
  '✅ Signs point to yes.',
  '⚠️ Reply hazy, try again.',
  '⚠️ Ask again later.',
  '⚠️ Better not tell you now.',
  '⚠️ Cannot predict now.',
  '⚠️ Concentrate and ask again.',
  '❌ Don\'t count on it.',
  '❌ My reply is no.',
  '❌ My sources say no.',
  '❌ Outlook not so good.',
  '❌ Very doubtful.',
];

module.exports = {
  name: '8ball',
  alias: ['eightball', 'magic8'],
  description: 'Ask the Magic 8-Ball a yes/no question',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Ask a yes/no question!\n\nUsage: ${config.prefix}8ball Will I be rich?\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    await sock.sendMessage(jid, {
      text: `🎱 *Magic 8-Ball*\n\n❓ Question: ${body}\n\n🔮 Answer: *${pickRandom(responses)}*\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
