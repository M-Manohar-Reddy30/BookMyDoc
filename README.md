# BookMyDoc

BookMyDoc is a real-world doctor‑appointment web app — a full‑stack project with a user frontend, an admin panel, and a Node/Express backend. It’s built with React + Vite on the frontends and Express + MongoDB for the backend. This repo is ready for local development and production deploys.

---

## Repo layout

```
BookMyDoc/
├─ admin/        # Admin panel (React + Vite)
├─ frontend/     # User-facing frontend (React + Vite)
├─ backend/      # Node/Express backend (server.js + routes/controllers)
└─ .gitignore    # root-level ignores
```

---

## Tech stack

* Frontend & Admin: React, Vite, Tailwind CSS
* Backend: Node.js, Express
* Database: MongoDB (Atlas or self-hosted)
* File storage (optional):** Cloudinary
* Payments (optional): Razorpay / Stripe
* Hosting: Render (backend), Vercel or Netlify (frontend/admin)

---

## Quick local setup (entire project)

> Run each section from the project root and follow the folder-specific instructions.

### Backend (Node / Express)

1. Open terminal, go to backend folder:

```bash
cd backend
npm install
```

2. Create a `.env` file in `backend/` with the variables your code expects (example below).
3. Start the server in development:

```bash
npm run dev   # or `node server.js` if not using nodemon
```

Example `backend/.env` (adjust keys to match your code):

```
PORT=8000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/bookmydoc
JWT_SECRET=super_secret_value
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
# Optional: payment or email credentials
STRIPE_SECRET_KEY=...
RAZORPAY_KEY=...
EMAIL_HOST=smtp.example.com
EMAIL_USER=...
EMAIL_PASS=...
```

> Check `backend/server.js` or `backend/config` to confirm exact env var names used by your app.

---

### Frontend & Admin (React + Vite)

For each UI (do `frontend` and `admin` separately):

```bash
cd frontend
npm install
npm run dev       # opens at http://localhost:5173 by default
# when ready for production build
npm run build
# build output: dist/
```

Frontend environment variable (optional):

* `VITE_BACKEND_URL` — set this to the backend URL in production (e.g. `https://bookmydoc-backend.onrender.com`).

While developing locally you can either:

* Run the backend at `http://localhost:8000` and configure `frontend/vite.config.js` to proxy `/api` to your backend, OR
* Set `VITE_BACKEND_URL=http://localhost:8000` so the client talks directly to the backend.

---

## Deploy backend to Render (recommended)

1. Sign in to Render and click **New > Web Service**.
2. Connect your GitHub account & select this repo. In the Render UI set the root directory to `backend` (monorepo mode).
3. Configure:

   * Branch: `main`
   * Build Command: `npm install`
   * Start Command: `npm start` or `node server.js` (ensure `package.json` has a `start` script)
4. Add Environment Variables in Render (match the names used in your `.env`).
5. Create service and deploy. Use Render logs for debugging any runtime errors.

Tip: Make sure your app reads `process.env.PORT || 8000` so Render’s dynamic port is used.

---

## Deploy frontend & admin to Vercel (recommended)

1. Go to Vercel → **New Project** → import your GitHub repo.
2. When prompted, pick the `frontend` folder (and import the `admin` folder as a separate project later).
3. Vercel usually auto-detects Vite. Settings to confirm:

   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
4. Add Environment Variables (Project Settings) if you want to set `VITE_BACKEND_URL`.
5. Deploy and test the live URL.

**Optional: keep `/api` relative with Vercel rewrites**
Add this `vercel.json` into `frontend/` (and similarly in `admin/`):

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://<YOUR_RENDER_BACKEND>.onrender.com/:path*" }
  ],
  "routes": [ { "handle": "filesystem" }, { "src": "/.*", "dest": "/index.html" } ]
}
```

This forwards client requests to `/api/*` through Vercel to your Render backend and avoids CORS.

---

## Netlify alternative

* Build command: `npm run build`
* Publish directory: `dist`
* For SPA fallback, add `_redirects` in `public/`:

```
/* /index.html 200
```

## Commands summary

* Backend dev: `cd backend && npm install && npm run dev`
* Frontend dev: `cd frontend && npm install && npm run dev`
* Build frontend: `cd frontend && npm run build`
