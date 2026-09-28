const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: String,
    description: String,
    icon: String,
    image: String,
    features: [String],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
