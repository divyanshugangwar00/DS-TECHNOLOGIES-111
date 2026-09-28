import { useEffect, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminRegistrations() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // all | user | employee

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'hr')) return;
    api
      .get('/auth/admin/passwords')
      .then((res) => {
setRows(res.data || []);
      })
      .catch((e) => setError(e.response?.data?.message || 'Load failed'));
  }, [user]);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return <div className="section container"><p>Access denied</p></div>;
  }

  const visible = rows.filter((u) => {
    if (u.role === 'admin') return false;
    if (roleFilter === 'all') return true;
    if (roleFilter === 'employee') return u.role === 'employee' || u.role === 'hr';
    if (roleFilter === 'user') return u.role === 'user' || !u.role;
    return true;
  });


  const downloadPdf = (u) => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Account - ${u.name}</title>
      <style>body{font-family:system-ui;padding:32px;max-width:640px;margin:auto}
      h1{color:#0369a1} table{width:100%;border-collapse:collapse} td{padding:8px;border-bottom:1px solid #e2e8f0}</style></head><body>
      <div style="display:flex;gap:12px;align-items:center;border-bottom:2px solid #0369a1;padding-bottom:12px;margin-bottom:16px">
        <img src="${window.location.origin}/logo.jpg" width="56" onerror="this.style.display='none'"/>
        <div><strong style="color:#0369a1;font-size:18px">DS-TECHNOLOGIES</strong><br/>
        <span style="font-size:12px;color:#64748b">Village Kuiya Rampur, Faridpur, Bareilly, UP 243503<br/>7895733906</span></div>
      </div>
      <h1>Account Registration Details</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }} className="no-print">
          <button type="button" className={'btn ' + (roleFilter === 'all' ? 'btn-primary' : 'btn-outline')} onClick={() => setRoleFilter('all')}>All ({rows.filter(u => u.role !== 'admin').length})</button>
          <button type="button" className={'btn ' + (roleFilter === 'user' ? 'btn-primary' : 'btn-outline')} onClick={() => setRoleFilter('user')}>Website Users</button>
          <button type="button" className={'btn ' + (roleFilter === 'employee' ? 'btn-primary' : 'btn-outline')} onClick={() => setRoleFilter('employee')}>Employees</button>
          <Link to="/admin/employees" className="btn btn-outline">Open Employees module →</Link>
        </div>
        <table>
        <tr><td>Name</td><td><strong>${u.name || ''}</strong></td></tr>
        <tr><td>Email</td><td>${u.email || ''}</td></tr>
        <tr><td>Phone</td><td>${u.phone || '—'}</td></tr>
        <tr><td>Role</td><td>${u.role || 'user'}</td></tr>
        <tr><td>Registered</td><td>${u.createdAt ? new Date(u.createdAt).toLocaleString('en-IN') : '—'}</td></tr>
        <tr><td>Status</td><td>${u.isActive === false ? 'Inactive' : 'Active'}</td></tr>
      </table>
      <p style="margin-top:32px;font-size:12px;color:#64748b">Generated from Admin panel · DS-TECHNOLOGIES</p>
      <script>window.onload=function(){window.print()}<\/script>
      </body></html>`);
    w.document.close();
  };

  return (
    <div className="section page-bg-admin">
      <div className="container">
        <h1 className="section-title" style={{ color: '#38bdf8' }}>New Accounts / Registrations</h1>
        <AdminHero variant="registrations" />
        <p className="section-subtitle">Website register → yahan full details · PDF download</p>
        {error && <p style={{ color: '#fca5a5' }}>{error}</p>}
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                <th style={{ padding: '0.6rem' }}>Name</th>
                <th style={{ padding: '0.6rem' }}>Email</th>
                <th style={{ padding: '0.6rem' }}>Phone</th>
                <th style={{ padding: '0.6rem' }}>Role</th>
                <th style={{ padding: '0.6rem' }}>Registered</th>
                <th style={{ padding: '0.6rem' }}>PDF</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '0.6rem' }}>{u.name}</td>
                  <td style={{ padding: '0.6rem' }}>{u.email}</td>
                  <td style={{ padding: '0.6rem' }}>{u.phone || '—'}</td>
                  <td style={{ padding: '0.6rem' }}>{u.role}</td>
                  <td style={{ padding: '0.6rem' }}>{u.createdAt ? new Date(u.createdAt).toLocaleString('en-IN') : '—'}</td>
                  <td style={{ padding: '0.6rem' }}>
                    <button type="button" className="btn btn-outline" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }} onClick={() => downloadPdf(u)}>
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visible.length === 0 && <p style={{ color: '#94a3b8', padding: '1rem' }}>No users yet / backend offline</p>}
        </div>
        <p style={{ marginTop: '1rem' }}><Link to="/admin" style={{ color: '#00d4ff' }}>← Dashboard</Link></p>
      </div>
    </div>
  );
}
