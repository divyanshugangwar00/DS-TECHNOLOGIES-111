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

export default function AdminSessionControl() {
  const { user } = useAuth();
  const [whitelist, setWhitelist] = useState(() => load('ds_ip_whitelist', '127.0.0.1, ::1'));
  const [enforce, setEnforce] = useState(() => load('ds_ip_enforce', false));
  const [sessions, setSessions] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    localStorage.setItem('ds_ip_whitelist', typeof whitelist === 'string' ? whitelist : whitelist.join(','));
  }, [whitelist]);
  useEffect(() => {
    localStorage.setItem('ds_ip_enforce', JSON.stringify(!!enforce));
  }, [enforce]);

  useEffect(() => {
    // Simulate active sessions + current
    const existing = load('ds_active_sessions', []);
    const current = {
      id: 'sess-current',
      device: navigator.userAgent.slice(0, 80),
      ip: 'This browser (local)',
      location: 'Local / unknown',
      lastActive: new Date().toISOString(),
      current: true,
    };
    const merged = [current, ...existing.filter((s) => !s.current)];
    setSessions(merged);
    localStorage.setItem('ds_active_sessions', JSON.stringify(merged));
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <div className="section container">
        <p>Session control — Super Admin only.</p>
        <Link to="/admin">← Back</Link>
      </div>
    );
  }

  const forceLogout = (id) => {
    setSessions((list) => {
      const next = list.filter((s) => s.id !== id);
      localStorage.setItem('ds_active_sessions', JSON.stringify(next));
      return next;
    });
    setMsg(id === 'sess-current' ? 'Marked current session for re-login (clear token manually if needed).' : 'Session terminated.');
    if (id === 'sess-current') {
      // soft signal
      try {
        sessionStorage.setItem('ds_force_logout', '1');
      } catch {}
    }
  };

  const addDemoSession = () => {
    const row = {
      id: `sess-${Date.now()}`,
      device: 'Chrome · Windows',
      ip: '103.x.x.' + Math.floor(Math.random() * 200),
      location: 'India (approx)',
      lastActive: new Date().toISOString(),
      current: false,
    };
    setSessions((s) => {
      const next = [...s, row];
      localStorage.setItem('ds_active_sessions', JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="section page-bg-sessions">
      <div className="container" style={{ maxWidth: 900 }}>
        <p>
          <Link to="/admin" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
          {' · '}
          <Link to="/admin/security-audit" style={{ color: '#94a3b8' }}>
            Full security audit
          </Link>
        </p>
        <h1 className="section-title">🔐 Security & Session Control</h1>
        <AdminHero variant="sessions" />
        <p className="section-subtitle">IP allow-list for admin and active session / force-logout controls.</p>
        {msg && <p style={{ color: '#34d399' }}>{msg}</p>}

        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ marginTop: 0, color: '#00d4ff' }}>IP whitelisting</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            When enforce is on, only listed IPs should access admin (enforce in reverse-proxy / backend middleware in production).
          </p>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', marginBottom: '0.75rem' }}>
            <input type="checkbox" checked={!!enforce} onChange={(e) => setEnforce(e.target.checked)} />
            Enforce IP whitelist for admin panel
          </label>
          <textarea
            value={whitelist}
            onChange={(e) => setWhitelist(e.target.value)}
            rows={3}
            placeholder="Comma-separated IPs or CIDR"
            style={{ width: '100%', padding: '0.5rem', borderRadius: 8 }}
          />
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: '0.5rem' }}
            onClick={() => setMsg('IP whitelist saved. Configure nginx/Cloudflare with same list for real blocking.')}
          >
            Save whitelist
          </button>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <h3 style={{ margin: 0, color: '#00d4ff' }}>Active sessions</h3>
            <button type="button" className="btn btn-outline" style={{ fontSize: '0.8rem' }} onClick={addDemoSession}>
              + Sample remote session
            </button>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Force logout removes session record; pair with server token revoke for production.</p>
          {sessions.map((s) => (
            <div
              key={s.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                flexWrap: 'wrap',
                padding: '0.75rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div>
                <strong style={{ color: '#e2e8f0' }}>{s.current ? 'This device' : 'Remote session'}</strong>
                <p style={{ margin: '0.2rem 0', color: '#94a3b8', fontSize: '0.85rem' }}>{s.device}</p>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem' }}>
                  {s.ip} · {s.location} · {new Date(s.lastActive).toLocaleString()}
                </p>
              </div>
              <button type="button" className="btn btn-outline" style={{ fontSize: '0.8rem', color: '#f87171' }} onClick={() => forceLogout(s.id)}>
                Force logout
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
