import { Link } from 'react-router-dom';

const PACKAGES = [
  {
    name: 'Starter Website',
    price: '₹15,000 – ₹35,000',
    desc: 'Perfect for small businesses and professionals who need a clean online presence.',
    features: [
      'Up to 5–7 pages',
      'Responsive (mobile-friendly)',
      'Contact form',
      'Basic SEO setup',
      'Social media links',
      '1 month support',
    ],
    highlight: false,
  },
  {
    name: 'Business Portal',
    price: '₹45,000 – ₹1,20,000',
    desc: 'For companies that need more than a brochure website — enquiries, admin and custom modules.',
    features: [
      'Custom design & pages',
      'Admin panel / CMS',
      'Enquiry or lead management',
      'User login (if needed)',
      'Email notifications',
      '3 months support',
    ],
    highlight: true,
  },
  {
    name: 'Custom System',
    price: 'Custom Quote',
    desc: 'HR systems, attendance, job portals, CRM tools, dashboards and full business applications.',
    features: [
      'Requirement analysis',
      'Custom modules & workflows',
      'Role-based access',
      'Reports & exports',
      'Training & handover',
      'Flexible support plans',
    ],
    highlight: false,
  },
];

const ADDONS = [
  { title: 'Maintenance Plan', text: 'Monthly updates, backups and small changes.' },
  { title: 'SEO Boost', text: 'On-page SEO, speed improvements and basic analytics setup.' },
  { title: 'Extra Modules', text: 'Attendance, leave, job application, certificate generator etc.' },
  { title: 'Training Session', text: 'Online or offline training for your team on the delivered system.' },
];

export default function Pricing() {
  return (
    <div>
      <section className="section" style={{ paddingTop: '7rem', background: 'linear-gradient(180deg, rgba(0,102,255,0.12), transparent)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 className="section-title">Pricing & Packages</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Transparent starting ranges. Final price depends on exact scope, design and features.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {PACKAGES.map((p) => (
              <div
                key={p.name}
                className="card"
                style={{
                  display: 'flex', flexDirection: 'column',
                  border: p.highlight ? '2px solid #0066ff' : undefined,
                  background: p.highlight ? 'linear-gradient(180deg, rgba(0,102,255,0.12), var(--dark-2))' : undefined,
                }}
              >
                {p.highlight && (
                  <div style={{
                    alignSelf: 'flex-start', background: '#0066ff', color: 'white',
                    fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.7rem',
                    borderRadius: 20, marginBottom: '0.75rem'
                  }}>MOST POPULAR</div>
                )}
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>{p.name}</h3>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#60a5fa', marginBottom: '0.75rem' }}>{p.price}</div>
                <p style={{ color: '#94a3b8', marginBottom: '1.25rem', flex: 1 }}>{p.desc}</p>
                <ul style={{ listStyle: 'none', marginBottom: '1.5rem' }}>
                  {p.features.map((f) => (
                    <li key={f} style={{ padding: '0.35rem 0', color: '#cbd5e1', display: 'flex', gap: '0.5rem' }}>
                      <span style={{ color: '#34d399' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className={`btn ${p.highlight ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%' }}>
                  Get Quote
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'rgba(0,0,0,0.25)' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>Add-ons</h2>
          <p className="section-subtitle" style={{ margin: '0 auto 2rem', textAlign: 'center' }}>Optional services you can add to any package.</p>
          <div className="grid-2">
            {ADDONS.map((a) => (
              <div className="card" key={a.title}>
                <h3 style={{ marginBottom: '0.5rem' }}>{a.title}</h3>
                <p style={{ color: '#94a3b8' }}>{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'rgba(0,102,255,0.08)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Need a custom estimate?</h2>
          <p className="section-subtitle" style={{ margin: '0 auto 2rem' }}>
            Share your requirements and we will send a clear proposal with timeline and cost.
          </p>
          <Link to="/contact" className="btn btn-primary">Request Free Consultation</Link>
        </div>
      </section>
    </div>
  );
}
