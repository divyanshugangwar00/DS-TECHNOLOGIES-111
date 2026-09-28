import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../../components/ErrorMessage';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate('/careers');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 440 }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img src="/logo.jpg" alt="DS" style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto 1rem' }} />
            <h1 style={{ fontSize: '1.75rem' }}>Create Account</h1>
            <p style={{ color: '#94a3b8' }}>Join DS-TECHNOLOGIES Careers</p>
          </div>

          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Password (min 6 characters)</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Creating...' : 'Register'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8' }}>
            Already have an account? <Link to="/login" style={{ color: '#00d4ff' }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
