import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import router from './src/routes/index.js';
import { attachWebSocket } from './src/ws/greenhouseWs.js';
// import * as controller from './src/controllers/greenhouseController.js'; // si non utilisé, commentez

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

const server = http.createServer(app);
attachWebSocket(server);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', router);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});