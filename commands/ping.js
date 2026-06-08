module.exports = {
  name: 'ping',
  alias: ['speed', 'test'],
  description: 'Check bot response speed',
  async execute({ sock, msg, jid }) {
    const start = Date.now();
    await sock.sendMessage(jid, { text: '🏓 Pinging...' }, { quoted: msg });
    const ms = Date.now() - start;
    await sock.sendMessage(jid, {
      text: `🏓 *Pong!*\n\n⚡ Speed: *${ms}ms*\n🤖 Bot: Online ✅\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
