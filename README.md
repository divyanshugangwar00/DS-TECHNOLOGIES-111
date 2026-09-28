# DS-TECHNOLOGIES

**Professional IT & Software Company Website + Admin HRIS + Employee Portal**

Final Year College Project · Founder: **Divyanshu Gangwar** · Bareilly, UP

---

## Project Overview

DS-TECHNOLOGIES is a full-stack web application for an IT services company. It includes:

| Module | Features |
|--------|----------|
| **Public Website** | Home, About, Services, Industries, Careers, Jobs, Internship, Courses, Insights, News, Contact, AI Chatbot, PWA |
| **Admin / HR Portal** | Dashboard, Jobs, Applications, Hiring Pipeline (Offer → Joining → Docs → Onboarding), Employees, Attendance, Leaves, Payroll, Departments, Designations, Tasks, CRM, Finance, Cloud, AI Analytics, CMS, Security, Reports |
| **Employee Portal** | Dashboard, Profile, Attendance (Check-in/out), Leave, Salary, Documents, Tasks, Notices, Directory, Support, Resign, Change Password |
| **Auth** | JWT + Offline demo login (backend optional for presentation) |

**Tech Stack:** React (Vite) · Node.js · Express · MongoDB · JWT · Multer · Nodemailer · Cloudinary (optional) · PWA

---

## Quick Start — Windows (recommended)

### Option A: One-click setup

1. Install Node.js 18+ and MongoDB.
2. Start MongoDB.
3. Double-click `INSTALL-AND-RUN.bat`.
4. The script installs packages, seeds admin/jobs/employees/attendance, and starts the frontend + backend.
5. Open `http://localhost:5173`.

### Option B: Manual

Backend terminal:

```powershell
cd backend
npm install
node seedAdmin.js
node seedJobs.js
node seedEmployees.js
node seedAttendance.js
npm run dev
```

Frontend terminal:

```powershell
cd frontend
npm install
npm run dev
```

Default local admin:

- Email: `admin@dstechnologies.com`
- Password: `admin123`

Employee/leadership seed accounts use the value in `EMPLOYEE_SEED_PASSWORD`. Change these values before production.

The frontend also has an offline demo fallback so the public UI remains usable if the backend is temporarily unavailable.

## Free Hosting (Production)

See **FREE_LAUNCH_GUIDE.md** and **HOSTING.md**.

Recommended free stack:

1. **MongoDB Atlas** (free cluster)
2. **Render.com** or **Railway.app** → backend
3. **Vercel** → frontend

Checklist:

- Backend env: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`
- Frontend env: `VITE_API_URL=https://YOUR-API.onrender.com/api`
- Seed admin after first deploy: `node seedAdmin.js` (or one-time script)

---

## Credentials

See `CREDENTIALS.txt` and `ADMIN_LOGIN.txt` (keep private for production).

---

## Project Structure

```
DS-TECHNOLOGIES/
├── backend/          # Express API
│   ├── config/       # DB, email, cloudinary
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── seed*.js
│   └── server.js
├── frontend/         # React + Vite
│   ├── public/       # logo, PWA, images
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/    # Home, Admin, Employee, Careers...
│       └── services/
├── README.md
├── HOSTING.md
└── FREE_LAUNCH_GUIDE.md
```

---

## Hiring Pipeline (built-in)

Application → Review → Shortlist → Interview → Selected → Offer Letter → Accept →  
Joining Form → Document Verification → Onboarding → Employee ID → Login

---

## License

Academic / college project use. © DS-TECHNOLOGIES · Divyanshu Gangwar

---

## Online deploy

See **[DEPLOY.md](./DEPLOY.md)** for free hosting on GitHub + Render + Vercel + MongoDB Atlas.

---

## Updates in FULL_INTERACTIVE_V3 (Added Features)

### New Public Pages
- **/testimonials** – Client testimonials with ratings
- **/case-studies** – Detailed project case studies (challenge → solution → results)
- **/team** – Team members page with roles and focus areas
- **/faq** – Accordion FAQ (General, Services, Careers, Pricing)
- **/pricing** – Service packages (Starter / Business / Custom) + add-ons
- **404 (NotFound)** – Custom page-not-found for unknown routes

### Improvements
- Home page: Testimonials teaser + FAQ teaser sections
- Contact page: Google Maps embed for office location
- Footer: Links to Team, Testimonials, Case Studies, Pricing, FAQ
- Navbar (About mega menu): Links to new company pages
- Cookie Consent banner (GDPR-style) on first visit
- Sitemap updated with all new public routes

### How to use new pages
Just navigate to the routes above after starting the frontend.
All pages use the same dark theme and card styling as the rest of the site.

---

## V4 Updates (Resume + Design + Content)

### Resume Builder overhaul
- **Resume (1-page A4)** mode — compact professional single-page layout, print-ready A4
- **Full CV (detailed)** mode — multi-section detailed CV
- Toggle between Resume / CV
- Print / Save PDF with proper A4 page size
- Live preview + completion %

### Design & content
- Updated global color palette (richer blues/cyans)
- New hero background image + gradients
- Home hero subtitle expanded with more detail
- Hero CTAs: Contact us · Explore careers · Our Services

### Admin
- Website CMS: new “New Pages Info” tab listing all public routes
- Existing CMS still edits Home, About, Services, Contact, etc.

### How to test Resume
1. Open `/careers/resume-builder`
2. Choose **Resume (1-page A4)**
3. Fill details → Live Preview → Print / Save PDF

---

## V5 Admin power features (partial but usable)

### Added now
1. **AdminListToolbar** – reusable Select All, Bulk Delete, Search, Export CSV, Import CSV, Refresh
2. **Employees** – bulk select + bulk delete + CSV export wired
3. **Interview Management** (`/admin/interviews`) – schedule, interviewer, status, feedback, bulk delete, export
4. **Certificate Generator** (`/admin/certificates`) – Internship/Course/Experience, employee pick, print A4 PDF, local save
5. **Dashboard** links for Interviews + Certificates
6. **Website CMS** – Logo upload/replace (browser localStorage) + Reset
7. **Navbar** – uses custom logo if uploaded

### Still backlog (need more time / backend APIs)
- Full soft-delete + trash for every module
- Force logout / session kill across devices
- Fine-grained page permissions matrix
- Invoice + Mark Paid + GST
- Run Payroll + bulk payslips email
- Lead → Client conversion pipeline
- Document expiry alerts automation
- CMS server-side live save (currently localStorage + existing CMS fields)
- Import CSV fully persisted to Mongo for all entities

Priority for next pass: tell which group (Finance / Payroll / CRM / Roles).

---

## V6 – Design speed + online-only

### Design
- Multi-color palette: blue, cyan, violet, pink, orange accents
- Hero multi-gradient + new space/tech image
- Section titles & buttons use multi-stop gradients
- Card hover purple/cyan glow

### Performance
- Removed `background-attachment: fixed` (major lag on hosted sites)
- Reduced backdrop-filter blur
- Vite build: minify, code-split React chunk, no sourcemaps in prod

### Offline DISABLED
- Service worker unregisters itself and clears caches
- main.jsx no longer registers SW
- App shows "Internet required" screen if browser is offline
