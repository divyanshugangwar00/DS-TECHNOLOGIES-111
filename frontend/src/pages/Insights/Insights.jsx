import { Link } from 'react-router-dom';

export const CONTENT = [
  { id: 84, title: 'Insights', text: 'Thought leadership on software, HR tech and digital transformation from DS-TECHNOLOGIES.' },
  { id: 85, title: 'Blog', text: 'Practical articles on MERN, cloud hosting, internships and product building.' },
  { id: 86, title: 'News', text: 'Company updates, hiring drives and campus activities — also on the News page.' },
  { id: 87, title: 'Press Releases', text: 'Official announcements for partnerships, launches and recognition.' },
  { id: 88, title: 'Articles', text: 'Long-form guides for students and SMBs adopting digital systems.' },
  { id: 89, title: 'Technology Trends', text: 'AI, cloud, security and full-stack trends relevant to Indian startups.' },
  { id: 90, title: 'Tutorials', text: 'Step-by-step tutorials for React, Node, MongoDB and deployment.' },
  { id: 91, title: 'Research', text: 'Short research notes from intern projects and data experiments.' },
  { id: 92, title: 'Events', text: 'Workshops, hackathons and university collaboration events.' },
  { id: 93, title: 'Webinars', text: 'Online sessions on careers, coding and product demos.' },
  { id: 94, title: 'Announcements', text: 'Urgent notices for employees, interns and applicants.' },
];

export default function Insights() {
  return (
    <div className="section page-bg-insights">
      <div className="container" style={{ maxWidth: 1100 }}>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Content hub</p>
        <h1 className="section-title">Insights & Content</h1>
        <p className="section-subtitle">Knowledge centre of DS-TECHNOLOGIES — every topic opens into a richer page with practical guidance and next steps.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.85rem' }}>
          {CONTENT.map((c) => (
            <Link to={`/explore/insights/${c.id}`} key={c.id} className="card catalog-card" style={{ color:'inherit', textDecoration:'none' }}>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{c.id}</div>
              <h3 style={{ color: '#38bdf8', margin: '0.35rem 0' }}>{c.title}</h3>
              <p style={{ color: '#cbd5e1', margin: 0, lineHeight: 1.6, fontSize: '0.92rem' }}>{c.text}</p>
              <div style={{ marginTop: '.9rem', color:'#67e8f9', fontWeight:800, fontSize:'.82rem' }}>Open topic →</div>
            </Link>
          ))}
        </div>
        <p style={{ marginTop: '1.5rem' }}><Link to="/news" className="btn btn-outline">Open News</Link>{' '}<Link to="/contact" className="btn btn-primary">Contribute content</Link></p>
      </div>
    </div>
  );
}
