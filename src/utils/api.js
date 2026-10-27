// Talks to the Express + MongoDB backend in /server. Every function here
// fails soft (returns null / false instead of throwing) so the app keeps
// working offline on LocalStorage alone if the backend isn't running —
// see AppContext.jsx, which treats the backend as an optional sync layer.

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5050';
const APP_SECRET = import.meta.env.VITE_APP_SECRET || '';

function headers() {
  const h = { 'Content-Type': 'application/json' };
  if (APP_SECRET) h['x-app-secret'] = APP_SECRET;
  return h;
}

/** Returns the saved state object from MongoDB, or null if unreachable / nothing saved yet. */
export async function fetchRemoteState() {
  try {
    const res = await fetch(`${API_BASE}/api/state`, { headers: headers() });
    if (!res.ok) return null;
    const body = await res.json();
    return body.data || null;
  } catch (err) {
    console.warn('MongoDB backend unreachable, staying on LocalStorage:', err.message);
    return null;
  }
}

/** Saves the whole app state to MongoDB. Returns true on success, false otherwise. */
export async function saveRemoteState(data) {
  try {
    const res = await fetch(`${API_BASE}/api/state`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ data }),
    });
    return res.ok;
  } catch (err) {
    console.warn('Failed to save to MongoDB, kept in LocalStorage only:', err.message);
    return false;
  }
}

/** Wipes the saved MongoDB document. Used by Settings → Reset Data. */
export async function deleteRemoteState() {
  try {
    const res = await fetch(`${API_BASE}/api/state`, { method: 'DELETE', headers: headers() });
    return res.ok;
  } catch (err) {
    console.warn('Failed to reset MongoDB state:', err.message);
    return false;
  }
}

/** Quick reachability check — used to show the connection badge in Settings. */
export async function pingBackend() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
