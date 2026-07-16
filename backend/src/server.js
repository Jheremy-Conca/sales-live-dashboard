import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { connectDB, disconnectDB } from './db/connection.js';
import {
  getTodaysSales,
  getTodaysStats,
  getTodaysSalesByProduct,
  getTodaysSalesByRegion,
} from './models/Sale.js';
import { startSalesEmitter } from './socket/salesEmitter.js';

const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const app = express();
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: CLIENT_URL },
});

// --- Rutas REST ---
// El frontend las usa para pintar el estado inicial al cargar la página;
// después, los updates en vivo llegan por el socket ('new-sale').

app.get('/api/sales/today', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 15;
    const sales = await getTodaysSales(limit);
    res.json(sales);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener ventas de hoy' });
  }
});

app.get('/api/sales/stats', async (req, res) => {
  try {
    const stats = await getTodaysStats();
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

app.get('/api/sales/by-product', async (req, res) => {
  try {
    const data = await getTodaysSalesByProduct();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener ventas por producto' });
  }
});

app.get('/api/sales/by-region', async (req, res) => {
  try {
    const data = await getTodaysSalesByRegion();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener ventas por región' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// --- Socket.IO ---
io.on('connection', (socket) => {
  console.log(`🔌 Cliente conectado: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`🔌 Cliente desconectado: ${socket.id}`);
  });
});

// --- Arranque ---
async function start() {
  await connectDB();
  startSalesEmitter(io);
  httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
  });
}

start();

// --- Apagado limpio ---
async function shutdown() {
  console.log('\n🛑 Cerrando servidor...');
  httpServer.close();
  await disconnectDB();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);