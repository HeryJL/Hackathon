// server.js
require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const WebSocket = require('ws');
const { Pool } = require('pg');

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/greenhouse/latest', async (req, res) => {
  const r = await pool.query(
    'SELECT * FROM greenhouse_measurements ORDER BY ts DESC LIMIT 1'
  );
  res.json(r.rows[0] || {});
});

app.get('/api/greenhouse/history', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '200', 10), 1000);
  const r = await pool.query(
    'SELECT * FROM greenhouse_measurements ORDER BY ts DESC LIMIT $1',
    [limit]
  );
  res.json(r.rows);
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws/greenhouse' });

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    try {
      const d = JSON.parse(message.toString());

      await pool.query(
        `INSERT INTO greenhouse_measurements
        (entity, temperature, air_humidity, soil_moisture, light, wind, reservoir, pump, fan, vents, ts)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
          d.entity,
          d.temperature,
          d.airHumidity,
          d.soilMoisture,
          d.light,
          d.wind,
          d.reservoir,
          d.pump,
          d.fan,
          d.vents,
          d.ts
        ]
      );
    } catch (err) {
      console.error('WS insert error:', err.message);
    }
  });
});



//---------------Routes 

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/farms', require('./routes/farmRoutes'));

server.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on ${process.env.PORT || 4000}`);
});