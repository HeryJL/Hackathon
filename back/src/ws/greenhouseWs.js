const WebSocket = require('ws');
const service = require('../services/greenhouseService');

function attachWebSocket(server) {
  const wss = new WebSocket.Server({
    server,
    path: process.env.WS_PATH || '/ws/greenhouse'
  });

  wss.on('connection', (ws) => {
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        await service.ingestMeasurement(data);
      } catch (err) {
        console.error('WS error:', err.message);
      }
    });
  });

  return wss;
}

module.exports = { attachWebSocket };