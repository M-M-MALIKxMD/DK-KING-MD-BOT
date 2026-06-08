const axios  = require('axios');
const config = require('../config');
const { fetchBuffer } = require('../lib/functions');

module.exports = {
  name: 'github',
  alias: ['gh', 'ghuser'],
  description: 'Search GitHub user or repository',
  async execute({ sock, msg, jid, body }) {
    if (!body) return sock.sendMessage(jid, { text: `❌ Usage: ${config.prefix}github <username or user/repo>\n\nExample: ${config.prefix}github torvalds\n\n> *Powered by Marco Malik*` }, { quoted: msg });

    try {
      const isRepo = body.includes('/');
      const url    = isRepo
        ? `https://api.github.com/repos/${body}`
        : `https://api.github.com/users/${body}`;

      const { data } = await axios.get(url, {
        headers: { 'User-Agent': 'Marco-Malik-Bot' },
        timeout: 15000,
      });

      let text;
      if (isRepo) {
        text = `📦 *GitHub Repository*\n\n📛 Name: ${data.full_name}\n📝 Description: ${data.description || 'No description'}\n⭐ Stars: ${data.stargazers_count?.toLocaleString()}\n🍴 Forks: ${data.forks_count?.toLocaleString()}\n👁️ Watchers: ${data.watchers_count?.toLocaleString()}\n💻 Language: ${data.language || 'N/A'}\n📅 Updated: ${new Date(data.updated_at).toLocaleDateString()}\n🔗 ${data.html_url}\n\n> *Powered by Marco Malik*`;
      } else {
        text = `👤 *GitHub User: ${data.login}*\n\n📛 Name: ${data.name || 'N/A'}\n📝 Bio: ${data.bio || 'No bio'}\n👥 Followers: ${data.followers?.toLocaleString()}\n👣 Following: ${data.following?.toLocaleString()}\n📦 Public Repos: ${data.public_repos}\n📍 Location: ${data.location || 'N/A'}\n🔗 ${data.html_url}\n\n> *Powered by Marco Malik*`;
        const buffer = await fetchBuffer(data.avatar_url).catch(() => null);
        if (buffer) return sock.sendMessage(jid, { image: buffer, caption: text }, { quoted: msg });
      }

      await sock.sendMessage(jid, { text }, { quoted: msg });
    } catch {
      await sock.sendMessage(jid, {
        text: `❌ GitHub user/repo *${body}* not found.\n\n> *Powered by Marco Malik*`,
      }, { quoted: msg });
    }
  },
};
