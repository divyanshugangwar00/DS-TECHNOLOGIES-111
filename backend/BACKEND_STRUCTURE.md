# DS-TECHNOLOGIES — API / Backend structure

```
backend/
├── config/          # db connection helpers (if present)
├── models/          # User, Employee, Job, Application, Attendance, Leave, Contact, ...
├── controllers/     # request handlers
├── routes/          # Express routers mounted in server.js
├── middleware/      # auth, roles, error handlers
├── services/        # shared business logic (if present)
├── utils/
├── uploads/
├── seeds / seedAdmin.js
└── server.js
```

## Core models (existing + roadmap names)

User, Employee, Job, Application, Attendance, Leave, Contact, Newsletter, Service, Industry, Insight  
Roadmap names for viva: Client, Project, Task, Ticket, Invoice, Payment, Performance, Course, Document, Notification, Message

## Auth

- JWT (`JWT_SECRET` required in `.env`)
- bcrypt password hashing
- Role-based routes (admin, hr, employee, user)

## Run

```bash
cp .env.example .env   # set MONGODB_URI, JWT_SECRET
npm install
node seedAdmin.js
npm start
```
