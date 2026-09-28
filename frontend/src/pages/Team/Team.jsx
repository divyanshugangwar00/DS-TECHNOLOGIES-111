import { Link } from 'react-router-dom';

const TEAM = [
  {
    name: 'Divyanshu Gangwar',
    role: 'Founder & Lead Developer',
    bio: 'Founder of DS-TECHNOLOGIES. Full-stack developer focused on practical business software, MERN applications, HR systems and career portals.',
    focus: ['Full-stack', 'Product', 'Architecture'],
    image: '/images/team/divyanshu-gangwar.jpg',
  },
  {
    name: 'Nikhil Gangwar',
    role: 'Core Team',
    bio: 'Contributes to development, operations and project delivery at DS-TECHNOLOGIES.',
    focus: ['Development', 'Support'],
    image: '/images/team/nikhil-gangwar.jpg',
  },
  {
    name: 'Rohit Kumar',
    role: 'Team Member',
    bio: 'Part of the delivery and support team working on client projects and internal tools.',
    focus: ['Implementation', 'Testing'],
    image: '/images/team/rohit-kumar.jpg',
  },
  {
    name: 'Devsaran Gangwar',
    role: 'Team Member',
    bio: 'Supports development and day-to-day project activities.',
    focus: ['Development'],
    image: '/images/team/devsaran-gangwar.jpg',
  },
];

export default function Team() {
  return (
    <div>
      <section className="section" style={{ paddingTop: '7rem', background: 'linear-gradient(180deg, rgba(0,102,255,0.12), transparent)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 className="section-title">Our Team</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            A focused Bareilly-based team building practical software, career portals and business systems.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2" style={{ gap: '1.75rem' }}>
            {TEAM.map((m) => (
              <div className="card" key={m.name} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: 90, height: 90, borderRadius: 16, overflow: 'hidden', flexShrink: 0,
                  background: 'linear-gradient(135deg, #0066ff, #00d4ff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.4rem'
                }}>
                  {m.image ? (
                    <img src={m.image} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.textContent = m.name.split(' ').map(n => n[0]).join(''); }} />
                  ) : m.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 style={{ marginBottom: '0.25rem' }}>{m.name}</h3>
                  <div style={{ color: '#60a5fa', fontSize: '0.95rem', marginBottom: '0.75rem' }}>{m.role}</div>
                  <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '0.75rem' }}>{m.bio}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {m.focus.map((f) => (
                      <span key={f} style={{
                        background: 'rgba(0,102,255,0.12)', color: '#93c5fd',
                        padding: '0.2rem 0.6rem', borderRadius: 6, fontSize: '0.78rem'
                      }}>{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'rgba(0,0,0,0.25)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Want to join the team?</h2>
          <p className="section-subtitle" style={{ margin: '0 auto 2rem' }}>
            We offer internships and full-time opportunities for developers who want real project experience.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/careers" className="btn btn-primary">View Openings</Link>
            <Link to="/careers/internship" className="btn btn-outline">Internship</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
