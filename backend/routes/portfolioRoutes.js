const express = require('express');
const Portfolio = require('../models/Portfolio');

const router = express.Router();

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || `user-${Date.now().toString(36)}`;
}

// Public: get by slug
router.get('/:slug', async (req, res) => {
  try {
    const doc = await Portfolio.findOne({ slug: req.params.slug.toLowerCase() });
    if (!doc) return res.status(404).json({ message: 'Portfolio not found' });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ message: e.message || 'Server error' });
  }
});

// Create or update by slug (no auth for college demo simplicity)
router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    let slug = slugify(body.slug || body.fullName);
    if (!body.fullName) return res.status(400).json({ message: 'Full name is required' });

    // Ensure unique slug if creating new
    const existing = await Portfolio.findOne({ slug });
    if (existing && body.forceNew) {
      slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    }

    const data = {
      slug,
      fullName: body.fullName,
      headline: body.headline || '',
      email: body.email || '',
      phone: body.phone || '',
      city: body.city || '',
      about: body.about || '',
      skills: body.skills || '',
      education: body.education || '',
      experience: body.experience || '',
      projects: Array.isArray(body.projects) ? body.projects : [],
      github: body.github || '',
      linkedin: body.linkedin || '',
      website: body.website || '',
      template: ['dark', 'light', 'minimal'].includes(body.template) ? body.template : 'dark',
    };

    const doc = await Portfolio.findOneAndUpdate(
      { slug },
      data,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({
      message: 'Portfolio saved',
      slug: doc.slug,
      path: `/p/${doc.slug}`,
      portfolio: doc,
    });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ message: 'Slug already taken. Change name or slug.' });
    }
    res.status(500).json({ message: e.message || 'Server error' });
  }
});

module.exports = router;
