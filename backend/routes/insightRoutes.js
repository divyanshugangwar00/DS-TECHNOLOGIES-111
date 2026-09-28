const express = require('express');
const router = express.Router();
const { getInsights, getInsightBySlug, createInsight } = require('../controllers/insightController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/', getInsights);
router.get('/:slug', getInsightBySlug);
router.post('/', protect, admin, createInsight);

module.exports = router;
