require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('./models/Employee');
const Attendance = require('./models/Attendance');

async function seed() {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ds-technologies';
    await mongoose.connect(uri);
    const employees = await Employee.find().limit(10);
    if (!employees.length) {
      console.log('No employees. Run seedEmployees.js first');
      process.exit(1);
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
    console.log('Sample attendance for today: ' + n + ' present');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
seed();
