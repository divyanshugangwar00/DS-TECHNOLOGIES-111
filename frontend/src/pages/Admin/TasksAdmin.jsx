import { useState, useEffect } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', assignee: '', priority: 'Medium', deadline: '' });
  useEffect(() => {
    try {
      const raw = localStorage.getItem('ds_admin_tasks');
      if (raw) setTasks(JSON.parse(raw));
    } catch (_) {}
  }, []);
  if (!user || (user.role !== 'admin' && user.role !== 'hr')) return <div className="section container"><p>Access denied</p></div>;
  const save = (next) => { setTasks(next); localStorage.setItem('ds_admin_tasks', JSON.stringify(next)); };
  return (
    <div className="section page-bg-admin">
      <div className="container" style={{ maxWidth: 640 }}>
        <h1 className="section-title">Tasks</h1>
        <AdminHero variant="default" />
        <form className="card" style={{ marginBottom: '1rem' }} onSubmit={(e) => {
          e.preventDefault();
          if (!form.title.trim()) return;
          save([{ ...form, id: Date.now(), status: 'Open' }, ...tasks]);
          setForm({ title: '', assignee: '', priority: 'Medium', deadline: '' });
        }}>
          <div className="form-group"><label>Task</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
          <div className="form-group"><label>Assignee name</label><input value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} /></div>
          <div className="grid-2">
            <div className="form-group"><label>Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} style={{ background: '#0f172a', color: '#e2e8f0' }}>
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>
            <div className="form-group"><label>Deadline</label><input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></div>
          </div>
          <button type="submit" className="btn btn-primary">Assign Task</button>
        </form>
        {tasks.map((t) => (
          <div key={t.id} className="card" style={{ marginBottom: '0.5rem' }}>
            <strong>{t.title}</strong>
            <p style={{ color: '#94a3b8', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>{t.assignee || 'Unassigned'} · {t.priority} · {t.deadline || '—'} · {t.status}</p>
          </div>
        ))}
        <p style={{ marginTop: '1rem' }}><Link to="/admin" style={{ color: '#00d4ff' }}>← Dashboard</Link></p>
      </div>
    </div>
  );
}
