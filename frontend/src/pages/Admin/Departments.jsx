import { useState, useEffect } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SEED = [
  'Leadership', 'Engineering', 'Technology', 'Operations', 'HR', 'Sales', 'Marketing',
  'Finance', 'Data & AI', 'Cloud', 'Cybersecurity', 'Consulting', 'Design', 'Medical', 'Healthcare IT',
];

export default function AdminDepartments() {
  const { user } = useAuth();
  const [list, setList] = useState(SEED);
  const [name, setName] = useState('');
  useEffect(() => {
    try {
      const raw = localStorage.getItem('ds_departments');
      if (raw) setList(JSON.parse(raw));
    } catch (_) {}
  }, []);
  if (!user || (user.role !== 'admin' && user.role !== 'hr')) return <div className="section container"><p>Access denied</p></div>;
  const save = (next) => { setList(next); localStorage.setItem('ds_departments', JSON.stringify(next)); };
  return (
    <div className="section page-bg-admin">
      <div className="container" style={{ maxWidth: 640 }}>
        <h1 className="section-title">Departments</h1>
        <AdminHero variant="default" />
        <form className="card" style={{ marginBottom: '1rem' }} onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; save([...list, name.trim()]); setName(''); }}>
          <div className="form-group"><label>Add department</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Quality Assurance" />
          </div>
          <button type="submit" className="btn btn-primary">Add</button>
        </form>
        <div className="card">
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#cbd5e1' }}>
            {list.map((d) => (
              <li key={d} style={{ marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <span>{d}</span>
                <button type="button" onClick={() => save(list.filter((x) => x !== d))} style={{ fontSize: '0.75rem', color: '#fca5a5', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
        <p style={{ marginTop: '1rem' }}><Link to="/admin" style={{ color: '#00d4ff' }}>← Dashboard</Link></p>
      </div>
    </div>
  );
}
