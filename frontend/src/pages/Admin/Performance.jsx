import { useEffect, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const QUARTERS = ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'];

function loadPerf() {
  try {
    return JSON.parse(localStorage.getItem('ds_performance') || '[]');
  } catch {
    return [];
  }
}

export default function AdminPerformance() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState(loadPerf);
  const [form, setForm] = useState({
    employeeId: '',
    employeeName: '',
    quarter: 'Q1 2026',
    rating: 4,
    goals: '',
    feedback: '',
    strengths: '',
    improvements: '',
  });
  const [filterQ, setFilterQ] = useState('All');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'hr')) return;
    api
      .get('/employees')
      .then((res) => setEmployees(res.data || []))
      .catch(() => {
        try {
          const local = JSON.parse(localStorage.getItem('ds_employees') || '[]');
          setEmployees(local);
        } catch {}
      });
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ds_performance', JSON.stringify(records));
  }, [records]);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container">
        <p>HR / Admin only.</p>
        <Link to="/admin">← Back</Link>
      </div>
    );
  }

  const onEmpChange = (id) => {
    const emp = employees.find((e) => (e._id || e.id || e.employeeId) === id);
    setForm((f) => ({
      ...f,
      employeeId: id,
      employeeName: emp?.name || emp?.fullName || '',
    }));
  };

  const save = (e) => {
    e.preventDefault();
    if (!form.employeeName && !form.employeeId) {
      setMsg('Select employee');
      return;
    }
    const row = {
      id: `perf-${Date.now()}`,
      ...form,
      employeeName:
        form.employeeName ||
        employees.find((x) => (x._id || x.id) === form.employeeId)?.name ||
        'Employee',
      updatedAt: new Date().toISOString(),
      by: user.email,
    };
    setRecords((r) => [row, ...r]);
    setMsg('Performance record saved.');
    setForm((f) => ({ ...f, goals: '', feedback: '', strengths: '', improvements: '', rating: 4 }));
  };

  const remove = (id) => {
    if (!window.confirm('Delete this performance entry?')) return;
    setRecords((r) => r.filter((x) => x.id !== id));
  };

  const filtered = records.filter((r) => filterQ === 'All' || r.quarter === filterQ);

  const stars = (n) => '★'.repeat(Number(n) || 0) + '☆'.repeat(5 - (Number(n) || 0));

  return (
    <div className="section page-bg-performance">
      <div className="container">
        <p style={{ marginBottom: '0.5rem' }}>
          <Link to="/admin/hr" style={{ color: '#00d4ff' }}>
            ← HR Module
          </Link>
        </p>
        <h1 className="section-title">📈 Performance Tracker</h1>
        <AdminHero variant="performance" />
        <p className="section-subtitle">
          Quarterly ratings, goals and feedback logs for staff — visible to HR and leadership.
        </p>
        {msg && <p style={{ color: '#34d399' }}>{msg}</p>}

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Add / update review</h3>
          <form onSubmit={save} style={{ display: 'grid', gap: '0.75rem', maxWidth: 640 }}>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Employee
              <select
                value={form.employeeId}
                onChange={(e) => onEmpChange(e.target.value)}
                required
                style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.55rem', borderRadius: 8 }}
              >
                <option value="">Select…</option>
                {employees.map((e) => (
                  <option key={e._id || e.id || e.employeeId} value={e._id || e.id || e.employeeId}>
                    {e.name || e.fullName} · {e.department || ''} · {e.designation || ''}
                  </option>
                ))}
              </select>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                Quarter
                <select
                  value={form.quarter}
                  onChange={(e) => setForm({ ...form, quarter: e.target.value })}
                  style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.55rem', borderRadius: 8 }}
                >
                  {QUARTERS.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                Rating (1–5)
                <select
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                  style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.55rem', borderRadius: 8 }}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} — {stars(n)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Goals for period
              <textarea
                value={form.goals}
                onChange={(e) => setForm({ ...form, goals: e.target.value })}
                rows={2}
                style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.55rem', borderRadius: 8 }}
                placeholder="OKRs / delivery targets…"
              />
            </label>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Feedback
              <textarea
                value={form.feedback}
                onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                rows={2}
                style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.55rem', borderRadius: 8 }}
              />
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                Strengths
                <input
                  value={form.strengths}
                  onChange={(e) => setForm({ ...form, strengths: e.target.value })}
                  style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.55rem', borderRadius: 8 }}
                />
              </label>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                Improvements
                <input
                  value={form.improvements}
                  onChange={(e) => setForm({ ...form, improvements: e.target.value })}
                  style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.55rem', borderRadius: 8 }}
                />
              </label>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
              Save performance log
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: '0.8rem', opacity: filterQ === 'All' ? 1 : 0.6 }}
            onClick={() => setFilterQ('All')}
          >
            All
          </button>
          {QUARTERS.map((q) => (
            <button
              key={q}
              type="button"
              className="btn btn-outline"
              style={{ fontSize: '0.8rem', opacity: filterQ === q ? 1 : 0.6 }}
              onClick={() => setFilterQ(q)}
            >
              {q}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {filtered.length === 0 && (
            <div className="card" style={{ color: '#94a3b8' }}>
              No performance logs yet. Add the first review above.
            </div>
          )}
          {filtered.map((r) => (
            <div key={r.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <strong style={{ color: '#e2e8f0' }}>{r.employeeName}</strong>
                  <span style={{ color: '#64748b', marginLeft: 8 }}>{r.quarter}</span>
                  <p style={{ margin: '0.35rem 0', color: '#fbbf24' }}>{stars(r.rating)} ({r.rating}/5)</p>
                </div>
                <button type="button" className="btn btn-outline" style={{ fontSize: '0.75rem' }} onClick={() => remove(r.id)}>
                  Delete
                </button>
              </div>
              {r.goals && (
                <p style={{ color: '#cbd5e1', margin: '0.25rem 0' }}>
                  <strong style={{ color: '#94a3b8' }}>Goals:</strong> {r.goals}
                </p>
              )}
              {r.feedback && (
                <p style={{ color: '#cbd5e1', margin: '0.25rem 0' }}>
                  <strong style={{ color: '#94a3b8' }}>Feedback:</strong> {r.feedback}
                </p>
              )}
              {(r.strengths || r.improvements) && (
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '0.25rem 0' }}>
                  Strengths: {r.strengths || '—'} · Improve: {r.improvements || '—'}
                </p>
              )}
              <p style={{ color: '#475569', fontSize: '0.75rem', margin: '0.5rem 0 0' }}>
                By {r.by} · {new Date(r.updatedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
