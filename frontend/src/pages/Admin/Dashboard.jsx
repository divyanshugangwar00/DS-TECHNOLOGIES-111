import { useEffect, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const cardStyle = {
  display: 'block',
  textDecoration: 'none',
  padding: '1.1rem 1.2rem',
  borderRadius: 14,
  background: 'linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.85))',
  border: '1px solid rgba(0,212,255,0.12)',
  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
  transition: 'transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    jobs: 0,
    openJobs: 0,
    applications: 0,
    pending: 0,
    employees: 0,
    activeEmp: 0,
    present: 0,
    contacts: 0,
    leavePending: 0,
  });

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'hr')) return;
    (async () => {
      try {
        const [jobs, apps, emps, att, contacts, leaves] = await Promise.all([
          api.get('/jobs').catch(() => ({ data: [] })),
          api.get('/applications').catch(() => ({ data: [] })),
          api.get('/employees').catch(() => ({ data: [] })),
          api.get('/attendance').catch(() => ({ data: [] })),
          api.get('/contact').catch(() => ({ data: [] })),
          api.get('/leaves').catch(() => ({ data: [] })),
        ]);
        const j = jobs.data || [];
        const a = apps.data || [];
        const e = emps.data || [];
        const today = new Date().toISOString().slice(0, 10);
        const attToday = (att.data || []).filter((r) => {
          try {
            return new Date(r.date).toISOString().slice(0, 10) === today;
          } catch {
            return false;
          }
        });
        const lv = leaves.data || [];
        setStats({
          jobs: j.length,
          openJobs: j.filter((x) => x.status === 'Open').length,
          applications: a.length,
          pending: a.filter((x) =>
            ['Pending', 'Under Review', 'Applied', 'Shortlisted', 'Interview'].includes(x.status)
          ).length,
          employees: e.length,
          activeEmp: e.filter((x) => x.isActive !== false).length,
          present: attToday.filter((r) => r.checkIn || r.status === 'Present').length,
          contacts: (contacts.data || []).length,
          leavePending: lv.filter((x) => x.status === 'Pending').length,
        });
      } catch (_) {}
    })();
  }, [user]);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container">
        <p>Only Leadership / HR can access Admin.</p>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    );
  }

  const kpi = [
    { label: 'Employees', value: stats.employees, color: '#38bdf8', to: '/admin/employees' },
    { label: 'Present', value: stats.present, color: '#34d399', to: '/admin/attendance?view=today' },
    { label: 'Leave ⏳', value: stats.leavePending, color: '#fbbf24', to: '/admin/leaves' },
    { label: 'Jobs', value: stats.openJobs, color: '#a78bfa', to: '/admin/jobs' },
    { label: 'Apps', value: stats.pending, color: '#f472b6', to: '/admin/applications' },
    { label: 'Contacts', value: stats.contacts, color: '#fb923c', to: '/admin/contacts' },
  ];

  const sections = [
    {
      title: 'Website CMS',
      items: [
        { to: '/admin/website-cms', icon: '✏️', label: 'Full website edit', desc: 'Home · About · Services · all text' },
        { to: '/admin/system-settings', icon: '⚙️', label: 'System settings', desc: 'Company · CMS blurbs' },
      ],
    },
    {
      title: 'Training · Comms · Sessions · Backup',
      items: [
        { to: '/admin/training', icon: '🎓', label: 'Training & LMS', desc: 'Intern materials · tests' },
        { to: '/admin/communications', icon: '📢', label: 'Announcements', desc: 'Teams · holiday calendar' },
        { to: '/admin/sessions', icon: '🔐', label: 'Session control', desc: 'IP whitelist · force logout' },
        { to: '/admin/data-export', icon: '🔄', label: 'Data export', desc: 'JSON · CSV · schedule' },
      ],
    },
    {
      title: 'Cloud · AI · Assets · Legal',
      items: [
        { to: '/admin/cloud', icon: '🚀', label: 'Cloud & Servers', desc: 'Health · SSL · deploy' },
        { to: '/admin/ai-analytics', icon: '📊', label: 'AI Analytics', desc: 'Revenue · capacity · retention' },
        { to: '/admin/assets', icon: '💼', label: 'Assets & Licenses', desc: 'Hardware · software' },
        { to: '/admin/legal', icon: '📜', label: 'Legal & Tax', desc: 'NDA · GST · TDS' },
      ],
    },
    {
      title: 'Support & Security',
      items: [
        { to: '/admin/support', icon: '🛠️', label: 'Support Tickets', desc: 'Client bugs · IT helpdesk · SLA' },
        { to: '/admin/system-settings', icon: '⚙️', label: 'System & CMS', desc: 'Company · services · API notes' },
        { to: '/admin/security-audit', icon: '🔒', label: 'Security & Audit', desc: 'Logs · backup · MFA' },
      ],
    },
    {
      title: 'CRM & Finance',
      items: [
        { to: '/admin/crm', icon: '🤝', label: 'CRM — Clients & Leads', desc: 'Pipeline · logs · proposals' },
        { to: '/admin/finance', icon: '💰', label: 'Finance & Billing', desc: 'Invoices · expenses · reports' },
        { to: '/admin/payroll', icon: '🧾', label: 'Payroll slips', desc: 'Employee salary processing' },
      ],
    },
    {
      title: 'Projects',
      items: [
        { to: '/admin/projects', icon: '📁', label: 'Project Board', desc: 'Kanban · tasks · milestones · repos' },
        { to: '/admin/tasks', icon: '✅', label: 'Quick Tasks', desc: 'Simple task list' },
      ],
    },
    {
      title: 'HR Module',
      items: [
        { to: '/admin/hr', icon: '👥', label: 'User & Employee Management', desc: 'Directory · RBAC · Attendance · Leave · Performance' },
        { to: '/admin/performance', icon: '📈', label: 'Performance Tracker', desc: 'Quarterly ratings & feedback' },
        { to: '/admin/roles', icon: '🔐', label: 'RBAC Permissions', desc: 'CEO · CTO · HR · Developer' },
      ],
    },
    {
      title: 'Employees',
      items: [
        { to: '/admin/employees', icon: '👥', label: 'All Employees', desc: `${stats.employees} total` },
        { to: '/admin/employees', icon: '➕', label: 'Add Employee', desc: 'Register new staff' },
        { to: '/admin/employees', icon: '✅', label: 'Active Employees', desc: `${stats.activeEmp} active` },
        { to: '/admin/departments', icon: '🏢', label: 'Departments', desc: 'Org structure' },
      ],
    },
    {
      title: 'Attendance',
      items: [
        { to: '/admin/attendance?view=today', icon: '📅', label: "Today's Attendance", desc: `${stats.present} present · summary only` },
        { to: '/admin/attendance?view=mark', icon: '✏️', label: 'Mark / Save', desc: 'Edit marks · Save · Unlock' },
        { to: '/admin/attendance-history', icon: '📂', label: 'Attendance history', desc: 'Any employee · edit any date' },
        { to: '/admin/reports', icon: '📊', label: 'Attendance Reports', desc: 'CSV + PDF' },
      ],
    },
    {
      title: 'Leave Management',
      items: [
        { to: '/admin/leaves', icon: '⏳', label: 'Pending Requests', desc: `${stats.leavePending} pending` },
        { to: '/admin/leaves', icon: '📄', label: 'Leave Slips', desc: 'View / Approve' },
        { to: '/admin/resign-letters', icon: '🚪', label: 'Resignation Letters', desc: 'Exit docs' },
      ],
    },
    {
      title: 'Payroll',
      items: [
        { to: '/admin/payroll?tab=list', icon: '📋', label: 'Salary list', desc: 'All employees' },
        { to: '/admin/payroll?tab=slips', icon: '🧾', label: 'Salary Slips', desc: 'View / Print PDF' },
        { to: '/admin/payroll?tab=payments', icon: '💳', label: 'Payments', desc: 'Net pay overview' },
      ],
    },
    {
      title: 'Hiring & Jobs',
      items: [
        { to: '/admin/jobs', icon: '💼', label: 'Manage Jobs', desc: `${stats.openJobs} open` },
        { to: '/admin/applications', icon: '📥', label: 'Applications', desc: `${stats.pending} pending` },
        { to: '/admin/registrations', icon: '🆕', label: 'New Registrations', desc: 'Website sign-ups + PDF' },
        { to: '/admin/offer', icon: '📝', label: 'Offer Letters', desc: 'Generate · Accept · PDF' },
        { to: '/admin/interviews', icon: '🗓️', label: 'Interview Management', desc: 'Schedule · Feedback · Status' },
        { to: '/admin/certificates', icon: '🏅', label: 'Certificate Generator', desc: 'Internship · Course · PDF' },
        { to: '/admin/joining', icon: '✍️', label: 'Joining Form', desc: '4 steps · PDF download' },
        { to: '/admin/documents-verify', icon: '🪪', label: 'Doc Verification', desc: 'Aadhaar · PAN' },
        { to: '/admin/onboarding', icon: '🚀', label: 'Full Onboarding', desc: 'Bank → Login' },
        { to: '/admin/courses', icon: '🎓', label: 'Courses', desc: 'Catalog' },
        { to: '/careers/internship', icon: '🏅', label: 'Certificates Builder', desc: 'Internship · Experience · PDF' },
        { to: '/admin/documents-verify', icon: '✅', label: 'Selection → Docs', desc: 'Pipeline after select' },
      ],
    },
    {
      title: 'Organization',
      items: [
        { to: '/admin/departments', icon: '🏢', label: 'Departments', desc: 'Add / manage' },
        { to: '/admin/designations', icon: '🏷️', label: 'Designations', desc: 'Positions' },
        { to: '/admin/roles', icon: '🔐', label: 'Roles & Permissions', desc: 'Access matrix' },
      ],
    },
    {
      title: 'Workplace',
      items: [
        { to: '/admin/tasks', icon: '✅', label: 'Tasks', desc: 'Assign work' },
        { to: '/admin/documents', icon: '📁', label: 'Documents', desc: 'Company files' },
        { to: '/admin/notices', icon: '📢', label: 'Notices', desc: 'Announcements + PDF' },
        { to: '/admin/treasury', icon: '🏦', label: 'Company Treasury', desc: 'CEO only · Bank balance' },
        { to: '/admin/awards', icon: '🏆', label: 'Awards', desc: 'Achievements' },
        { to: '/admin/settings', icon: '🖼️', label: 'Media / Branding', desc: 'Logo · company settings' },
      ],
    },
    {
      title: 'Website & System',
      items: [
        { to: '/admin/contacts', icon: '✉️', label: 'Contact messages', desc: `${stats.contacts} messages` },
        { to: '/admin/reports', icon: '📈', label: 'Reports', desc: 'CSV + PDF export' },
        { to: '/admin/settings', icon: '⚙️', label: 'Settings', desc: 'Company & social' },
        { to: '/admin/passwords', icon: '🔑', label: 'All Passwords', desc: 'Current + history' },
        { to: '/admin/security', icon: '🛡️', label: 'Security', desc: 'Password & sessions' },
        { to: '/admin/chatbot', icon: '🤖', label: 'Chatbot', desc: 'FAQs' },
        { to: '/admin/modules', icon: '🗺️', label: 'All Modules map', desc: 'Roadmap' },
      ],
    },
  ];

  return (
    <div className="section page-bg-admin">
      <div className="container">
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 className="section-title" style={{ marginBottom: '0.35rem' }}>
            Admin Dashboard
          </h1>
          <p className="section-subtitle">
            Welcome, {user.name || 'Admin'} · HR / Leadership control center
          </p>
        <AdminHero variant="dashboard" />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1.25rem',
          }}
        >
          {kpi.map((k) => (
            <Link
              key={k.label}
              to={k.to}
              style={{
                ...cardStyle,
                textAlign: 'center',
                borderColor: `${k.color}33`,
                textDecoration: 'none',
                cursor: 'pointer',
                display: 'block',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
            >
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: k.color }}>{k.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>{k.label}</div>
              <div style={{ fontSize: '0.65rem', color: k.color, marginTop: 6 }}>Open →</div>
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '2rem' }}>
          {[
            ['+ Add Employee', '/admin/employees'],
            ['+ Job', '/admin/jobs'],
            ['Attendance', '/admin/attendance'],
            ['Leaves', '/admin/leaves'],
            ['Payroll', '/admin/payroll'],
            ['+ Notice', '/admin/notices'],
            ['Resignations', '/admin/resign-letters'],
          ].map(([label, to]) => (
            <Link key={to + label} to={to} className="btn btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
              {label}
            </Link>
          ))}
        </div>

        {sections.map((sec) => (
          <div key={sec.title} style={{ marginBottom: '1.75rem' }}>
            <h2
              style={{
                fontSize: '0.95rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#00d4ff',
                marginBottom: '0.85rem',
                fontWeight: 700,
              }}
            >
              {sec.title}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '0.85rem',
              }}
            >
              {sec.items.map((item) => (
                <Link
                  key={item.label + item.to}
                  to={item.to}
                  style={cardStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.45)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,212,255,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.12)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
                  }}
                >
                  <div style={{ fontSize: '1.15rem', marginBottom: 6 }}>{item.icon}</div>
                  <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{item.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
