import { useEffect, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function load(key, fb) {
  try {
    const r = localStorage.getItem(key);
    if (r) return JSON.parse(r);
  } catch {}
  return fb;
}

const TEAMS = ['All company', 'Engineering', 'Designers', 'HR', 'Sales', 'Interns', 'Managers'];

const DEMO_HOLIDAYS = [
  { id: 'h1', date: '2026-01-26', name: 'Republic Day', type: 'National' },
  { id: 'h2', date: '2026-03-14', name: 'Holi', type: 'Festival' },
  { id: 'h3', date: '2026-08-15', name: 'Independence Day', type: 'National' },
  { id: 'h4', date: '2026-10-02', name: 'Gandhi Jayanti', type: 'National' },
  { id: 'h5', date: '2026-11-08', name: 'Diwali (company)', type: 'Company' },
];

export default function AdminCommunications() {
  const { user } = useAuth();
  const [tab, setTab] = useState('announce');
  const [announcements, setAnnouncements] = useState(() => load('ds_announcements', []));
  const [holidays, setHolidays] = useState(() => load('ds_holidays', DEMO_HOLIDAYS));
  const [msg, setMsg] = useState('');
  const [aForm, setAForm] = useState({ title: '', body: '', team: 'All company', priority: 'Normal' });
  const [hForm, setHForm] = useState({ date: '', name: '', type: 'Company' });

  useEffect(() => {
    localStorage.setItem('ds_announcements', JSON.stringify(announcements));
    // also mirror to notices for employee board if empty structure
  }, [announcements]);
  useEffect(() => {
    localStorage.setItem('ds_holidays', JSON.stringify(holidays));
  }, [holidays]);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container">
        <p>Communications — Admin / HR.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  const publish = (e) => {
    e.preventDefault();
    const row = {
      id: `ann-${Date.now()}`,
      ...aForm,
      at: new Date().toISOString(),
      by: user.email,
    };
    setAnnouncements((a) => [row, ...a]);
    // push into ds_notices for employee visibility
    try {
      const notices = JSON.parse(localStorage.getItem('ds_notices') || '[]');
      notices.unshift({
        id: row.id,
        title: `[${row.team}] ${row.title}`,
        body: row.body,
        date: new Date().toISOString().slice(0, 10),
        published: true,
      });
      localStorage.setItem('ds_notices', JSON.stringify(notices));
    } catch {}
    setAForm({ title: '', body: '', team: 'All company', priority: 'Normal' });
    setMsg('Announcement published (visible on employee notice board).');
  };

  return (
    <div className="section page-bg-comms">
      <div className="container" style={{ maxWidth: 900 }}>
        <p>
          <Link to="/admin" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
          {' · '}
          <Link to="/admin/notices" style={{ color: '#94a3b8' }}>
            Full notices builder
          </Link>
        </p>
        <h1 className="section-title">📢 Internal Communication & Notice Board</h1>
        <AdminHero variant="comms" />
        <p className="section-subtitle">Team-targeted announcements and company holiday calendar.</p>
        {msg && <p style={{ color: '#34d399' }}>{msg}</p>}

        <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
          <button type="button" className={tab === 'announce' ? 'btn btn-primary' : 'btn btn-outline'} onClick={() => setTab('announce')}>
            Announcements
          </button>
          <button type="button" className={tab === 'holidays' ? 'btn btn-primary' : 'btn btn-outline'} onClick={() => setTab('holidays')}>
            Holiday calendar
          </button>
        </div>

        {tab === 'announce' && (
          <>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Send announcement</h3>
              <form onSubmit={publish} style={{ display: 'grid', gap: '0.5rem' }}>
                <input
                  placeholder="Title"
                  value={aForm.title}
                  onChange={(e) => setAForm({ ...aForm, title: e.target.value })}
                  required
                  style={{ padding: '0.5rem', borderRadius: 8 }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <select
                    value={aForm.team}
                    onChange={(e) => setAForm({ ...aForm, team: e.target.value })}
                    style={{ padding: '0.5rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}
                  >
                    {TEAMS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                  <select
                    value={aForm.priority}
                    onChange={(e) => setAForm({ ...aForm, priority: e.target.value })}
                    style={{ padding: '0.5rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}
                  >
                    <option>Normal</option>
                    <option>Important</option>
                    <option>Urgent</option>
                  </select>
                </div>
                <textarea
                  placeholder="Message body"
                  value={aForm.body}
                  onChange={(e) => setAForm({ ...aForm, body: e.target.value })}
                  rows={4}
                  required
                  style={{ padding: '0.5rem', borderRadius: 8 }}
                />
                <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
                  Publish to notice board
                </button>
              </form>
            </div>
            {announcements.map((a) => (
              <div key={a.id} className="card" style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <strong style={{ color: '#e2e8f0' }}>{a.title}</strong>
                  <span style={{ color: a.priority === 'Urgent' ? '#f87171' : '#94a3b8', fontSize: '0.85rem' }}>
                    {a.team} · {a.priority}
                  </span>
                </div>
                <p style={{ color: '#cbd5e1', whiteSpace: 'pre-wrap' }}>{a.body}</p>
                <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>
                  {new Date(a.at).toLocaleString()} · {a.by}
                </p>
              </div>
            ))}
          </>
        )}

        {tab === 'holidays' && (
          <>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Add holiday</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setHolidays((h) => [{ id: `h-${Date.now()}`, ...hForm }, ...h].sort((a, b) => a.date.localeCompare(b.date)));
                  setHForm({ date: '', name: '', type: 'Company' });
                  setMsg('Holiday added.');
                }}
                style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr auto', gap: '0.5rem' }}
              >
                <input type="date" value={hForm.date} onChange={(e) => setHForm({ ...hForm, date: e.target.value })} required style={{ padding: '0.5rem', borderRadius: 8 }} />
                <input placeholder="Holiday name" value={hForm.name} onChange={(e) => setHForm({ ...hForm, name: e.target.value })} required style={{ padding: '0.5rem', borderRadius: 8 }} />
                <select value={hForm.type} onChange={(e) => setHForm({ ...hForm, type: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}>
                  <option>National</option>
                  <option>Festival</option>
                  <option>Company</option>
                  <option>Optional</option>
                </select>
                <button type="submit" className="btn btn-primary">
                  Add
                </button>
              </form>
            </div>
            <div className="card">
              <h3 style={{ marginTop: 0, color: '#00d4ff' }}>2026 calendar</h3>
              {[...holidays]
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((h) => (
                  <div
                    key={h.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      flexWrap: 'wrap',
                      gap: 8,
                    }}
                  >
                    <span style={{ color: '#38bdf8', fontWeight: 600, minWidth: 110 }}>{h.date}</span>
                    <span style={{ color: '#e2e8f0', flex: 1 }}>{h.name}</span>
                    <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{h.type}</span>
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ fontSize: '0.7rem' }}
                      onClick={() => setHolidays((list) => list.filter((x) => x.id !== h.id))}
                    >
                      ✕
                    </button>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
