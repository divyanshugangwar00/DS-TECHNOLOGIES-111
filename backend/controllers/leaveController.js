const Leave = require('../models/Leave');
const Employee = require('../models/Employee');

const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate({ path: 'employee', populate: { path: 'user', select: 'name email' } })
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const applyLeave = async (req, res) => {
  try {
    const emp = await Employee.findOne({ user: req.user._id });
    if (!emp) return res.status(404).json({ message: 'Employee profile not found' });
    const { type, fromDate, toDate, reason } = req.body;
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const days = Math.max(1, Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1);
    const leave = await Leave.create({
      employee: emp._id,
      type: type || 'Casual',
      fromDate: from,
      toDate: to,
      days,
      reason: reason || '',
    });
    res.status(201).json(leave);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    leave.status = req.body.status;
    leave.reviewNote = req.body.reviewNote || '';
    leave.reviewedBy = req.user._id;
    await leave.save();
    const populated = await Leave.findById(leave._id).populate({
      path: 'employee',
      populate: { path: 'user', select: 'name email' },
    });
    res.json(populated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports = { getLeaves, applyLeave, updateLeaveStatus };
