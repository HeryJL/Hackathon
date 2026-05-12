const express = require('express');
const cors = require('cors');

function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN }));
  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ ok: true });
  });

  return app;
}

module.exports = { createApp };