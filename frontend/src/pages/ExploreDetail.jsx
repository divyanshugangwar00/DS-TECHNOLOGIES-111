import { Link, useParams } from 'react-router-dom';
import { SERVICES } from './Services/Services';
import { SOLUTIONS } from './Solutions/Solutions';
import { INDUSTRIES } from './Industries/Industries';
import { CONTENT } from './Insights/Insights';
import { MODULES } from './Courses/Courses';
import { MODULES as CLIENT_MODULES } from './Client/ClientPortal';

const IMAGES = {
  services: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1800&q=85',
  solutions: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1800&q=85',
  industries: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1800&q=85',
  insights: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1800&q=85',
  courses: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1800&q=85',
  client: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1800&q=85',
};

const slug = (value = '') => String(value).toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function getItem(section, rawSlug) {
  const target = slug(rawSlug);
  if (section === 'services') return SERVICES.find(x => x.id === rawSlug || slug(x.id) === target);
  if (section === 'solutions') return SOLUTIONS.find(x => x.id === rawSlug || slug(x.id) === target);
  if (section === 'industries') return INDUSTRIES.find(x => x[0] === rawSlug || slug(x[0]) === target || slug(x[1]) === target);
  if (section === 'insights') return CONTENT.find(x => String(x.id) === rawSlug || slug(x.title) === target);
  if (section === 'courses') return MODULES.find(x => String(x.id) === rawSlug || slug(x.title) === target);
  if (section === 'client') return CLIENT_MODULES.find(x => slug(x.title) === target || String(x.id) === rawSlug);
  return { id: rawSlug, title: String(rawSlug).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), text: 'A dedicated DS-TECHNOLOGIES information and action page for this capability.', icon: '✦', features: ['Overview and scope', 'Practical use cases', 'Workflow and deliverables', 'Next steps'] };
}

function normalize(section, item) {
  if (!item) return null;
  if (section === 'industries') return { id: item[0], title: item[1], text: item[2], icon: '◈', features: ['Domain-specific workflows', 'Role-based dashboards', 'Digital forms and approvals', 'Reports and operational visibility'] };
  if (section === 'insights') return { id: item.id, title: item.title, text: item.text, icon: '✦', features: ['Practical guides', 'Real-world examples', 'Implementation checklists', 'Actionable takeaways'] };
  if (section === 'courses') return { id: item.id, title: item.title, text: item.text, icon: '🎓', features: ['Structured learning path', 'Practice material', 'Progress tracking', 'Certificate / completion support'] };
  if (section === 'client') return { id: item.id, title: item.title, text: `${item.title} is a dedicated part of the DS-TECHNOLOGIES client collaboration workflow.`, icon: '◫', features: ['Secure account-aware access', 'Clear status and activity', 'Project communication', 'Action-oriented records'] };
  return { ...item, features: item.features || item.bullets || [] };
}

function buildSections(section, item) {
  const title = item.title;
  const common = [
    { heading: 'What this includes', body: `A complete ${title.toLowerCase()} workflow designed around practical business requirements, clear ownership and measurable outcomes.` },
    { heading: 'Typical workflow', body: 'Discover → define requirements → design the experience → build/configure → test → launch → monitor → improve.' },
    { heading: 'Deliverables', body: 'Working screens, reusable components, documented workflows, validations, role-aware access and a clear handover path.' },
  ];
  if (section === 'services') common[0].body = `${title} covers planning, implementation and support so the capability can move from idea to production without leaving the operational details behind.`;
  if (section === 'solutions') common[0].body = `${title} combines multiple capabilities into an outcome-focused package. The emphasis is on solving a business problem rather than selling an isolated feature.`;
  if (section === 'industries') common[0].body = `${title} delivery starts with the industry's real workflows, terminology, users and compliance/operational needs, then maps those needs into digital systems.`;
  if (section === 'insights') common[0].body = `This ${title.toLowerCase()} area is structured as a practical knowledge resource: concepts, examples, implementation ideas and useful next steps for readers.`;
  if (section === 'courses') common[0].body = `${title} is part of the learning experience. Learners can move from fundamentals to practice, review progress and build evidence of their skills.`;
  if (section === 'client') common[0].body = `${title} is designed to keep client work visible, organized and actionable across projects, communication, files, billing and support.`;
  return common;
}

export default function ExploreDetail() {
  const { section = 'services', slug: rawSlug = '' } = useParams();
  const item = normalize(section, getItem(section, rawSlug));
  const image = IMAGES[section] || IMAGES.services;

  if (!item) return <div className="section"><div className="container"><div className="card"><h1>Section not found</h1><p style={{ color: '#94a3b8' }}>The requested option is not available.</p><Link className="btn btn-primary" to="/">Back to home</Link></div></div></div>;

  const sections = buildSections(section, item);
  const parent = `/${section === 'client' ? 'client' : section}`;
  const action = section === 'courses' ? '/register' : section === 'client' ? '/login' : '/contact';

  return <div className="explore-page" style={{ backgroundImage: `linear-gradient(180deg, rgba(2,6,23,.42), rgba(2,6,23,.97) 38%), url(${image})` }}>
    <div className="container explore-wrap">
      <div className="explore-hero">
        <div>
          <div className="explore-kicker">DS-TECHNOLOGIES • {section.toUpperCase()}</div>
          <div className="explore-icon">{item.icon}</div>
          <h1>{item.title}</h1>
          <p>{item.text}</p>
          <div className="explore-actions"><Link to={action} className="btn btn-primary">{section === 'courses' ? 'Start / Enrol' : section === 'client' ? 'Sign in' : 'Discuss this'} →</Link><Link to={parent} className="btn btn-outline">Back to {section}</Link></div>
        </div>
        <div className="explore-stat"><strong>360°</strong><span>End-to-end coverage</span><div className="explore-stat-line" /></div>
      </div>

      <div className="explore-grid">
        <section className="explore-main">
          <div className="explore-card"><div className="explore-label">CAPABILITY MAP</div><h2>What you can expect</h2><div className="explore-feature-grid">{item.features.map((f, i) => <div className="explore-feature" key={f}><span>{String(i + 1).padStart(2, '0')}</span><div><h3>{f}</h3><p>Designed as a usable, connected part of the overall workflow rather than a standalone screen.</p></div></div>)}</div></div>
          {sections.map(s => <div className="explore-card" key={s.heading}><div className="explore-label">DETAIL</div><h2>{s.heading}</h2><p className="explore-long">{s.body}</p><div className="explore-points"><span>✓ Clear requirements</span><span>✓ Responsive design</span><span>✓ Validation & states</span><span>✓ Production handover</span></div></div>)}
        </section>
        <aside className="explore-side">
          <div className="explore-side-card"><h3>Use cases</h3><ul><li>Business operations</li><li>Customer / employee journeys</li><li>Dashboards and reporting</li><li>Digital forms and workflows</li><li>Scalable future enhancements</li></ul></div>
          <div className="explore-side-card"><h3>Next step</h3><p>Tell us your requirement, current process and expected outcome. The team can turn the option above into a tailored implementation plan.</p><Link to={action} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>{section === 'courses' ? 'Explore enrolment' : 'Start a conversation'}</Link></div>
        </aside>
      </div>
    </div>
  </div>;
}
