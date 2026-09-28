const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.route('/').get(getJobs).post(protect, admin, createJob);
router.route('/:id').get(getJobById).put(protect, admin, updateJob).delete(protect, admin, deleteJob);

module.exports = router;
