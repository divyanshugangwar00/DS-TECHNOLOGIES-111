import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const GROUPS = [
  {
    title: 'Employment letters',
    items: [
      { name: 'Offer Letter', to: '/admin/offer', desc: 'Generate · Accept · PDF' },
      { name: 'Joining Letter', to: '/admin/joining', desc: 'Multi-step form · PDF' },
      { name: 'Experience Letter', to: '/careers/internship', desc: 'Certificate builder' },
      { name: 'Resignation Letter', to: '/admin/resign-letters', desc: 'Exit requests' },
    ],
  },
  {
    title: 'Identity & onboarding',
    items: [
      { name: 'Document Verification', to: '/admin/documents-verify', desc: 'Aadhaar · PAN · Marksheets' },
      { name: 'Full Onboarding', to: '/admin/onboarding', desc: 'Bank → Login' },
      { name: 'ID Card template', to: '/admin/employees', desc: 'Employee profiles' },
    ],
  },
  {
    title: 'HR policies & compliance',
    items: [
      { name: 'Company Policy Handbook', to: '/admin/settings', desc: 'Settings · company info' },
      { name: 'Code of Conduct', to: '/admin/notices', desc: 'Publish as notice' },
      { name: 'Leave Policy', to: '/admin/leaves', desc: 'Leave management' },
      { name: 'Attendance Policy', to: '/admin/attendance', desc: 'Mark · reports' },
    ],
  },
  {
    title: 'Payroll & finance',
    items: [
      { name: 'Salary Slips', to: '/admin/payroll', desc: 'View · PDF' },
      { name: 'Internship Certificate', to: '/careers/internship', desc: 'Public + admin edit' },
    ],
  },
  {
    title: 'Media & certificates',
    items: [
      { name: 'Awards & Certificates', to: '/admin/awards', desc: 'Add milestones' },
      { name: 'Notices / Circulars', to: '/admin/notices', desc: 'PDF · signatures' },
    ],
  },
];

export default function DocumentsAdmin() {
  const { user } = useAuth();
  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container">
        <p>Access denied</p>
      </div>
    );
  }

  return (
    <div className="section page-bg-admin">
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 className="section-title">📁 Documents & Templates</h1>
        <AdminHero variant="default" />
        <p className="section-subtitle">
          IT company document centre — letters, policies, verification, payroll (Accenture / Wipro style modules)
        </p>

        {GROUPS.map((g) => (
          <div className="card" key={g.title} style={{ marginBottom: '1rem' }}>
            <h3 style={{ color: '#38bdf8', marginTop: 0 }}>{g.title}</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {g.items.map((it) => (
                <li
                  key={it.name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '0.65rem 0',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <Link to={it.to} style={{ color: '#e2e8f0', fontWeight: 600 }}>
                      {it.name}
                    </Link>
                    <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{it.desc}</div>
                  </div>
                  <Link to={it.to} style={{ color: '#00d4ff', fontSize: '0.85rem' }}>
                    Open →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <p>
          <Link to="/admin" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
