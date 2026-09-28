const express = require('express');
const Site = require('../models/Site');
const router = express.Router();

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || `site-${Date.now().toString(36)}`;
}

router.get('/:slug', async (req, res) => {
  try {
    const doc = await Site.findOne({ slug: req.params.slug.toLowerCase() });
    if (!doc) return res.status(404).json({ message: 'Site not found' });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ message: e.message || 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const body = req.body || {};
    if (!body.title) return res.status(400).json({ message: 'Site title is required' });
    let slug = slugify(body.slug || body.title);

    const data = {
      slug,
      siteType: body.siteType || 'business',
      template: body.template || 'business-dark',
      title: body.title,
      tagline: body.tagline || '',
      about: body.about || '',
      services: body.services || '',
      phone: body.phone || '',
      email: body.email || '',
      whatsapp: body.whatsapp || '',
      address: body.address || '',
      city: body.city || '',
      hours: body.hours || '',
      logoUrl: body.logoUrl || '',
      heroImage: body.heroImage || '',
      ctaText: body.ctaText || 'Contact us',
      ctaLink: body.ctaLink || '',
      socialInstagram: body.socialInstagram || '',
      socialFacebook: body.socialFacebook || '',
      ownerName: body.ownerName || '',
    };

    const doc = await Site.findOneAndUpdate({ slug }, data, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });

    res.status(201).json({
      message: 'Site saved',
      slug: doc.slug,
      path: `/site/${doc.slug}`,
      site: doc,
    });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ message: 'Slug already taken' });
    res.status(500).json({ message: e.message || 'Server error' });
  }
});

module.exports = router;
