require('dotenv').config();
const mongoose = require('mongoose');
const Portfolio = require('./models/Portfolio');

async function run() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ds-technologies';
  await mongoose.connect(uri);
  console.log('MongoDB Connected');

  const doc = await Portfolio.findOneAndUpdate(
    { slug: 'divyanshu' },
    {
      slug: 'divyanshu',
      fullName: 'Divyanshu Gangwar',
      headline: 'Frontend Developer · React · MERN',
      email: 'hello@example.com',
      phone: '+91 98765 43210',
      city: 'Bareilly, UP',
      about:
        'Building clean web apps and learning full-stack development. Interested in product UI, APIs and campus tech projects.',
      skills: 'React, JavaScript, HTML, CSS, Node.js, MongoDB, Git',
      education: 'BCA · XYZ College · 2024',
      experience: 'Web Intern — DS-TECHNOLOGIES (2025)\nBuilt UI screens and integrated REST APIs.',
      projects: [
        {
          title: 'Job Portal UI',
          tech: 'React, Vite',
          description: 'Careers portal with filters and apply flow.',
          link: '',
        },
      ],
      github: 'github.com/username',
      linkedin: 'linkedin.com/in/username',
      website: '',
      template: 'dark',
    },
    { upsert: true, new: true }
  );

  console.log('Portfolio ready:', doc.slug, '→ /p/' + doc.slug);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
