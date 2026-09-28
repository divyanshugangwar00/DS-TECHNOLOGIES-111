import { useState, useEffect } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MODULES = [
  'Dashboard overview',
  'Staff Directory',
  'Add / Edit Employee',
  'Attendance & timesheets',
  'Leave approve / reject',
  'Performance ratings',
  'Payroll / salary slips',
  'Jobs & Applications',
  'Offer / Onboarding',
  'Documents verify',
  'Treasury (company bank)',
  'Roles & permissions',
  'System settings',
  'Reports export',
  'Notices publish',
  'Website content',
];

const ROLES = [
  { key: 'ceo', label: 'CEO / Founder (admin)', color: '#00d4ff' },
  { key: 'cto', label: 'CTO', color: '#a78bfa' },
  { key: 'hr', label: 'HR', color: '#34d399' },
  { key: 'manager', label: 'Manager', color: '#fbbf24' },
  { key: 'developer', label: 'Developer / Employee', color: '#94a3b8' },
];

// true = full access, 'r' = read only, false = none
const DEFAULT_MATRIX = {
  'Dashboard overview': { ceo: true, cto: true, hr: true, manager: true, developer: 'r' },
  'Staff Directory': { ceo: true, cto: true, hr: true, manager: 'r', developer: false },
  'Add / Edit Employee': { ceo: true, cto: false, hr: true, manager: false, developer: false },
  'Attendance & timesheets': { ceo: true, cto: true, hr: true, manager: true, developer: 'r' },
  'Leave approve / reject': { ceo: true, cto: false, hr: true, manager: true, developer: false },
  'Performance ratings': { ceo: true, cto: true, hr: true, manager: true, developer: 'r' },
  'Payroll / salary slips': { ceo: true, cto: false, hr: true, manager: false, developer: 'r' },
  'Jobs & Applications': { ceo: true, cto: false, hr: true, manager: false, developer: false },
  'Offer / Onboarding': { ceo: true, cto: false, hr: true, manager: false, developer: false },
  'Documents verify': { ceo: true, cto: false, hr: true, manager: false, developer: false },
  'Treasury (company bank)': { ceo: true, cto: false, hr: false, manager: false, developer: false },
  'Roles & permissions': { ceo: true, cto: false, hr: false, manager: false, developer: false },
  'System settings': { ceo: true, cto: false, hr: false, manager: false, developer: false },
  'Reports export': { ceo: true, cto: true, hr: true, manager: 'r', developer: false },
  'Notices publish': { ceo: true, cto: true, hr: true, manager: true, developer: false },
  'Website content': { ceo: true, cto: false, hr: false, manager: false, developer: false },
};

function loadMatrix() {
  try {
    const raw = localStorage.getItem('ds_rbac_matrix');
    if (raw) return { ...DEFAULT_MATRIX, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_MATRIX;
}

export default function AdminRoles() {
  const { user } = useAuth();
  const [matrix, setMatrix] = useState(loadMatrix);
  const [saved, setSaved] = useState('');

  useEffect(() => {
    localStorage.setItem('ds_rbac_matrix', JSON.stringify(matrix));
  }, [matrix]);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container">
        <p>Only leadership / HR can open Roles & Permissions.</p>
        <Link to="/admin">← Back</Link>
      </div>
    );
  }

  const isCeo = user.role === 'admin';

  const cycle = (mod, roleKey) => {
    if (!isCeo) return;
    const cur = matrix[mod]?.[roleKey];
    let next;
    if (cur === true) next = 'r';
    else if (cur === 'r') next = false;
    else next = true;
    setMatrix((m) => ({
      ...m,
      [mod]: { ...(m[mod] || {}), [roleKey]: next },
    }));
    setSaved('Permissions updated (saved in browser).');
  };

  const cell = (val) => {
    if (val === true) return <span style={{ color: '#34d399', fontWeight: 700 }}>Full</span>;
    if (val === 'r') return <span style={{ color: '#fbbf24', fontWeight: 600 }}>Read</span>;
    return <span style={{ color: '#64748b' }}>None</span>;
  };

  return (
    <div className="section page-bg-roles">
      <div className="container">
        <p style={{ marginBottom: '0.5rem' }}>
          <Link to="/admin/hr" style={{ color: '#00d4ff' }}>← HR Module</Link>
        </p>
        <h1 className="section-title">🔐 Role-Based Access Control (RBAC)</h1>
        <AdminHero variant="roles" />
        <p className="section-subtitle">
          Set who sees what — CEO, CTO, HR, Manager, Developer. CEO can click cells to cycle:{' '}
          <strong>Full → Read → None</strong>.
        </p>
        {saved && <p style={{ color: '#34d399' }}>{saved}</p>}
        {!isCeo && (
          <p style={{ color: '#fbbf24', fontSize: '0.9rem' }}>View only — only CEO/Founder can change permissions.</p>
        )}

        <div className="card" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem', color: '#94a3b8' }}>Module</th>
                {ROLES.map((r) => (
                  <th key={r.key} style={{ padding: '0.75rem', color: r.color }}>
                    {r.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODULES.map((mod) => (
                <tr key={mod} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '0.7rem', color: '#e2e8f0', fontWeight: 500 }}>{mod}</td>
                  {ROLES.map((r) => (
                    <td
                      key={r.key}
                      onClick={() => cycle(mod, r.key)}
                      style={{
                        padding: '0.7rem',
                        cursor: isCeo ? 'pointer' : 'default',
                        userSelect: 'none',
                      }}
                      title={isCeo ? 'Click to change' : ''}
                    >
                      {cell(matrix[mod]?.[r.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0, color: '#00d4ff' }}>How roles map in login</h3>
          <ul style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
            <li>
              <strong>admin</strong> → CEO / Founder — full system including Treasury
            </li>
            <li>
              <strong>hr</strong> → HR Admin — staff, attendance, leave, payroll, hiring
            </li>
            <li>
              <strong>employee</strong> (Manager designation) → team attendance / leave approve where assigned
            </li>
            <li>
              <strong>employee</strong> (Developer) → own profile, attendance, leave apply, salary slip, tasks
            </li>
          </ul>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Your login: <strong style={{ color: '#e2e8f0' }}>{user.email}</strong> · role{' '}
            <strong style={{ color: '#00d4ff' }}>{user.role}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
