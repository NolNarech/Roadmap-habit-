# Connecting Dev Progress Tracker to MongoDB

Your data now lives in MongoDB Atlas instead of only your browser's
LocalStorage. This means: it survives clearing browser data, and (if you
ever open the app from another browser pointed at the same backend) it'll
show the same data there too.

There are two pieces running on your computer:

1. **`server/`** — a small Express API that reads/writes your MongoDB database.
2. **the React app** (this folder) — talks to that API instead of writing straight to LocalStorage.

Both need to be running at the same time while you use the app.

---

## 1. Get your MongoDB Atlas connection string

You said you already have this — from the Atlas dashboard it's under
**Connect → Drivers**, and looks like:

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
```

Two things worth double-checking before it'll work:

- **Network Access** (left sidebar in Atlas) → make sure your current IP is
  allow-listed, or add `0.0.0.0/0` (allow from anywhere) for local dev.
- If your password has special characters like `@`, `:`, `/`, or `#`, they
  need to be URL-encoded, or the connection string won't parse correctly.

## 2. Configure the backend

```bash
cd server
npm install
cp .env.example .env
```

Open `server/.env` and fill in:

```env
MONGODB_URI=<your real Atlas connection string, with a database name added, e.g. .../dev-progress-tracker?retryWrites=true&w=majority>
PORT=5050
CLIENT_ORIGIN=http://localhost:5173
APP_SECRET=<make up a long random string>
```

`APP_SECRET` is a simple shared password between the frontend and backend —
it stops a stranger who somehow finds your server's address from reading or
overwriting your data. Just make one up (e.g. mash the keyboard for 30
characters); you don't need to remember it, just paste it in both places
(see step 3).

Start it:

```bash
npm start
```

You should see:

```
✅ Connected to MongoDB
✅ API listening on http://localhost:5050
```

If instead you see a connection error, it's almost always the Network
Access allow-list or a special character in the password — see step 1.

## 3. Configure the frontend

Back in the project root (not `server/`):

```bash
cp .env.example .env
```

Open `.env` and set:

```env
VITE_API_URL=http://localhost:5050
VITE_APP_SECRET=<the exact same string you put in server/.env>
```

Then run the app as usual:

```bash
npm install
npm run dev
```

## 4. Check it worked

Open the app (`http://localhost:5173`) and look at the top bar — you'll see
a small status badge:

- **Synced** (green) — connected, your data is in MongoDB.
- **Saving…** (cyan, spinning) — a change was just made and is being pushed up.
- **Offline (local only)** (amber) — can't reach the backend right now; the
  app still works, everything is just saved to this browser only until the
  backend comes back.

The very first time it connects successfully, whatever's currently in your
browser (your existing tasks/XP/streak from before) gets pushed up to
MongoDB automatically — nothing is lost in the switch.

## Notes

- This is built for **one person, one database document** — it's not a
  multi-user login system. That matches how you're using it (your own
  dashboard), but keep the server's address private since anyone who can
  reach it (and has `APP_SECRET`) can read/write your data.
- If you ever want to run this somewhere other than your own computer
  (Render, Railway, etc.), update `CLIENT_ORIGIN` in `server/.env` and
  `VITE_API_URL` in the frontend `.env` to match wherever things end up
  living — ask and I can walk through that when you're ready.
