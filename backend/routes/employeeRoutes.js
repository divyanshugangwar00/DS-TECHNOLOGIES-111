const express = require('express');
const router = express.Router();
const {
  getEmployees,
  createEmployee,
  getMyEmployeeProfile,
  deleteEmployee,
  updateEmployee,
  resign,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/', protect, admin, getEmployees);
router.post('/', protect, admin, createEmployee);
router.get('/me', protect, getMyEmployeeProfile);
router.post('/resign', protect, resign);
router.put('/:id', protect, admin, updateEmployee);
router.delete('/:id', protect, admin, deleteEmployee);

module.exports = router;
