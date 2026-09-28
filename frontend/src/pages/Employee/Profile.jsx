import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function EmployeeProfile() {
  const { user } = useAuth();
  const [p, setP] = useState(null);
  useEffect(() => {
    api.get('/employees/me').then((r) => setP(r.data)).catch(() => {});
  }, []);
  if (!user) return null;
  const row = (label, val) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '0.55rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <span style={{ color: '#94a3b8' }}>{label}</span>
      <span style={{ color: '#e2e8f0', textAlign: 'right' }}>{val || '—'}</span>
    </div>
  );
  return (
    <div className="section page-bg-admin">
      <div className="container" style={{ maxWidth: 640 }}>
        <h1 className="section-title">My Profile</h1>
        <div className="card" style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{ width: 88, height: 88, borderRadius: '50%', margin: '0 auto 1rem', background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700 }}>
            {(user.name || 'E')[0].toUpperCase()}
          </div>
          <h2 style={{ margin: 0 }}>{user.name}</h2>
          <p style={{ color: '#00d4ff', margin: '0.35rem 0' }}>{p?.designation || 'Team Member'}</p>
          <p style={{ color: '#94a3b8', margin: 0 }}>{p?.department}</p>
        </div>
        <div className="card">
          {row('Employee ID', p?.employeeId)}
          {row('Company email', user.email)}
          {row('Mobile', user.phone)}
          {row('Joining date', p?.joiningDate ? new Date(p.joiningDate).toLocaleDateString('en-IN') : null)}
          {row('Employment type', p?.employmentType)}
          {row('Work location', p?.workLocation)}
          {row('Qualification', p?.qualification)}
          {row('Experience', p?.experienceYears)}
          {row('Skills', (p?.skills || []).join(', '))}
          {row('Gender', p?.gender)}
          {row('Address', [p?.address, p?.city, p?.state, p?.pin].filter(Boolean).join(', '))}
          {row('Emergency contact', p?.emergencyContact)}
          {row('Personal email', p?.personalEmail)}
        </div>
        <p style={{ marginTop: '1rem' }}><Link to="/employee" style={{ color: '#00d4ff' }}>← Dashboard</Link></p>
      </div>
    </div>
  );
}
