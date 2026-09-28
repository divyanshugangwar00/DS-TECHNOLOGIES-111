const GROUPS = [
  {
    id: 'frontend',
    title: 'Frontend Technologies',
    items: ['HTML', 'CSS', 'JavaScript', 'React', 'Vite', 'Responsive UI systems'],
  },
  {
    id: 'backend',
    title: 'Backend Technologies',
    items: ['Node.js', 'Express.js', 'REST APIs', 'JWT Auth', 'Middleware & validation'],
  },
  {
    id: 'mobile',
    title: 'Mobile Technologies',
    items: ['Android-ready APIs', 'Progressive Web Apps', 'Cross-platform friendly backends'],
  },
  {
    id: 'databases',
    title: 'Databases',
    items: ['MongoDB', 'MongoDB Atlas', 'Mongoose ODM', 'SQL fundamentals'],
  },
  {
    id: 'cloud',
    title: 'Cloud',
    items: ['Vercel', 'Render', 'Environment configs', 'Static + API hosting'],
  },
  {
    id: 'devops',
    title: 'DevOps',
    items: ['Git / GitHub', 'npm scripts', 'Build & start pipelines', 'Log-based troubleshooting'],
  },
  {
    id: 'aiml',
    title: 'AI / ML',
    items: ['Python', 'Classification helpers', 'Data pipelines basics', 'Generative API hooks'],
  },
  {
    id: 'testing',
    title: 'Testing Tools',
    items: ['Manual QA checklists', 'API testing', 'Form validation tests', 'Print/PDF layout checks'],
  },
  {
    id: 'security',
    title: 'Security Tools',
    items: ['bcrypt', 'JWT', 'Role-based access', 'CORS & env secrets'],
  },
];

export default function Technologies() {
  return (
    <div className="section page-bg-technologies">
      <div className="container" style={{ maxWidth: 1000 }}>
        <h1 className="section-title">Technologies</h1>
        <p className="section-subtitle">Stack DS-TECHNOLOGIES uses to design, build and host production-ready systems.</p>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {GROUPS.map((g, idx) => (
            <div key={g.id} id={g.id} className="card" style={{ scrollMarginTop: 90 }}>
              <h2 style={{ color: '#38bdf8', marginTop: 0 }}>{46 + idx}. {g.title}</h2>
              <ul style={{ color: '#cbd5e1', lineHeight: 1.8, columns: 2, marginBottom: 0 }}>
                {g.items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
