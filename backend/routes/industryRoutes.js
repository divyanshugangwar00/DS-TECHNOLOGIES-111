const express = require('express');
const router = express.Router();
const Industry = require('../models/Industry');

router.get('/', async (req, res) => {
  try {
    const industries = await Industry.find({ isActive: true }).sort('order');
    res.json(industries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
