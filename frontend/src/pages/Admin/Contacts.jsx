import { useEffect, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminContacts() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'hr')) {
      api.get('/contact')
        .then((res) => setContacts(res.data))
        .catch((err) => setError(err.response?.data?.message || 'Failed to load'));
    }
  }, [user]);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return <div className="section container"><p>Access denied</p></div>;
  }

  return (
    <div className="section page-bg-admin">
      <div className="container">
        <h1 className="section-title">Contact Submissions</h1>
        <AdminHero variant="default" />
        {error && <p style={{ color: '#fca5a5' }}>{error}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {contacts.length === 0 ? (
            <div className="card"><p style={{ color: '#94a3b8' }}>No messages yet. They appear when someone submits Contact form.</p></div>
          ) : (
            contacts.map((c) => (
              <div className="card" key={c._id}>
                <h3>{c.name}</h3>
                <p style={{ color: '#94a3b8' }}>{c.email} {c.phone && `· ${c.phone}`}</p>
                <p style={{ color: '#00d4ff' }}>{c.subject || 'No subject'}</p>
                <p style={{ color: '#cbd5e1', marginTop: '0.5rem' }}>{c.message}</p>
                <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.5rem' }}>{new Date(c.createdAt).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
        <p style={{ marginTop: '1rem' }}><Link to="/admin" style={{ color: '#00d4ff' }}>← Dashboard</Link></p>
      </div>
    </div>
  );
}
