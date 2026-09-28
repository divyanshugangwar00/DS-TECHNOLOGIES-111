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

const DEMO_HW = [
  { id: 'hw-1', type: 'Laptop', brand: 'Dell', serial: 'DL-2026-001', assignedTo: 'Rohit Kumar', date: '2026-05-01', condition: 'Good' },
  { id: 'hw-2', type: 'Laptop', brand: 'HP', serial: 'HP-2026-014', assignedTo: 'Nikhil Gangwar', date: '2026-06-12', condition: 'Good' },
];

const DEMO_SW = [
  { id: 'sw-1', name: 'GitHub Team', seats: 10, expiry: '2027-01-15', cost: '₹4,500/mo', vendor: 'GitHub' },
  { id: 'sw-2', name: 'Zoom Pro', seats: 5, expiry: '2026-10-01', cost: '₹1,200/mo', vendor: 'Zoom' },
  { id: 'sw-3', name: 'Adobe CC', seats: 2, expiry: '2026-12-20', cost: '₹4,000/mo', vendor: 'Adobe' },
];

export default function AdminAssets() {
  const { user } = useAuth();
  const [tab, setTab] = useState('hardware');
  const [hw, setHw] = useState(() => load('ds_assets_hw', DEMO_HW));
  const [sw, setSw] = useState(() => load('ds_assets_sw', DEMO_SW));
  const [msg, setMsg] = useState('');
  const [hForm, setHForm] = useState({ type: 'Laptop', brand: '', serial: '', assignedTo: '', date: '', condition: 'Good' });
  const [sForm, setSForm] = useState({ name: '', seats: '', expiry: '', cost: '', vendor: '' });

  useEffect(() => { localStorage.setItem('ds_assets_hw', JSON.stringify(hw)); }, [hw]);
  useEffect(() => { localStorage.setItem('ds_assets_sw', JSON.stringify(sw)); }, [sw]);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return <div className="section container"><p>Assets — Admin/HR.</p><Link to="/login">Login</Link></div>;
  }

  const daysUntil = (d) => (d ? Math.ceil((new Date(d) - new Date()) / 864e5) : null);

  return (
    <div className="section page-bg-assets">
      <div className="container" style={{ maxWidth: 960 }}>
        <p><Link to="/admin" style={{ color: '#00d4ff' }}>← Dashboard</Link></p>
        <h1 className="section-title">💼 Asset & Inventory Management</h1>
        <AdminHero variant="assets" />
        <p className="section-subtitle">Hardware allocation (serial numbers) and paid software license expiry tracking.</p>
        {msg && <p style={{ color: '#34d399' }}>{msg}</p>}

        <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
          <button type="button" className={tab === 'hardware' ? 'btn btn-primary' : 'btn btn-outline'} onClick={() => setTab('hardware')}>Hardware</button>
          <button type="button" className={tab === 'software' ? 'btn btn-primary' : 'btn btn-outline'} onClick={() => setTab('software')}>Software licenses</button>
        </div>

        {tab === 'hardware' && (
          <>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Allocate hardware</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setHw((l) => [{ id: `hw-${Date.now()}`, ...hForm }, ...l]);
                  setHForm({ type: 'Laptop', brand: '', serial: '', assignedTo: '', date: '', condition: 'Good' });
                  setMsg('Hardware record saved.');
                }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '0.5rem' }}
              >
                <select value={hForm.type} onChange={(e) => setHForm({ ...hForm, type: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}>
                  <option>Laptop</option><option>Desktop</option><option>Monitor</option><option>Mouse</option><option>Keyboard</option><option>Phone</option><option>Other</option>
                </select>
                <input placeholder="Brand / model" value={hForm.brand} onChange={(e) => setHForm({ ...hForm, brand: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <input placeholder="Serial number" value={hForm.serial} onChange={(e) => setHForm({ ...hForm, serial: e.target.value })} required style={{ padding: '0.5rem', borderRadius: 8 }} />
                <input placeholder="Assigned to" value={hForm.assignedTo} onChange={(e) => setHForm({ ...hForm, assignedTo: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <input type="date" value={hForm.date} onChange={(e) => setHForm({ ...hForm, date: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <select value={hForm.condition} onChange={(e) => setHForm({ ...hForm, condition: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}>
                  <option>Good</option><option>Fair</option><option>Repair</option><option>Retired</option>
                </select>
                <button type="submit" className="btn btn-primary">Save</button>
              </form>
            </div>
            {hw.map((h) => (
              <div key={h.id} className="card" style={{ marginBottom: '0.45rem' }}>
                <strong style={{ color: '#e2e8f0' }}>{h.type} · {h.brand}</strong>
                <p style={{ color: '#94a3b8', margin: '0.25rem 0', fontSize: '0.9rem' }}>S/N: {h.serial} · {h.assignedTo || 'Unassigned'} · {h.condition}</p>
                <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>Issued: {h.date || '—'}</p>
                <button type="button" className="btn btn-outline" style={{ marginTop: 6, fontSize: '0.75rem' }} onClick={() => setHw((l) => l.filter((x) => x.id !== h.id))}>Remove</button>
              </div>
            ))}
          </>
        )}

        {tab === 'software' && (
          <>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Add software license</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSw((l) => [{ id: `sw-${Date.now()}`, ...sForm }, ...l]);
                  setSForm({ name: '', seats: '', expiry: '', cost: '', vendor: '' });
                  setMsg('License saved.');
                }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '0.5rem' }}
              >
                <input placeholder="Tool name" value={sForm.name} onChange={(e) => setSForm({ ...sForm, name: e.target.value })} required style={{ padding: '0.5rem', borderRadius: 8 }} />
                <input placeholder="Vendor" value={sForm.vendor} onChange={(e) => setSForm({ ...sForm, vendor: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <input placeholder="Seats" value={sForm.seats} onChange={(e) => setSForm({ ...sForm, seats: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <input type="date" value={sForm.expiry} onChange={(e) => setSForm({ ...sForm, expiry: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <input placeholder="Billing / cost" value={sForm.cost} onChange={(e) => setSForm({ ...sForm, cost: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <button type="submit" className="btn btn-primary">Save</button>
              </form>
            </div>
            {sw.map((s) => {
              const d = daysUntil(s.expiry);
              return (
                <div key={s.id} className="card" style={{ marginBottom: '0.45rem', borderColor: d !== null && d < 45 ? 'rgba(248,113,113,0.4)' : undefined }}>
                  <strong style={{ color: '#e2e8f0' }}>{s.name}</strong> <span style={{ color: '#64748b' }}>({s.vendor})</span>
                  <p style={{ color: '#94a3b8', margin: '0.25rem 0', fontSize: '0.9rem' }}>
                    Seats: {s.seats || '—'} · {s.cost || '—'} · Expiry: {s.expiry || '—'}{' '}
                    {d !== null && <span style={{ color: d < 45 ? '#f87171' : '#34d399' }}>({d} days)</span>}
                  </p>
                  <button type="button" className="btn btn-outline" style={{ fontSize: '0.75rem' }} onClick={() => setSw((l) => l.filter((x) => x.id !== s.id))}>Remove</button>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
