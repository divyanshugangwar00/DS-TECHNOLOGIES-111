const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { getLeaves, applyLeave, updateLeaveStatus } = require('../controllers/leaveController');

router.get('/', protect, admin, getLeaves);
router.post('/apply', protect, applyLeave);
router.put('/:id/status', protect, admin, updateLeaveStatus);

module.exports = router;
