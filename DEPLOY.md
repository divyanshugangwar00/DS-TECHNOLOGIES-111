# DS-TECHNOLOGIES — Free Hosting (GitHub + Render + Vercel)

## 1. MongoDB Atlas
1. https://cloud.mongodb.com → Free M0 cluster
2. Database Access → user + password
3. Network Access → **Allow Access from Anywhere** (`0.0.0.0/0`)
4. Connect → Drivers → copy URI  
   Replace `<password>`; add `/ds-technologies` before `?`  
   If password has `@` write `%40` instead.

Example:
```
mongodb+srv://user:Pass%40word@cluster0.xxxxx.mongodb.net/ds-technologies?retryWrites=true&w=majority
```

## 2. GitHub
```bash
cd DS-TECHNOLOGIES
git init
git add .
git commit -m "DS-TECHNOLOGIES ready for deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USER/DS-TECHNOLOGIES.git
git push -u origin main
```

## 3. Backend — Render
1. render.com → New → **Web Service** → this repo
2. Settings:

| Field | Value |
|-------|--------|
| **Root Directory** | `backend` |
| Runtime | Node |
| Build | `npm install` |
| Start | `npm start` |
| Plan | **Free** |

3. Environment:

| Key | Value |
|-----|--------|
| `MONGODB_URI` | full Atlas string |
| `JWT_SECRET` | any long random text |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | `*` |

4. Deploy → URL like `https://ds-technologies-xxxx.onrender.com`  
5. Test: `https://YOUR-URL/api/health` → `{"status":"ok",...}`

6. Seed admin (once), from your PC:
```bash
cd backend
# temporary .env with same MONGODB_URI
node seedAdmin.js
```
Login: `admin@dstechnologies.com` / `admin123`

## 4. Frontend — Vercel
1. vercel.com → Import same GitHub repo
2. Settings:

| Field | Value |
|-------|--------|
| Root Directory | `frontend` |
| Build | `npm run build` |
| Output | `dist` |

3. Environment:
```
VITE_API_URL=https://YOUR-RENDER-URL.onrender.com/api
```
(must end with `/api`)

4. Deploy → open site → Login

5. Optional: Render → Environment → set `CLIENT_URL` to your Vercel URL → Manual Deploy.

## Common errors
| Error | Fix |
|-------|-----|
| ENOTFOUND cluster... | Wrong hostname — copy URI again from Atlas |
| bad auth | Password wrong or `@` not encoded as `%40` |
| secretOrPrivateKey | Add `JWT_SECRET` on Render |
| Frontend blank API | `VITE_API_URL` missing `/api` or frontend not redeployed after env change |
| Sleep delay | Free Render sleeps after ~15 min idle |

**Do not commit** `backend/.env` — only use dashboard env vars.
