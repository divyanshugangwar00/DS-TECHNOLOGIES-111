const mongoose = require('mongoose');

const industrySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: String,
    description: String,
    image: String,
    solutions: [String],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Industry', industrySchema);
