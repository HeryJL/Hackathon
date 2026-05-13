// src/ws/greenhouseWs.js
import { WebSocketServer } from 'ws';
import { ingestMeasurement } from '../services/greenhouseService.js';

export function attachWebSocket(server) {
  const wss = new WebSocketServer({
    server,
    path: process.env.WS_PATH || '/ws/greenhouse'
  });

  wss.on('connection', (ws) => {
    console.log('Node-RED connecté au serveur');
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        await ingestMeasurement(data);
      } catch (err) {
        console.error('Erreur WS:', err.message);
      }
    });
  });

  return wss;
}