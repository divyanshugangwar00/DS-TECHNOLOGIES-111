import { Link } from 'react-router-dom';

const ITEMS = [
  { title: 'Portfolio', text: 'Selected work from DS-TECHNOLOGIES across web, HR and career systems.' },
  { title: 'Projects', text: 'Job Portal with Resume Management, HR suite modules and company OS.' },
  { title: 'Web Projects', text: 'React + Node corporate sites, admin CMS and public careers pages.' },
  { title: 'Mobile Projects', text: 'API-first designs ready for Android clients and PWA use.' },
  { title: 'AI Projects', text: 'Spam Email Detection, Stock Market Prediction and smart assistants.' },
  { title: 'ERP Projects', text: 'Attendance, leaves, payroll lists and employee self-service.' },
  { title: 'E-Commerce Projects', text: 'Catalogue and enquiry flows for product businesses.' },
  { title: 'Client Projects', text: 'Custom deliveries for local businesses and institutional demos.' },
  { title: 'Case Studies', text: 'Structured stories: Client → Problem → Requirements → Solution → Technology → Process → Challenges → Team.' },
];

const CASE = ['Client', 'Problem', 'Requirements', 'Solution', 'Technology', 'Development Process', 'Challenges', 'Team'];

export default function Portfolio() {
  return (
    <div className="section page-bg-portfolio">
      <div className="container" style={{ maxWidth: 1000 }}>
        <h1 className="section-title">Projects / Portfolio</h1>
        <p className="section-subtitle">Proof of delivery — web, AI, ERP-style modules and client case studies.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.9rem' }}>
          {ITEMS.map((x, i) => (
            <div key={x.title} className="card">
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{75 + i}</div>
              <h3 style={{ color: '#38bdf8', margin: '0.35rem 0' }}>{x.title}</h3>
              <p style={{ color: '#cbd5e1', margin: 0, lineHeight: 1.65 }}>{x.text}</p>
            </div>
          ))}
        </div>
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ color: '#e2e8f0', marginTop: 0 }}>Case study template</h3>
          <ol style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
            {CASE.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
          <Link to="/contact" className="btn btn-primary">Request full case study PDF</Link>
        </div>
      </div>
    </div>
  );
}
