import { useSiteContent } from '../../context/SiteContentContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const EXPLORE = [
  {
    title: 'Why join DS-TECHNOLOGIES',
    to: '#why-join',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&q=80',
  },
  {
    title: 'Life at DS',
    to: '#life',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80',
  },
  {
    title: 'Career paths',
    to: '#paths',
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=700&q=80',
  },
  {
    title: 'Meet our people',
    to: '#people',
    img: '/images/team/divyanshu-gangwar.jpg',
  },
  {
    title: 'Diversity & inclusion',
    to: '#diversity',
    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&q=80',
  },
  {
    title: 'Students & graduates',
    to: '#students',
    img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700&q=80',
  },
];

const PATHS = [
  {
    title: 'Students and graduates',
    img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&q=80',
    text: 'Internships, trainee roles and first jobs for BCA, MCA, B.Tech, B.Com, BBA, diploma and related streams. Structured mentoring, real projects and company-branded internship certificates. You learn by building — not only by watching slides.',
  },
  {
    title: 'Experienced professionals',
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&q=80',
    text: 'Software engineers, team leads, HR, operations and domain specialists who want ownership on real client and product work. Clear growth from Senior → Lead → Manager with visible impact on delivery and people.',
  },
  {
    title: 'Executives & leadership',
    img: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=500&q=80',
    text: 'Managers and CXO-track contributors who shape delivery, hiring and growth for a young technology company. Leadership is hands-on: clients, quality and culture together.',
  },
  {
    title: 'Our professions',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80',
    text: 'Software Development · Web & Mobile · Cloud · Data & AI · Cyber Security · QA · HR · Finance · Sales · Support · Design · Internships across all streams.',
  },
];

const CONNECT = [
  {
    title: 'Our offices',
    img: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=500&q=80',
    text: 'HQ: Village Kuiya Rampur, Post Kakra Kalan, Faridpur, Bareilly, Uttar Pradesh 243503. Hybrid and remote options for many roles across India.',
  },
  {
    title: 'Campus activities',
    img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&q=80',
    text: 'College drives, workshops and internship programmes with Invertis and regional institutions — focused on employable skills and real portfolios.',
  },
  {
    title: 'Career events',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80',
    text: 'Walk-ins, virtual interviews and hiring sprints announced on Careers, WhatsApp and social channels. Stay connected for the next cohort.',
  },
];

const JOIN_STEPS = [
  { title: 'Job search', text: 'Browse 1000+ catalogue roles by department, course, type and location on Job search.' },
  { title: 'Application', text: 'Submit form with education, skills, resume and preferred role. Course selection is mandatory.' },
  { title: 'Review & shortlist', text: 'HR reviews applications and shortlists matching profiles for interview.' },
  { title: 'Interview', text: 'Technical / HR rounds — online or in Bareilly. Be ready with projects and honesty about skills.' },
  { title: 'Offer letter', text: 'Selected candidates receive offer with CTC/stipend, joining date and terms.' },
  { title: 'Onboarding', text: 'Documents, joining form, employee ID and portal login for attendance, leave and salary.' },
];

const PLATFORM = [
  { title: 'Dashboard', hi: 'डैशबोर्ड', desc: 'Overview of jobs, applications, employees, attendance, contacts and quick actions for leadership.' },
  { title: 'Employee Management', hi: 'कर्मचारी मैनेजमेंट', desc: 'Add, edit, replace employees; departments, designations, salaries and status — role-based access.' },
  { title: 'Project Tracking', hi: 'प्रोजेक्ट मैनेजमेंट', desc: 'Tasks, deadlines and ownership so delivery stays visible to managers and teams.' },
  { title: 'Client CRM', hi: 'क्लाइंट मैनेजमेंट', desc: 'Track client conversations, requirements and follow-ups from enquiry to delivery.' },
  { title: 'Finance & Invoices', hi: 'बिल और सैलरी', desc: 'Payroll, salary slips, deductions, payments and company treasury (CEO-controlled).' },
  { title: 'Web Leads', hi: 'वेबसाइट से आई पूछताछ', desc: 'Contact form messages and career enquiries captured for HR and sales follow-up.' },
  { title: 'Support Tickets', hi: 'क्लाइंट / कर्मचारी शिकायतें', desc: 'IT, HR, salary and leave tickets with status tracking for employees and admins.' },
  { title: 'System Settings', hi: 'वेबसाइट और पासवर्ड सेटिंग्स', desc: 'Company profile, social links, security, roles & permissions and password history.' },
];

export default function Careers() {
  const { content } = useSiteContent();
  const [q, setQ] = useState('');
  const ch = content.careers || {};

  return (
    <div className="page-bg-careers">
      <section
        style={{
          position: 'relative',
          minHeight: 420,
          display: 'flex',
          alignItems: 'center',
          background:
            'linear-gradient(105deg, rgba(10,15,28,0.88) 0%, rgba(10,15,28,0.45) 55%, rgba(10,15,28,0.2) 100%), url(https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1600&q=80) center/cover',
        }}
      >
        <div className="container" style={{ padding: '3rem 1rem' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: 8 }}>Home / Careers</p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 700, color: '#fff', lineHeight: 1.15, margin: '0 0 0.75rem' }}>
            {ch.heroTitle || 'Your next role. Make it real.'}
          </h1>
          <p style={{ color: '#cbd5e1', maxWidth: 480, marginBottom: '1.25rem' }}>
            {ch.heroSubtitle || 'Explore open jobs and internships at DS-TECHNOLOGIES.'}
          </p>
          <Link to="/careers/jobs" style={{ color: '#00d4ff', fontWeight: 600, textDecoration: 'none' }}>
            Explore all jobs →
          </Link>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/careers/jobs${q ? `?q=${encodeURIComponent(q)}` : ''}`;
            }}
            style={{
              marginTop: '1.5rem',
              display: 'flex',
              maxWidth: 480,
              background: 'rgba(15,23,42,0.95)',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.12)',
              overflow: 'hidden',
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search jobs by location, profession or keywords"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#e2e8f0',
                padding: '0.85rem 1.25rem',
                outline: 'none',
                fontSize: '0.95rem',
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ borderRadius: 999, margin: 4, padding: '0.55rem 1.25rem' }}>
              →
            </button>
          </form>
        </div>
      </section>

      <div className="section">
        <div className="container" style={{ maxWidth: 1000 }}>
          <div id="why-join" className="card" style={{ marginBottom: '2rem', scrollMarginTop: 90 }}>
            <h2 style={{ color: '#e2e8f0', marginTop: 0 }}>What's next?</h2>
            <p style={{ color: '#cbd5e1', lineHeight: 1.75, fontSize: '1.02rem' }}>
              Helping clients grow with reliable software is a real challenge. When you join DS-TECHNOLOGIES, you join a
              young technology company of builders and problem-solvers driven to use technology to reimagine what is
              possible — and make it real.
            </p>
            <p style={{ color: '#cbd5e1', lineHeight: 1.75 }}>
              Together we deliver projects for businesses across industries while building careers for interns,
              engineers, HR and operations talent in Bareilly and beyond.
            </p>
          </div>

          <h2 style={{ color: '#e2e8f0', marginBottom: '1rem' }}>Explore DS-TECHNOLOGIES</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '0.85rem',
              marginBottom: '2.5rem',
            }}
          >
            {EXPLORE.map((item) => (
              <a
                key={item.title}
                href={item.to}
                style={{
                  position: 'relative',
                  display: 'block',
                  minHeight: 160,
                  borderRadius: 12,
                  overflow: 'hidden',
                  textDecoration: 'none',
                  background: '#0f172a',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <img
                  src={item.img}
                  alt=""
                  style={{ width: '100%', height: 160, objectFit: 'cover', opacity: 0.55 }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(transparent 30%, rgba(0,0,0,0.85))',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '1rem',
                  }}
                >
                  <span style={{ color: '#fff', fontWeight: 600 }}>
                    {item.title} <span style={{ color: '#00d4ff' }}>→</span>
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Why join — long */}
          <div id="why-join-detail" className="card" style={{ marginBottom: '1.25rem', scrollMarginTop: 90 }}>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&q=80"
              alt="Team collaboration"
              style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 12, marginBottom: '1rem' }}
            />
            <h2 style={{ color: '#00d4ff', marginTop: 0 }}>Why join DS-TECHNOLOGIES</h2>
            <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
              We are not a place where resumes disappear into a black box. From day one you see a clear pipeline:
              application → review → interview → offer → onboarding → employee portal. That transparency is part of our
              product culture — the same systems we build for clients, we use ourselves.
            </p>
            <ul style={{ color: '#cbd5e1', lineHeight: 1.9 }}>
              <li>Real projects — software, web, cloud and internal HR platforms</li>
              <li>Mentorship from founders and managers, not only peers</li>
              <li>Internships with certificates and full-time conversion paths</li>
              <li>Open to BCA, MCA, B.Tech, B.Com, BBA, diplomas and related streams</li>
              <li>Hybrid options and Bareilly-based collaboration</li>
              <li>Growth path: Intern → Junior → Engineer → Senior → Lead → Manager</li>
            </ul>
          </div>

          {/* Life — long */}
          <div id="life" className="card" style={{ marginBottom: '1.25rem', scrollMarginTop: 90 }}>
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&q=80"
              alt="Workplace"
              style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 12, marginBottom: '1rem' }}
            />
            <h2 style={{ color: '#00d4ff', marginTop: 0 }}>Life at DS</h2>
            <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
              Learning culture, real ownership and tools we also ship to clients — attendance, leave, payroll slips,
              offers and onboarding. Hybrid-friendly where the role allows. You will use the employee portal for daily
              work: check-in/out, leave requests, salary slips and notices.
            </p>
            <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
              Communication is direct. Managers are reachable. Mistakes are treated as learning moments when intent is
              honest. We care about delivery quality and about people finishing the week proud of what they shipped.
            </p>
          </div>

          {/* Career paths */}
          <div id="paths" style={{ marginBottom: '2rem', scrollMarginTop: 90 }}>
            <h2 style={{ color: '#e2e8f0' }}>Career paths</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
              {PATHS.map((p) => (
                <div key={p.title} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <img src={p.img} alt="" style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ color: '#38bdf8', marginTop: 0, fontSize: '1.05rem' }}>{p.title}</h3>
                    <p style={{ color: '#cbd5e1', margin: 0, lineHeight: 1.65, fontSize: '0.92rem' }}>{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meet our people — ONLY photo + link to About founder (no full bio here) */}
          <div id="people" className="card" style={{ marginBottom: '1.25rem', scrollMarginTop: 90, textAlign: 'center' }}>
            <h2 style={{ color: '#00d4ff', marginTop: 0 }}>Meet our people</h2>
            <p style={{ color: '#94a3b8', maxWidth: 560, margin: '0 auto 1.25rem', lineHeight: 1.65 }}>
              Leadership includes Founder & CEO, Co-Founder, managers and HR. Full profiles and organisation structure
              live on the About page.
            </p>
            <div
              style={{
                display: 'inline-block',
                background: 'rgba(15,23,42,0.8)',
                borderRadius: 16,
                padding: '1rem',
                border: '1px solid rgba(255,255,255,0.1)',
                maxWidth: 280,
              }}
            >
              <img
                src="/images/team/divyanshu-gangwar.jpg"
                alt="Divyanshu Gangwar"
                style={{
                  width: 200,
                  height: 240,
                  objectFit: 'cover',
                  borderRadius: 12,
                  border: '2px solid rgba(0,212,255,0.35)',
                }}
              />
              <p style={{ margin: '0.75rem 0 0.15rem', color: '#e2e8f0', fontWeight: 600 }}>Divyanshu Gangwar</p>
              <p style={{ margin: 0, color: '#00d4ff', fontSize: '0.9rem' }}>Founder & CEO</p>
              <Link
                to="/about#founder"
                className="btn btn-primary"
                style={{ display: 'inline-block', marginTop: '0.85rem', fontSize: '0.85rem' }}
              >
                View full founder profile →
              </Link>
            </div>
            <p style={{ marginTop: '1rem' }}>
              <Link to="/about#leadership" style={{ color: '#00d4ff' }}>
                Full leadership team on About →
              </Link>
            </p>
          </div>

          {/* Students */}
          <div id="students" className="card" style={{ marginBottom: '1.25rem', scrollMarginTop: 90 }}>
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&q=80"
              alt="Students"
              style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 12, marginBottom: '1rem' }}
            />
            <h2 style={{ color: '#00d4ff', marginTop: 0 }}>Students and graduates</h2>
            <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
              Internship opportunities with company certificates, campus-friendly hiring and entry roles for technology,
              commerce, science, medical-related support tracks and related courses. Build a portfolio with real tasks,
              guided reviews and a formal certificate you can share with colleges and employers.
            </p>
            <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
              See{' '}
              <Link to="/careers/internship" style={{ color: '#00d4ff' }}>
                Internship certificate
              </Link>
              ,{' '}
              <Link to="/courses" style={{ color: '#00d4ff' }}>
                Courses
              </Link>{' '}
              and{' '}
              <Link to="/careers/jobs?q=Intern" style={{ color: '#00d4ff' }}>
                Internship jobs
              </Link>
              .
            </p>
          </div>

          {/* Diversity */}
          <div id="diversity" className="card" style={{ marginBottom: '1.25rem', scrollMarginTop: 90 }}>
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1000&q=80"
              alt="Inclusion"
              style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 12, marginBottom: '1rem' }}
            />
            <h2 style={{ color: '#00d4ff', marginTop: 0 }}>Diversity and inclusion</h2>
            <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
              We hire talent across gender and educational backgrounds. Roles are open to everyone from all listed course
              streams. Selection is based on skills, attitude and role fit — not on privilege or bias.
            </p>
            <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
              First-generation graduates and candidates from smaller cities are especially welcome. Our founding story is
              rooted in creating opportunities where traditional hiring often overlooks strong talent.
            </p>
          </div>

          {/* Platform modules */}
          <div id="platform" style={{ marginBottom: '2rem', scrollMarginTop: 90 }}>
            <h2 style={{ color: '#e2e8f0' }}>Our internal platform modules</h2>
            <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
              DS-TECHNOLOGIES runs on the same kind of systems we build for clients — accessible via Admin / Employee
              login.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.85rem' }}>
              {PLATFORM.map((m) => (
                <div key={m.title} className="card">
                  <h3 style={{ margin: '0 0 0.25rem', color: '#38bdf8', fontSize: '1rem' }}>{m.title}</h3>
                  <p style={{ margin: '0 0 0.5rem', color: '#64748b', fontSize: '0.8rem' }}>{m.hi}</p>
                  <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.55 }}>{m.desc}</p>
                </div>
              ))}
            </div>
            <p style={{ marginTop: '1rem' }}>
              <Link to="/login" className="btn btn-outline" style={{ marginRight: 8 }}>
                Employee / Admin login
              </Link>
              <Link to="/admin" className="btn btn-primary">
                Admin dashboard
              </Link>
            </p>
          </div>

          <h2 style={{ color: '#e2e8f0' }}>Let's connect</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {CONNECT.map((c) => (
              <div key={c.title} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <img src={c.img} alt="" style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ color: '#38bdf8', marginTop: 0 }}>{c.title}</h3>
                  <p style={{ color: '#cbd5e1', margin: 0, lineHeight: 1.65, fontSize: '0.92rem' }}>{c.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div id="join" style={{ scrollMarginTop: 90 }}>
            <h2 style={{ color: '#e2e8f0' }}>Join us — recruitment process</h2>
            <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
              Interview tips: prepare your projects, be honest about skills, keep resume + certificates ready. We never
              ask candidates for money.
            </p>
            <div style={{ display: 'grid', gap: '0.65rem', marginBottom: '1.5rem' }}>
              {JOIN_STEPS.map((s, i) => (
                <div
                  key={s.title}
                  className="card"
                  style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '0.9rem 1.1rem' }}
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'rgba(0,212,255,0.15)',
                      color: '#00d4ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <strong style={{ color: '#e2e8f0' }}>{s.title}</strong>
                    <p style={{ margin: '0.25rem 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg,#0c4a6e,#0f172a)' }}>
            <h2 style={{ marginTop: 0, color: '#fff' }}>Make it real with DS-TECHNOLOGIES</h2>
            <p style={{ color: '#cbd5e1' }}>Browse jobs or start your internship journey today.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/careers/jobs" className="btn btn-primary">
                Job search (1000+)
              </Link>
              <Link to="/careers/internship" className="btn btn-outline">
                Internship
              </Link>
              <Link to="/about#founder" className="btn btn-outline">
                Founder profile
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Contact HR
              </Link>
            </div>
            <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.8rem' }}>
              Official: divyanshugangwar950@gmail.com · 7895733906 · 7454910637
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
