const express = require('express');
const router = express.Router();
const {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
  markStatus,
  getByEmployee,
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.post('/checkin', protect, checkIn);
router.post('/checkout', protect, checkOut);
router.get('/me', protect, getMyAttendance);
router.get('/', protect, admin, getAllAttendance);
router.post('/mark', protect, admin, markStatus);
router.get('/employee/:employeeId', protect, admin, getByEmployee);

module.exports = router;
