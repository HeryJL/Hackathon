// src/ws/greenhouseWs.js
import { WebSocketServer } from 'ws';
import { ingestMeasurement } from '../services/greenhouseService.js';

// Ensemble des clients frontend connectés
const frontendClients = new Set();

export function attachWebSocket(server) {
  const wss = new WebSocketServer({
    server,
    path: process.env.WS_PATH || '/ws/greenhouse'
  });

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const clientType = url.searchParams.get('client'); // 'frontend' ou absent = Node-RED

    if (clientType === 'frontend') {
      // ── Client frontend (browser) ──
      console.log('Client frontend connecté');
      frontendClients.add(ws);

      ws.on('close', () => {
        frontendClients.delete(ws);
        console.log('Client frontend déconnecté');
      });

      ws.on('error', () => frontendClients.delete(ws));

    } else {
      // ── Source de données (Node-RED) ──
      console.log('Node-RED connecté au serveur');

      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message.toString());
          const saved = await ingestMeasurement(data);

          // Broadcaster la nouvelle mesure à tous les clients frontend
          broadcastToFrontend({
            type: 'MEASUREMENT',
            payload: saved
          });

        } catch (err) {
          console.error('Erreur WS:', err.message);
        }
      });

      ws.on('error', (err) => console.error('Erreur Node-RED WS:', err.message));
    }
  });

  return wss;
}

function broadcastToFrontend(data) {
  const message = JSON.stringify(data);
  for (const client of frontendClients) {
    if (client.readyState === 1) { // OPEN
      client.send(message);
    } else {
      frontendClients.delete(client);
    }
  }
}