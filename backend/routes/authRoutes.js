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

module.exports = router;
