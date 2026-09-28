const Insight = require('../models/Insight');

const getInsights = async (req, res) => {
  try {
    const insights = await Insight.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInsightBySlug = async (req, res) => {
  try {
    const insight = await Insight.findOne({ slug: req.params.slug, isPublished: true });
    if (!insight) return res.status(404).json({ message: 'Not found' });
    insight.views += 1;
    await insight.save();
    res.json(insight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createInsight = async (req, res) => {
  try {
    const insight = await Insight.create(req.body);
    res.status(201).json(insight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getInsights, getInsightBySlug, createInsight };
