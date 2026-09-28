import { useSiteContent } from '../../context/SiteContentContext';
import Hero from '../../components/Hero/Hero';
import { Link } from 'react-router-dom';
import { SOLUTIONS as HOME_SOLUTIONS } from '../Solutions/Solutions';
const SERVICES = [
  { id: 'software', title: 'Custom Software', desc: 'Business software, portals and workflow systems built around your process.', icon: '💻' },
  { id: 'cloud', title: 'Cloud Solutions', desc: 'Cloud setup, migration, deployment, monitoring and production support.', icon: '☁️' },
  { id: 'ai', title: 'AI & Data', desc: 'AI assistants, analytics, dashboards and intelligent automation.', icon: '🤖' },
  { id: 'cyber', title: 'Cybersecurity', desc: 'Authentication, roles, secure uploads, validation and security-first deployment.', icon: '🔒' },
  { id: 'engineering', title: 'Digital Engineering', desc: 'APIs, microservices, full-stack engineering, testing and DevOps.', icon: '⚙️' },
  { id: 'consulting', title: 'IT Consulting', desc: 'Technology roadmaps, architecture, product planning and digital transformation.', icon: '🚀' },
  { id: 'application', title: 'Application Services', desc: 'Build, modernise and maintain web and business applications.', icon: '📱' },
  { id: 'experience', title: 'Experience Services', desc: 'Modern UX, responsive interfaces and customer journeys.', icon: '✨' },
  { id: 'digital-enterprise', title: 'Enterprise Apps', desc: 'ERP/CRM-style systems and business application integrations.', icon: '🏢' },
];

const QUICK_LINKS = [
  { to: '/solutions', icon: '🧩', title: 'Solutions', text: 'Business, cloud, AI, security, education and finance solutions.' },
  { to: '/technologies', icon: '🛠️', title: 'Technologies', text: 'Explore the stacks, platforms and tools used for delivery.' },
  { to: '/portfolio', icon: '🚀', title: 'Portfolio', text: 'See projects, case studies and product work.' },
  { to: '/products', icon: '📦', title: 'Products', text: 'Explore reusable digital products and modules.' },
  { to: '/client', icon: '👥', title: 'Client Portal', text: 'Client-facing dashboard and project communication tools.' },
  { to: '/crm', icon: '🤝', title: 'CRM', text: 'Manage leads, contacts, follow-ups and enquiries.' },
  { to: '/finance', icon: '💰', title: 'Finance', text: 'Finance, payroll and reporting tools.' },
  { to: '/support', icon: '🎫', title: 'Support', text: 'Get help, raise requests and find FAQs.' },
  { to: '/trust', icon: '🛡️', title: 'Trust & Security', text: 'Security, privacy, policies and trust information.' },
  { to: '/ai', icon: '✨', title: 'AI Features', text: 'Explore AI assistants and smart product features.' },
  { to: '/news', icon: '📰', title: 'News', text: 'Company updates, announcements and technology news.' },
  { to: '/careers/jobs', icon: '💼', title: 'Jobs', text: 'Find open positions and apply online.' },
  { to: '/careers/internship', icon: '🎓', title: 'Internships', text: 'Internship opportunities, certificates and career resources.' },
  { to: '/careers/resume-builder', icon: '📄', title: 'Resume Builder', text: 'Create a modern resume with education, marks and projects.' },
  { to: '/courses', icon: '📚', title: 'Courses', text: 'Explore learning and training opportunities.' },
  { to: '/contact', icon: '📩', title: 'Contact', text: 'Send an enquiry or request a proposal.' },
];

const whyUs = [
  { title: 'Fresh & Focused', text: 'Modern full-stack skills and attention from discovery through production support.' },
  { title: 'Quality Delivery', text: 'Clean code, clear communication and practical production-ready solutions.' },
  { title: 'Talent from India', text: 'We build opportunities for graduates, students and experienced professionals.' },
  { title: 'Rooted Locally', text: 'Based in Bareilly, UP, serving businesses and teams across India.' },
];

export default function Home() {
  const { content } = useSiteContent();
  const industries = content.industries?.items || [
    'Banking & Financial Services', 'Communications', 'Education', 'Energy & Utilities',
    'Healthcare & Life Sciences', 'Hi Tech', 'Insurance', 'Manufacturing',
    'Media & Entertainment', 'Oil & Gas', 'Retail & Consumer Goods',
    'Travel, Logistics & Hospitality', 'Automotive', 'Public Sector',
  ];
  const customBlocks = content.customBlocks || [];

  return (
    <div className="page-bg-home-root" style={{ background: "linear-gradient(180deg, rgba(2,6,23,0.55), rgba(2,6,23,0.88)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80') center top / cover fixed" }}>
      <Hero />

      <section className="section page-nature-1" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div className="container">
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(15,23,42,.96), rgba(7,30,55,.9))', borderColor: 'rgba(0,212,255,.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <div style={{ color: '#00d4ff', fontSize: '.78rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>Explore DS-TECHNOLOGIES</div>
                <h2 style={{ margin: '.35rem 0 .5rem', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>Everything is available from the home page</h2>
                <p style={{ color: '#94a3b8', margin: 0 }}>Services, solutions, products, portals, careers, AI, support and business tools — no hidden dead-end cards.</p>
              </div>
              <Link to="/services" className="btn btn-primary">Open full catalogue →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: '1.5rem' }}>
        <div className="container">
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(2,6,23,.98), rgba(8,35,62,.94))', borderColor: 'rgba(56,189,248,.25)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', gap:'1rem', alignItems:'center', flexWrap:'wrap' }}>
              <div><div style={{color:'#00d4ff',fontSize:'.75rem',fontWeight:800,letterSpacing:'.12em',textTransform:'uppercase'}}>Start here</div><h2 style={{margin:'.3rem 0'}}>All capabilities are open from the home page</h2><p style={{color:'#94a3b8',margin:0}}>No dead-end cards. Open any service or solution below to see its details and take action.</p></div>
              <Link to="/services" className="btn btn-primary">Open full services →</Link>
            </div>
          </div>
          <div style={{marginTop:'1.25rem'}}>
            <h2 className="section-title" style={{fontSize:'1.7rem'}}>All Services</h2>
            <div className="grid-3">
              {SERVICES.map((s) => <Link key={s.id} to={`/explore/services/${s.id}`} className="card" style={{display:'block',color:'inherit',padding:'1.1rem'}}>
                <div style={{display:'flex',justifyContent:'space-between',gap:'.5rem'}}><span style={{fontSize:'1.6rem'}}>{s.icon}</span><span style={{color:'#00d4ff',fontSize:'.72rem',fontWeight:800}}>OPEN →</span></div>
                <h3 style={{margin:'.6rem 0 .3rem',fontSize:'1rem'}}>{s.title}</h3><p style={{color:'#94a3b8',fontSize:'.82rem',lineHeight:1.5,margin:0}}>{s.text || s.desc}</p>
              </Link>)}
            </div>
          </div>
          <div style={{marginTop:'2.2rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',gap:'1rem',alignItems:'end',flexWrap:'wrap'}}><div><h2 className="section-title" style={{fontSize:'1.7rem'}}>All Solutions</h2><p className="section-subtitle" style={{margin:0}}>Business, enterprise, cloud, AI, education, healthcare and finance.</p></div><Link to="/solutions" className="btn btn-outline">View all solutions →</Link></div>
            <div className="grid-3" style={{marginTop:'1rem'}}>
              {HOME_SOLUTIONS.map((s) => <Link key={s.id} to={`/explore/solutions/${s.id}`} className="card" style={{display:'block',color:'inherit',padding:'1.1rem'}}><div style={{fontSize:'1.6rem'}}>{s.icon}</div><h3 style={{margin:'.6rem 0 .3rem',fontSize:'1rem'}}>{s.title}</h3><p style={{color:'#94a3b8',fontSize:'.82rem',margin:0,lineHeight:1.5}}>{s.text}</p></Link>)}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'rgba(0,0,0,.25)' }}>
        <div className="container">
          <h2 className="section-title">All Tools & Sections</h2>
          <p className="section-subtitle">Direct access to every public-facing section from one place.</p>
          <div className="grid-3">
            {QUICK_LINKS.map((item) => (
              <Link to={item.to} className="card" key={item.to} style={{ display: 'block', color: 'inherit' }}>
                <div style={{ fontSize: '1.8rem' }}>{item.icon}</div>
                <h3 style={{ margin: '.7rem 0 .35rem' }}>{item.title}</h3>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '.92rem' }}>{item.text}</p>
                <div style={{ marginTop: '1rem', color: '#38bdf8', fontWeight: 700, fontSize: '.85rem' }}>Open {item.title} →</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Industries</h2>
          <p className="section-subtitle">Choose a sector to jump directly to its details.</p>
          <div className="grid-3">
            {[...new Set(industries)].map((title, index) => {
              const ids = ['banking','communications','education','energy','healthcare','technology','insurance','manufacturing','media','oilgas','retail','logistics','automotive','publicsector'];
              return <Link to={`/explore/industries/${ids[index] || 'technology'}`} className="card" key={title} style={{ display: 'block' }}><h3>{title}</h3><p style={{ color: '#64748b', margin: '.5rem 0 0' }}>Explore industry fit →</p></Link>;
            })}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'rgba(0,0,0,.25)' }}>
        <div className="container">
          <h2 className="section-title">Why DS-TECHNOLOGIES</h2>
          <p className="section-subtitle">What makes us different as a new-age IT company.</p>
          <div className="grid-2">
            {whyUs.map((item) => <div className="card" key={item.title}><h3 style={{ marginBottom: '.5rem' }}>{item.title}</h3><p style={{ color: '#94a3b8' }}>{item.text}</p></div>)}
          </div>
        </div>
      </section>

      {customBlocks.length > 0 && (
        <section className="section"><div className="container"><h2 className="section-title">Updates</h2><div className="grid-2">{customBlocks.map((b) => <div className="card" key={b.id || b.title}><h3>{b.title}</h3><p style={{ color: '#94a3b8', whiteSpace: 'pre-wrap' }}>{b.body}</p></div>)}</div></div></section>
      )}

      <section className="section">
        <div className="container">
          <h2 className="section-title">What Clients Say</h2>
          <p className="section-subtitle">Trusted by local businesses, institutes and startups.</p>
          <div className="grid-2">
            <div className="card">
              <div style={{ color: '#f59e0b', marginBottom: '0.5rem' }}>★★★★★</div>
              <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>“DS-TECHNOLOGIES built our complete inventory and billing system. Clean, easy-to-use and delivered on time.”</p>
              <div style={{ fontWeight: 600 }}>Rahul Sharma</div>
              <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Founder · Retail Chain</div>
            </div>
            <div className="card">
              <div style={{ color: '#f59e0b', marginBottom: '0.5rem' }}>★★★★★</div>
              <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>“Internship & job portal with resume tracking — exactly what we needed for our institute.”</p>
              <div style={{ fontWeight: 600 }}>Priya Verma</div>
              <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>HR Manager · Education</div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to="/testimonials" className="btn btn-outline">View All Testimonials</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'rgba(0,0,0,.2)' }}>
        <div className="container">
          <h2 className="section-title">Quick Answers</h2>
          <p className="section-subtitle">Common questions about projects, pricing and careers.</p>
          <div className="grid-2">
            <div className="card">
              <h3 style={{ marginBottom: '0.5rem' }}>How long does a project take?</h3>
              <p style={{ color: '#94a3b8' }}>A basic website usually takes 1–3 weeks. Custom portals and HR systems typically take 4–10 weeks depending on scope.</p>
            </div>
            <div className="card">
              <h3 style={{ marginBottom: '0.5rem' }}>Do you offer internships?</h3>
              <p style={{ color: '#94a3b8' }}>Yes. Practical internships with real modules, mentorship and certificates on successful completion.</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/faq" className="btn btn-outline">Full FAQ</Link>
            <Link to="/pricing" className="btn btn-outline">View Pricing</Link>
            <Link to="/case-studies" className="btn btn-outline">Case Studies</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'rgba(0,102,255,.08)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Ready to Build Something Great?</h2>
          <p className="section-subtitle" style={{ margin: '0 auto 2rem' }}>From company websites and MERN portals to HR systems, internships and data dashboards — DS-TECHNOLOGIES delivers practical software with clear communication and long-term support.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary">Let’s Connect</Link>
            <Link to="/careers" className="btn btn-outline">Join Our Team</Link>
            <Link to="/about" className="btn btn-outline">Who We Are</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
