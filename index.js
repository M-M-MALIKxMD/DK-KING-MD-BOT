const express  = require('express');
const config   = require('./config');
const { startBot } = require('./connect');
const logger   = require('./lib/logger');

// ── Keep-alive HTTP server ────────────────────────────────────────────────────
const app = express();

app.get('/health', (_, res) => res.json({ status: 'ok', bot: config.botName, uptime: process.uptime() }));
app.get('/',       (_, res) => res.send(`<h2>${config.botName} is running! 🤖</h2>`));

app.listen(config.port, () => logger.info(`HTTP server on port ${config.port}`));

// ── Start WhatsApp bot ────────────────────────────────────────────────────────
startBot().catch(err => { logger.error('Fatal error:', err); process.exit(1); });

process.on('unhandledRejection', err => logger.error('Unhandled rejection:', err?.message || err));
process.on('uncaughtException',  err => logger.error('Uncaught exception:',  err?.message || err));
