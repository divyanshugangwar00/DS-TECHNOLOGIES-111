const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    employeeId: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    joiningDate: { type: Date, default: Date.now },
    reportingManager: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    workLocation: { type: String, default: 'Hybrid' },
    salary: Number,
    isActive: { type: Boolean, default: true },
    // extended profile
    profilePhoto: String,
    personalEmail: String,
    companyEmail: String,
    dateOfBirth: Date,
    gender: { type: String, enum: ['Male', 'Female', 'Other', ''], default: '' },
    address: String,
    city: String,
    state: String,
    pin: String,
    emergencyContact: String,
    employmentType: {
      type: String,
      enum: ['Full Time', 'Part Time', 'Intern', 'Contract'],
      default: 'Full Time',
    },
    skills: [String],
    qualification: String,
    experienceYears: String,
    resumeUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
