const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: String,
    tech: String,
    description: String,
    link: String,
  },
  { _id: false }
);

const portfolioSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, required: true },
    headline: String,
    email: String,
    phone: String,
    city: String,
    about: String,
    skills: String,
    education: String,
    experience: String,
    projects: [projectSchema],
    github: String,
    linkedin: String,
    website: String,
    template: { type: String, enum: ['dark', 'light', 'minimal'], default: 'dark' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);
