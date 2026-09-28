import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const MEGA = {
  insights: {
    title: 'Insights',
    blurb: 'Thought leadership, ideas and insights shaping business and technology.',
    columns: [
      {
        links: [
          { to: '/explore/insights/hot-topics', label: 'Hot topics' },
          { to: '/explore/insights/ai-future', label: 'Reshape your future with AI' },
          { to: '/explore/insights/sustainability', label: 'Leading sustainability' },
          { to: '/explore/insights/research', label: 'Our research library' },
          { to: '/explore/insights/experts', label: 'Expert perspectives' },
        ],
      },
      {
        links: [
          { to: '/explore/insights/tech-future', label: 'The future of technology' },
          { to: '/explore/insights/customer-cx', label: 'Marketing & customer experience' },
          { to: '/explore/insights/careers-insight', label: 'Career & skills insights' },
          { to: '/news', label: 'News & press' },
        ],
      },
    ],
    side: { title: 'DS Research', text: 'Practical insights for SMEs & enterprises in India' },
  },
  industries: {
    title: 'Industries',
    blurb: 'Deep domain expertise across the sectors that power growth — like global IT leaders, built for India-first delivery.',
    columns: [
      {
        links: [
          { to: '/explore/industries/banking', label: 'Banking & Financial Services' },
          { to: '/explore/industries/communications', label: 'Communications' },
          { to: '/explore/industries/education', label: 'Education' },
          { to: '/explore/industries/energy', label: 'Energy & Utilities' },
          { to: '/explore/industries/healthcare', label: 'Healthcare & Life Sciences' },
          { to: '/explore/industries/technology', label: 'Hi Tech / High Technology' },
          { to: '/explore/industries/insurance', label: 'Insurance' },
          { to: '/explore/industries/aerospace', label: 'Aerospace & Defense' },
          { to: '/explore/industries/agriculture', label: 'Agriculture' },
          { to: '/explore/industries/automotive', label: 'Automotive' },
        ],
      },
      {
        links: [
          { to: '/explore/industries/manufacturing', label: 'Manufacturing' },
          { to: '/explore/industries/media', label: 'Media & Entertainment' },
          { to: '/explore/industries/oilgas', label: 'Oil & Gas' },
          { to: '/explore/industries/privateequity', label: 'Private Equity' },
          { to: '/explore/industries/professionalservices', label: 'Professional Services' },
          { to: '/explore/industries/retail', label: 'Retail & Consumer Goods' },
          { to: '/explore/industries/logistics', label: 'Travel, Transportation, Logistics & Hospitality' },
          { to: '/explore/industries/chemical', label: 'Chemical Manufacturing' },
          { to: '/explore/industries/publicsector', label: 'Public Sector / Government' },
          { to: '/explore/industries/mining', label: 'Mining' },
        ],
      },
      {
        links: [
          { to: '/explore/industries/semiconductor', label: 'Semiconductor' },
          { to: '/explore/industries/utilities', label: 'Utilities' },
          { to: '/explore/industries/waste', label: 'Waste Management' },
          { to: '/explore/industries/lifesciences', label: 'Life Sciences' },
          { to: '/explore/industries/infoservices', label: 'Information Services & Publishing' },
          { to: '/explore/industries/epc', label: 'Engineering Procurement & Construction' },
          { to: '/explore/industries/cpg', label: 'Consumer Packaged Goods' },
          { to: '/explore/industries/realestate', label: 'Real Estate' },
          { to: '/explore/industries/hospitality', label: 'Hospitality & Travel' },
          { to: '/industries', label: 'View all industries →' },
        ],
      },
    ],
    side: { title: 'Featured', text: 'Industry playbooks · Bareilly HQ · Digital solutions for every vertical' },
  },
  services: {
    title: 'Services',
    blurb: 'Full-stack capabilities — consulting, engineering, cloud, AI, platforms and experience services.',
    columns: [
      {
        links: [
          { to: '/explore/services/consulting', label: 'DS Consulting' },
          { to: '/explore/services/application', label: 'Application Services' },
          { to: '/explore/services/automation', label: 'Intelligent Automation' },
          { to: '/explore/services/testing', label: 'Testing Services' },
          { to: '/explore/services/performance', label: 'Performance Engineering' },
          { to: '/explore/services/cloud', label: 'Cloud & Infrastructure' },
          { to: '/explore/services/cloud-consulting', label: 'Cloud Consulting' },
          { to: '/explore/services/network', label: 'Network Services' },
          { to: '/explore/services/cyber', label: 'Cyber Security' },
        ],
      },
      {
        links: [
          { to: '/explore/services/engineering', label: 'Engineering Services' },
          { to: '/explore/services/analytics', label: 'Data Analytics' },
          { to: '/explore/services/ai', label: 'Artificial Intelligence' },
          { to: '/explore/services/digital-enterprise', label: 'Digital Enterprise Applications' },
          { to: '/explore/services/microsoft', label: 'Microsoft Business Applications' },
          { to: '/explore/services/sap', label: 'SAP' },
          { to: '/explore/services/oracle', label: 'Oracle' },
          { to: '/explore/services/salesforce', label: 'Salesforce' },
          { to: '/explore/services/pega', label: 'Pega / BPM' },
        ],
      },
      {
        links: [
          { to: '/explore/services/bps', label: 'Business Process Services' },
          { to: '/explore/services/experience', label: 'Experience Services' },
          { to: '/explore/services/integrated', label: 'Integrated Offerings' },
          { to: '/explore/services/sustainability', label: 'Sustainability Services' },
          { to: '/explore/services/software', label: 'Custom Software Development' },
          { to: '/explore/services/web', label: 'Web & Mobile Apps' },
          { to: '/explore/services/devops', label: 'DevOps & CI/CD' },
          { to: '/explore/services/platforms', label: 'Products & Platforms' },
          { to: '/services', label: 'View all services →' },
        ],
      },
    ],
    side: { title: 'Spotlight', text: 'Scale with DS · AI delivered right · Innovation lab' },
  },
  careers: {
    title: 'Careers',
    blurb: 'Become part of builders and free-thinkers — help clients grow with technology.',
    columns: [
      {
        links: [
          { to: '/careers#why-join', label: 'Why join DS-TECHNOLOGIES' },
          { to: '/careers#life', label: 'Life at DS' },
          { to: '/about#leadership', label: 'Meet our people' },
          { to: '/careers#paths', label: 'Career paths' },
          { to: '/careers#students', label: 'Students and graduates' },
          { to: '/careers#diversity', label: 'Diversity and inclusion' },
        ],
      },
      {
        links: [
          { to: '/careers#paths', label: 'Experienced professionals' },
          { to: '/careers#join', label: 'Recruitment process' },
          { to: '/careers#join', label: 'Interview tips' },
          { to: '/careers/jobs', label: 'Job search' },
          { to: '/careers/internship', label: 'Internships & certificates' },
          { to: '/contact', label: "Let's connect" },
        ],
      },
    ],
    side: { title: 'Hiring now', text: 'Open roles · Interns · Developers · HR · Bareilly & hybrid' },
  },
  about: {
    title: 'About us',
    blurb: 'Corporate overview, leadership, brand, citizenship and how we work with clients.',
    columns: [
      {
        links: [
          { to: '/about#overview', label: 'Corporate Overview' },
          { to: '/about#leadership', label: 'Leadership' },
          { to: '/about#founder', label: 'Founder & CEO — Divyanshu' },
          { to: '/about#brand', label: 'Our Brand' },
          { to: '/about#sustainability', label: 'Sustainability' },
          { to: '/about#recognition', label: 'Recognition' },
          { to: '/about#customers', label: 'Customer Speak' },
          { to: '/about#partners', label: 'Partners Ecosystem' },
        ],
      },
      {
        links: [
          { to: '/team', label: 'Our Team' },
          { to: '/testimonials', label: 'Testimonials' },
          { to: '/case-studies', label: 'Case Studies' },
          { to: '/pricing', label: 'Pricing' },
          { to: '/faq', label: 'FAQ' },
          { to: '/news', label: 'News' },
          { to: '/contact', label: 'Contact Us' },
        ],
      },
    ],
    side: { title: 'Our Promise', text: 'Scale at Speed · AI Delivered Right · Bareilly HQ' },
  },
  more: {
    title: 'More',
    blurb: 'Products, portals and resources',
    columns: [
      {
        links: [
          { to: '/solutions', label: 'Solutions' },
          { to: '/technologies', label: 'Technologies' },
          { to: '/portfolio', label: 'Portfolio' },
          { to: '/products', label: 'Products' },
          { to: '/news', label: 'News' },
        ],
      },
      {
        links: [
          { to: '/client', label: 'Client Portal' },
          { to: '/crm', label: 'CRM' },
          { to: '/finance', label: 'Finance' },
          { to: '/support', label: 'Support' },
          { to: '/trust', label: 'Trust' },
          { to: '/ai', label: 'AI Features' },
        ],
      },
      {
        links: [
          { to: '/legal/privacy', label: 'Privacy Policy' },
          { to: '/legal/terms', label: 'Terms' },
          { to: '/careers/internship', label: 'Certificates / Offer letter' },
          { to: '/careers/jobs', label: 'All Jobs' },
        ],
      },
    ],
    side: { title: 'Company', text: 'DS-TECHNOLOGIES · Bareilly HQ' },
  },

};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(null);
  const closeTimer = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openMega = (key) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMega(key);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setMega(null), 180);
  };

  useEffect(() => () => closeTimer.current && clearTimeout(closeTimer.current), []);

  const panel = mega ? MEGA[mega] : null;

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo" onClick={() => setMega(null)}>
          <img src={(typeof window !== 'undefined' && localStorage.getItem('ds_custom_logo')) || '/logo.jpg'} alt="DS-TECHNOLOGIES" className="logo-img" onError={(e) => { e.target.src = '/logo.jpg'; }} />
          <span className="logo-text">DS-TECHNOLOGIES</span>
        </Link>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <NavLink to="/" end onClick={() => setOpen(false)}>
            Home
          </NavLink>

          {['insights', 'industries', 'services', 'careers'].map((key) => (
            <div
              key={key}
              className="nav-item-mega"
              onMouseEnter={() => openMega(key)}
              onMouseLeave={scheduleClose}
            >
              <NavLink
                to={key === 'careers' ? '/careers' : `/${key}`}
                onClick={() => {
                  setOpen(false);
                  setMega(null);
                }}
              >
                {MEGA[key].title}
              </NavLink>
            </div>
          ))}

          <div className="nav-item-mega" onMouseEnter={() => openMega('about')} onMouseLeave={scheduleClose}>
            <NavLink
              to="/about"
              onClick={() => {
                setOpen(false);
                setMega(null);
              }}
            >
              About
            </NavLink>
          </div>

          <NavLink to="/courses" onClick={() => setOpen(false)}>
            Courses
          </NavLink>
          <NavLink to="/careers/resume-builder" onClick={() => setOpen(false)}>
            Resume Builder
          </NavLink>
          <NavLink to="/portfolio-builder" onClick={() => setOpen(false)}>
            Portfolio Builder
          </NavLink>
          <NavLink to="/website-builder" onClick={() => setOpen(false)}>
            Website Builder
          </NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)}>
            Contact
          </NavLink>

          <div className="nav-item-mega" onMouseEnter={() => openMega('more')} onMouseLeave={scheduleClose}>
            <button
              type="button"
              className="nav-more-btn"
              aria-expanded={mega === 'more'}
              aria-haspopup="true"
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', font: 'inherit', padding: 0 }}
              onClick={() => setMega(mega === 'more' ? null : 'more')}
            >
              More ▾
            </button>
          </div>

          {user ? (
            <div className="user-menu">
              {(user.role === 'admin' || user.role === 'hr') && (
                <NavLink to="/admin" onClick={() => setOpen(false)}>
                  Admin Panel
                </NavLink>
              )}
              {user.role === 'employee' && (
                <NavLink to="/employee" onClick={() => setOpen(false)}>
                  My Portal
                </NavLink>
              )}
              <span className="user-name" title={user.email}>
                {user.role === 'admin' || user.role === 'hr'
                  ? (user.email || 'Admin')
                  : (user.name?.split(' ')[0] || 'User')}
              </span>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              <NavLink to="/login" className="btn btn-outline" onClick={() => setOpen(false)}>
                Login
              </NavLink>
              <NavLink to="/register" className="btn btn-primary" onClick={() => setOpen(false)}>
                Register
              </NavLink>
            </div>
          )}
        </nav>

        <button className="hamburger mobile-only" onClick={() => setOpen(!open)} aria-label="Menu">
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Capgemini-style mega panel */}
      {panel && (
        <div
          className="mega-panel"
          onMouseEnter={() => openMega(mega)}
          onMouseLeave={scheduleClose}
        >
          <div className="container mega-inner">
            <div className="mega-left">
              <h3>{panel.title}</h3>
              <p>{panel.blurb}</p>
              <Link
                to={mega === 'careers' ? '/careers' : mega === 'about' ? '/about' : `/${mega}`}
                className="mega-learn"
                onClick={() => setMega(null)}
              >
                Learn more →
              </Link>
            </div>
            <div className="mega-cols">
              {panel.columns.map((col, i) => (
                <ul key={i}>
                  {col.links.map((l) => (
                    <li key={l.to + l.label}>
                      <Link to={l.to} onClick={() => setMega(null)}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
            <div className="mega-side">
              <strong>{panel.side.title}</strong>
              <p>{panel.side.text}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
