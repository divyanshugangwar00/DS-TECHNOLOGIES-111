import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function EmployeeDirectory() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  useEffect(() => {
    // employees list may be admin-only — try anyway, fallback empty
    api.get('/employees').then((r) => setList(r.data || [])).catch(() => setList([]));
  }, []);
  return (
    <div className="section page-bg-admin">
      <div className="container">
        <h1 className="section-title">Company Directory</h1>
        <p className="section-subtitle">HR · Managers · Team (public work contacts only)</p>
        {list.length === 0 ? (
          <div className="card">
            <p style={{ color: '#94a3b8' }}>Directory load needs HR permission. Contact:</p>
            <p>HR · soni@dstechnologies.com</p>
            <p>Phone · 7895733906</p>
          </div>
        ) : (
          <div className="grid-2">
            {list.slice(0, 40).map((e) => (
              <div key={e._id} className="card">
                <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem' }}>{e.user?.name}</h3>
                <p style={{ color: '#00d4ff', margin: 0, fontSize: '0.9rem' }}>{e.designation}</p>
                <p style={{ color: '#94a3b8', margin: '0.25rem 0', fontSize: '0.85rem' }}>{e.department}</p>
                <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>{e.user?.email}</p>
              </div>
            ))}
          </div>
        )}
        <p style={{ marginTop: '1rem' }}><Link to="/employee" style={{ color: '#00d4ff' }}>← Dashboard</Link></p>
      </div>
    </div>
  );
}
