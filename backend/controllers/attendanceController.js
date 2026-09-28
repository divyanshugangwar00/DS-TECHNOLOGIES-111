const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const sendEmail = require('../utils/sendEmail');

function dayRange(dateInput) {
  const day = dateInput ? new Date(dateInput) : new Date();
  const start = new Date(day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(day);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

const checkIn = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) return res.status(404).json({ message: 'Employee profile not found' });

    const { start, end } = dayRange();
    let attendance = await Attendance.findOne({ employee: employee._id, date: { $gte: start, $lte: end } });
    if (attendance && attendance.checkIn) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    if (!attendance) {
      attendance = await Attendance.create({
        employee: employee._id,
        date: start,
        checkIn: new Date(),
        status: 'Present',
      });
    } else {
      attendance.checkIn = new Date();
      attendance.status = 'Present';
      await attendance.save();
    }

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkOut = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) return res.status(404).json({ message: 'Employee profile not found' });

    const { start, end } = dayRange();
    const attendance = await Attendance.findOne({ employee: employee._id, date: { $gte: start, $lte: end } });
    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({ message: 'Please check in first' });
    }
    if (attendance.checkOut) {
      return res.status(400).json({ message: 'Already checked out' });
    }

    attendance.checkOut = new Date();
    const hours = (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60);
    attendance.workHours = Math.round(hours * 100) / 100;
    await attendance.save();

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyAttendance = async (req, res) => {
  try {
    const employee = await Employee.findOne({ user: req.user._id });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    const records = await Attendance.find({ employee: employee._id }).sort({ date: -1 }).limit(60);
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate({ path: 'employee', populate: { path: 'user', select: 'name email' } })
      .sort({ date: -1 })
      .limit(500);
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markStatus = async (req, res) => {
  try {
    const { employeeId, status, date } = req.body;
    if (!employeeId || !status) {
      return res.status(400).json({ message: 'employeeId and status required' });
    }
    const allowed = ['Present', 'Absent', 'Half-day', 'Leave', 'Holiday'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const { start, end } = dayRange(date);
    let rec = await Attendance.findOne({ employee: employeeId, date: { $gte: start, $lte: end } });

    if (!rec) {
      rec = await Attendance.create({
        employee: employeeId,
        date: start,
        status,
        checkIn: status === 'Present' || status === 'Half-day' ? new Date() : undefined,
      });
    } else {
      rec.status = status;
      if (status === 'Present' || status === 'Half-day') {
        if (!rec.checkIn) rec.checkIn = new Date();
      }
      if (status === 'Absent') {
        rec.checkIn = undefined;
        rec.checkOut = undefined;
        rec.workHours = undefined;
      }
      await rec.save();
    }

    const populated = await Attendance.findById(rec._id).populate({
      path: 'employee',
      populate: { path: 'user', select: 'name email' },
    });
    // Email alert to employee when admin marks attendance
    try {
      const u = populated?.employee?.user;
      if (u?.email) {
        await sendEmail({
          to: u.email,
          subject: `DS-TECHNOLOGIES – Attendance marked: ${status}`,
          html: `<p>Hi ${u.name || 'Team member'},</p>
            <p>Your attendance for <strong>${(date || new Date().toISOString().slice(0,10))}</strong> has been marked as <strong>${status}</strong>.</p>
            <p>— DS-TECHNOLOGIES HR</p>`,
        });
      }
    } catch (e) { console.log('Attendance email skipped', e.message); }
    res.json(populated);
  } catch (error) {
    // duplicate key → update existing
    if (error.code === 11000) {
      try {
        const { employeeId, status, date } = req.body;
        const { start, end } = dayRange(date);
        const rec = await Attendance.findOneAndUpdate(
          { employee: employeeId, date: { $gte: start, $lte: end } },
          {
            status,
            checkIn: status === 'Present' || status === 'Half-day' ? new Date() : null,
            checkOut: status === 'Absent' ? null : undefined,
          },
          { new: true }
        ).populate({ path: 'employee', populate: { path: 'user', select: 'name email' } });
        return res.json(rec);
      } catch (e2) {
        return res.status(500).json({ message: e2.message });
      }
    }
    res.status(500).json({ message: error.message });
  }
};


const getByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const records = await Attendance.find({ employee: employeeId })
      .sort({ date: -1 })
      .limit(120)
      .populate({ path: 'employee', populate: { path: 'user', select: 'name email' } });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkIn, checkOut, getMyAttendance, getAllAttendance, markStatus, getByEmployee };

