# DS-TECHNOLOGIES — Final package (fast hosting)

## Why hosted site felt slow
- Running `npm run dev` (Vite dev server) on a host is **slow**. Always use **production build**.
- Old service worker / fixed backgrounds were fixed in this package.

## Fast deploy (frontend)

```bash
cd frontend
npm install
npm run build
```

Upload only the **`frontend/dist`** folder to Netlify / Vercel / any static host.

Or connect the repo and set:
- Build command: `cd frontend && npm install && npm run build`
- Publish directory: `frontend/dist`

## Backend (API)

```bash
cd backend
cp .env.example .env
# set MONGODB_URI, JWT_SECRET, EMAIL_USER, EMAIL_PASS, ADMIN_NOTIFY_EMAIL
npm install
npm start
```

Set frontend `.env.production`:
```
VITE_API_URL=https://your-backend-url/api
```

## Fixes included
- WhatsApp no longer opens on attendance mark
- Attendance works on Today + Mark views
- Certificate landscape + full text
- Resume vs Full CV different content/modes
- Offline SW disabled (site needs internet)
- Multi-color theme + nature hero images
- Vite production minify + React code-split

## After update in browser
Hard refresh: **Ctrl + Shift + R** (clears old CSS/JS cache).
