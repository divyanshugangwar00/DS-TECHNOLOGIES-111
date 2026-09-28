import { useEffect, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const KEY = 'ds_awards';

export default function AdminAwards() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    name: '',
    organization: '',
    year: new Date().getFullYear().toString(),
    description: '',
    certificateUrl: '',
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    try {
      setList(JSON.parse(localStorage.getItem(KEY) || '[]'));
    } catch {
      setList([]);
    }
  }, []);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container">
        <p>Access denied</p>
      </div>
    );
  }

  const persist = (next) => {
    setList(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const save = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setMsg('Award name required');
      return;
    }
    const item = { id: Date.now().toString(), ...form, at: new Date().toISOString() };
    persist([item, ...list]);
    setForm({ name: '', organization: '', year: new Date().getFullYear().toString(), description: '', certificateUrl: '' });
    setMsg('Award added');
  };

  const onCert = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setForm((prev) => ({ ...prev, certificateUrl: r.result }));
    r.readAsDataURL(f);
  };

  return (
    <div className="section page-bg-admin">
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 className="section-title">🏆 Awards & Achievements</h1>
        <AdminHero variant="default" />
        <p className="section-subtitle">Add real milestones only — name, org, year, certificate</p>
        {msg && <p style={{ color: '#10b981' }}>{msg}</p>}

        <form onSubmit={save} className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginTop: 0, color: '#38bdf8' }}>Add Award</h3>
          <div className="grid-2">
            <div className="form-group">
              <label>Award name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Best Startup Campus Partner"
                required
              />
            </div>
            <div className="form-group">
              <label>Organization</label>
              <input
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                placeholder="Issuing body"
              />
            </div>
            <div className="form-group">
              <label>Year</label>
              <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Certificate image</label>
              <input type="file" accept="image/*" onChange={onCert} style={{ color: '#94a3b8', fontSize: '0.85rem' }} />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Short description of the achievement"
            />
          </div>
          {form.certificateUrl && (
            <img src={form.certificateUrl} alt="cert" style={{ maxHeight: 120, marginBottom: 12, borderRadius: 8 }} />
          )}
          <button type="submit" className="btn btn-primary">
            Save Award
          </button>
        </form>

        {list.length === 0 ? (
          <div className="card">
            <p style={{ color: '#cbd5e1' }}>
              We are a growing technology company. Achievements will appear here as Leadership adds real
              milestones. No fake awards.
            </p>
          </div>
        ) : (
          list.map((a) => (
            <div className="card" key={a.id} style={{ marginBottom: '0.85rem', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {a.certificateUrl && (
                <img src={a.certificateUrl} alt="" style={{ width: 100, height: 80, objectFit: 'cover', borderRadius: 8 }} />
              )}
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 0.25rem', color: '#e2e8f0' }}>{a.name}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                  {a.organization} · {a.year}
                </p>
                {a.description && <p style={{ color: '#cbd5e1', marginTop: 8 }}>{a.description}</p>}
                <button
                  type="button"
                  style={{ marginTop: 8, color: '#fca5a5', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                  onClick={() => persist(list.filter((x) => x.id !== a.id))}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}

        <p style={{ marginTop: '1rem' }}>
          <Link to="/admin" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
