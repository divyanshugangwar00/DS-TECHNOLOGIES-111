import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const KEY = 'ds_notices';
const ANN_KEY = 'ds_announcements';

const DEFAULTS = [
  {
    id: 'def1',
    title: 'Company announcement',
    body: 'Welcome to DS-TECHNOLOGIES portal. Mark attendance daily and apply leave online.',
    department: 'All',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'def2',
    title: 'Office address',
    body: 'Village Kuiya Rampur, Faridpur, Bareilly UP 243503 · Phone 7895733906 · 7454910637',
    department: 'All',
    createdAt: new Date().toISOString(),
  },
];

function loadAll() {
  let fromAdmin = [];
  let fromAnn = [];
  try {
    fromAdmin = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (!Array.isArray(fromAdmin)) fromAdmin = [];
  } catch {
    fromAdmin = [];
  }
  try {
    fromAnn = JSON.parse(localStorage.getItem(ANN_KEY) || '[]');
    if (!Array.isArray(fromAnn)) fromAnn = [];
  } catch {
    fromAnn = [];
  }
  // Map announcements to notice shape
  const mappedAnn = fromAnn.map((a) => ({
    id: a.id || `ann-${a.at}`,
    title: a.title || 'Announcement',
    body: a.body || '',
    department: a.team || a.department || 'All',
    createdAt: a.at || a.createdAt || new Date().toISOString(),
    author: a.by || a.author || 'HR',
    priority: a.priority,
    source: 'announcement',
  }));
  const adminShaped = fromAdmin.map((n) => ({
    ...n,
    body: n.body || n.content || n.message || '',
    createdAt: n.createdAt || n.date || n.at || new Date().toISOString(),
    source: 'admin',
  }));
  const seen = new Set();
  const merged = [];
  [...adminShaped, ...mappedAnn].forEach((n) => {
    const k = (n.id || '') + '|' + (n.title || '');
    if (seen.has(k)) return;
    seen.add(k);
    merged.push(n);
  });
  merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const adminTitles = new Set(merged.map((n) => (n.title || '').toLowerCase()));
  const extras = DEFAULTS.filter((d) => !adminTitles.has(d.title.toLowerCase()));
  return [...merged, ...extras];
}

export default function EmployeeNotices() {
  const { user } = useAuth();
  const [list, setList] = useState([]);

  const refresh = useCallback(() => {
    setList(loadAll());
  }, []);

  useEffect(() => {
    refresh();
    const onEvt = () => refresh();
    const onStorage = (e) => {
      if (!e.key || e.key === KEY || e.key === ANN_KEY) refresh();
    };
    window.addEventListener('ds-notices-updated', onEvt);
    window.addEventListener('storage', onStorage);
    const t = setInterval(refresh, 4000);
    return () => {
      window.removeEventListener('ds-notices-updated', onEvt);
      window.removeEventListener('storage', onStorage);
      clearInterval(t);
    };
  }, [refresh]);

  return (
    <div className="section page-bg-employee">
      <div className="container" style={{ maxWidth: 720 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h1 className="section-title">📢 Notices</h1>
            <p className="section-subtitle">HR / Admin published notices · auto-refresh</p>
          </div>
          <button type="button" className="btn btn-outline" onClick={refresh}>
            Refresh
          </button>
        </div>

        {list.length === 0 ? (
          <div className="card">
            <p style={{ color: '#94a3b8' }}>No notices yet. When admin publishes, they appear here.</p>
          </div>
        ) : (
          list.map((n) => (
            <div
              key={n.id || n.title}
              className="card"
              style={{
                marginBottom: '1rem',
                borderLeft: n.priority === 'Urgent' ? '4px solid #f87171' : '4px solid #00d4ff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.15rem' }}>{n.title}</h3>
                {n.priority && (
                  <span style={{ color: n.priority === 'Urgent' ? '#f87171' : '#fbbf24', fontSize: '0.8rem' }}>{n.priority}</span>
                )}
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0.4rem 0 0.75rem' }}>
                {n.department && n.department !== 'All' ? `${n.department} · ` : ''}
                {n.createdAt ? new Date(n.createdAt).toLocaleString('en-IN') : ''}
                {n.author ? ` · ${n.author}` : ''}
              </p>
              <div
                style={{
                  color: '#e2e8f0',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.7,
                  fontSize: '0.95rem',
                  background: 'rgba(15,23,42,0.6)',
                  padding: '0.85rem 1rem',
                  borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {n.body}
              </div>
            </div>
          ))
        )}

        <p style={{ marginTop: '1rem' }}>
          <Link to="/employee" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
        </p>
        <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Logged in as {user?.name || user?.email}</p>
      </div>
    </div>
  );
}
