require('dotenv').config();
const mongoose = require('mongoose');
const Site = require('./models/Site');

async function run() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ds-technologies';
  await mongoose.connect(uri);
  const doc = await Site.findOneAndUpdate(
    { slug: 'sunrise-cafe' },
    {
      slug: 'sunrise-cafe',
      siteType: 'cafe',
      template: 'cafe',
      title: 'Sunrise Cafe',
      tagline: 'Fresh coffee · Homemade snacks · Wi‑Fi',
      about: 'Family-run cafe in Bareilly.',
      services: 'Coffee, Sandwiches, Desserts, Wi-Fi',
      phone: '+91 98765 43210',
      email: 'hello@sunrisecafe.in',
      whatsapp: '919876543210',
      city: 'Bareilly, UP',
      hours: '9 AM – 10 PM',
      ctaText: 'Order on WhatsApp',
      ownerName: 'Rahul Sharma',
    },
    { upsert: true, new: true }
  );
  console.log('Site ready:', doc.slug, '→ /site/' + doc.slug);
  await mongoose.disconnect();
}
run().catch((e) => { console.error(e); process.exit(1); });
