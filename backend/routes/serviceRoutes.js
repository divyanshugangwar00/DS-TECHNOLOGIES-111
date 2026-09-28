const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort('order');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
