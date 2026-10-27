import { Router } from 'express';
import { AppStateModel } from '../models/AppState.js';

const OWNER = 'default-user'; // single-user app — one document total

export const stateRouter = Router();

// GET /api/state — returns the saved state, or null if nothing's been saved yet
// (the frontend falls back to its built-in defaults in that case).
stateRouter.get('/', async (req, res) => {
  try {
    const doc = await AppStateModel.findOne({ owner: OWNER });
    res.json({ data: doc ? doc.data : null, updatedAt: doc?.updatedAt || null });
  } catch (err) {
    console.error('GET /api/state failed:', err.message);
    res.status(500).json({ error: 'Failed to load state.' });
  }
});

// PUT /api/state — replaces the saved state with whatever the frontend sends.
// The frontend sends its entire state object on every change (debounced),
// same pattern it used for LocalStorage — so this is a full upsert, not a
// partial patch.
stateRouter.put('/', async (req, res) => {
  try {
    const { data } = req.body;
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: '"data" must be an object.' });
    }
    const doc = await AppStateModel.findOneAndUpdate(
      { owner: OWNER },
      { data },
      { upsert: true, new: true }
    );
    res.json({ ok: true, updatedAt: doc.updatedAt });
  } catch (err) {
    console.error('PUT /api/state failed:', err.message);
    res.status(500).json({ error: 'Failed to save state.' });
  }
});

// DELETE /api/state — wipes the saved document (used by "Reset Data" in Settings).
stateRouter.delete('/', async (req, res) => {
  try {
    await AppStateModel.deleteOne({ owner: OWNER });
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/state failed:', err.message);
    res.status(500).json({ error: 'Failed to reset state.' });
  }
});
