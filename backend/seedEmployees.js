require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Employee = require('./models/Employee');

const SEED_PASSWORD = process.env.EMPLOYEE_SEED_PASSWORD || 'Ds@2026';

const FIRST = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Shaurya', 'Atharv', 'Aadhya', 'Ananya', 'Aarohi', 'Diya', 'Myra', 'Anika', 'Ira', 'Navya',
  'Kabir', 'Rudra', 'Yash', 'Rohan', 'Kunal', 'Aman', 'Nikhil', 'Rohit', 'Sachin', 'Vikas',
  'Priya', 'Neha', 'Pooja', 'Sneha', 'Kavita', 'Meera', 'Shreya', 'Anjali', 'Ritu', 'Sakshi',
  'Manish', 'Deepak', 'Suresh', 'Ramesh', 'Mahesh', 'Rajesh', 'Dinesh', 'Naresh', 'Pankaj', 'Vivek',
  'Khushi', 'Isha', 'Tanvi', 'Nisha', 'Komal', 'Payal', 'Swati', 'Jyoti', 'Preeti', 'Aarti',
];
const LAST = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Yadav', 'Patel', 'Shah', 'Joshi', 'Malhotra',
  'Kapoor', 'Chopra', 'Bansal', 'Agarwal', 'Saxena', 'Mishra', 'Pandey', 'Tiwari', 'Chauhan', 'Rathore',
  'Gangwar', 'Kashyap', 'Rastogi', 'Dixit', 'Rawat', 'Negi', 'Bisht', 'Thakur', 'Rana', 'Mehta',
];

// Hierarchy bands → count targets (~200 total)
const BANDS = [
  { designation: 'Founder & CEO', department: 'Leadership', role: 'admin', count: 1, salary: 85000, prefix: 'DS-L' },
  { designation: 'Co-Founder', department: 'Leadership', role: 'admin', count: 2, salary: 75000, prefix: 'DS-L' },
  { designation: 'Chairman', department: 'Leadership', role: 'admin', count: 1, salary: 80000, prefix: 'DS-L' },
  { designation: 'Board Director', department: 'Leadership', role: 'admin', count: 4, salary: 70000, prefix: 'DS-BD' },
  { designation: 'CEO / Managing Director', department: 'Leadership', role: 'admin', count: 1, salary: 82000, prefix: 'DS-L' },
  { designation: 'CTO – Chief Technology Officer', department: 'Technology', role: 'admin', count: 1, salary: 72000, prefix: 'DS-CXO' },
  { designation: 'CIO – Chief Information Officer', department: 'Technology', role: 'admin', count: 1, salary: 70000, prefix: 'DS-CXO' },
  { designation: 'COO – Chief Operating Officer', department: 'Operations', role: 'admin', count: 1, salary: 70000, prefix: 'DS-CXO' },
  { designation: 'CFO – Chief Financial Officer', department: 'Finance', role: 'admin', count: 1, salary: 70000, prefix: 'DS-CXO' },
  { designation: 'CMO – Chief Marketing Officer', department: 'Marketing', role: 'admin', count: 1, salary: 65000, prefix: 'DS-CXO' },
  { designation: 'CHRO – Chief Human Resources Officer', department: 'HR', role: 'hr', count: 1, salary: 65000, prefix: 'DS-CXO' },
  { designation: 'VP Engineering', department: 'Engineering', role: 'admin', count: 2, salary: 60000, prefix: 'DS-VP' },
  { designation: 'Director – HR', department: 'HR', role: 'hr', count: 2, salary: 55000, prefix: 'DS-DIR' },
  { designation: 'Director – Sales', department: 'Sales', role: 'employee', count: 2, salary: 55000, prefix: 'DS-DIR' },
  { designation: 'Director – Delivery', department: 'Operations', role: 'employee', count: 2, salary: 55000, prefix: 'DS-DIR' },
  { designation: 'General Manager', department: 'Operations', role: 'employee', count: 4, salary: 50000, prefix: 'DS-GM' },
  { designation: 'Senior Manager – Engineering', department: 'Engineering', role: 'employee', count: 6, salary: 48000, prefix: 'DS-SM' },
  { designation: 'Senior Manager – HR', department: 'HR', role: 'hr', count: 3, salary: 45000, prefix: 'DS-SM' },
  { designation: 'Manager – Engineering', department: 'Engineering', role: 'employee', count: 8, salary: 42000, prefix: 'DS-MGR' },
  { designation: 'Manager – Operations', department: 'Operations', role: 'employee', count: 5, salary: 40000, prefix: 'DS-MGR' },
  { designation: 'Manager – Sales', department: 'Sales', role: 'employee', count: 5, salary: 40000, prefix: 'DS-MGR' },
  { designation: 'Manager – HR', department: 'HR', role: 'hr', count: 4, salary: 38000, prefix: 'DS-MGR' },
  { designation: 'Team Lead – Frontend', department: 'Engineering', role: 'employee', count: 6, salary: 35000, prefix: 'DS-TL' },
  { designation: 'Team Lead – Backend', department: 'Engineering', role: 'employee', count: 6, salary: 35000, prefix: 'DS-TL' },
  { designation: 'Team Lead – QA', department: 'Engineering', role: 'employee', count: 4, salary: 32000, prefix: 'DS-TL' },
  { designation: 'Senior Software Engineer', department: 'Engineering', role: 'employee', count: 15, salary: 32000, prefix: 'DS-SSE' },
  { designation: 'Software Engineer', department: 'Engineering', role: 'employee', count: 25, salary: 25000, prefix: 'DS-SE' },
  { designation: 'Frontend Developer', department: 'Engineering', role: 'employee', count: 12, salary: 24000, prefix: 'DS-FE' },
  { designation: 'Backend Developer', department: 'Engineering', role: 'employee', count: 12, salary: 24000, prefix: 'DS-BE' },
  { designation: 'Junior Developer', department: 'Engineering', role: 'employee', count: 15, salary: 18000, prefix: 'DS-JR' },
  { designation: 'QA Engineer', department: 'Engineering', role: 'employee', count: 8, salary: 22000, prefix: 'DS-QA' },
  { designation: 'HR Executive', department: 'HR', role: 'hr', count: 6, salary: 22000, prefix: 'DS-HR' },
  { designation: 'Business Development Executive', department: 'Sales', role: 'employee', count: 8, salary: 22000, prefix: 'DS-BD' },
  { designation: 'IT Support Executive', department: 'Operations', role: 'employee', count: 6, salary: 20000, prefix: 'DS-IT' },
  { designation: 'Accounts Assistant', department: 'Finance', role: 'employee', count: 4, salary: 20000, prefix: 'DS-FIN' },
  { designation: 'Customer Support Executive', department: 'Operations', role: 'employee', count: 6, salary: 18000, prefix: 'DS-CS' },
  { designation: 'Intern – Software', department: 'Engineering', role: 'employee', count: 12, salary: 10000, prefix: 'DS-INT' },
  { designation: 'Trainee – Software', department: 'Engineering', role: 'employee', count: 8, salary: 10000, prefix: 'DS-TRN' },
];

// Fixed real leadership (founder list)
const FIXED = [
  { name: 'Divyanshu Gangwar', email: 'divyanshu@dstechnologies.com', phone: '7895733906', role: 'admin', designation: 'Founder & CEO', department: 'Leadership', employeeId: 'DS-L-001', salary: 85000 },
  { name: 'Devsaran Gangwar', email: 'devsaran@dstechnologies.com', phone: '8979802499', role: 'admin', designation: 'Co-Founder / Chairman', department: 'Leadership', employeeId: 'DS-L-006', salary: 80000 },
  { name: 'Soni', email: 'soni@dstechnologies.com', phone: '9800000001', role: 'admin', designation: 'Director', department: 'Leadership', employeeId: 'DS-L-002', salary: 65000 },
  { name: 'Poonam Gangwar', email: 'poonam@dstechnologies.com', phone: '9800000002', role: 'admin', designation: 'CMO – Chief Marketing Officer', department: 'Marketing', employeeId: 'DS-CXO-CMO', salary: 65000 },
  { name: 'Sandhya', email: 'sandhya@dstechnologies.com', phone: '9800000010', role: 'admin', designation: 'CTO – Chief Technology Officer', department: 'Technology', employeeId: 'DS-CXO-CTO', salary: 72000 },
  { name: 'Rajeev Kumar', email: 'rajeev@dstechnologies.com', phone: '9800000004', role: 'admin', designation: 'COO – Chief Operating Officer', department: 'Operations', employeeId: 'DS-L-005', salary: 70000 },
  { name: 'Nikhil Gangwar', email: 'nikhil@dstechnologies.com', phone: '8126914479', role: 'employee', designation: 'Assistant Manager', department: 'Operations', employeeId: 'DS-L-004', salary: 45000 },
  { name: 'Rohit Kumar', email: 'rohit@dstechnologies.com', phone: '7817051268', role: 'employee', designation: 'Manager – Operations', department: 'Operations', employeeId: 'DS-MGR-001', salary: 40000 },
  { name: 'Sachin', email: 'sachin@dstechnologies.com', phone: '9800000006', role: 'employee', designation: 'Manager – Sales', department: 'Sales', employeeId: 'DS-MGR-002', salary: 40000 },
  { name: 'Sanjeev', email: 'sanjeev@dstechnologies.com', phone: '9800000007', role: 'employee', designation: 'Senior Manager – Engineering', department: 'Engineering', employeeId: 'DS-SM-001', salary: 48000 },
  { name: 'Sunil', email: 'sunil@dstechnologies.com', phone: '9800000008', role: 'employee', designation: 'General Manager', department: 'Operations', employeeId: 'DS-GM-001', salary: 50000 },
];

function buildTeam() {
  const team = [...FIXED];
  const usedEmails = new Set(FIXED.map((t) => t.email.toLowerCase()));
  const usedIds = new Set(FIXED.map((t) => t.employeeId));
  let n = 0;
  let seq = {};

  // continue numbering after FIXED ids (e.g. DS-L-006 → next DS-L-007)
  for (const id of usedIds) {
    const m = String(id).match(/^([A-Z0-9-]+?)-(\d+)$/i);
    if (m) {
      const prefix = m[1];
      const num = parseInt(m[2], 10);
      seq[prefix] = Math.max(seq[prefix] || 0, num);
    }
  }

  for (const band of BANDS) {
    let need = band.count;
    const already = team.filter((t) => t.designation === band.designation).length;
    need = Math.max(0, need - already);

    for (let i = 0; i < need; i++) {
      n++;
      const fn = FIRST[n % FIRST.length];
      const ln = LAST[(n * 3) % LAST.length];
      const name = `${fn} ${ln}`;
      let email = `${fn.toLowerCase()}.${ln.toLowerCase()}${n}@dstechnologies.com`;
      while (usedEmails.has(email.toLowerCase())) {
        n++;
        email = `${fn.toLowerCase()}.${ln.toLowerCase()}${n}@dstechnologies.com`;
      }
      usedEmails.add(email.toLowerCase());
      seq[band.prefix] = (seq[band.prefix] || 0) + 1;
      let employeeId = `${band.prefix}-${String(seq[band.prefix]).padStart(3, '0')}`;
      while (usedIds.has(employeeId)) {
        seq[band.prefix] += 1;
        employeeId = `${band.prefix}-${String(seq[band.prefix]).padStart(3, '0')}`;
      }
      usedIds.add(employeeId);

      team.push({
        name,
        email,
        phone: `98${String(10000000 + n).slice(0, 8)}`,
        role: band.role,
        designation: band.designation,
        department: band.department,
        employeeId,
        salary: band.salary,
      });
    }
  }

  // pad to at least 200
  while (team.length < 200) {
    n++;
    const fn = FIRST[n % FIRST.length];
    const ln = LAST[(n * 7) % LAST.length];
    const email = `staff${n}@dstechnologies.com`;
    if (usedEmails.has(email.toLowerCase())) continue;
    usedEmails.add(email.toLowerCase());
    let sid = `DS-STF-${String(team.length + 1).padStart(3, '0')}`;
    while (usedIds.has(sid)) {
      n++;
      sid = `DS-STF-${String(1000 + n).padStart(3, '0')}`;
    }
    usedIds.add(sid);
    team.push({
      name: `${fn} ${ln}`,
      email,
      phone: `97${String(10000000 + n).slice(0, 8)}`,
      role: 'employee',
      designation: n % 2 === 0 ? 'Software Engineer' : 'Junior Developer',
      department: 'Engineering',
      employeeId: sid,
      salary: n % 2 === 0 ? 25000 : 18000,
    });
  }

  return team.slice(0, 200);
}

async function seed() {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ds-technologies';
    await mongoose.connect(uri);
    console.log('MongoDB Connected');

    const team = buildTeam();
    console.log(`Seeding ${team.length} employees...`);

    // Idempotent clean of employee links (users kept / updated)
    // Drop conflicting employee docs then recreate from team — avoids E11000 user_1
    await Employee.deleteMany({});
    console.log('Cleared employees collection (users kept)');

    let count = 0;
    for (const t of team) {
      let user = await User.findOne({ email: t.email.toLowerCase() });
      if (!user) {
        user = new User({
          name: t.name,
          email: t.email.toLowerCase(),
          password: SEED_PASSWORD,
          phone: t.phone,
          role: t.role || 'employee',
        });
        if (user._passwordPlainCapture !== undefined) {
          user._passwordPlainCapture = SEED_PASSWORD;
          user._passwordChangedBy = 'seed';
        }
        await user.save();
      } else {
        user.name = t.name;
        user.role = t.role || user.role || 'employee';
        user.phone = t.phone || user.phone;
        // reset demo password only for company domain
        try {
          user.password = SEED_PASSWORD;
          if (user._passwordPlainCapture !== undefined) {
            user._passwordPlainCapture = SEED_PASSWORD;
            user._passwordChangedBy = 'seed';
          }
          await user.save();
        } catch (_) {
          await User.updateOne({ _id: user._id }, { name: t.name, role: t.role, phone: t.phone });
          user = await User.findById(user._id);
        }
      }

      // One employee per user — create after deleteMany
      try {
        await Employee.create({
          user: user._id,
          employeeId: t.employeeId,
          department: t.department,
          designation: t.designation,
          workLocation: 'Bareilly / Hybrid',
          salary: t.salary || 25000,
          employmentType:
            String(t.designation || '').includes('Intern') || String(t.designation || '').includes('Trainee')
              ? 'Intern'
              : 'Full Time',
          isActive: true,
          companyEmail: t.email.toLowerCase(),
        });
      } catch (err) {
        // employeeId clash — tweak id and retry once
        if (err && err.code === 11000) {
          const altId = `${t.employeeId}-R${count}`;
          await Employee.create({
            user: user._id,
            employeeId: altId,
            department: t.department,
            designation: t.designation,
            workLocation: 'Bareilly / Hybrid',
            salary: t.salary || 25000,
            employmentType: 'Full Time',
            isActive: true,
            companyEmail: t.email.toLowerCase(),
          });
        } else {
          throw err;
        }
      }

      count++;
      if (count % 50 === 0) console.log(`  ${count}/${team.length}`);
    }

    // Ensure master admin login (no employee row required)
    let admin = await User.findOne({ email: 'admin@dstechnologies.com' });
    if (!admin) {
      await User.create({
        name: 'Admin',
        email: 'admin@dstechnologies.com',
        password: 'admin123',
        role: 'admin',
        phone: '7895733906',
      });
      console.log('Created admin@dstechnologies.com / admin123');
    } else {
      admin.password = 'admin123';
      admin.role = 'admin';
      try {
        await admin.save();
      } catch (_) {}
      console.log('Admin ready: admin@dstechnologies.com / admin123');
    }

    // Leadership logins reminder
    console.log(`--- Leadership logins (password ${SEED_PASSWORD}) ---`);
    console.log('divyanshu@dstechnologies.com · soni@ · poonam@ · sandhya@ · rajeev@ · devsaran@');
    console.log(`Done. ${count} employees seeded.`);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

seed();
