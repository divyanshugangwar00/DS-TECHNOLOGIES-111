import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function fmtDate(d) {
  if (!d) return '—';
  try {
    const x = new Date(d);
    if (Number.isNaN(x.getTime())) return String(d).slice(0, 10);
    return x.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return String(d);
  }
}

function daysBetween(from, to) {
  try {
    const a = new Date(from);
    const b = new Date(to);
    const diff = Math.round((b - a) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 1;
  } catch {
    return 1;
  }
}

function myKey(user) {
  return 'ds_my_leaves_' + (user?._id || user?.email || 'guest');
}

export default function LeaveApply() {
  const { user } = useAuth();
  const [form, setForm] = useState({ type: 'Casual', fromDate: '', toDate: '', reason: '' });
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem(myKey(user));
        let mine = raw ? JSON.parse(raw) : [];
        // merge status updates from admin global list
        const all = JSON.parse(localStorage.getItem('ds_all_leaves') || '[]');
        const byId = {};
        all.forEach((l) => {
          if (l.id) byId[l.id] = l;
          if (l._id) byId[l._id] = l;
        });
        mine = mine.map((l) => {
          const u = byId[l.id] || byId[l._id];
          if (u && u.status) return { ...l, status: u.status, reviewedAt: u.reviewedAt };
          return l;
        });
        // also pull any all-leaves for this user not in mine
        const emails = (user?.email || '').toLowerCase();
        all.forEach((l) => {
          if (
            (l.userId && user?._id && String(l.userId) === String(user._id)) ||
            (l.email && emails && l.email.toLowerCase() === emails)
          ) {
            if (!mine.find((m) => m.id === l.id || m._id === l._id)) mine.unshift(l);
          }
        });
        setList(mine);
        localStorage.setItem(myKey(user), JSON.stringify(mine));
      } catch (_) {}
    };
    load();
    window.addEventListener('ds-leaves-updated', load);
    window.addEventListener('focus', load);
    const t = setInterval(load, 3000);
    return () => {
      window.removeEventListener('ds-leaves-updated', load);
      window.removeEventListener('focus', load);
      clearInterval(t);
    };
  }, [user]);

  if (!user)
    return (
      <div className="section container">
        <p>Please login</p>
      </div>
    );

  const balance = { Casual: 8, Sick: 6, Annual: 12, Unpaid: '—' };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    if (!form.fromDate || !form.toDate) {
      setErr('From and To dates required');
      return;
    }
    const id = 'leave-' + Date.now();
    const entry = {
      id,
      _id: id,
      ...form,
      days: daysBetween(form.fromDate, form.toDate),
      status: 'Pending',
      createdAt: new Date().toISOString(),
      employeeName: user.name || user.email,
      name: user.name || user.email,
      email: user.email,
      userId: user._id,
      department: user.department || user.designation || '—',
    };

    try {
      const { data } = await api.post('/leaves/apply', form);
      if (data) {
        Object.assign(entry, data);
        if (!entry.id) entry.id = entry._id || id;
      }
    } catch (_) {
      // offline / no employee profile — still save locally
    }

    const next = [entry, ...list];
    setList(next);
    localStorage.setItem(myKey(user), JSON.stringify(next));
    try {
      const all = JSON.parse(localStorage.getItem('ds_all_leaves') || '[]');
      all.unshift(entry);
      localStorage.setItem('ds_all_leaves', JSON.stringify(all));
      window.dispatchEvent(new Event('ds-leaves-updated'));
    } catch (_) {}
    setMsg('Leave request submitted · Status: Pending (HR will approve/reject)');
    setForm({ type: 'Casual', fromDate: '', toDate: '', reason: '' });
  };

  return (
    <div className="section page-bg-employee">
      <div className="container" style={{ maxWidth: 640 }}>
        <p>
          <Link to="/employee" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
        </p>
        <h1 className="section-title">Apply Leave</h1>
        <p className="section-subtitle">
          Balance — Casual: {balance.Casual} · Sick: {balance.Sick} · Annual: {balance.Annual}
        </p>
        {msg && <p style={{ color: '#10b981' }}>{msg}</p>}
        {err && <p style={{ color: '#fca5a5' }}>{err}</p>}

        <form onSubmit={submit} className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginTop: 0 }}>New request</h3>
          <div className="form-group">
            <label>Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              style={{ width: '100%', background: '#0f172a', color: '#e2e8f0', padding: '0.5rem' }}
            >
              {['Casual', 'Sick', 'Annual', 'Unpaid'].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>From</label>
            <input type="date" value={form.fromDate} onChange={(e) => setForm({ ...form, fromDate: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>To</label>
            <input type="date" value={form.toDate} onChange={(e) => setForm({ ...form, toDate: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Reason</label>
            <textarea rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit request
          </button>
        </form>

        <div className="card">
          <h3 style={{ marginBottom: '0.75rem' }}>My leave history</h3>
          {list.length === 0 ? (
            <p style={{ color: '#94a3b8', margin: 0 }}>No leave requests yet.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#e2e8f0' }}>
              {list.map((l) => (
                <li key={l.id || l._id} style={{ marginBottom: 8 }}>
                  {l.type} · {fmtDate(l.fromDate)} → {fmtDate(l.toDate)}
                  <span
                    style={{
                      marginLeft: 8,
                      color:
                        l.status === 'Approved' ? '#10b981' : l.status === 'Rejected' ? '#fca5a5' : '#fbbf24',
                      fontWeight: 600,
                    }}
                  >
                    {l.status || 'Pending'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
