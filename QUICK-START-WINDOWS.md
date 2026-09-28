# DS-TECHNOLOGIES — Quick Start (Windows)

## One-click local setup
1. Make sure Node.js 18+ and MongoDB are installed and MongoDB is running.
2. Double-click `INSTALL-AND-RUN.bat`.
3. The script installs dependencies, seeds admin/jobs/employees/attendance, and opens frontend/backend terminals.
4. Open `http://localhost:5173`.

## Manual commands
### Backend
```powershell
cd backend
npm install
node seedAdmin.js
node seedJobs.js
node seedEmployees.js
node seedAttendance.js
npm run dev
```

### Frontend (new terminal)
```powershell
cd frontend
npm install
npm run dev
```

## Default local admin
- Email: `admin@dstechnologies.com`
- Password: `admin123`

Change the password before production deployment.

## MongoDB
The local default is:
`mongodb://127.0.0.1:27017/ds-technologies`

For MongoDB Atlas, replace `MONGODB_URI` in `backend/.env`.

## Production hosting
- Backend: Render
- Frontend: Vercel
- Database: MongoDB Atlas

Never upload `backend/.env` to GitHub. Set production environment variables in the hosting dashboard.
