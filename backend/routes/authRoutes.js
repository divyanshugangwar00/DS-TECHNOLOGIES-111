const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  changePassword,
  adminListPasswords,
  adminSetPassword,
  forgotPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/password', protect, changePassword);
router.get('/admin/passwords', protect, adminListPasswords);
router.put('/admin/set-password', protect, adminSetPassword);

// Temporary seed-admin
router.get('/seed-admin', async (req, res) => {
  try {
    const User = require('../models/User');
    await User.deleteMany({ email: 'admin@dstechnologies.com' });
    const user = new User({
      name: 'Admin',
      email: 'admin@dstechnologies.com',
      password: 'admin123',
      role: 'admin',
    });
    user._passwordPlainCapture = 'admin123';
    user._passwordChangedBy = 'seed';
    await user.save();
    res.json({ message: 'Admin created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;