/**
 * Express HTTP server (Mini App API)
 */
const express = require('express');
const cors = require('cors');
const config = require('./config/default');
const apiRoutes = require('./routes/api.routes');

function createServer() {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);
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
