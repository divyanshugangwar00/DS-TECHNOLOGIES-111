import { useEffect, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminPasswords() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [q, setQ] = useState('');
  const [resetId, setResetId] = useState('');
  const [newPass, setNewPass] = useState('');

  const load = () => {
    api
      .get('/auth/admin/passwords')
      .then((res) => setRows(res.data || []))
      .catch((e) => setError(e.response?.data?.message || 'Failed — admin login + backend required'));
  };

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'hr')) load();
  }, [user]);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container">
        <p>Only Admin / HR</p>
      </div>
    );
  }

  const filtered = rows.filter(
    (r) =>
      !q ||
      r.name?.toLowerCase().includes(q.toLowerCase()) ||
      r.email?.toLowerCase().includes(q.toLowerCase())
  );

  const reset = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    try {
      await api.put('/auth/admin/set-password', { userId: resetId, newPassword: newPass });
      setMsg('Password updated');
      setNewPass('');
      setResetId('');
      load();
    } catch (ex) {
      setError(ex.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="section page-bg-admin">
      <div className="container">
        <h1 className="section-title">🔐 Passwords (Admin)</h1>
        <AdminHero variant="default" />
        <p className="section-subtitle">
          Current + history · User change / admin reset dono yahan update hote rehte hain
        </p>
        <p style={{ color: '#fbbf24', fontSize: '0.85rem' }}>
          Sirf Leadership/HR ke liye. Production me is page ko restrict / audit rakhein.
        </p>
        {error && <p style={{ color: '#fca5a5' }}>{error}</p>}
        {msg && <p style={{ color: '#10b981' }}>{msg}</p>}

        <input
          placeholder="Search name / email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ marginBottom: '1rem', width: '100%', maxWidth: 360, padding: '0.6rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: '#e2e8f0' }}
        />

        <form onSubmit={reset} className="card" style={{ marginBottom: '1.25rem' }}>
          <h3>Reset password</h3>
          <div className="grid-2">
            <div className="form-group">
              <label>User</label>
              <select value={resetId} onChange={(e) => setResetId(e.target.value)} required style={{ background: '#0f172a', color: '#e2e8f0' }}>
                <option value="">Select…</option>
                {rows.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.name} ({r.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>New password</label>
              <input value={newPass} onChange={(e) => setNewPass(e.target.value)} required minLength={6} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Set Password
          </button>
        </form>

        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.12)', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Name</th>
                <th style={{ padding: '0.5rem' }}>Email</th>
                <th style={{ padding: '0.5rem' }}>Role</th>
                <th style={{ padding: '0.5rem' }}>Current password</th>
                <th style={{ padding: '0.5rem' }}>History (old → new)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '0.5rem' }}>{r.name}</td>
                  <td style={{ padding: '0.5rem' }}>{r.email}</td>
                  <td style={{ padding: '0.5rem' }}>{r.role}</td>
                  <td style={{ padding: '0.5rem', color: '#10b981', fontFamily: 'monospace' }}>{r.currentPassword}</td>
                  <td style={{ padding: '0.5rem', color: '#94a3b8', fontSize: '0.75rem' }}>
                    {(r.passwordHistory || []).slice(0, 5).map((h, i) => (
                      <div key={i}>
                        {h.passwordPlain} · {h.changedBy} · {h.changedAt ? new Date(h.changedAt).toLocaleString() : ''}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p style={{ color: '#94a3b8' }}>No users / backend off</p>}
        </div>
        <p style={{ marginTop: '1rem' }}>
          <Link to="/admin" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
