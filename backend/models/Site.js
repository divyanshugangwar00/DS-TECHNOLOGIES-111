const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    siteType: { type: String, default: 'business' },
    template: { type: String, required: true, default: 'business-dark' },
    title: { type: String, required: true },
    tagline: String,
    about: String,
    services: String,
    phone: String,
    email: String,
    whatsapp: String,
    address: String,
    city: String,
    hours: String,
    logoUrl: String,
    heroImage: String,
    ctaText: String,
    ctaLink: String,
    socialInstagram: String,
    socialFacebook: String,
    ownerName: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Site', siteSchema);
