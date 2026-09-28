/**
 * Create default admin user
 * Run: node seedAdmin.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function seedAdmin() {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ds-technologies';
    await mongoose.connect(uri);
    console.log('MongoDB Connected');

    const email = process.env.ADMIN_EMAIL || 'admin@dstechnologies.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    if (password.length < 6) throw new Error('ADMIN_PASSWORD must be at least 6 characters');
    const existing = await User.findOne({ email });

    if (existing) {
      existing.role = 'admin';
      existing.password = password;
      existing._passwordPlainCapture = password;
      existing._passwordChangedBy = 'seed';
      existing.markModified('password');
      await existing.save();
      console.log('Admin already exists. Password reset from ADMIN_PASSWORD.');
      console.log('Email:', email);
    } else {
      const admin = new User({
        name: 'DS Admin',
        email: email,
        password,
        phone: '7895733906',
        role: 'admin',
      });
      admin._passwordPlainCapture = password;
      admin._passwordChangedBy = 'seed';
      await admin.save();
      console.log('Admin created successfully!');
      console.log('Email:', email);
      console.log('Password: set in ADMIN_PASSWORD');
      console.log('ID:', admin._id);
    }
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

seedAdmin();
