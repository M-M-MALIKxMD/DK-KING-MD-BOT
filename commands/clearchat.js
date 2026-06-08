const config = require('../config');
const { storeDeletedMsg } = require('../lib/database');
const path = require('path');
const fs   = require('fs');

module.exports = {
  name: 'clearchat',
  alias: ['clearcache', 'cleardata'],
  description: 'Clear bot\'s temp/cache data',
  ownerOnly: true,
  async execute({ sock, msg, jid }) {
    try {
      const { TEMP_DIR } = require('../lib/functions');
      const files = fs.readdirSync(TEMP_DIR);
      let count = 0;
      for (const f of files) {
        try { fs.unlinkSync(path.join(TEMP_DIR, f)); count++; } catch {}
      }
      await sock.sendMessage(jid, {
        text: `🗑️ *Cache cleared!*\n\n🗂️ Deleted ${count} temp files.\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    } catch (e) {
      await sock.sendMessage(jid, { text: `❌ Failed: ${e.message}\n\n> *Powered by Marco Malik*` }, { quoted: msg });
    }
  },
};
