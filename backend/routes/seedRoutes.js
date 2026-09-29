const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Employee = require('../models/Employee');
const User = require('../models/User');
const Attendance = require('../models/Attendance');

router.get('/jobs', async (req, res) => {
  try {
    await Job.deleteMany({});
    const jobs = [
      {
        title: 'Junior Software Developer',
        department: 'Engineering',
        location: 'Bareilly / Hybrid / Remote',
        type: 'Full-time',
        experience: '0-2 years',
        description: 'Junior Software Developer role at DS-TECHNOLOGIES.',
        requirements: ['Relevant degree / diploma'],
        responsibilities: ['Learn and deliver', 'Team collaboration'],
        skills: ['BCA/B.Tech/MCA'],
        salaryRange: '₹15,000 – ₹25,000 / month',
        status: 'Open',
        openings: 2,
      },
      {
        title: 'Frontend Developer',
        department: 'Engineering',
        location: 'Bareilly / Hybrid / Remote',
        type: 'Full-time',
        experience: '0-2 years',
        description: 'Frontend Developer role at DS-TECHNOLOGIES.',
        requirements: ['React basics'],
        responsibilities: ['UI development'],
        skills: ['React', 'HTML', 'CSS'],
        salaryRange: '₹18,000 – ₹30,000 / month',
        status: 'Open',
        openings: 2,
      },
      {
        title: 'Backend Developer (Node.js)',
        department: 'Engineering',
        location: 'Bareilly / Hybrid / Remote',
        type: 'Full-time',
        experience: '0-2 years',
        description: 'Backend Node.js role at DS-TECHNOLOGIES.',
        requirements: ['Node basics'],
        responsibilities: ['API development'],
        skills: ['Node', 'MongoDB'],
        salaryRange: '₹20,000 – ₹35,000 / month',
        status: 'Open',
        openings: 2,
      },
      {
        title: 'Full Stack Developer',
        department: 'Engineering',
        location: 'Bareilly / Hybrid / Remote',
        type: 'Full-time',
        experience: '0-2 years',
        description: 'Full Stack MERN role.',
        requirements: ['React + Node'],
        responsibilities: ['End to end features'],
        skills: ['MERN'],
        salaryRange: '₹12,000 – ₹18,000 / month',
        status: 'Open',
        openings: 2,
      },
      {
        title: 'Web Developer Intern',
        department: 'Engineering',
        location: 'Bareilly / Hybrid / Remote',
        type: 'Internship',
        experience: '0-1 years',
        description: 'Internship for freshers.',
        requirements: ['HTML/CSS/JS'],
        responsibilities: ['Learn and support'],
        skills: ['Web basics'],
        salaryRange: '₹8,000 – ₹12,000 / month',
        status: 'Open',
        openings: 3,
      },
      {
        title: 'HR Executive',
        department: 'HR',
        location: 'Bareilly',
        type: 'Full-time',
        experience: '0-2 years',
        description: 'HR support and hiring assistance.',
        requirements: ['Good communication'],
        responsibilities: ['Hiring support', 'Employee records'],
        skills: ['MS Office'],
        salaryRange: '₹12,000 – ₹20,000 / month',
        status: 'Open',
        openings: 1,
      },
    ];
    const created = await Job.insertMany(jobs);
    res.json({ message: 'Jobs seeded', count: created.length });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/employees', async (req, res) => {
  try {
    await Employee.deleteMany({});
    const password = process.env.EMPLOYEE_SEED_PASSWORD || 'Employee@123';

    const list = [
      { name: 'Divyanshu Gangwar', email: 'divyanshu@dstechnologies.com', phone: '9500000001', role: 'admin', designation: 'Founder & CEO', department: 'Leadership', employeeId: 'DS-L-001', salary: 80000 },
      { name: 'Devsaran Gangwar', email: 'devsaran@dstechnologies.com', phone: '9500000002', role: 'admin', designation: 'Co-Founder', department: 'Leadership', employeeId: 'DS-L-002', salary: 75000 },
      { name: 'Nikhil Gangwar', email: 'nikhil@dstechnologies.com', phone: '8126914479', role: 'employee', designation: 'Assistant Manager', department: 'Operations', employeeId: 'DS-L-004', salary: 45000 },
      { name: 'Rohit Kumar', email: 'rohit@dstechnologies.com', phone: '7817051268', role: 'employee', designation: 'Manager – Operations', department: 'Operations', employeeId: 'DS-MGR-001', salary: 40000 },
      { name: 'Sachin', email: 'sachin@dstechnologies.com', phone: '9800000006', role: 'employee', designation: 'Manager – Sales', department: 'Sales', employeeId: 'DS-MGR-002', salary: 40000 },
      { name: 'Sanjeev', email: 'sanjeev@dstechnologies.com', phone: '9800000007', role: 'employee', designation: 'Senior Manager – Engineering', department: 'Engineering', employeeId: 'DS-SM-001', salary: 48000 },
    ];

    const created = [];
    for (const item of list) {
      let user = await User.findOne({ email: item.email.toLowerCase() });
      if (!user) {
        user = new User({
          name: item.name,
          email: item.email.toLowerCase(),
          password,
          phone: item.phone,
          role: item.role === 'admin' ? 'admin' : 'employee',
        });
        user._passwordPlainCapture = password;
        user._passwordChangedBy = 'seed';
        await user.save();
      } else {
        user.role = item.role === 'admin' ? 'admin' : 'employee';
        user.password = password;
        user._passwordPlainCapture = password;
        user._passwordChangedBy = 'seed';
        user.markModified('password');
        await user.save();
      }

      const emp = await Employee.create({
        user: user._id,
        employeeId: item.employeeId,
        department: item.department,
        designation: item.designation,
        salary: item.salary,
        joiningDate: new Date('2024-01-15'),
        workLocation: 'Hybrid',
        isActive: true,
        employmentType: 'Full Time',
      });
      created.push(emp.employeeId);
    }

    res.json({
      message: 'Employees seeded',
      count: created.length,
      ids: created,
      defaultPassword: password,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/attendance', async (req, res) => {
  try {
    const employees = await Employee.find({ isActive: true }).limit(10);
    if (!employees.length) {
      return res.status(400).json({ message: 'Seed employees first: /api/seed/employees' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let n = 0;
    for (const emp of employees) {
      const exists = await Attendance.findOne({ employee: emp._id, date: today });
      if (exists) continue;

      const checkIn = new Date(today);
      checkIn.setHours(9, 30 + n, 0, 0);

      await Attendance.create({
        employee: emp._id,
        date: today,
        checkIn,
        status: 'Present',
      });
      n++;
    }

    res.json({ message: 'Attendance seeded', present: n });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;