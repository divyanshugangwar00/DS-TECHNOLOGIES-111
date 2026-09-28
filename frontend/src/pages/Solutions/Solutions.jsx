import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const SOLUTIONS = [
  { id: 'business', icon: '💼', title: 'Business Solutions', text: 'Day-to-day digital systems for operations, HR and customer communication.', features: ['HR & operations', 'Customer forms', 'Approvals', 'Reports'] },
  { id: 'enterprise', icon: '🏢', title: 'Enterprise Solutions', text: 'Role-based admin, multi-module portals and audit-friendly workflows.', features: ['Role-based access', 'Multi-module portals', 'Audit trails', 'Management dashboards'] },
  { id: 'digital', icon: '🌐', title: 'Digital Solutions', text: 'Websites, forms, CMS content and end-to-end online presence.', features: ['Corporate websites', 'CMS', 'Lead forms', 'SEO-ready pages'] },
  { id: 'cloud', icon: '☁️', title: 'Cloud Solutions', text: 'Hosted APIs and frontends with Atlas database and production-friendly deployment.', features: ['Vercel / Render', 'MongoDB Atlas', 'Environment setup', 'Monitoring'] },
  { id: 'ai', icon: '🤖', title: 'AI Solutions', text: 'Assistants, classification and smart features inside real products.', features: ['AI assistants', 'Smart search', 'Automation', 'AI APIs'] },
  { id: 'data', icon: '📊', title: 'Data Solutions', text: 'Reports, exports and dashboards for decision makers.', features: ['KPI dashboards', 'Exports', 'Analytics', 'Business intelligence'] },
  { id: 'security', icon: '🔐', title: 'Security Solutions', text: 'Auth, roles, secure uploads and environment hygiene.', features: ['Authentication', 'RBAC', 'Secure uploads', 'Security practices'] },
  { id: 'automation', icon: '⚡', title: 'Automation Solutions', text: 'Reduce manual HR and admin work with slips, notices and status flows.', features: ['Workflow automation', 'Notifications', 'Approvals', 'Scheduled tasks'] },
  { id: 'ecommerce', icon: '🛒', title: 'E-Commerce Solutions', text: 'Product catalogues and enquiry-to-order style journeys.', features: ['Catalogues', 'Enquiries', 'Customer journey', 'Admin tools'] },
  { id: 'education', icon: '🎓', title: 'Education Solutions', text: 'Courses, certificates, internships and campus career tools.', features: ['Courses', 'Certificates', 'Internships', 'Career portal'] },
  { id: 'healthcare', icon: '🏥', title: 'Healthcare Solutions', text: 'Staff and clinic-oriented digital modules.', features: ['Staff workflows', 'Digital forms', 'Appointments foundation', 'Reports'] },
  { id: 'finance', icon: '💰', title: 'Finance Solutions', text: 'Payroll lists, slips and finance-team friendly reports.', features: ['Payroll', 'Salary slips', 'Reports', 'Exports'] },
];

export default function Solutions() {
  return (
    <div className="page-bg-solutions section page-bg-services">
      <div className="container" style={{ maxWidth: 1200 }}>
        <p style={{ color: '#38bdf8', fontSize: '.8rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>Outcome-focused digital packages</p>
        <h1 className="section-title">Solutions</h1>
        <p className="section-subtitle">Each solution now opens its own detailed page. Explore the capabilities, workflow, use cases and implementation path.</p>
        <div className="grid-3" style={{ marginTop: '1.25rem' }}>
          {SOLUTIONS.map((s, i) => <Link key={s.id} to={`/explore/solutions/${s.id}`} className="card catalog-card" style={{ color: 'inherit', textDecoration: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ fontSize: '2rem' }}>{s.icon}</span><span className="catalog-open">OPEN →</span></div>
            <div style={{ color: '#64748b', fontSize: '.72rem', marginTop: '.5rem' }}>{String(i + 1).padStart(2, '0')} · DS SOLUTION</div>
            <h2 style={{ color: '#38bdf8', fontSize: '1.08rem', margin: '.4rem 0' }}>{s.title}</h2>
            <p style={{ color: '#cbd5e1', lineHeight: 1.65, margin: 0 }}>{s.text}</p>
            <div style={{ marginTop: '.9rem', color: '#67e8f9', fontWeight: 800, fontSize: '.82rem' }}>Explore solution →</div>
          </Link>)}
        </div>
        <div className="card" style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h2>Not sure which solution fits?</h2>
          <p style={{ color: '#94a3b8' }}>Tell us the business problem, team size and desired outcome. We can combine multiple modules into one implementation plan.</p>
          <Link to="/contact" className="btn btn-primary">Book a solution demo →</Link>
        </div>
      </div>
    </div>
  );
}
