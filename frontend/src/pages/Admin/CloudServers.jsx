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

const DEMO_SERVERS = [
  { id: 'srv-1', name: 'prod-web-01', provider: 'AWS', region: 'ap-south-1', cpu: 42, ram: 61, status: 'Healthy', url: 'https://console.aws.amazon.com' },
  { id: 'srv-2', name: 'staging-api', provider: 'DigitalOcean', region: 'blr1', cpu: 18, ram: 34, status: 'Healthy', url: '' },
  { id: 'srv-3', name: 'client-retail-db', provider: 'Azure', region: 'Central India', cpu: 78, ram: 82, status: 'Warning', url: '' },
];

const DEMO_DOMAINS = [
  { id: 'dom-1', domain: 'client-retail.example', client: 'Bareilly Retail Mart', sslExpiry: '2026-11-20', domainExpiry: '2027-03-01' },
  { id: 'dom-2', domain: 'uphealth.example', client: 'UP Health Clinic', sslExpiry: '2026-09-15', domainExpiry: '2026-12-01' },
];

export default function AdminCloudServers() {
  const { user } = useAuth();
  const [tab, setTab] = useState('health');
  const [servers, setServers] = useState(() => load('ds_cloud_servers', DEMO_SERVERS));
  const [domains, setDomains] = useState(() => load('ds_cloud_domains', DEMO_DOMAINS));
  const [deploys, setDeploys] = useState(() => load('ds_cloud_deploys', []));
  const [msg, setMsg] = useState('');
  const [sForm, setSForm] = useState({ name: '', provider: 'AWS', region: '', cpu: 20, ram: 40, status: 'Healthy', url: '' });
  const [dForm, setDForm] = useState({ domain: '', client: '', sslExpiry: '', domainExpiry: '' });
  const [depForm, setDepForm] = useState({ project: '', environment: 'Production', branch: 'main', notes: '' });

  useEffect(() => { localStorage.setItem('ds_cloud_servers', JSON.stringify(servers)); }, [servers]);
  useEffect(() => { localStorage.setItem('ds_cloud_domains', JSON.stringify(domains)); }, [domains]);
  useEffect(() => { localStorage.setItem('ds_cloud_deploys', JSON.stringify(deploys)); }, [deploys]);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return <div className="section container"><p>Cloud & Server — Admin access.</p><Link to="/login">Login</Link></div>;
  }

  const daysUntil = (dateStr) => {
    if (!dateStr) return null;
    return Math.ceil((new Date(dateStr) - new Date()) / 864e5);
  };

  const refreshMetrics = () => {
    setServers((list) =>
      list.map((s) => ({
        ...s,
        cpu: Math.min(95, Math.max(5, Math.round(s.cpu + (Math.random() * 20 - 10)))),
        ram: Math.min(95, Math.max(10, Math.round(s.ram + (Math.random() * 16 - 8)))),
        status: s.cpu > 85 || s.ram > 85 ? 'Warning' : 'Healthy',
      }))
    );
    setMsg('Metrics refreshed (simulated live sample). Connect real AWS/Azure APIs in production.');
  };

  const addServer = (e) => {
    e.preventDefault();
    setServers((l) => [{ id: `srv-${Date.now()}`, ...sForm, cpu: Number(sForm.cpu), ram: Number(sForm.ram) }, ...l]);
    setSForm({ name: '', provider: 'AWS', region: '', cpu: 20, ram: 40, status: 'Healthy', url: '' });
    setMsg('Server added to monitor.');
  };

  const addDomain = (e) => {
    e.preventDefault();
    setDomains((l) => [{ id: `dom-${Date.now()}`, ...dForm }, ...l]);
    setDForm({ domain: '', client: '', sslExpiry: '', domainExpiry: '' });
    setMsg('Domain / SSL tracker entry added.');
  };

  const deploy = (e) => {
    e.preventDefault();
    const row = {
      id: `dep-${Date.now()}`,
      ...depForm,
      status: 'Queued → Simulated success',
      at: new Date().toISOString(),
      by: user.email,
    };
    setDeploys((d) => [row, ...d]);
    setDepForm({ project: '', environment: 'Production', branch: 'main', notes: '' });
    setMsg('Deployment recorded. Wire CI/CD (GitHub Actions / Jenkins) for real pushes.');
  };

  return (
    <div className="section page-bg-cloud">
      <div className="container" style={{ maxWidth: 1000 }}>
        <p><Link to="/admin" style={{ color: '#00d4ff' }}>← Dashboard</Link></p>
        <h1 className="section-title">🚀 Cloud & Server Management</h1>
        <AdminHero variant="cloud" />
        <p className="section-subtitle">Server health, domain/SSL expiry alerts, and deployment records for client apps.</p>
        {msg && <p style={{ color: '#34d399' }}>{msg}</p>}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
          {[
            ['health', '📡 Server health'],
            ['ssl', '🔐 Domain & SSL'],
            ['deploy', '🚢 Deployment'],
          ].map(([k, l]) => (
            <button key={k} type="button" className={tab === k ? 'btn btn-primary' : 'btn btn-outline'} style={{ fontSize: '0.85rem' }} onClick={() => setTab(k)}>
              {l}
            </button>
          ))}
        </div>

        {tab === 'health' && (
          <>
            <button type="button" className="btn btn-outline" style={{ marginBottom: '0.75rem' }} onClick={refreshMetrics}>
              Refresh live metrics
            </button>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Add server</h3>
              <form onSubmit={addServer} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '0.5rem' }}>
                <input placeholder="Name" value={sForm.name} onChange={(e) => setSForm({ ...sForm, name: e.target.value })} required style={{ padding: '0.5rem', borderRadius: 8 }} />
                <select value={sForm.provider} onChange={(e) => setSForm({ ...sForm, provider: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}>
                  <option>AWS</option><option>Azure</option><option>DigitalOcean</option><option>GCP</option><option>Other</option>
                </select>
                <input placeholder="Region" value={sForm.region} onChange={(e) => setSForm({ ...sForm, region: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <input type="number" placeholder="CPU %" value={sForm.cpu} onChange={(e) => setSForm({ ...sForm, cpu: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <input type="number" placeholder="RAM %" value={sForm.ram} onChange={(e) => setSForm({ ...sForm, ram: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <button type="submit" className="btn btn-primary">Add</button>
              </form>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '0.75rem' }}>
              {servers.map((s) => (
                <div key={s.id} className="card" style={{ borderColor: s.status === 'Warning' ? 'rgba(251,191,36,0.4)' : undefined }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ color: '#e2e8f0' }}>{s.name}</strong>
                    <span style={{ color: s.status === 'Healthy' ? '#34d399' : '#fbbf24', fontSize: '0.85rem' }}>{s.status}</span>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{s.provider} · {s.region}</p>
                  <div style={{ marginBottom: 6 }}>
                    <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>CPU {s.cpu}%</div>
                    <div style={{ height: 8, background: '#1e293b', borderRadius: 4 }}>
                      <div style={{ width: `${s.cpu}%`, height: '100%', borderRadius: 4, background: s.cpu > 80 ? '#f87171' : '#38bdf8' }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>RAM {s.ram}%</div>
                    <div style={{ height: 8, background: '#1e293b', borderRadius: 4 }}>
                      <div style={{ width: `${s.ram}%`, height: '100%', borderRadius: 4, background: s.ram > 80 ? '#f87171' : '#34d399' }} />
                    </div>
                  </div>
                  <button type="button" className="btn btn-outline" style={{ marginTop: 8, fontSize: '0.75rem' }} onClick={() => setServers((l) => l.filter((x) => x.id !== s.id))}>Remove</button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'ssl' && (
          <>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Track domain / SSL</h3>
              <form onSubmit={addDomain} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: '0.5rem' }}>
                <input placeholder="Domain" value={dForm.domain} onChange={(e) => setDForm({ ...dForm, domain: e.target.value })} required style={{ padding: '0.5rem', borderRadius: 8 }} />
                <input placeholder="Client" value={dForm.client} onChange={(e) => setDForm({ ...dForm, client: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <input type="date" title="SSL expiry" value={dForm.sslExpiry} onChange={(e) => setDForm({ ...dForm, sslExpiry: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <input type="date" title="Domain expiry" value={dForm.domainExpiry} onChange={(e) => setDForm({ ...dForm, domainExpiry: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <button type="submit" className="btn btn-primary">Add</button>
              </form>
            </div>
            {domains.map((d) => {
              const sslD = daysUntil(d.sslExpiry);
              const domD = daysUntil(d.domainExpiry);
              const alert = (sslD !== null && sslD < 30) || (domD !== null && domD < 30);
              return (
                <div key={d.id} className="card" style={{ marginBottom: '0.5rem', borderColor: alert ? 'rgba(248,113,113,0.45)' : undefined }}>
                  <strong style={{ color: '#e2e8f0' }}>{d.domain}</strong>
                  <span style={{ color: '#64748b', marginLeft: 8 }}>{d.client}</span>
                  <p style={{ color: '#cbd5e1', margin: '0.35rem 0', fontSize: '0.9rem' }}>
                    SSL: {d.sslExpiry || '—'} {sslD !== null && <span style={{ color: sslD < 30 ? '#f87171' : '#34d399' }}>({sslD} days)</span>}
                    {' · '}
                    Domain: {d.domainExpiry || '—'} {domD !== null && <span style={{ color: domD < 30 ? '#f87171' : '#34d399' }}>({domD} days)</span>}
                  </p>
                  {alert && <p style={{ color: '#fca5a5', margin: 0, fontSize: '0.85rem' }}>⚠ Expiry within 30 days — renew soon.</p>}
                </div>
              );
            })}
          </>
        )}

        {tab === 'deploy' && (
          <>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Deployment automation log</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Record deploy intent from panel; connect GitHub Actions / pipeline webhooks for real push.</p>
              <form onSubmit={deploy} style={{ display: 'grid', gap: '0.5rem', maxWidth: 480 }}>
                <input placeholder="Project name" value={depForm.project} onChange={(e) => setDepForm({ ...depForm, project: e.target.value })} required style={{ padding: '0.5rem', borderRadius: 8 }} />
                <select value={depForm.environment} onChange={(e) => setDepForm({ ...depForm, environment: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}>
                  <option>Production</option><option>Staging</option><option>Development</option>
                </select>
                <input placeholder="Branch" value={depForm.branch} onChange={(e) => setDepForm({ ...depForm, branch: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <textarea placeholder="Notes / commit" value={depForm.notes} onChange={(e) => setDepForm({ ...depForm, notes: e.target.value })} rows={2} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>Queue deploy</button>
              </form>
            </div>
            {deploys.map((d) => (
              <div key={d.id} className="card" style={{ marginBottom: '0.45rem' }}>
                <strong style={{ color: '#e2e8f0' }}>{d.project}</strong> · {d.environment} · <code style={{ color: '#38bdf8' }}>{d.branch}</code>
                <p style={{ color: '#94a3b8', margin: '0.25rem 0', fontSize: '0.88rem' }}>{d.status}</p>
                <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>{new Date(d.at).toLocaleString()} · {d.by}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
