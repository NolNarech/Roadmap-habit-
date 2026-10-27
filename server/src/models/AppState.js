import mongoose from 'mongoose';

// The frontend already keeps one cohesive state object (tasks, roadmap
// progress, projects, notes, sessions, xp, achievements, profile, theme) —
// see src/context/AppContext.jsx. Rather than re-model every nested shape
// as its own strict schema (which would need updating every time a frontend
// field changes), we store that whole object as-is in `data` and let Mongo's
// flexible `Mixed` type hold it. One document per user; `owner` exists so
// this can grow into multi-user later without a migration.
const AppStateSchema = new mongoose.Schema(
  {
    owner: { type: String, required: true, unique: true, default: 'default-user' },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const AppStateModel = mongoose.model('AppState', AppStateSchema);
