const axios  = require('axios');
const config = require('../config');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs   = require('fs');
const { TEMP_DIR } = require('../lib/functions');

module.exports = {
  name: 'img2url',
  alias: ['imageurl', 'imgurl', 'uploadimage'],
  description: 'Upload image and get a URL',
  async execute({ sock, msg, jid, quoted }) {
    const q = quoted?.message || msg.message;
    const hasImage = q?.imageMessage || q?.stickerMessage || q?.documentMessage;

    if (!hasImage) {
      return sock.sendMessage(jid, {
        text: `❌ Reply to an *image* or *sticker* to get its URL.\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }

    await sock.sendMessage(jid, { text: '📤 _Uploading image..._' }, { quoted: msg });

    try {
      const buffer = await sock.downloadMediaMessage(quoted || msg);
      const fileName = `${uuidv4()}.jpg`;
      const filePath = path.join(TEMP_DIR, fileName);
      fs.writeFileSync(filePath, buffer);

      // Upload to catbox.moe (free, no auth)
      const form = new FormData();
      const { Blob } = require('buffer');
      form.append('reqtype', 'fileupload');
      form.append('userhash', '');
      form.append('fileToUpload', new Blob([buffer]), fileName);

      const { data } = await axios.post('https://catbox.moe/user/api.php', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });

      fs.unlinkSync(filePath);

      if (!data || !data.startsWith('http')) throw new Error('Upload failed');

      await sock.sendMessage(jid, {
        text: `✅ *Image Uploaded!*\n\n🔗 URL: ${data}\n\n_Click the link to view or share your image._\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });

    } catch (err) {
      await sock.sendMessage(jid, {
        text: `❌ Upload failed: ${err.message}\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }
  },
};
