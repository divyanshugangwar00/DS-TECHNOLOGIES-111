const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    company: String,
    subject: String,
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Resolved'],
      default: 'New',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
