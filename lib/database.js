const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const files = {
  users:    path.join(DATA_DIR, 'users.json'),
  groups:   path.join(DATA_DIR, 'groups.json'),
  deleted:  path.join(DATA_DIR, 'deleted.json'),
  settings: path.join(DATA_DIR, 'settings.json'),
};

function load(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch { return {}; }
}

function save(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ── Users ──────────────────────────────────────────────────────────────────────
function getUser(jid) {
  const db = load(files.users);
  if (!db[jid]) db[jid] = { jid, warnings: 0, banned: false, premium: false };
  return db[jid];
}

function saveUser(jid, data) {
  const db = load(files.users);
  db[jid] = { ...getUser(jid), ...data };
  save(files.users, db);
}

function getAllUsers() { return load(files.users); }

// ── Groups ─────────────────────────────────────────────────────────────────────
function getGroup(jid) {
  const db = load(files.groups);
  if (!db[jid]) db[jid] = { jid, antiLink: false, antiSpam: false, antiDelete: false, welcome: false, goodbye: false, muted: false };
  return db[jid];
}

function saveGroup(jid, data) {
  const db = load(files.groups);
  db[jid] = { ...getGroup(jid), ...data };
  save(files.groups, db);
}

// ── Deleted Messages ───────────────────────────────────────────────────────────
function storeDeletedMsg(id, msgData) {
  const db = load(files.deleted);
  db[id] = msgData;
  // keep last 500
  const keys = Object.keys(db);
  if (keys.length > 500) delete db[keys[0]];
  save(files.deleted, db);
}

function getDeletedMessage(id) {
  return load(files.deleted)[id] || null;
}

// ── Settings ───────────────────────────────────────────────────────────────────
function getSetting(key, def) {
  return load(files.settings)[key] ?? def;
}

function setSetting(key, value) {
  const db = load(files.settings);
  db[key] = value;
  save(files.settings, db);
}

module.exports = { getUser, saveUser, getAllUsers, getGroup, saveGroup, storeDeletedMsg, getDeletedMessage, getSetting, setSetting };
