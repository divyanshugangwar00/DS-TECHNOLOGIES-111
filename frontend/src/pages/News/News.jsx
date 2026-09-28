import { Link } from 'react-router-dom';

const NEWS = [
  {
    type: 'Press',
    title: 'DS-TECHNOLOGIES launches integrated careers and employee portal',
    date: '2026',
    body: 'Applicants can explore jobs, apply online and track hiring steps. Employees use attendance, leave and salary tools from the same platform.',
  },
  {
    type: 'Company',
    title: 'Internship and certificate programme open for students',
    date: '2026',
    body: 'Students from technology, commerce, science and related streams can apply for structured internships with company-branded certificates.',
  },
  {
    type: 'Product',
    title: 'Internal HRIS: offers, onboarding and document verification',
    date: '2026',
    body: 'End-to-end digital joining flow — selection, offer letter, multi-step form, identity checks and employee login.',
  },
  {
    type: 'Community',
    title: 'Hiring across engineering, HR and operations',
    date: 'Ongoing',
    body: 'Open roles are listed on Careers. Freshers and experienced candidates from Bareilly and pan-India (hybrid/remote) are welcome.',
  },
];

export default function News() {
  return (
    <div className="section page-bg-about">
      <div className="container" style={{ maxWidth: 900 }}>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 6 }}>News</p>
        <h1 className="section-title">Latest news & stories</h1>
        <p className="section-subtitle">
          Press updates, product milestones and community stories from DS-TECHNOLOGIES.
        </p>

        <div style={{ display: 'grid', gap: '1rem', marginTop: '1.25rem' }}>
          {NEWS.map((n) => (
            <article key={n.title} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ color: '#00d4ff', fontSize: '0.75rem', fontWeight: 600 }}>{n.type}</span>
                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{n.date}</span>
              </div>
              <h2 style={{ margin: '0.4rem 0', fontSize: '1.1rem', color: '#e2e8f0' }}>{n.title}</h2>
              <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.6 }}>{n.body}</p>
            </article>
          ))}
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/insights" style={{ color: '#00d4ff' }}>
            Insights →
          </Link>
          <Link to="/careers" style={{ color: '#00d4ff' }}>
            Careers →
          </Link>
          <Link to="/contact" style={{ color: '#00d4ff' }}>
            Media contact →
          </Link>
        </div>
      </div>
    </div>
  );
}
