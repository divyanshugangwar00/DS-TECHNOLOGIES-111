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

export default function AdminLegalCompliance() {
  const { user } = useAuth();
  const [tab, setTab] = useState('contracts');
  const [docs, setDocs] = useState(() =>
    load('ds_legal_docs', [
      { id: 'leg-1', type: 'NDA', party: 'Bareilly Retail Mart', signedOn: '2026-04-10', validTill: '2027-04-10', note: 'Mutual NDA' },
      { id: 'leg-2', type: 'Employment Contract', party: 'Rohit Kumar', signedOn: '2026-05-01', validTill: '', note: 'Full-time' },
    ])
  );
  const [tax, setTax] = useState(() =>
    load('ds_legal_tax', [
      { id: 'tax-1', type: 'GST Return', period: 'Q1 2026', filedOn: '2026-07-15', amount: '45,000', status: 'Filed' },
      { id: 'tax-2', type: 'TDS', period: 'Jul 2026', filedOn: '', amount: '12,000', status: 'Pending' },
    ])
  );
  const [msg, setMsg] = useState('');
  const [dForm, setDForm] = useState({ type: 'NDA', party: '', signedOn: '', validTill: '', note: '' });
  const [tForm, setTForm] = useState({ type: 'GST Return', period: '', filedOn: '', amount: '', status: 'Pending' });

  useEffect(() => { localStorage.setItem('ds_legal_docs', JSON.stringify(docs)); }, [docs]);
  useEffect(() => { localStorage.setItem('ds_legal_tax', JSON.stringify(tax)); }, [tax]);

  if (!user || user.role !== 'admin') {
    return <div className="section container"><p>Legal & Compliance — Super Admin / Founder.</p><Link to="/admin">← Back</Link></div>;
  }

  return (
    <div className="section page-bg-legal">
      <div className="container" style={{ maxWidth: 960 }}>
        <p><Link to="/admin" style={{ color: '#00d4ff' }}>← Dashboard</Link></p>
        <h1 className="section-title">📜 Legal & Compliance</h1>
        <AdminHero variant="legal" />
        <p className="section-subtitle">NDA / contracts digital register and GST · TDS · corporate tax filing records.</p>
        {msg && <p style={{ color: '#34d399' }}>{msg}</p>}

        <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
          <button type="button" className={tab === 'contracts' ? 'btn btn-primary' : 'btn btn-outline'} onClick={() => setTab('contracts')}>NDA & Contracts</button>
          <button type="button" className={tab === 'tax' ? 'btn btn-primary' : 'btn btn-outline'} onClick={() => setTab('tax')}>Tax & GST</button>
        </div>

        {tab === 'contracts' && (
          <>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Register document</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDocs((l) => [{ id: `leg-${Date.now()}`, ...dForm }, ...l]);
                  setDForm({ type: 'NDA', party: '', signedOn: '', validTill: '', note: '' });
                  setMsg('Contract / NDA logged.');
                }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: '0.5rem' }}
              >
                <select value={dForm.type} onChange={(e) => setDForm({ ...dForm, type: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}>
                  <option>NDA</option><option>Service Agreement</option><option>Employment Contract</option><option>Offer Letter Archive</option><option>Other</option>
                </select>
                <input placeholder="Party / client / employee" value={dForm.party} onChange={(e) => setDForm({ ...dForm, party: e.target.value })} required style={{ padding: '0.5rem', borderRadius: 8 }} />
                <input type="date" value={dForm.signedOn} onChange={(e) => setDForm({ ...dForm, signedOn: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <input type="date" value={dForm.validTill} onChange={(e) => setDForm({ ...dForm, validTill: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <input placeholder="Note / file ref" value={dForm.note} onChange={(e) => setDForm({ ...dForm, note: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <button type="submit" className="btn btn-primary">Save</button>
              </form>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Store signed PDFs in Media / secure drive; reference path in note field.</p>
            </div>
            {docs.map((d) => (
              <div key={d.id} className="card" style={{ marginBottom: '0.45rem' }}>
                <strong style={{ color: '#e2e8f0' }}>{d.type}</strong> · {d.party}
                <p style={{ color: '#94a3b8', margin: '0.25rem 0', fontSize: '0.9rem' }}>
                  Signed {d.signedOn || '—'} · Valid till {d.validTill || '—'}
                </p>
                <p style={{ color: '#64748b', margin: 0, fontSize: '0.85rem' }}>{d.note}</p>
                <button type="button" className="btn btn-outline" style={{ marginTop: 6, fontSize: '0.75rem' }} onClick={() => setDocs((l) => l.filter((x) => x.id !== d.id))}>Remove</button>
              </div>
            ))}
          </>
        )}

        {tab === 'tax' && (
          <>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Tax / GST record</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setTax((l) => [{ id: `tax-${Date.now()}`, ...tForm }, ...l]);
                  setTForm({ type: 'GST Return', period: '', filedOn: '', amount: '', status: 'Pending' });
                  setMsg('Tax record saved.');
                }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '0.5rem' }}
              >
                <select value={tForm.type} onChange={(e) => setTForm({ ...tForm, type: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}>
                  <option>GST Return</option><option>TDS</option><option>Advance Tax</option><option>Corporate Tax</option><option>Other</option>
                </select>
                <input placeholder="Period (e.g. Q2 2026)" value={tForm.period} onChange={(e) => setTForm({ ...tForm, period: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <input type="date" value={tForm.filedOn} onChange={(e) => setTForm({ ...tForm, filedOn: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <input placeholder="Amount ₹" value={tForm.amount} onChange={(e) => setTForm({ ...tForm, amount: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <select value={tForm.status} onChange={(e) => setTForm({ ...tForm, status: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}>
                  <option>Pending</option><option>Filed</option><option>Paid</option>
                </select>
                <button type="submit" className="btn btn-primary">Save</button>
              </form>
            </div>
            {tax.map((t) => (
              <div key={t.id} className="card" style={{ marginBottom: '0.45rem' }}>
                <strong style={{ color: '#e2e8f0' }}>{t.type}</strong> · {t.period}
                <span style={{ marginLeft: 8, color: t.status === 'Pending' ? '#fbbf24' : '#34d399' }}>{t.status}</span>
                <p style={{ color: '#94a3b8', margin: '0.25rem 0', fontSize: '0.9rem' }}>
                  Amount: ₹{t.amount || '—'} · Filed: {t.filedOn || '—'}
                </p>
                <button type="button" className="btn btn-outline" style={{ fontSize: '0.75rem' }} onClick={() => setTax((l) => l.filter((x) => x.id !== t.id))}>Remove</button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
