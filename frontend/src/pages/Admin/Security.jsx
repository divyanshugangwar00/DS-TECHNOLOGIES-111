import { useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminSecurity() {
  const { user } = useAuth();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  if (!user) return null;

  const changePassword = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    if (form.next.length < 6) {
      setErr('New password min 6 characters');
      return;
    }
    if (form.next !== form.confirm) {
      setErr('Passwords do not match');
      return;
    }
    try {
      await api.put('/auth/password', { currentPassword: form.current, newPassword: form.next });
      setMsg('Password updated successfully');
      setForm({ current: '', next: '', confirm: '' });
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Update failed — use seed password if first time, or API may need backend support');
    }
  };

  return (
    <div className="section page-bg-admin">
      <div className="container" style={{ maxWidth: 520 }}>
        <h1 className="section-title">🔒 Security</h1>
        <AdminHero variant="default" />
        <p className="section-subtitle">Logged in as {user.email}</p>
        <form onSubmit={changePassword} className="card">
          <div className="form-group">
            <label>Current password</label>
            <input type="password" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>New password</label>
            <input type="password" value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Confirm new password</label>
            <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
          </div>
          {err && <p style={{ color: '#fca5a5' }}>{err}</p>}
          {msg && <p style={{ color: '#10b981' }}>{msg}</p>}
          <button type="submit" className="btn btn-primary">Change Password</button>
        </form>
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3>Coming soon</h3>
          <ul style={{ color: '#94a3b8' }}>
            <li>Forgot password email flow</li>
            <li>Login history & active sessions</li>
            <li>Two-factor authentication</li>
            <li>Account lock after failed attempts</li>
          </ul>
        </div>
        <p style={{ marginTop: '1rem' }}><Link to="/admin" style={{ color: '#00d4ff' }}>← Dashboard</Link></p>
      </div>
    </div>
  );
}
