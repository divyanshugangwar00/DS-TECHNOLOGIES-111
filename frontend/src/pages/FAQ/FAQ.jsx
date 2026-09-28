import { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ_DATA = [
  {
    category: 'General',
    items: [
      { q: 'What does DS-TECHNOLOGIES do?', a: 'We build custom software, company websites, career/job portals, HR & attendance systems, CRM-style tools and digital solutions for businesses, colleges and startups — mainly using modern web technologies (MERN stack).' },
      { q: 'Where is DS-TECHNOLOGIES based?', a: 'We are based in Bareilly, Uttar Pradesh (Village Kuiya Rampur, Faridpur). We work with clients locally and remotely.' },
      { q: 'Do you work with clients outside Bareilly?', a: 'Yes. We take remote projects across India as long as requirements and communication are clear.' },
    ],
  },
  {
    category: 'Services & Projects',
    items: [
      { q: 'What kind of projects do you take?', a: 'Company websites, business portals, internship/job application systems, attendance & leave modules, enquiry/CRM tools, dashboards, and custom web applications.' },
      { q: 'How long does a typical project take?', a: 'A basic company website can take 1–3 weeks. A full portal or HR system usually takes 4–10 weeks depending on features and feedback cycles.' },
      { q: 'Do you provide support after delivery?', a: 'Yes. We offer post-delivery support, bug fixes and small improvements. Ongoing maintenance packages can also be arranged.' },
      { q: 'Can you modify or upgrade an existing system?', a: 'Yes, if the existing codebase is accessible and documented enough for us to work on it safely.' },
    ],
  },
  {
    category: 'Careers & Internship',
    items: [
      { q: 'Do you offer internships?', a: 'Yes. We offer practical internships where interns work on real modules (MERN, portals, dashboards) under guidance. Certificates are provided on successful completion.' },
      { q: 'How can I apply for a job or internship?', a: 'Go to the Careers section, choose Internship or Jobs, fill the application form and upload your resume. You can also use our Resume Builder tool.' },
      { q: 'Is the internship paid?', a: 'This depends on the role, duration and performance. Details are shared during the selection process.' },
    ],
  },
  {
    category: 'Pricing & Process',
    items: [
      { q: 'How is pricing decided?', a: 'Pricing depends on scope (number of pages/modules), design complexity, integrations and timeline. We share a clear estimate after understanding requirements.' },
      { q: 'Do you take advance payment?', a: 'Yes. Usually a partial advance is taken to start the project, with remaining amount linked to milestones or final delivery.' },
      { q: 'Will I own the source code?', a: 'Yes, after full payment the agreed source code and project files are handed over as per the agreement.' },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
      marginBottom: '0.75rem', overflow: 'hidden', background: 'var(--dark-2)'
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', textAlign: 'left', padding: '1.1rem 1.25rem',
          background: 'transparent', color: 'white', fontSize: '1.05rem', fontWeight: 600,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem'
        }}
      >
        <span>{q}</span>
        <span style={{ fontSize: '1.4rem', color: '#60a5fa', flexShrink: 0 }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div style={{ padding: '0 1.25rem 1.25rem', color: '#94a3b8', lineHeight: 1.7 }}>
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <div>
      <section className="section" style={{ paddingTop: '7rem', background: 'linear-gradient(180deg, rgba(0,102,255,0.12), transparent)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 className="section-title">Frequently Asked Questions</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Quick answers about our services, process, careers and how we work.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          {FAQ_DATA.map((group) => (
            <div key={group.category} style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#60a5fa' }}>{group.category}</h2>
              {group.items.map((item) => <FAQItem key={item.q} q={item.q} a={item.a} />)}
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ background: 'rgba(0,102,255,0.08)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Still have questions?</h2>
          <p className="section-subtitle" style={{ margin: '0 auto 2rem' }}>We are happy to clarify anything about projects, internships or partnership.</p>
          <Link to="/contact" className="btn btn-primary">Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
