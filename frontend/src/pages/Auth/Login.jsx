import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../../components/ErrorMessage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.role === 'admin' || data.role === 'hr') navigate('/admin');
      else if (data.role === 'employee') navigate('/employee');
      else navigate('/careers');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Offline: admin@dstechnologies.com / admin123');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section page-bg-auth" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: 440 }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img src="/logo.jpg" alt="DS" style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto 1rem' }} />
            <h1 style={{ fontSize: '1.75rem' }}>Welcome Back</h1>
            <p style={{ color: '#94a3b8' }}>Sign in to your account</p>
          </div>

          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@email.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8' }}>
            <Link to="/forgot-password" style={{ color: '#00d4ff' }}>Forgot password?</Link>
            <br />
            Don’t have an account? <Link to="/register" style={{ color: '#00d4ff' }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
