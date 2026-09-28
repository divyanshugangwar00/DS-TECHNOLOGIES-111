import { Link } from 'react-router-dom';

const ITEMS = [
  { id: 171, title: 'CRM Dashboard' },
  { id: 172, title: 'Leads' },
  { id: 173, title: 'Lead Details' },
  { id: 174, title: 'Lead Sources' },
  { id: 175, title: 'Lead Assignment' },
  { id: 176, title: 'Follow-ups' },
  { id: 177, title: 'Calls' },
  { id: 178, title: 'Meetings' },
  { id: 179, title: 'Emails' },
  { id: 180, title: 'Notes' },
  { id: 181, title: 'Opportunities' },
  { id: 182, title: 'Quotations' },
  { id: 183, title: 'Sales Pipeline' },
  { id: 184, title: 'Customers' },
  { id: 185, title: 'Lost Leads' },
  { id: 186, title: 'Converted Leads' },
];

const PIPE = ['Lead', 'Contacted', 'Meeting', 'Requirement', 'Quotation', 'Negotiation', 'Won', 'Lost'];

export default function CRM() {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 1000 }}>
        <h1 className="section-title">CRM</h1>
        <p className="section-subtitle">Customer relationship modules for leads, pipeline and conversions. Contact form leads feed this flow.</p>
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3 style={{ color: '#38bdf8', marginTop: 0 }}>Pipeline</h3>
          <p style={{ color: '#cbd5e1' }}>{PIPE.join(' → ')}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.7rem' }}>
          {ITEMS.map((x) => (
            <div key={x.id} className="card" style={{ padding: '0.8rem' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{x.id}</div>
              <div style={{ color: '#e2e8f0', fontWeight: 600 }}>{x.title}</div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '1rem' }}>
          <Link to="/admin/contacts" className="btn btn-primary">Admin contacts / leads</Link>{' '}
          <Link to="/contact" className="btn btn-outline">Public contact form</Link>
        </p>
      </div>
    </div>
  );
}
