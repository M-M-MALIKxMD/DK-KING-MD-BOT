const config = require('../config');

module.exports = {
  name: 'stickerinfo',
  alias: ['sinfo', 'packinfo'],
  description: 'Get sticker metadata',
  async execute({ sock, msg, jid, quoted }) {
    const q = quoted?.message || msg.message;
    if (!q?.stickerMessage) {
      return sock.sendMessage(jid, {
        text: `❌ Reply to a *sticker* to get its info.\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }

    const s = q.stickerMessage;
    await sock.sendMessage(jid, {
      text: `🎭 *Sticker Info*\n\n📦 Pack: ${s.packname || 'Unknown'}\n✍️ Author: ${s.author || 'Unknown'}\n🆔 Pack ID: ${s.packId || 'N/A'}\n📺 Animated: ${s.isAnimated ? 'Yes ✅' : 'No ❌'}\n🎮 Avatar: ${s.isAvatar ? 'Yes ✅' : 'No ❌'}\n\n> *Powered by Marco Malik*`,
    }, { quoted: msg });
  },
};
