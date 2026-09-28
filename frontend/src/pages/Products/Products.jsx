import { Link } from 'react-router-dom';

const PRODUCTS = [
  { name: 'Company Products', desc: 'Public website + CMS for services, industries, news and contact leads.', details: ['Overview', 'Features', 'Technology', 'Screenshots', 'Pricing', 'Documentation', 'Contact / Demo'] },
  { name: 'SaaS Products', desc: 'Subscription-minded HR and careers modules ready for multi-company demos.', details: ['Overview', 'Features', 'Technology', 'Screenshots', 'Pricing', 'Documentation', 'Contact / Demo'] },
  { name: 'Mobile Products', desc: 'API-backed mobile experiences for attendance and field communication.', details: ['Overview', 'Features', 'Technology', 'Screenshots', 'Pricing', 'Documentation', 'Contact / Demo'] },
  { name: 'Web Products', desc: 'React portals for admin, employee and client journeys.', details: ['Overview', 'Features', 'Technology', 'Screenshots', 'Pricing', 'Documentation', 'Contact / Demo'] },
  { name: 'AI Products', desc: 'Assistants and smart helpers embedded in DS platforms.', details: ['Overview', 'Features', 'Technology', 'Screenshots', 'Pricing', 'Documentation', 'Contact / Demo'] },
  { name: 'ERP Products', desc: 'Modular ERP-style workforce and operations features.', details: ['Overview', 'Features', 'Technology', 'Screenshots', 'Pricing', 'Documentation', 'Contact / Demo'] },
  { name: 'CRM Products', desc: 'Lead and contact management tied to website enquiries.', details: ['Overview', 'Features', 'Technology', 'Screenshots', 'Pricing', 'Documentation', 'Contact / Demo'] },
  { name: 'Internal Tools', desc: 'Notices, certificates, payroll lists and support tickets for internal teams.', details: ['Overview', 'Features', 'Technology', 'Screenshots', 'Pricing', 'Documentation', 'Contact / Demo'] },
];

export default function Products() {
  return (
    <div className="section page-bg-products">
      <div className="container" style={{ maxWidth: 1000 }}>
        <h1 className="section-title">Products</h1>
        <p className="section-subtitle">Product lines under DS-TECHNOLOGIES with standard detail sections for demos and viva.</p>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {PRODUCTS.map((p, i) => (
            <div key={p.name} className="card">
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{67 + i}</div>
              <h3 style={{ color: '#38bdf8', margin: '0.35rem 0' }}>{p.name}</h3>
              <p style={{ color: '#cbd5e1', lineHeight: 1.65 }}>{p.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {p.details.map((d) => (
                  <span key={d} style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: 6, background: 'rgba(56,189,248,0.12)', color: '#7dd3fc' }}>{d}</span>
                ))}
              </div>
              <div style={{ marginTop: 12 }}>
                <Link to="/contact" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>Contact / Demo</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
