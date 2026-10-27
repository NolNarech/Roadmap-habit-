import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { stateRouter } from './routes/state.js';

const { MONGODB_URI, PORT = 5050, CLIENT_ORIGIN = 'http://localhost:5173', APP_SECRET } = process.env;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in server/.env — copy server/.env.example to server/.env and fill it in.');
  process.exit(1);
}
if (!APP_SECRET || APP_SECRET === 'change-me-to-something-long-and-random') {
  console.warn('⚠️  APP_SECRET is unset or still the placeholder — set a real random value in server/.env before deploying anywhere public.');
}

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: '5mb' })); // the whole app state can get sizeable with tasks/notes history

// Every /api request must carry the shared secret, so a stranger who
// finds the server's URL can't read or overwrite your data. The frontend
// sends this automatically once VITE_APP_SECRET is set in its own .env.
app.use('/api', (req, res, next) => {
  if (!APP_SECRET) return next(); // local-only dev convenience if you skip setting one
  if (req.get('x-app-secret') !== APP_SECRET) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  next();
});

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/api/state', stateRouter);

async function start() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');
  app.listen(PORT, () => console.log(`✅ API listening on http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error('❌ Failed to start server:', err.message);
  process.exit(1);
});
