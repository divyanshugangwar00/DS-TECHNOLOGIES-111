import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const BLOCKS = [
  {
    title: 'All Staff Directory',
    hi: 'कर्मचारी डायरेक्टरी',
    desc: 'Profile management, contact info, joining details, department and designation for every employee.',
    to: '/admin/employees',
    icon: '👥',
  },
  {
    title: 'Role-Based Access Control (RBAC)',
    hi: 'भूमिका एवं अनुमतियाँ',
    desc: 'Permissions for CEO, CTO, HR, Manager and Developer — who sees staff, payroll, treasury, settings.',
    to: '/admin/roles',
    icon: '🔐',
  },
  {
    title: 'Attendance & Time Tracking',
    hi: 'हाज़िरी एवं टाइमशीट',
    desc: 'Daily check-in / check-out logs, present · absent · half-day, department filter, save and PDF export.',
    to: '/admin/attendance',
    icon: '🕐',
  },
  {
    title: 'Leave Management',
    hi: 'छुट्टी प्रबंधन',
    desc: 'Approve or reject leave and holiday requests — sick, casual, annual — with balance tracking.',
    to: '/admin/leaves',
    icon: '🏖️',
  },
  {
    title: 'Performance Tracker',
    hi: 'परफ़ॉर्मेंस ट्रैकर',
    desc: 'Quarterly ratings, goals and feedback logs for staff. Visible to HR and leadership.',
    to: '/admin/performance',
    icon: '📈',
  },
  {
    title: 'Payroll & Salary Slips',
    hi: 'पेरोल',
    desc: 'Earnings, deductions, net pay, company logo slips and payment status.',
    to: '/admin/payroll',
    icon: '💰',
  },
  {
    title: 'Passwords (admin view)',
    hi: 'पासवर्ड इतिहास',
    desc: 'Leadership can see username / password history updates for support (secure handling).',
    to: '/admin/passwords',
    icon: '🔑',
  },
  {
    title: 'Resignations',
    hi: 'इस्तीफ़ा',
    desc: 'Employee resign requests and exit letters for HR follow-up.',
    to: '/admin/resign-letters',
    icon: '🚪',
  },
];

export default function AdminHRModule() {
  const { user } = useAuth();
  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container">
        <p>HR Module is for Admin / HR only.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  return (
    <div className="section page-bg-hr">
      <div className="container">
        <p style={{ marginBottom: '0.5rem' }}>
          <Link to="/admin" style={{ color: '#00d4ff' }}>
            ← Admin Dashboard
          </Link>
        </p>
        <h1 className="section-title">👥 User & Employee Management (HR Module)</h1>
        <AdminHero variant="hr" />
        <p className="section-subtitle">
          Complete people operations for DS-TECHNOLOGIES — directory, access control, attendance, leave and performance.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
            marginTop: '1.25rem',
          }}
        >
          {BLOCKS.map((b) => (
            <Link
              key={b.title}
              to={b.to}
              style={{
                textDecoration: 'none',
                display: 'block',
                padding: '1.25rem',
                borderRadius: 14,
                background: 'linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.9))',
                border: '1px solid rgba(0,212,255,0.15)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                transition: 'border-color 0.2s, transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.45)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.15)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{b.icon}</div>
              <h3 style={{ margin: '0 0 0.25rem', color: '#e2e8f0', fontSize: '1.05rem' }}>{b.title}</h3>
              <p style={{ margin: '0 0 0.5rem', color: '#64748b', fontSize: '0.8rem' }}>{b.hi}</p>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.55 }}>{b.desc}</p>
              <span style={{ color: '#00d4ff', fontSize: '0.85rem', marginTop: '0.75rem', display: 'inline-block' }}>
                Open →
              </span>
            </Link>
          ))}
        </div>

        <div className="card" style={{ marginTop: '2rem' }}>
          <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Quick flow</h3>
          <p style={{ color: '#cbd5e1', lineHeight: 1.75, margin: 0 }}>
            Hire → Offer → Joining form → Documents verify → Employee ID → Staff Directory → Daily Attendance → Leave
            requests → Quarterly Performance → Payroll slips. All steps stay inside Admin for leadership and HR.
          </p>
        </div>
      </div>
    </div>
  );
}
