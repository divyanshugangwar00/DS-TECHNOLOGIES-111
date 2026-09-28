const jwt = require('jsonwebtoken');

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (secret && String(secret).trim()) return String(secret).trim();
  // Development fallback so college project still runs if .env forgotten
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      '[WARN] JWT_SECRET missing in .env — using temporary dev secret. Add JWT_SECRET to backend/.env'
    );
    return 'ds_tech_secret_2026_college_project';
  }
  throw new Error(
    'JWT_SECRET must be set in environment variables (Render Environment or backend/.env)'
  );
};

const generateToken = (id) => {
  return jwt.sign({ id }, getSecret(), {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

module.exports = generateToken;
