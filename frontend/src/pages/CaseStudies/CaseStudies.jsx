import { Link } from 'react-router-dom';

const CASES = [
  {
    id: 'inventory-billing',
    title: 'Inventory & Billing System for Retail Chain',
    industry: 'Retail',
    challenge: 'Manual stock tracking and billing was causing frequent errors and time loss.',
    solution: 'Built a custom web-based inventory + GST billing system with role-based access, stock alerts and daily reports.',
    results: ['70% reduction in billing time', 'Real-time stock visibility', 'Easy GST-ready invoices'],
    tech: ['React', 'Node.js', 'MongoDB', 'PDF generation'],
  },
  {
    id: 'internship-portal',
    title: 'Internship & Job Application Portal',
    industry: 'Education / HR',
    challenge: 'College and company needed a single place to collect applications, resumes and track status.',
    solution: 'Full career portal with job listings, online application form, resume upload, admin dashboard and status tracking.',
    results: ['500+ applications managed', 'Faster shortlisting', 'Professional candidate experience'],
    tech: ['MERN Stack', 'File Upload', 'Email notifications'],
  },
  {
    id: 'hr-attendance',
    title: 'HR Attendance & Leave Management',
    industry: 'Manufacturing',
    challenge: 'Paper-based attendance and leave registers were hard to manage and audit.',
    solution: 'Digital attendance marking, leave application workflow, approval system and monthly reports for HR.',
    results: ['Paperless HR process', 'Accurate monthly reports', 'Transparent leave balance'],
    tech: ['React', 'Express', 'MongoDB', 'Role-based access'],
  },
  {
    id: 'college-website',
    title: 'Modern College Website + Enquiry System',
    industry: 'Education',
    challenge: 'Old static website was not mobile-friendly and enquiry management was manual.',
    solution: 'Responsive college website with course pages, admission enquiry form, admin panel and basic CMS.',
    results: ['Mobile-first experience', 'Organised enquiry tracking', 'Better online presence'],
    tech: ['React', 'Node.js', 'Responsive design'],
  },
  {
    id: 'crm-enquiry',
    title: 'CRM-style Enquiry & Follow-up System',
    industry: 'Services',
    challenge: 'Leads from website and WhatsApp were getting lost; no follow-up history.',
    solution: 'Simple CRM to capture leads, assign to team, set follow-up reminders and track conversion.',
    results: ['No lost leads', 'Clear follow-up history', 'Higher conversion rate'],
    tech: ['React', 'Node.js', 'MongoDB'],
  },
  {
    id: 'dashboard-analytics',
    title: 'Business Dashboard & Reports',
    industry: 'Multiple',
    challenge: 'Owners needed daily/weekly business numbers without opening multiple Excel files.',
    solution: 'Custom dashboard showing key metrics, charts and downloadable reports.',
    results: ['Single source of truth', 'Faster decision making', 'Export-ready reports'],
    tech: ['React', 'Charts', 'REST APIs'],
  },
];

export default function CaseStudies() {
  return (
    <div>
      <section className="section" style={{ paddingTop: '7rem', background: 'linear-gradient(180deg, rgba(0,102,255,0.12), transparent)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 className="section-title">Case Studies</h1>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Real projects delivered by DS-TECHNOLOGIES — from problem to practical digital solution.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {CASES.map((c, idx) => (
              <div className="card" key={c.id} style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{
                      display: 'inline-block', background: 'rgba(0,102,255,0.15)', color: '#60a5fa',
                      padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem'
                    }}>{c.industry}</span>
                    <h2 style={{ fontSize: '1.5rem', margin: '0.5rem 0' }}>{c.title}</h2>
                  </div>
                  <div style={{ color: '#64748b', fontWeight: 600 }}>Case #{idx + 1}</div>
                </div>

                <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '1.25rem' }}>
                  <div>
                    <h4 style={{ color: '#f87171', marginBottom: '0.4rem' }}>Challenge</h4>
                    <p style={{ color: '#94a3b8' }}>{c.challenge}</p>
                  </div>
                  <div>
                    <h4 style={{ color: '#34d399', marginBottom: '0.4rem' }}>Solution</h4>
                    <p style={{ color: '#94a3b8' }}>{c.solution}</p>
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <h4 style={{ color: '#60a5fa', marginBottom: '0.5rem' }}>Results</h4>
                  <ul style={{ color: '#cbd5e1', paddingLeft: '1.2rem' }}>
                    {c.results.map((r) => <li key={r} style={{ marginBottom: '0.3rem' }}>{r}</li>)}
                  </ul>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {c.tech.map((t) => (
                    <span key={t} style={{
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      padding: '0.25rem 0.7rem', borderRadius: 6, fontSize: '0.8rem', color: '#94a3b8'
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'rgba(0,102,255,0.08)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Have a similar challenge?</h2>
          <p className="section-subtitle" style={{ margin: '0 auto 2rem' }}>We can design a practical solution for your business process.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary">Discuss Your Project</Link>
            <Link to="/portfolio" className="btn btn-outline">View Portfolio</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
