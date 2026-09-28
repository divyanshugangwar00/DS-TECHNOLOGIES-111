import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSiteContent } from '../../context/SiteContentContext';

const EXPLORE = [
  { title: 'Who we are', to: '#overview', img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&q=80' },
  { title: 'Founder & CEO', to: '#founder', img: '/images/team/divyanshu-gangwar.jpg' },
  { title: 'Management & governance', to: '#leadership', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&q=80' },
  { title: 'ESG / Values', to: '#esg', img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&q=80' },
  { title: 'CSR', to: '#csr', img: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=500&q=80' },
  { title: 'Technology partners', to: '#partners', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80' },
  { title: 'Locations', to: '#locations', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80' },
  { title: 'Awards & Achievements', to: '#awards', img: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=500&q=80' },
  { title: 'Partners', to: '#partners', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80' },
  { title: 'Certifications', to: '#certifications', img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=80' },
];

const LEADERS = [
  { name: 'Divyanshu Gangwar', role: 'Founder & CEO', phone: '7895733906 · 7454910637', extra: 'DOB: 14/04/2006 · BCA · MCA (pursuing)', img: '/images/team/divyanshu-gangwar.jpg', href: '#founder' },
  { name: 'Devsaran Gangwar', role: 'Co-Founder / Chairman', phone: '8979802499', extra: 'Leadership · Guidance', img: '/images/team/devsaran-gangwar.jpg' },
  { name: 'Rohit Kumar', role: 'Manager', phone: '7817051268', extra: 'Operations · Team', img: '/images/team/rohit-kumar.jpg' },
  { name: 'Nikhil Gangwar', role: 'Assistant Manager', phone: '8126914479', extra: 'DOB: 01/01/2005 · Coordination', img: '/images/team/nikhil-gangwar.jpg' },
];

export default function About() {
  const [showFounderBio, setShowFounderBio] = useState(false);
  const { content } = useSiteContent();
  const aboutCms = content.about || {};

  return (
    <div className="page-bg-about">
      <section
        style={{
          position: 'relative',
          minHeight: 340,
          display: 'flex',
          alignItems: 'center',
          background:
            'linear-gradient(100deg, rgba(10,15,28,0.92) 0%, rgba(10,15,28,0.75) 45%, rgba(10,15,28,0.55) 100%), url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&q=80) center/cover',
          color: '#fff',
        }}
      >
        <div className="container" style={{ padding: '3rem 1.25rem' }}>
          <p style={{ color: '#00d4ff', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', fontSize: '0.85rem' }}>About us</p>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', margin: '0.5rem 0 1rem', maxWidth: 700 }}>
            We help organisations imagine their future and make it real
          </h1>
          <p style={{ color: '#cbd5e1', maxWidth: 560, lineHeight: 1.7 }}>
            {aboutCms.intro ||
              'DS-TECHNOLOGIES is an IT and software company from Bareilly, UP — software, web, mobile, and careers for young talent.'}
          </p>
        </div>
      </section>

      <div className="section">
        <div className="container">
          <h2 className="section-title" style={{ fontSize: '1.35rem' }}>Explore</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {EXPLORE.map((e) => (
              <a key={e.title} href={e.to} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <img src={e.img} alt="" style={{ width: '100%', height: 100, objectFit: 'cover' }} />
                  <div style={{ padding: '0.75rem', fontWeight: 600, color: '#e2e8f0', fontSize: '0.9rem' }}>{e.title}</div>
                </div>
              </a>
            ))}
          </div>

          <section id="overview" className="card" style={{ marginBottom: '1.5rem', scrollMarginTop: 90 }}>
            <h2 style={{ color: '#00d4ff', marginTop: 0 }}>Who we are</h2>
            <p style={{ color: '#cbd5e1', lineHeight: 1.75 }}>
              {aboutCms.intro ||
                'DS-TECHNOLOGIES delivers custom software, web and mobile applications, IT consulting and digital support.'}
            </p>
            <p style={{ color: '#94a3b8', lineHeight: 1.7 }}>
              <strong style={{ color: '#e2e8f0' }}>Mission:</strong> {aboutCms.mission || 'Reliable tech and meaningful employment.'}
            </p>
            <p style={{ color: '#94a3b8', lineHeight: 1.7 }}>
              <strong style={{ color: '#e2e8f0' }}>Vision:</strong> {aboutCms.vision || 'Scale into a trusted enterprise for youth opportunity.'}
            </p>
          </section>

          <section id="founder" className="card" style={{ marginBottom: '1.5rem', scrollMarginTop: 90, overflow: 'hidden' }}>
            <div className="founder-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 280px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
              <div style={{ textAlign: 'center' }}>
                <img
                  src="/images/team/divyanshu-gangwar.jpg"
                  alt="Divyanshu Gangwar"
                  style={{ width: '100%', maxWidth: 260, borderRadius: 16, objectFit: 'cover', border: '3px solid rgba(0,212,255,0.35)' }}
                />
                <h2 style={{ margin: '1rem 0 0.25rem', color: '#e2e8f0', fontSize: '1.35rem' }}>Divyanshu Gangwar</h2>
                <p style={{ margin: 0, color: '#00d4ff', fontWeight: 600 }}>Founder & CEO, DS Technologies</p>
                <p style={{ margin: '0.5rem 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>DOB: 14/04/2006</p>
                <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.8rem' }}>BCA · MCA (pursuing) · Invertis University</p>
                <button type="button" className="btn btn-primary" style={{ marginTop: '0.85rem', fontSize: '0.85rem' }} onClick={() => setShowFounderBio((v) => !v)}>
                  {showFounderBio ? 'Hide full about ↑' : 'View full about →'}
                </button>
              </div>
              <div>
                {!showFounderBio && (
                  <div style={{ color: '#94a3b8', lineHeight: 1.6 }}>
                    <p>Founder &amp; CEO of DS Technologies · BCA · MCA (pursuing).</p>
                    <p style={{ fontSize: '0.9rem' }}>
                      Click <strong style={{ color: '#00d4ff' }}>View full about</strong> under the photo to read origin story, education and goals.
                    </p>
                  </div>
                )}
                {showFounderBio && (
                  <div>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>Introduction & Vision</p>
                    <blockquote style={{ margin: '0.5rem 0 1rem', padding: '0.85rem 1rem', borderLeft: '4px solid #00d4ff', background: 'rgba(0,212,255,0.08)', color: '#e2e8f0', fontStyle: 'italic', lineHeight: 1.55 }}>
                      True leadership is not about finding a seat at the table; it is about building a bigger table for others.
                    </blockquote>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.75 }}>
                      Hello, I am <strong>Divyanshu Gangwar</strong>, Founder and CEO of DS-TECHNOLOGIES. I am a BCA student at Invertis University, Bareilly, with a strong foundation in computer applications, programming and full-stack development. I am a quick learner and team player, motivated to build practical software and create real opportunities for students like myself.
                    </p>
                    <h3 style={{ color: '#00d4ff' }}>Origin story</h3>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.75 }}>
                      DS-TECHNOLOGIES was started from Village Kuiya Rampur, Bareilly, after seeing skilled graduates struggle for industry exposure. Instead of only applying for jobs, I built a company that delivers client software and structured internships — so talent can learn on real MERN projects, job portals and data tools.
                    </p>
                    <h3 style={{ color: '#00d4ff' }}>Education</h3>
                    <ul style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                      <li><strong>2023–26</strong> — Bachelor of Computer Applications (BCA), Invertis University, Bareilly</li>
                      <li><strong>2021–23</strong> — 12th Intermediate (U.P. Board), Jainarayan Saraswati Vidya Mandir Inter College, Bareilly</li>
                      <li><strong>2019–21</strong> — 10th Matriculation (U.P. Board), Saraswati Vidya Mandir</li>
                    </ul>
                    <h3 style={{ color: '#00d4ff' }}>Skills</h3>
                    <p style={{ color: '#cbd5e1', lineHeight: 1.75 }}>
                      Python · Java · HTML · SQL · MongoDB · Express.js · React.js · Node.js · MS Word / Excel / PowerPoint · Power BI
                    </p>
                    <h3 style={{ color: '#00d4ff' }}>Projects</h3>
                    <ul style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                      <li>Spam Email Detection System (Python)</li>
                      <li>Stock Market Prediction System (Python)</li>
                      <li>Job Portal with Resume Management System (MERN)</li>
                    </ul>
                    <h3 style={{ color: '#00d4ff' }}>Certificates</h3>
                    <ul style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                      <li>Python 101 for Data Science — IBM (Feb 2025)</li>
                      <li>SQL and Relational Databases 101 — IBM (Feb 2025)</li>
                      <li>Power BI Dashboard Showdown — Invertis University (Sep 2025)</li>
                      <li>Frontend Development Internship — CodeAlpha (Oct 2025)</li>
                    </ul>
                    <h3 style={{ color: '#00d4ff' }}>What we do</h3>
                    <ul style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                      <li>Custom software, HRIS and web applications (React / Node / MongoDB)</li>
                      <li>Data tools with Python and Power BI</li>
                      <li>Internship programmes and course certificates</li>
                      <li>Cloud deployment guidance and ongoing tech support</li>
                    </ul>
                    <h3 style={{ color: '#00d4ff' }}>Connect</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
                      <a href="https://www.linkedin.com/in/divyanshu-gangwar-0b4982274" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>LinkedIn</a>
                      <a href="https://www.instagram.com/divyanshu_gangwar_" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>Instagram</a>
                      <a href="https://wa.me/917895733906" target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>WhatsApp</a>
                      <a href="mailto:divyanshugangwar950@gmail.com" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>Email</a>
                      <a href="tel:+917895733906" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>7895733906</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <style>{'@media (max-width:720px){.founder-grid{grid-template-columns:1fr!important}}'}</style>
          </section>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center', marginBottom: '2rem' }}>
            {[
              { v: '1000+', l: 'Open roles catalogue' },
              { v: '200+', l: 'Team capacity' },
              { v: '1', l: 'HQ · Bareilly, UP' },
            ].map((s) => (
              <div key={s.l} className="card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#00d4ff' }}>{s.v}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{s.l}</div>
              </div>
            ))}
          </div>

          <section id="leadership" className="card" style={{ marginBottom: '1.25rem', scrollMarginTop: 90 }}>
            <h2 style={{ color: '#00d4ff', marginTop: 0 }}>Management and governance</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {LEADERS.map((p) => (
                <div key={p.name + p.role} className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                  {p.img ? (
                    <img src={p.img} alt={p.name} style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,212,255,0.3)' }} />
                  ) : (
                    <div style={{ width: 88, height: 88, borderRadius: '50%', margin: '0 auto', background: 'rgba(0,102,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#00d4ff' }}>
                      {p.name.charAt(0)}
                    </div>
                  )}
                  <div style={{ marginTop: '0.65rem', fontWeight: 700, color: '#e2e8f0' }}>{p.name}</div>
                  <div style={{ color: '#00d4ff', fontSize: '0.85rem' }}>{p.role}</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{p.phone}</div>
                  <div style={{ color: '#64748b', fontSize: '0.72rem' }}>{p.extra}</div>
                </div>
              ))}
            </div>
          </section>

          <section id="history" className="card" style={{ marginBottom: '1.25rem' }}>
            <h2 style={{ color: '#00d4ff', marginTop: 0 }}>Our story</h2>
            <p style={{ color: '#cbd5e1', lineHeight: 1.75 }}>
              Founded by Divyanshu Gangwar after BCA at Invertis University while pursuing MCA — reliable digital solutions with internship and fresher hiring pipelines.
            </p>
          </section>

          <section id="esg" className="card" style={{ marginBottom: '1.25rem', scrollMarginTop: 90 }}>
            <h2 style={{ color: '#00d4ff', marginTop: 0 }}>Values</h2>
            <ul style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
              <li>Honest delivery and transparent communication</li>
              <li>Inclusive hiring across streams</li>
              <li>Efficient software and cloud usage</li>
              <li>Clear HR processes — offers, onboarding, attendance, payroll</li>
            </ul>
          </section>

          <section id="csr" className="card" style={{ marginBottom: '1.25rem', scrollMarginTop: 90 }}>
            <h2 style={{ color: '#00d4ff', marginTop: 0 }}>CSR</h2>
            <p style={{ color: '#cbd5e1', lineHeight: 1.75 }}>
              Campus workshops, internship certificates and skill exposure for students in the Bareilly region.
            </p>
          </section>

          <section id="partners" className="card" style={{ marginBottom: '1.25rem', scrollMarginTop: 90 }}>
            <h2 style={{ color: '#00d4ff', marginTop: 0 }}>Technology</h2>
            <p style={{ color: '#cbd5e1', lineHeight: 1.75 }}>React · Node.js · MongoDB · Cloud · DevOps practices.</p>
          </section>

          <section id="locations" className="card" style={{ marginBottom: '1.25rem', scrollMarginTop: 90 }}>
            <h2 style={{ color: '#00d4ff', marginTop: 0 }}>Locations</h2>
            <p style={{ color: '#cbd5e1', lineHeight: 1.75 }}>
              Village Kuiya Rampur, Post Kakra Kalan, Faridpur, Bareilly, UP 243503
              <br />
              Phone: 7895733906 · 7454910637
              <br />
              Email: divyanshugangwar950@gmail.com
            </p>
          </section>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/careers" className="btn btn-primary" style={{ marginRight: 8 }}>Careers</Link>
            <Link to="/contact" className="btn btn-outline">Contact</Link>
          </div>

          <section id="awards" className="card" style={{ marginBottom: '1.25rem', scrollMarginTop: 90 }}>
            <h2 style={{ color: '#00d4ff', marginTop: 0 }}>Awards & Achievements</h2>
            <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>Recognition for student projects, internship programmes and practical MERN deliveries from Bareilly HQ. Power BI Dashboard Showdown (Invertis), IBM skill badges and CodeAlpha frontend internship highlight our learning culture.</p>
          </section>
          <section id="certifications" className="card" style={{ marginBottom: '1.25rem', scrollMarginTop: 90 }}>
            <h2 style={{ color: '#00d4ff', marginTop: 0 }}>Certifications</h2>
            <ul style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
              <li>IBM — Python 101 for Data Science</li>
              <li>IBM — SQL and Relational Databases 101</li>
              <li>Invertis University — Power BI Dashboard Showdown</li>
              <li>CodeAlpha — Frontend Development Internship</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
