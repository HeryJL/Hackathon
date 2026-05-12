// server.js
require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const { attachWebSocket } = require('./src/ws/greenhouseWs');
const controller = require('./src/controllers/greenhouseController');

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Routes API
app.get('/health', (req, res) => res.json({ ok: true }));
app.get('/api/greenhouse/latest', controller.getLatest);
app.get('/api/greenhouse/history', controller.getHistory);

const server = http.createServer(app);

// Activation du WebSocket
attachWebSocket(server);





//---------------Routes 

app.use('/api/auth', require('./src/routes/authRoutes'));
//app.use('/api/farms', require('./src/routes/farmRoutes'));

server.listen(process.env.PORT || 4000, () => {
  console.log(`Server running on ${process.env.PORT || 4000}`);
});