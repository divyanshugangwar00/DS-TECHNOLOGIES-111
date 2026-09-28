export const SITE_TEMPLATES = [
  {
    id: 'business-dark',
    name: 'Business Dark',
    type: 'business',
    desc: 'Corporate dark theme for agencies & startups',
    colors: { bg: '#0b1220', text: '#e2e8f0', accent: '#38bdf8', muted: '#94a3b8', card: '#111827' },
  },
  {
    id: 'business-light',
    name: 'Business Light',
    type: 'business',
    desc: 'Clean light professional look',
    colors: { bg: '#f8fafc', text: '#0f172a', accent: '#0284c7', muted: '#64748b', card: '#ffffff' },
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    type: 'restaurant',
    desc: 'Warm tones for restaurants & dhabas',
    colors: { bg: '#1c1410', text: '#fef3c7', accent: '#f59e0b', muted: '#d6d3d1', card: '#292018' },
  },
  {
    id: 'cafe',
    name: 'Cafe / Bakery',
    type: 'cafe',
    desc: 'Soft cream theme for cafes',
    colors: { bg: '#faf7f2', text: '#3f2a1d', accent: '#b45309', muted: '#78716c', card: '#ffffff' },
  },
  {
    id: 'coaching',
    name: 'Coaching / Institute',
    type: 'coaching',
    desc: 'Education & coaching centres',
    colors: { bg: '#0f172a', text: '#e0e7ff', accent: '#818cf8', muted: '#a5b4fc', card: '#1e1b4b' },
  },
  {
    id: 'clinic',
    name: 'Clinic / Hospital',
    type: 'clinic',
    desc: 'Calm medical green/blue',
    colors: { bg: '#f0fdfa', text: '#134e4a', accent: '#0d9488', muted: '#5eead4', card: '#ffffff' },
  },
  {
    id: 'event',
    name: 'Event / Wedding',
    type: 'event',
    desc: 'Bold event & celebration pages',
    colors: { bg: '#1a0a1f', text: '#fce7f3', accent: '#e879f9', muted: '#d8b4fe', card: '#2e1065' },
  },
  {
    id: 'shop',
    name: 'Shop / Store',
    type: 'shop',
    desc: 'Retail & local shop showcase',
    colors: { bg: '#0c0a09', text: '#fafaf9', accent: '#fb923c', muted: '#a8a29e', card: '#1c1917' },
  },
  {
    id: 'ngo',
    name: 'NGO / Trust',
    type: 'ngo',
    desc: 'Non-profit & social causes',
    colors: { bg: '#f0fdf4', text: '#14532d', accent: '#16a34a', muted: '#4ade80', card: '#ffffff' },
  },
  {
    id: 'creative',
    name: 'Creative Studio',
    type: 'creative',
    desc: 'Designers, photographers, freelancers',
    colors: { bg: '#030712', text: '#f1f5f9', accent: '#22d3ee', muted: '#94a3b8', card: '#111827' },
  },
];

export function getTemplate(id) {
  return SITE_TEMPLATES.find((t) => t.id === id) || SITE_TEMPLATES[0];
}
