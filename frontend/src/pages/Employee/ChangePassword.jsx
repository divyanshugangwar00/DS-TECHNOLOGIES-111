import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ChangePassword() {
  const { user } = useAuth();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  if (!user) {
    return (
      <div className="section container">
        <p>Please login</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  const submit = async (e) => {
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
      setMsg('Password changed successfully');
      setForm({ current: '', next: '', confirm: '' });
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Failed — check current password');
    }
  };

  return (
    <div className="section page-bg-auth">
      <div className="container" style={{ maxWidth: 480 }}>
        <h1 className="section-title">Change Password</h1>
        <p className="section-subtitle">{user.email}</p>
        <form onSubmit={submit} className="card">
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
          <button type="submit" className="btn btn-primary">Update Password</button>
        </form>
        <p style={{ marginTop: '1rem' }}><Link to="/employee" style={{ color: '#00d4ff' }}>← Dashboard</Link></p>
      </div>
    </div>
  );
}
