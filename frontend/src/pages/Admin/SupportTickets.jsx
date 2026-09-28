import { useEffect, useMemo, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PRI = ['Critical', 'High', 'Medium', 'Low'];
const STATUS = ['Open', 'In Progress', 'Waiting', 'Resolved', 'Closed'];
const TYPES = ['Client Bug', 'Internal IT', 'Network', 'Server / Login', 'Hardware', 'Other'];

function load() {
  try {
    const raw = localStorage.getItem('ds_support_tickets');
    if (raw) return JSON.parse(raw);
  } catch {}
  return [
    {
      id: 'TKT-1001',
      type: 'Client Bug',
      title: 'Checkout button not responding on mobile',
      reporter: 'Bareilly Retail Mart',
      email: 'amit@retailmart.example',
      priority: 'High',
      status: 'Open',
      slaHours: 24,
      createdAt: new Date(Date.now() - 3600e3 * 20).toISOString(),
      notes: 'Reproduced on Chrome Android.',
    },
    {
      id: 'TKT-1002',
      type: 'Internal IT',
      title: 'VPN login fails for new employee',
      reporter: 'Rohit Kumar',
      email: 'rohit@dstechnologies.com',
      priority: 'Medium',
      status: 'In Progress',
      slaHours: 48,
      createdAt: new Date(Date.now() - 3600e3 * 5).toISOString(),
      notes: 'Reset credentials pending.',
    },
  ];
}

function hoursOpen(iso) {
  return (Date.now() - new Date(iso).getTime()) / 3600e3;
}

export default function AdminSupportTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState(load);
  const [filter, setFilter] = useState('All');
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({
    type: 'Client Bug',
    title: '',
    reporter: '',
    email: '',
    priority: 'Medium',
    slaHours: 24,
    notes: '',
  });

  useEffect(() => {
    localStorage.setItem('ds_support_tickets', JSON.stringify(tickets));
  }, [tickets]);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container">
        <p>Support / Helpdesk — Admin or HR.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  const add = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const id = `TKT-${1000 + tickets.length + 1}`;
    setTickets((t) => [
      {
        id,
        ...form,
        status: 'Open',
        createdAt: new Date().toISOString(),
        slaHours: Number(form.slaHours) || 24,
      },
      ...t,
    ]);
    setForm({ type: 'Client Bug', title: '', reporter: '', email: '', priority: 'Medium', slaHours: 24, notes: '' });
    setMsg(`Ticket ${id} created.`);
  };

  const setStatus = (id, status) => {
    setTickets((list) => list.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const slaBreached = (t) => {
    if (t.status === 'Resolved' || t.status === 'Closed') return false;
    return hoursOpen(t.createdAt) > (t.slaHours || 24);
  };

  const filtered = tickets.filter((t) => {
    if (filter === 'All') return true;
    if (filter === 'SLA Breach') return slaBreached(t);
    if (filter === 'Client Bug') return t.type === 'Client Bug';
    if (filter === 'Internal IT') return t.type === 'Internal IT' || t.type === 'Network' || t.type === 'Server / Login' || t.type === 'Hardware';
    return t.status === filter;
  });

  const stats = useMemo(() => {
    const open = tickets.filter((t) => t.status === 'Open' || t.status === 'In Progress').length;
    const breach = tickets.filter(slaBreached).length;
    const critical = tickets.filter((t) => t.priority === 'Critical' && t.status !== 'Closed' && t.status !== 'Resolved').length;
    return { open, breach, critical, total: tickets.length };
  }, [tickets]);

  return (
    <div className="section page-bg-support">
      <div className="container" style={{ maxWidth: 1000 }}>
        <p>
          <Link to="/admin" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
        </p>
        <h1 className="section-title">🛠️ Technical Support & Ticketing</h1>
        <AdminHero variant="support" />
        <p className="section-subtitle">Client bug tickets, internal IT helpdesk, and SLA alerts for high-priority issues.</p>
        {msg && <p style={{ color: '#34d399' }}>{msg}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '0.65rem', marginBottom: '1rem' }}>
          {[
            { l: 'Open / active', v: stats.open, c: '#38bdf8' },
            { l: 'SLA breached', v: stats.breach, c: '#f87171' },
            { l: 'Critical open', v: stats.critical, c: '#fbbf24' },
            { l: 'Total tickets', v: stats.total, c: '#94a3b8' },
          ].map((x) => (
            <div key={x.l} className="card" style={{ padding: '0.75rem', margin: 0 }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{x.l}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: x.c }}>{x.v}</div>
            </div>
          ))}
        </div>

        {stats.breach > 0 && (
          <div
            className="card"
            style={{
              marginBottom: '1rem',
              borderColor: 'rgba(248,113,113,0.5)',
              background: 'rgba(127,29,29,0.25)',
            }}
          >
            <strong style={{ color: '#fca5a5' }}>⚠ SLA Monitor</strong>
            <p style={{ color: '#fecaca', margin: '0.35rem 0 0' }}>
              {stats.breach} ticket(s) exceeded SLA window — prioritise Critical/High unresolved bugs immediately.
            </p>
          </div>
        )}

        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Raise ticket</h3>
          <form onSubmit={add} style={{ display: 'grid', gap: '0.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: '0.5rem' }}>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}>
                {TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}>
                {PRI.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
              <input type="number" placeholder="SLA hours" value={form.slaHours} onChange={(e) => setForm({ ...form, slaHours: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
              <input placeholder="Reporter / client" value={form.reporter} onChange={(e) => setForm({ ...form, reporter: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
              <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
            </div>
            <input placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required style={{ padding: '0.5rem', borderRadius: 8 }} />
            <textarea placeholder="Details" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} style={{ padding: '0.5rem', borderRadius: 8 }} />
            <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
              Create ticket
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {['All', 'SLA Breach', 'Client Bug', 'Internal IT', 'Open', 'In Progress', 'Resolved'].map((f) => (
            <button key={f} type="button" className={filter === f ? 'btn btn-primary' : 'btn btn-outline'} style={{ fontSize: '0.75rem' }} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>

        {filtered.map((t) => {
          const breach = slaBreached(t);
          const age = hoursOpen(t.createdAt).toFixed(1);
          return (
            <div
              key={t.id}
              className="card"
              style={{
                marginBottom: '0.55rem',
                borderColor: breach ? 'rgba(248,113,113,0.45)' : undefined,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
                  {t.id} · {t.type}
                </span>
                <span style={{ color: t.priority === 'Critical' || t.priority === 'High' ? '#f87171' : '#fbbf24', fontWeight: 600, fontSize: '0.85rem' }}>
                  {t.priority}
                  {breach ? ' · SLA BREACH' : ''}
                </span>
              </div>
              <strong style={{ color: '#e2e8f0' }}>{t.title}</strong>
              <p style={{ color: '#94a3b8', margin: '0.25rem 0', fontSize: '0.88rem' }}>
                {t.reporter} · {t.email} · open {age}h / SLA {t.slaHours}h
              </p>
              {t.notes && <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.9rem' }}>{t.notes}</p>}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8, alignItems: 'center' }}>
                <select value={t.status} onChange={(e) => setStatus(t.id, e.target.value)} style={{ padding: '0.3rem', borderRadius: 6, background: '#0f172a', color: '#e2e8f0', fontSize: '0.8rem' }}>
                  {STATUS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <button type="button" className="btn btn-outline" style={{ fontSize: '0.75rem' }} onClick={() => setTickets((list) => list.filter((x) => x.id !== t.id))}>
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
