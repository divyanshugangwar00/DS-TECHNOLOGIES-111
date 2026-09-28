import { Link } from 'react-router-dom';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Rahul Sharma',
    role: 'Founder',
    company: 'Local Retail Chain, Bareilly',
    rating: 5,
    text: 'DS-TECHNOLOGIES built our complete inventory and billing system. The team understood our business quickly and delivered a clean, easy-to-use portal. Highly recommended for small businesses.',
    avatar: 'RS',
  },
  {
    id: 2,
    name: 'Priya Verma',
    role: 'HR Manager',
    company: 'Education Institute',
    rating: 5,
    text: 'We needed an internship and job application portal. They delivered a full system with resume upload, tracking and admin dashboard within the promised timeline.',
    avatar: 'PV',
  },
  {
    id: 3,
    name: 'Amit Patel',
    role: 'Operations Head',
    company: 'Manufacturing Unit',
    rating: 5,
    text: 'Their custom attendance and leave management module saved us hours of manual work every month. Support after delivery has also been excellent.',
    avatar: 'AP',
  },
  {
    id: 4,
    name: 'Sneha Gupta',
    role: 'Startup Founder',
    company: 'EdTech Startup',
    rating: 4,
    text: 'From website to student portal and certificate generation — everything was handled professionally. Communication was clear and regular.',
    avatar: 'SG',
  },
  {
    id: 5,
    name: 'Vikram Singh',
    role: 'IT Coordinator',
    company: 'College, UP',
    rating: 5,
    text: 'DS-TECHNOLOGIES helped us modernize our college website and student enquiry system. The team is young, energetic and technically strong.',
    avatar: 'VS',
  },
  {
    id: 6,
    name: 'Neha Agarwal',
    role: 'Business Owner',
    company: 'Service Business',
    rating: 5,
    text: 'Got a complete company website + CRM-style enquiry management. Price was fair and quality was better than expected for a Bareilly-based team.',
    avatar: 'NA',
  },
];

function Stars({ count }) {
  return (
    <div style={{ color: '#f59e0b', fontSize: '1.1rem', letterSpacing: 2 }}>
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </div>
  );
}

export default function Testimonials() {
  return (
    <div>
      <section className="section" style={{ paddingTop: '7rem', background: 'linear-gradient(180deg, rgba(0,102,255,0.12), transparent)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 className="section-title">Client Testimonials</h1>
          <p className="section-subtitle" style={{ margin: '0 auto 1rem' }}>
            Real feedback from businesses, institutes and startups who trusted DS-TECHNOLOGIES for their digital projects.
          </p>
          <Link to="/contact" className="btn btn-primary" style={{ marginTop: '1rem' }}>Share Your Experience</Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: '1.5rem' }}>
            {TESTIMONIALS.map((t) => (
              <div className="card" key={t.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Stars count={t.rating} />
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, flex: 1 }}>“{t.text}”</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #0066ff, #00d4ff)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.95rem'
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 600 }}>{t.name}</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{t.role} · {t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'rgba(0,102,255,0.08)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Want to be our next success story?</h2>
          <p className="section-subtitle" style={{ margin: '0 auto 2rem' }}>Tell us about your project and we will get back within 24 hours.</p>
          <Link to="/contact" className="btn btn-primary">Start a Conversation</Link>
        </div>
      </section>
    </div>
  );
}
