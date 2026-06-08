const axios  = require('axios');
const config = require('../config');

module.exports = {
  name: 'npm',
  alias: ['package', 'node'],
  description: 'Search npm package info',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}npm <package name>\n\nExample: ${config.prefix}npm axios\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    try {
      const { data } = await axios.get(`https://registry.npmjs.org/${encodeURIComponent(body)}`, { timeout: 12000 });
      const latest = data['dist-tags']?.latest;
      const ver    = data.versions?.[latest];

      await sock.sendMessage(jid, {
        text: `📦 *NPM Package: ${data.name}*\n\n📝 Description: ${data.description || 'No description'}\n🔖 Latest: v${latest}\n📅 Published: ${new Date(data.time?.[latest]).toLocaleDateString()}\n👤 Author: ${data.author?.name || 'N/A'}\n📥 Weekly Downloads: ${(data.downloads?.weekly || 'N/A').toLocaleString?.() || 'N/A'}\n🔗 ${data.homepage || `https://npmjs.com/package/${data.name}`}\n\nInstall: \`npm install ${data.name}\`\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    } catch {
      await sock.sendMessage(jid, {
        text: `❌ Package *${body}* not found on npm.\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }
  },
};
