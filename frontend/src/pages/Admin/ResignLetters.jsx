import { useEffect, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const KEY = 'ds_resignations';

export default function AdminResignLetters() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [dept, setDept] = useState('All');
  const [msg, setMsg] = useState('');

  const refresh = () => {
    try {
      setList(JSON.parse(localStorage.getItem(KEY) || '[]'));
    } catch {
      setList([]);
    }
  };

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 4000);
    window.addEventListener('focus', refresh);
    window.addEventListener('ds-resign-updated', refresh);
    return () => {
      clearInterval(t);
      window.removeEventListener('focus', refresh);
      window.removeEventListener('ds-resign-updated', refresh);
    };
  }, []);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container">
        <p>Access denied</p>
      </div>
    );
  }

  const save = (next) => {
    setList(next);
    localStorage.setItem(KEY, JSON.stringify(next));
    try {
      window.dispatchEvent(new Event('ds-resign-updated'));
    } catch (_) {}
  };

  const displayName = (r) => r.employeeName || r.name || r.email || 'Employee';

  const updateStatus = (id, status, extra = {}) => {
    const next = list.map((r) => {
      if (r.id === id || (!r.id && (r.email === id || r.createdAt === id))) {
        return { ...r, status, ...extra, updatedAt: new Date().toISOString() };
      }
      return r;
    });
    save(next);
    setMsg(`Updated: ${status}`);
  };

  const filtered = list.filter((r) => dept === 'All' || (r.department || '') === dept);

  return (
    <div className="section page-bg-admin">
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 className="section-title">🚪 Resignation Letters</h1>
        <AdminHero variant="hr" showThumbs={false} />
        <button type="button" className="btn btn-outline" style={{ marginBottom: 8 }} onClick={refresh}>
          Refresh
        </button>
        {msg && <p style={{ color: '#34d399' }}>{msg}</p>}
        <p className="section-subtitle">Approve / reject is visible to the employee on their Resign page.</p>

        <select value={dept} onChange={(e) => setDept(e.target.value)} style={{ marginBottom: 12, padding: 8, background: '#0f172a', color: '#e2e8f0', borderRadius: 8 }}>
          {['All', 'Engineering', 'HR', 'Operations', 'Sales', 'Finance', 'Technology', 'engineering'].map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        {filtered.length === 0 ? (
          <div className="card">
            <p style={{ color: '#94a3b8' }}>No resignations yet. Employee submits from /employee/resign</p>
          </div>
        ) : (
          filtered.map((r, i) => (
            <div className="card" key={r.id || i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <strong style={{ color: '#f8fafc' }}>{displayName(r)}</strong>
                <span style={{ color: r.status === 'Approved' ? '#34d399' : r.status === 'Rejected' ? '#f87171' : '#fbbf24' }}>
                  {r.status || 'Submitted'}
                </span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                {r.email} · {r.department} · LWD {r.lastWorkingDay} · {r.reason}
              </p>
              <p style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                Bank: {r.bankAccount || '—'} · IFSC {r.ifsc || '—'} · Settlement: {r.salarySettlement || 'Pending'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                <button type="button" className="btn btn-primary" style={{ fontSize: '0.8rem' }} onClick={() => updateStatus(r.id, 'Approved', { hrNote: 'Resignation accepted by HR' })}>
                  Approve (employee sees)
                </button>
                <button type="button" className="btn btn-outline" style={{ fontSize: '0.8rem' }} onClick={() => updateStatus(r.id, 'Rejected', { hrNote: 'Please contact HR' })}>
                  Reject
                </button>
                <button type="button" className="btn btn-outline" style={{ fontSize: '0.8rem' }} onClick={() => updateStatus(r.id, 'Approved', { salarySettlement: 'Paid', hrNote: 'Final settlement processed' })}>
                  Mark settlement paid
                </button>
              </div>
            </div>
          ))
        )}
        <p style={{ marginTop: 16 }}>
          <Link to="/admin" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
