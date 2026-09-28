const express = require('express');
const router = express.Router();
const {
  applyJob,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { uploadResume } = require('../middleware/uploadMiddleware');

router.post('/', uploadResume, applyJob);
router.get('/', protect, admin, getApplications);
router.put('/:id/status', protect, admin, updateApplicationStatus);
router.delete('/:id', protect, admin, deleteApplication);

module.exports = router;
