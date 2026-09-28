/** Global website content — editable by Super Admin. Persists in localStorage; works after hosting in the same browser / can export JSON. */

export const SITE_CONTENT_KEY = 'ds_website_cms_v1';

export const DEFAULT_SITE_CONTENT = {
  updatedAt: null,
  company: {
    name: 'DS-TECHNOLOGIES',
    tagline: 'Imagine the future. Make it real.',
    address: 'Village Kuiya Rampur, Post Kakra Kalan, Faridpur, Bareilly, Uttar Pradesh 243503',
    phone1: '7895733906',
    phone2: '7454910637',
    email: 'divyanshugangwar950@gmail.com',
    linkedin: 'https://www.linkedin.com/in/divyanshu-gangwar-0b4982274',
    instagram: 'https://www.instagram.com/divyanshu_gangwar_',
    whatsapp: 'https://wa.me/917895733906',
  },
  home: {
    heroTitle: 'Building digital products that power real businesses',
    heroSubtitle:
      'DS-TECHNOLOGIES is a Bareilly-based software company that designs, builds and supports custom web applications, business portals, HR systems and career platforms. We work with startups, institutes and growing companies across India — delivering clean MERN-stack products, practical dashboards and long-term technical support so your ideas become production-ready systems.',
    ctaPrimary: 'Explore careers',
    ctaSecondary: 'Contact us',
    statsJobs: '1000+',
    statsTeam: '200+',
    statsClients: 'Growing',
  },
  about: {
    intro:
      'DS-TECHNOLOGIES is a Bareilly-based technology company founded by Divyanshu Gangwar (BCA, Invertis University). We build job portals, HR systems, web applications and data tools using the MERN stack (MongoDB, Express, React, Node.js), Python and modern cloud practices. Our focus is practical software for local businesses and meaningful internships for students who want industry experience.',
    mission: 'Deliver reliable, affordable software and create real employment and internship opportunities for deserving talent from Uttar Pradesh and beyond.',
    vision: 'Grow into a trusted regional tech partner known for quality delivery, transparent communication and youth skill development.',
    founderBio:
      'Divyanshu Gangwar is Founder & CEO of DS-TECHNOLOGIES. He is pursuing BCA at Invertis University, Bareilly (2023–26), with a foundation in programming, databases and full-stack development. Skills include Python, Java, HTML, SQL, MongoDB, Express.js, React.js, Node.js, MS Office and Power BI. Projects include Spam Email Detection, Stock Market Prediction and a Job Portal with Resume Management (MERN). Certifications: IBM Python 101, IBM SQL & Relational Databases 101, Power BI Dashboard (Invertis), Frontend Development Internship (CodeAlpha). Contact: 7895733906 · divyanshugangwar950@gmail.com · Village Kuiya Rampur, Bareilly 243503.',
  },
  services: {
    heading: 'What we deliver',
    items: [
      { title: 'Custom Software', desc: 'End-to-end business applications, HRIS modules, payroll tools and workflow automation tailored to your processes.' },
      { title: 'Web Development', desc: 'Modern React and Node.js portals, company websites, admin dashboards and secure REST APIs with MongoDB.' },
      { title: 'Data & Analytics', desc: 'Python-based insights, Power BI dashboards, reporting pipelines and decision-support tools for growing teams.' },
      { title: 'Internships & Training', desc: 'Structured internship programmes, course certificates and hands-on MERN / frontend projects for students.' },
      { title: 'Cloud & Support', desc: 'Deployment guidance, monitoring basics and ongoing technical support so your systems stay reliable after launch.' },
      { title: 'Career & Job Portal Solutions', desc: 'Resume-aware job portals, application tracking and HR workflows similar to production systems used by IT companies.' },
    ],
  },
  industries: {
    heading: 'Industries we serve',
    items: [
      'Banking & Financial Services',
      'Healthcare',
      'Retail & Consumer',
      'Manufacturing',
      'Education',
      'Technology',
    ],
  },
  careers: {
    heroTitle: 'Start your career with real projects',
    heroSubtitle: 'Apply for internships and full-time roles at DS-TECHNOLOGIES. Work on MERN apps, data tools and live client-style modules — with certificates and mentorship from our Bareilly team.',
  },
  contact: {
    heading: 'Get in touch',
    blurb: 'Share your project idea, partnership interest or career enquiry. We respond from our Bareilly HQ (Village Kuiya Rampur, Faridpur). Call 7895733906 / 7454910637 or email divyanshugangwar950@gmail.com.',
  },
  footer: {
    note: '© DS-TECHNOLOGIES · Bareilly, Uttar Pradesh',
  },
  customBlocks: [],
};

export function loadSiteContent() {
  try {
    const raw = localStorage.getItem(SITE_CONTENT_KEY);
    if (!raw) return structuredClone(DEFAULT_SITE_CONTENT);
    const parsed = JSON.parse(raw);
    return deepMerge(structuredClone(DEFAULT_SITE_CONTENT), parsed);
  } catch {
    return structuredClone(DEFAULT_SITE_CONTENT);
  }
}

export function saveSiteContent(content) {
  const next = { ...content, updatedAt: new Date().toISOString() };
  localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(next));
  try {
    window.dispatchEvent(new CustomEvent('ds-site-content-updated', { detail: next }));
  } catch (_) {}
  return next;
}

export function resetSiteContent() {
  localStorage.removeItem(SITE_CONTENT_KEY);
  try {
    window.dispatchEvent(new CustomEvent('ds-site-content-updated', { detail: DEFAULT_SITE_CONTENT }));
  } catch (_) {}
  return structuredClone(DEFAULT_SITE_CONTENT);
}

function deepMerge(base, over) {
  if (!over || typeof over !== 'object') return base;
  Object.keys(over).forEach((k) => {
    if (Array.isArray(over[k])) base[k] = over[k];
    else if (over[k] && typeof over[k] === 'object' && !Array.isArray(over[k])) {
      base[k] = deepMerge(base[k] || {}, over[k]);
    } else if (over[k] !== undefined) base[k] = over[k];
  });
  return base;
}

function structuredClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
