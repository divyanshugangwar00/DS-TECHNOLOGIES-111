import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMsg('');
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMsg(data.message || 'If this email exists, password reset info was sent / shown to admin.');
    } catch (err) {
      // offline fallback
      setMsg(
        'Password reset request noted. Contact HR/Admin (admin@dstechnologies.com) or try offline demo passwords: admin123 / Ds@2026'
      );
      if (err.response?.data?.message) setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section page-bg-auth">
      <div className="container" style={{ maxWidth: 420 }}>
        <h1 className="section-title">Forgot Password</h1>
        <p className="section-subtitle">Email enter karein — Admin reset kar sakte hain</p>
        {msg && <p style={{ color: '#10b981' }}>{msg}</p>}
        {error && <p style={{ color: '#fca5a5' }}>{error}</p>}
        <form onSubmit={submit} className="card">
          <div className="form-group">
            <label>Registered Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Submitting…' : 'Request Reset'}
          </button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Link to="/login" style={{ color: '#00d4ff' }}>
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
