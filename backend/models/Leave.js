const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    type: {
      type: String,
      enum: ['Sick', 'Casual', 'Annual', 'Unpaid', 'Other'],
      default: 'Casual',
    },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    days: { type: Number, default: 1 },
    reason: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewNote: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Leave', leaveSchema);
