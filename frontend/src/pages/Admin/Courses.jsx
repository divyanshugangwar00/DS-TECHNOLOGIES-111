import { useState, useEffect } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SEED = [
  { id: '1', name: 'BCA', category: 'Technology', duration: '3 years', eligibility: '12th', careers: 'Web Dev, Software' },
  { id: '2', name: 'B.Tech CSE', category: 'Technology', duration: '4 years', eligibility: '12th PCM', careers: 'SDE, Full Stack' },
  { id: '3', name: 'MCA', category: 'Technology', duration: '2 years', eligibility: 'Graduation', careers: 'Software, Cloud' },
  { id: '4', name: 'B.Com', category: 'Commerce', duration: '3 years', eligibility: '12th', careers: 'Accounts, Finance' },
  { id: '5', name: 'MBA', category: 'Commerce', duration: '2 years', eligibility: 'Graduation', careers: 'Management, Sales' },
  { id: '6', name: 'MBBS', category: 'Medical', duration: '5.5 years', eligibility: 'NEET', careers: 'Doctor' },
  { id: '7', name: 'B.Pharm', category: 'Medical', duration: '4 years', eligibility: '12th PCB', careers: 'Pharmacist' },
  { id: '8', name: 'Diploma Computer', category: 'Engineering', duration: '3 years', eligibility: '10th', careers: 'IT Support, Web' },
  { id: '9', name: 'B.Tech EE', category: 'Engineering', duration: '4 years', eligibility: '12th PCM', careers: 'GET, Software trainee' },
  { id: '10', name: 'BA', category: 'Arts', duration: '3 years', eligibility: '12th', careers: 'Content, Support' },
];

export default function AdminCourses() {
  const { user } = useAuth();
  const [list, setList] = useState(SEED);
  const [form, setForm] = useState({ name: '', category: 'Technology', duration: '', eligibility: '', careers: '' });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ds_courses');
      if (raw) setList(JSON.parse(raw));
    } catch (_) {}
  }, []);

  const persist = (next) => {
    setList(next);
    localStorage.setItem('ds_courses', JSON.stringify(next));
  };

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return <div className="section container"><p>Access denied</p></div>;
  }

  const add = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    persist([...list, { ...form, id: Date.now().toString() }]);
    setForm({ name: '', category: 'Technology', duration: '', eligibility: '', careers: '' });
  };

  const remove = (id) => persist(list.filter((c) => c.id !== id));

  return (
    <div className="section page-bg-admin">
      <div className="container">
        <h1 className="section-title">🎓 Courses</h1>
        <AdminHero variant="default" />
        <p className="section-subtitle">Catalog for apply form & careers mapping (saved in browser)</p>

        <form onSubmit={add} className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="grid-2">
            <div className="form-group">
              <label>Course name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ background: '#0f172a', color: '#e2e8f0' }}>
                {['Technology', 'Engineering', 'Commerce', 'Medical', 'Science', 'Arts'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Duration</label>
              <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Eligibility</label>
              <input value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Career options / related jobs</label>
            <input value={form.careers} onChange={(e) => setForm({ ...form, careers: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary">+ Add Course</button>
        </form>

        <div className="grid-2">
          {list.map((c) => (
            <div key={c.id} className="card">
              <h3>{c.name}</h3>
              <p style={{ color: '#00d4ff', margin: '0.25rem 0' }}>{c.category}</p>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Duration: {c.duration || '—'}</p>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Eligibility: {c.eligibility || '—'}</p>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Careers: {c.careers || '—'}</p>
              <button type="button" onClick={() => remove(c.id)} style={{ marginTop: '0.75rem', padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', borderRadius: 6, color: '#fca5a5' }}>
                Delete
              </button>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '1rem' }}><Link to="/admin" style={{ color: '#00d4ff' }}>← Dashboard</Link></p>
      </div>
    </div>
  );
}
