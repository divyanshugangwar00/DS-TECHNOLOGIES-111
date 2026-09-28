const express = require('express');
const router = express.Router();
const { submitContact, getContacts } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.post('/', submitContact);
router.get('/', protect, admin, getContacts);

module.exports = router;
