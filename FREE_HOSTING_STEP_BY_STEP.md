# DS-TECHNOLOGIES — Free hosting (step by step)

Website **only works with internet + live backend**. Offline login band hai.

Accounts needed (sab free):
1. **MongoDB Atlas** — database  
2. **GitHub** — code  
3. **Render.com** — backend API  
4. **Vercel** or **Netlify** — frontend  

---

## A. MongoDB Atlas (database)

1. Open https://www.mongodb.com/cloud/atlas → Sign up (Google OK)  
2. Create **FREE M0** cluster (any region, e.g. Mumbai / Singapore)  
3. **Database Access** → Add user  
   - Username: `dstech`  
   - Password: `DSTECH2026` (ya strong password — note kar lo)  
4. **Network Access** → Add IP → **Allow Access from Anywhere** `0.0.0.0/0`  
5. **Database** → Connect → Drivers → copy **SRV** string  

Example shape:
```
mongodb+srv://dstech:DSTECH2026@cluster0.xxxxx.mongodb.net/ds-technologies?retryWrites=true&w=majority
```

Password me `@ # %` ho to URL-encode karo.

---

## B. GitHub

1. https://github.com → New repository: `DS-TECHNOLOGIES` (Public)  
2. Apne PC pe project folder me:

```bash
cd DS-TECHNOLOGIES
git init
git add .
git commit -m "DS-TECHNOLOGIES college project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/DS-TECHNOLOGIES.git
git push -u origin main
```

GitHub password ke jagah **Personal Access Token** use karo (Settings → Developer settings → PAT → classic → `repo` scope).

---

## C. Backend on Render (free)

1. https://render.com → Sign up with GitHub  
2. **New → Web Service** → Connect `DS-TECHNOLOGIES` repo  
3. Settings:

| Field | Value |
|--------|--------|
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance | Free |

4. **Environment** variables:

| Key | Value |
|-----|--------|
| `MONGODB_URI` | Atlas SRV string (upar wala) |
| `JWT_SECRET` | `ds_tech_secret_2026_college_project` |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | `*` (ya baad me Vercel URL) |

5. **Create Web Service** → wait until **Live**  
6. Copy backend URL, e.g. `https://ds-technologies-api.onrender.com`

Test browser me:
`https://YOUR-RENDER-URL/api/health`  
(agar health route nahi to `/api/jobs` try karo)

7. Render shell / one-time: seed admin (optional)  
   Local se Atlas pe:
```bash
cd backend
# .env me same MONGODB_URI
node seedAdmin.js
```

Default login: `admin@dstechnologies.com` / `admin123`

---

## D. Frontend on Vercel (free)

1. https://vercel.com → Sign up with GitHub  
2. **Add New Project** → import `DS-TECHNOLOGIES`  
3. Settings:

| Field | Value |
|--------|--------|
| Root Directory | `frontend` |
| Framework | Vite |
| Build Command | `npm run build` |
| Output | `dist` |

4. **Environment Variable**:

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://YOUR-RENDER-URL/api` |

(Example: `https://ds-technologies-api.onrender.com/api`)

5. Deploy → copy frontend URL: `https://xxx.vercel.app`

6. Render pe `CLIENT_URL` update karo = Vercel URL → Manual Deploy backend once.

---

## E. Netlify alternative (frontend)

- Base directory: `frontend`  
- Build: `npm run build`  
- Publish: `dist`  
- Env: `VITE_API_URL` = Render API `/api`

---

## F. Login test (online only)

1. Open Vercel/Netlify site (internet ON)  
2. Login: `admin@dstechnologies.com` / `admin123`  
3. Agar fail:  
   - Render logs me Mongo / JWT check  
   - Browser F12 → Network → `/api/auth/login` status  

**Offline / file:// se site nahi chalega** — yeh expected hai.

---

## Local pe pehle test (optional)

```bash
# MongoDB local / Compass running
cd backend
copy .env.example .env
npm install
node seedAdmin.js
npm start

# naya terminal
cd frontend
npm install
npm run dev
```

Open http://localhost:5173  

---

## Files hosting ke liye zaroori

```
DS-TECHNOLOGIES/
├── backend/          → Render rootDir
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── models/ controllers/ routes/ ...
│   └── seedAdmin.js
├── frontend/         → Vercel/Netlify root
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── src/
└── FREE_HOSTING_STEP_BY_STEP.md
```

`.env` Render/Vercel dashboard pe set hota hai — ZIP me secret mat daalo.

---

## Common errors

| Error | Fix |
|--------|-----|
| `secretOrPrivateKey must have a value` | Render Env me `JWT_SECRET` add + redeploy |
| `ENOTFOUND cluster...` | Atlas connection string / cluster name sahi? |
| `bad auth` | Atlas user password / URI encode |
| Frontend API fail | `VITE_API_URL` me `/api` suffix + redeploy frontend |
| Render sleep | Free tier 15 min baad sleep — pehla request slow |

