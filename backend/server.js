const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.warn('[WARN] JWT_SECRET is not set. Set it in .env or hosting Environment variables.');
}

connectDB();

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) return cb(null, true);
      return cb(null, true); // allow for free multi-host demos; tighten in production if needed
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for resumes. Resume files are served as downloads so arbitrary
// uploaded file types cannot be interpreted as active content by the browser.
app.use(
  '/uploads/resumes',
  express.static(path.join(__dirname, 'uploads', 'resumes'), {
    setHeaders: (res) => {
      res.setHeader('Content-Disposition', 'attachment');
      res.setHeader('X-Content-Type-Options', 'nosniff');
    },
  })
);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));
app.use('/api/insights', require('./routes/insightRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/industries', require('./routes/industryRoutes'));
app.use('/api/portfolios', require('./routes/portfolioRoutes'));
app.use('/api/sites', require('./routes/siteRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'DS-TECHNOLOGIES API is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'DS-TECHNOLOGIES API', time: new Date().toISOString() });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
