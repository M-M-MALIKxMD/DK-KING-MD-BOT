const config = require('../config');
const { formatDuration } = require('../lib/functions');

module.exports = {
  name: 'menu',
  alias: ['help', 'commands', 'start'],
  description: 'Show all commands menu',
  async execute({ sock, msg, jid, senderNum }) {
    const up  = formatDuration(process.uptime() * 1000);
    const now = new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });

    const text = `
╔╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╗
╠╬╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╬╣
╠╬  🖤 ${config.botName} 🖤  ╬╣
╠╬╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╦╬╣
╚╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╩╝

👤 User: @${senderNum}
⏱️ Uptime: ${up}
🕐 Time: ${now}
⚡ Prefix: *${config.prefix}*

━━━━━━━━━━━━━━━━━━━━━━
🤖 *[ AI FEATURES ]*
━━━━━━━━━━━━━━━━━━━━━━
${config.prefix}ai • ${config.prefix}gemini • ${config.prefix}gpt
${config.prefix}imagine • ${config.prefix}marco
${config.prefix}waqar • ${config.prefix}zahid
${config.prefix}syed • ${config.prefix}devil

━━━━━━━━━━━━━━━━━━━━━━
⬇️ *[ DOWNLOADERS ]*
━━━━━━━━━━━━━━━━━━━━━━
${config.prefix}play • ${config.prefix}playvid
${config.prefix}youtube • ${config.prefix}tiktok
${config.prefix}instagram • ${config.prefix}facebook
${config.prefix}movie • ${config.prefix}apk

━━━━━━━━━━━━━━━━━━━━━━
🎭 *[ STICKERS ]*
━━━━━━━━━━━━━━━━━━━━━━
${config.prefix}sticker • ${config.prefix}toimage
${config.prefix}steal • ${config.prefix}emojimix
${config.prefix}stickerinfo • ${config.prefix}aisticker

━━━━━━━━━━━━━━━━━━━━━━
🛠️ *[ UTILITIES ]*
━━━━━━━━━━━━━━━━━━━━━━
${config.prefix}qr • ${config.prefix}ss • ${config.prefix}img2url
${config.prefix}tts • ${config.prefix}translate
${config.prefix}weather • ${config.prefix}calc
${config.prefix}time • ${config.prefix}shorturl
${config.prefix}currency • ${config.prefix}otp

━━━━━━━━━━━━━━━━━━━━━━
💕 *[ REACTIONS ]*
━━━━━━━━━━━━━━━━━━━━━━
${config.prefix}love • ${config.prefix}hug • ${config.prefix}kiss
${config.prefix}sad • ${config.prefix}sorry • ${config.prefix}gift
${config.prefix}goodmorning • ${config.prefix}goodnight
${config.prefix}hang • ${config.prefix}kill

━━━━━━━━━━━━━━━━━━━━━━
🎮 *[ FUN & GAMES ]*
━━━━━━━━━━━━━━━━━━━━━━
${config.prefix}joke • ${config.prefix}fact • ${config.prefix}quote
${config.prefix}dare • ${config.prefix}truth • ${config.prefix}roast
${config.prefix}ship • ${config.prefix}rate • ${config.prefix}flip
${config.prefix}roll • ${config.prefix}8ball • ${config.prefix}rps
${config.prefix}trivia • ${config.prefix}meme
${config.prefix}cat • ${config.prefix}dog • ${config.prefix}fox

━━━━━━━━━━━━━━━━━━━━━━
🔍 *[ SEARCH ]*
━━━━━━━━━━━━━━━━━━━━━━
${config.prefix}google • ${config.prefix}wiki
${config.prefix}lyrics • ${config.prefix}github
${config.prefix}npm • ${config.prefix}anime
${config.prefix}image • ${config.prefix}imdb

━━━━━━━━━━━━━━━━━━━━━━
🛡️ *[ ADMIN TOOLS ]*
━━━━━━━━━━━━━━━━━━━━━━
${config.prefix}kick • ${config.prefix}add • ${config.prefix}promote
${config.prefix}demote • ${config.prefix}mute • ${config.prefix}unmute
${config.prefix}warn • ${config.prefix}warnlist
${config.prefix}antilink • ${config.prefix}antispam
${config.prefix}tagall • ${config.prefix}hidetag
${config.prefix}welcome • ${config.prefix}goodbye

━━━━━━━━━━━━━━━━━━━━━━
🔧 *[ TEXT TOOLS ]*
━━━━━━━━━━━━━━━━━━━━━━
${config.prefix}base64 • ${config.prefix}binary
${config.prefix}morse • ${config.prefix}reverse
${config.prefix}hash • ${config.prefix}password

━━━━━━━━━━━━━━━━━━━━━━
👑 *[ OWNER ONLY ]*
━━━━━━━━━━━━━━━━━━━━━━
${config.prefix}broadcast • ${config.prefix}ban
${config.prefix}unban • ${config.prefix}setprefix
${config.prefix}restart • ${config.prefix}shutdown
${config.prefix}eval • ${config.prefix}join
${config.prefix}block • ${config.prefix}unblock

━━━━━━━━━━━━━━━━━━━━━━
📢 Join Channel: ${config.channelLink}
━━━━━━━━━━━━━━━━━━━━━━

> *Powered by Marco Malik*`;

    await sock.sendMessage(jid, { text: text.trim(), mentions: [senderNum + '@s.whatsapp.net'] }, { quoted: msg });
  },
};
