const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Please add a job title'], trim: true },
    jobCode: { type: String, unique: true, sparse: true, trim: true, index: true },
    slug: { type: String, unique: true, sparse: true, trim: true, index: true },
    department: { type: String, required: true, trim: true },
    location: { type: String, required: true, default: 'Remote / Hybrid' },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], default: 'Full-time' },
    experience: { type: String, default: '0-2 years' },
    description: { type: String, required: true },
    requirements: [String],
    responsibilities: [String],
    skills: [String],
    salaryRange: String,
    status: { type: String, enum: ['Open', 'Closed', 'Draft'], default: 'Open' },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    openings: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
