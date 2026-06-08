const axios = require('axios');
const fs    = require('fs');
const path  = require('path');

const TEMP_DIR = path.join(__dirname, '..', 'temp');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

// ── HTTP helpers ──────────────────────────────────────────────────────────────
async function fetchBuffer(url, opts = {}) {
  const { data } = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000, ...opts });
  return Buffer.from(data);
}

async function fetchJson(url, opts = {}) {
  const { data } = await axios.get(url, { timeout: 15000, ...opts });
  return data;
}

// ── Misc helpers ──────────────────────────────────────────────────────────────
function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function formatDuration(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h ${m % 60}m`;
  if (h > 0) return `${h}h ${m % 60}m ${s % 60}s`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

function mentionToJid(mention) {
  const num = mention.replace(/[^0-9]/g, '');
  return num + '@s.whatsapp.net';
}

// ── Fancy text ────────────────────────────────────────────────────────────────
const fancyStyles = {
  bold(t) {
    const map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const bold = '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵';
    return [...t].map(c => { const i = map.indexOf(c); return i >= 0 ? [...bold][i] : c; }).join('');
  },
  italic(t) {
    const map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const ital = '𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻';
    return [...t].map(c => { const i = map.indexOf(c); return i >= 0 ? [...ital][i] : c; }).join('');
  },
  bubble(t) {
    const map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const bub = 'ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⓪①②③④⑤⑥⑦⑧⑨';
    return [...t].map(c => { const i = map.indexOf(c); return i >= 0 ? [...bub][i] : c; }).join('');
  },
  flip(t) {
    const map = 'abcdefghijklmnopqrstuvwxyz';
    const flp = 'ɐqɔpǝɟbɥıɾʞlɯuodbɹsʇnʌʍxʎz';
    return [...t.toLowerCase()].reverse().map(c => { const i = map.indexOf(c); return i >= 0 ? flp[i] : c; }).join('');
  },
};

// ── Reaction GIF helper ───────────────────────────────────────────────────────
async function getReactionGif(type) {
  try {
    const { data } = await axios.get(`https://nekos.best/api/v2/${type}`, { timeout: 10000 });
    return data.results?.[0]?.url || null;
  } catch {
    return null;
  }
}

// ── Random emojis list ────────────────────────────────────────────────────────
const randomEmojis = ['❤️','😂','😍','🔥','✨','🎉','💯','🙏','😎','🥰','💪','😊','🤩','👏','🌟','💫','🎯','🚀','💥','🌈'];

module.exports = { fetchBuffer, fetchJson, pickRandom, getRandomInt, sleep, formatBytes, formatDuration, mentionToJid, fancyStyles, getReactionGif, randomEmojis, TEMP_DIR };
