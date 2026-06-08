require('dotenv').config();

module.exports = {
  ownerNumber:       process.env.OWNER_NUMBER        || '923001234567',
  ownerName:         process.env.OWNER_NAME          || 'Marco Malik',
  botName:           process.env.BOT_NAME            || 'MARCO MALIK MD',
  prefix:            process.env.PREFIX              || '.',
  sessionId:         process.env.SESSION_ID          || '',
  mode:              process.env.BOT_MODE            || 'public',

  // WhatsApp Channel
  channelLink:       'https://whatsapp.com/channel/0029VbDUxbb60eBlMbNen40B',
  channelId:         '120363427010525315@newsletter',

  // AI Keys (optional — free fallbacks included)
  geminiKey:         process.env.GEMINI_API_KEY      || '',
  openaiKey:         process.env.OPENAI_API_KEY      || '',
  removebgKey:       process.env.REMOVEBG_API_KEY    || '',

  // Auto Features
  autoReact:         process.env.AUTO_REACT          !== 'false',
  reactMode:         process.env.REACT_MODE          || 'random',   // 'random' | 'fixed'
  fixedEmoji:        process.env.FIXED_EMOJI         || '❤️',
  autoRead:          process.env.AUTO_READ           !== 'false',
  autoStatusView:    process.env.AUTO_STATUS_VIEW    !== 'false',
  autoStatusReply:   process.env.AUTO_STATUS_REPLY   !== 'false',
  statusReplyMsg:    process.env.STATUS_REPLY_MSG    || 'Seen Your Status 👀 By Marco Malik',

  // Protection
  antiCall:          process.env.ANTI_CALL           !== 'false',
  antiDelete:        process.env.ANTI_DELETE         !== 'false',
  antiLink:          process.env.ANTI_LINK           === 'true',
  antiSpam:          process.env.ANTI_SPAM           !== 'false',

  // View Once
  viewOnce:          process.env.VIEW_ONCE           !== 'false',

  // Footer/branding
  footer:            '\n\n> *Powered by Marco Malik*',
  dlFooter:          '\n\n> *Downloaded by Marco Malik MD Bot*',

  // Misc
  port:              parseInt(process.env.PORT)      || 3000,
};
