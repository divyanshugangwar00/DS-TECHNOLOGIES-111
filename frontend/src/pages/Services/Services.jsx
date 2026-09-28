import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const SERVICES = [
  { id: 'consulting', title: 'DS Consulting', icon: '🧭', text: 'Technology strategy, architecture, product planning and digital transformation roadmaps.', bullets: ['Technology assessment', 'Architecture & roadmap', 'Product discovery', 'Digital transformation'] },
  { id: 'application', title: 'Application Services', icon: '📱', text: 'Build, modernise and maintain web and business applications across the lifecycle.', bullets: ['React / Node applications', 'Legacy modernisation', 'API integrations', 'Application maintenance'] },
  { id: 'automation', title: 'Intelligent Automation', icon: '⚡', text: 'Automate repetitive HR, admin, reporting and customer workflows with practical digital processes.', bullets: ['Workflow automation', 'Notifications', 'Approvals & status flows', 'Scheduled jobs'] },
  { id: 'testing', title: 'Testing Services', icon: '🧪', text: 'Functional, API, integration and regression testing for reliable releases.', bullets: ['Functional testing', 'API testing', 'Regression checks', 'Release validation'] },
  { id: 'performance', title: 'Performance Engineering', icon: '🚀', text: 'Improve page speed, API response times, reliability and production observability.', bullets: ['Frontend optimisation', 'API profiling', 'Caching strategies', 'Production monitoring'] },
  { id: 'cloud', title: 'Cloud & Infrastructure', icon: '☁️', text: 'Cloud-ready applications using Vercel, Render, MongoDB Atlas and environment management.', bullets: ['Cloud deployment', 'Environment configuration', 'Database hosting', 'Monitoring basics'] },
  { id: 'cloud-consulting', title: 'Cloud Consulting', icon: '🌐', text: 'Choose hosting, migration and deployment patterns that fit budget, reliability and scale.', bullets: ['Hosting selection', 'Migration planning', 'Cost-aware architecture', 'Environment separation'] },
  { id: 'network', title: 'Network Services', icon: '🔗', text: 'Connectivity, secure access, environment separation and deployment networking guidance.', bullets: ['Secure connectivity', 'DNS & domains', 'API access', 'Environment isolation'] },
  { id: 'cyber', title: 'Cyber Security', icon: '🔒', text: 'Authentication, roles, validation, secure uploads, HTTPS-ready deployment and security hygiene.', bullets: ['Authentication & RBAC', 'Secure uploads', 'Input validation', 'Security reviews'] },
  { id: 'engineering', title: 'Engineering Services', icon: '⚙️', text: 'Full-stack engineering, APIs, databases, architecture, integrations and maintainable code.', bullets: ['MERN stack', 'REST APIs', 'MongoDB', 'Code quality & architecture'] },
  { id: 'analytics', title: 'Data Analytics', icon: '📊', text: 'Dashboards, KPI reports, exports and operational analytics for hiring, HR, sales and business teams.', bullets: ['KPI dashboards', 'Reports & exports', 'Power BI-ready data', 'Operational analytics'] },
  { id: 'ai', title: 'Artificial Intelligence', icon: '🤖', text: 'AI assistants, classification, intelligent search and practical AI features integrated into products.', bullets: ['AI assistants', 'Smart search', 'Classification', 'AI-powered workflows'] },
  { id: 'digital-enterprise', title: 'Digital Enterprise Applications', icon: '🏢', text: 'Role-based business portals covering HR, CRM, finance, careers, projects and operations.', bullets: ['HR & employee portals', 'CRM', 'Finance modules', 'Operations dashboards'] },
  { id: 'microsoft', title: 'Microsoft Business Applications', icon: '🪟', text: 'Integration-minded workflows and business application support around Microsoft ecosystems.', bullets: ['Microsoft workflows', 'Business reporting', 'Office integrations', 'Process digitisation'] },
  { id: 'sap', title: 'SAP', icon: '🟦', text: 'SAP-oriented business process integration, reporting and enterprise application support.', bullets: ['Process integration', 'Reporting support', 'Data workflows', 'Enterprise portals'] },
  { id: 'oracle', title: 'Oracle', icon: '🔴', text: 'Oracle-oriented enterprise data and business application integration support.', bullets: ['Database integration', 'Business workflows', 'Reporting', 'Application support'] },
  { id: 'salesforce', title: 'Salesforce', icon: '☁️', text: 'CRM integration, customer workflows and lead-management automation.', bullets: ['Lead management', 'Customer journeys', 'CRM integrations', 'Follow-up automation'] },
  { id: 'pega', title: 'Pega / BPM', icon: '🔄', text: 'Business process management, workflow design and approval automation concepts.', bullets: ['BPM design', 'Approval flows', 'Case management', 'Workflow automation'] },
  { id: 'bps', title: 'Business Process Services', icon: '🧩', text: 'Digitise HR, recruitment, customer support and operational processes.', bullets: ['Recruitment workflows', 'HR operations', 'Support workflows', 'Process tracking'] },
  { id: 'experience', title: 'Experience Services', icon: '✨', text: 'Responsive UX, customer journeys, accessible interfaces and modern design systems.', bullets: ['UX design', 'Responsive UI', 'Accessibility', 'Design systems'] },
  { id: 'integrated', title: 'Integrated Offerings', icon: '🔗', text: 'Combine software, cloud, data, AI, security and support into one delivery plan.', bullets: ['Software + cloud', 'AI + data', 'Security + support', 'Managed delivery'] },
  { id: 'sustainability', title: 'Sustainability Services', icon: '🌱', text: 'Digital-first processes, paper reduction and practical technology choices that reduce operational waste.', bullets: ['Paperless workflows', 'Digital approvals', 'Resource-efficient systems', 'Sustainability reporting'] },
  { id: 'software', title: 'Custom Software Development', icon: '💻', text: 'Bespoke business software, portals and workflow modules tailored to the way your organisation works.', bullets: ['Custom portals', 'Business workflows', 'Admin dashboards', 'Role-based access'] },
  { id: 'web', title: 'Web & Mobile Apps', icon: '📲', text: 'Responsive websites, portals and mobile-ready applications using modern frontend and backend stacks.', bullets: ['React websites', 'Mobile-ready UI', 'Backend APIs', 'Responsive design'] },
  { id: 'devops', title: 'DevOps & CI/CD', icon: '♾️', text: 'Build scripts, environment separation, deployment workflows, logs and release practices.', bullets: ['Git workflows', 'CI/CD', 'Deployments', 'Release monitoring'] },
  { id: 'platforms', title: 'Products & Platforms', icon: '📦', text: 'Reusable SaaS-style modules and platform foundations for recurring business needs.', bullets: ['Reusable modules', 'SaaS foundations', 'Admin platforms', 'Scalable architecture'] },
  { id: 'fullstack', title: 'Full Stack Development', icon: '🧑‍💻', text: 'MERN stack delivery from UI and API design to MongoDB and production deployment.', bullets: ['React', 'Node / Express', 'MongoDB', 'Production deployment'] },
  { id: 'mobile', title: 'Mobile App Development', icon: '📱', text: 'Android and cross-platform apps connected to secure backend APIs.', bullets: ['Mobile UI', 'API integration', 'Authentication', 'App-ready architecture'] },
  { id: 'desktop', title: 'Desktop Application Development', icon: '🖥️', text: 'Desktop utilities and internal tools for workflows that need local application experiences.', bullets: ['Internal tools', 'Utilities', 'Local workflows', 'Data integrations'] },
  { id: 'saas', title: 'SaaS Development', icon: '☁️', text: 'Cloud-friendly product structures, tenant-aware architecture and subscription-ready foundations.', bullets: ['Multi-tenant foundations', 'Cloud deployment', 'Subscription-ready design', 'Admin controls'] },
  { id: 'api', title: 'API Development', icon: '🔌', text: 'REST APIs, JWT authentication, validation, integrations and documented endpoints.', bullets: ['REST APIs', 'JWT auth', 'Validation', 'Third-party integrations'] },
  { id: 'uiux', title: 'UI/UX Design', icon: '🎨', text: 'Wireframes, design systems, responsive interfaces and print-ready digital experiences.', bullets: ['Wireframes', 'Design systems', 'Responsive UI', 'Usability improvements'] },
  { id: 'cloud-migration', title: 'Cloud Migration', icon: '☁️', text: 'Move local projects to cloud hosting, Atlas databases, managed secrets and CI-friendly repositories.', bullets: ['Migration planning', 'Database migration', 'Secrets management', 'Deployment setup'] },
  { id: 'genai', title: 'Generative AI', icon: '✨', text: 'Chat assistants, content helpers and API-based generative features inside business applications.', bullets: ['AI chat', 'Content generation', 'AI APIs', 'Product assistants'] },
  { id: 'bi', title: 'Business Intelligence', icon: '📈', text: 'Leadership dashboards, structured exports and decision-support reporting.', bullets: ['Management dashboards', 'KPI reporting', 'Exports', 'Decision support'] },
  { id: 'digital', title: 'Digital Transformation', icon: '🔄', text: 'Turn paper and manual workflows into trackable, role-based digital systems.', bullets: ['Process mapping', 'Digital forms', 'Role-based workflows', 'Operational visibility'] },
  { id: 'erp', title: 'ERP Development', icon: '🏭', text: 'Modular ERP-style systems for employees, operations, finance and management reporting.', bullets: ['HR', 'Finance', 'Operations', 'Management reporting'] },
  { id: 'crm', title: 'CRM Development', icon: '🤝', text: 'Leads, contacts, follow-ups and enquiry pipelines connected to website forms.', bullets: ['Leads', 'Contacts', 'Follow-ups', 'Enquiry pipelines'] },
  { id: 'ecommerce', title: 'E-Commerce Development', icon: '🛒', text: 'Product catalogues, customer journeys, cart-ready foundations and admin tools.', bullets: ['Product catalogues', 'Customer journeys', 'Cart foundations', 'Admin tools'] },
  { id: 'maintenance', title: 'Maintenance & Support', icon: '🛠️', text: 'Bug fixes, enhancements, monitoring, training and post-launch support.', bullets: ['Bug fixing', 'Enhancements', 'Monitoring', 'Training & support'] },
];

export default function Services() {
  return (
    <div className="section page-bg-services">
      <div className="container" style={{ maxWidth: 1250 }}>
        <p style={{ color: '#38bdf8', fontSize: '.8rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>Complete capability catalogue</p>
        <h1 className="section-title">Services</h1>
        <p className="section-subtitle" style={{ maxWidth: 900 }}>Every service is a real navigation point. Click a card to open a dedicated page with scope, workflow, deliverables and next steps.</p>
        <div className="grid-3" style={{ marginTop: '1.25rem' }}>
          {SERVICES.map((s, i) => <Link key={s.id} to={`/explore/services/${s.id}`} className="card catalog-card" style={{ color: 'inherit', textDecoration: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '.75rem', alignItems: 'center' }}><span style={{ fontSize: '2rem' }}>{s.icon}</span><span className="catalog-open">OPEN →</span></div>
            <div style={{ color: '#64748b', fontSize: '.72rem', fontWeight: 700, marginTop: '.55rem' }}>{String(i + 1).padStart(2, '0')} · DS SERVICE</div>
            <h2 style={{ color: '#38bdf8', fontSize: '1.08rem', margin: '.45rem 0' }}>{s.title}</h2>
            <p style={{ color: '#cbd5e1', lineHeight: 1.65, margin: 0, fontSize: '.92rem' }}>{s.text}</p>
            <div style={{ marginTop: '1rem', color: '#67e8f9', fontWeight: 800, fontSize: '.82rem' }}>View complete service page →</div>
          </Link>)}
        </div>
        <div className="card" style={{ marginTop: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(0,102,255,.16), rgba(0,212,255,.06))' }}>
          <h2 style={{ marginBottom: '.5rem' }}>Need a combination of services?</h2>
          <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>Combine engineering, cloud, data, AI, security and support into one delivery plan.</p>
          <Link to="/contact" className="btn btn-primary">Request a proposal →</Link>{' '}
          <Link to="/solutions" className="btn btn-outline">View solutions</Link>
        </div>
      </div>
    </div>
  );
}
