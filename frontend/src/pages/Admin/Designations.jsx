import { useState, useEffect } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SEED = [
  'Founder & CEO', 'Chairman', 'CTO', 'COO', 'CFO', 'CHRO', 'General Manager',
  'Senior Manager', 'Manager', 'Team Lead', 'Senior Software Engineer', 'Software Engineer',
  'Junior Developer', 'Intern – Software', 'HR Executive', 'Business Development Executive',
];

export default function AdminDesignations() {
  const { user } = useAuth();
  const [list, setList] = useState(SEED);
  const [name, setName] = useState('');
  useEffect(() => {
    try {
      const raw = localStorage.getItem('ds_designations');
      if (raw) setList(JSON.parse(raw));
    } catch (_) {}
  }, []);
  if (!user || (user.role !== 'admin' && user.role !== 'hr')) return <div className="section container"><p>Access denied</p></div>;
  const save = (next) => { setList(next); localStorage.setItem('ds_designations', JSON.stringify(next)); };
  return (
    <div className="section page-bg-admin">
      <div className="container" style={{ maxWidth: 640 }}>
        <h1 className="section-title">Designations</h1>
        <AdminHero variant="default" />
        <form className="card" style={{ marginBottom: '1rem' }} onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; save([...list, name.trim()]); setName(''); }}>
          <div className="form-group"><label>Add designation</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary">Add</button>
        </form>
        <div className="card">
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#cbd5e1' }}>
            {list.map((d) => (
              <li key={d} style={{ marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
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
