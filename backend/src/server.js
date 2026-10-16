/**
 * Express HTTP server (Mini App API)
 */
const express = require('express');
const cors = require('cors');
const config = require('./config/default');
const apiRoutes = require('./routes/api.routes');

/**
 * @param {{ webhook?: { path: string, handler: Function } | null }} [options]
 *   webhook — Telegram webhook (index.js da WEBHOOK_DOMAIN bo'lsa yaratiladi)
 */
function createServer({ webhook = null } = {}) {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  // Telegram webhook — CORS va JSON parserdan oldin (Telegraf so'rov tanasini o'zi o'qiydi va secret_token'ni tekshiradi)
  if (webhook) app.post(webhook.path, webhook.handler);

  app.use(
    cors({
      origin: config.server.corsOrigins.includes('*') ? true : config.server.corsOrigins,
      allowedHeaders: ['Content-Type', 'Authorization'],
      methods: ['GET', 'POST', 'PATCH'],
    }),
  );
  app.use(express.json({ limit: '100kb' }));

  app.use('/api', apiRoutes);
  app.use((req, res) => res.status(404).json({ error: 'NOT_FOUND' }));

  return app;
}

module.exports = { createServer };
