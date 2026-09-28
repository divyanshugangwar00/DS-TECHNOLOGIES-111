const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: String,
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ['Article', 'Case Study', 'Research', 'News'],
      default: 'Article',
    },
    author: String,
    coverImage: String,
    tags: [String],
    isPublished: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Insight', insightSchema);
