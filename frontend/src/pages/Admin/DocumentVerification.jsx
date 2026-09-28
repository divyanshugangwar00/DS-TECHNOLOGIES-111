import { useEffect, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { getOfflineApps, updateOfflineApp } from '../../utils/offlineStore';

const DOC_TYPES = [
  'Aadhaar Card',
  'PAN Card',
  'Passport / Other ID',
  '10th Marksheet',
  '12th Marksheet',
  'Graduation / Degree',
  'Experience Letter',
  'Relieving Letter',
  'Previous Salary Slip',
  'Photo',
  'Address Proof',
  'Resume / CV',
];

function displayName(a) {
  if (!a) return '—';
  const n = (a.name || '').trim();
  const jf = a.joiningForm || {};
  const fromForm = [jf.firstName, jf.middleName, jf.lastName].filter(Boolean).join(' ').trim();
  if (fromForm && fromForm.length > 1) return fromForm;
  if (n && n.length > 1) return n;
  if (a.email) {
    const part = String(a.email).split('@')[0].replace(/[._0-9]+/g, ' ').trim();
    return part.replace(/\w/g, (c) => c.toUpperCase()) || 'Candidate';
  }
  return n.length === 1 ? `Candidate (${n})` : n || 'Candidate';
}

export default function DocumentVerification() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const appId = params.get('id');
  const [list, setList] = useState([]);
  const [app, setApp] = useState(null);
  const [filter, setFilter] = useState('All');
  const [docs, setDocs] = useState({});
  const [msg, setMsg] = useState('');

  const load = () => {
    api
      .get('/applications')
      .then((res) => {
        const data = res.data?.length ? res.data : getOfflineApps();
        setList(Array.isArray(data) ? data : []);
        if (appId) {
          const found = (data || []).find((a) => a._id === appId);
          setApp(found || null);
          setDocs(found?.documentStatuses || {});
        }
      })
      .catch(() => {
        const data = getOfflineApps();
        setList(data);
        if (appId) {
          const found = data.find((a) => a._id === appId);
          setApp(found || null);
          setDocs(found?.documentStatuses || {});
        }
      });
  };

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'hr')) load();
  }, [user, appId]);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container">
        <p>Access denied</p>
      </div>
    );
  }

  const pipeline = list.filter(
    (a) =>
      ['Selected', 'Offer', 'Document Verification', 'Joining', 'Onboarded', 'Accepted'].includes(a.status) ||
      a.selectionStatus === 'Selected' ||
      a.offerAccepted
  );

  const setStatus = (type, status) => {
    setDocs((d) => ({ ...d, [type]: status }));
  };

  const saveAll = async () => {
    if (!app) return;
    const payload = { documentStatuses: docs, pipelineStep: 'Document Verification', status: 'Document Verification' };
    try {
      await api.put(`/applications/${app._id}/status`, payload);
    } catch {
      updateOfflineApp(app._id, payload);
    }
    setMsg('Document statuses saved');
    load();
  };

  const counts = { Pending: 0, 'Under Review': 0, Verified: 0, Rejected: 0 };
  Object.values(docs).forEach((s) => {
    if (counts[s] !== undefined) counts[s]++;
  });
  DOC_TYPES.forEach((t) => {
    if (!docs[t]) counts.Pending++;
  });

  return (
    <div className="section page-bg-admin">
      <div className="container">
        <h1 className="section-title">4. Identity & Document Verification</h1>
        <AdminHero variant="default" />
        <p className="section-subtitle">Pending → Under Review → Verified → Rejected · per document</p>
        {msg && <p style={{ color: '#10b981' }}>{msg}</p>}

        {!appId && (
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <h3>Select candidate (pipeline)</h3>
            {pipeline.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>
                No candidates in verification pipeline. Offer accept / Selected status ke baad yahan aayenge.
              </p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {pipeline.map((a) => (
                  <li key={a._id} style={{ padding: '0.55rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <Link to={`/admin/documents-verify?id=${a._id}`} style={{ color: '#00d4ff' }}>
                      {displayName(a)}
                    </Link>
                    <span style={{ color: '#94a3b8' }}>
                      {' '}
                      · {a.email} · {a.status} · {a.positionSelected || a.job?.title || '—'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.85rem' }}>
              All applications:{' '}
              <Link to="/admin/applications" style={{ color: '#38bdf8' }}>
                Manage in Applications
              </Link>
            </p>
          </div>
        )}

        {app && (
          <>
            <p style={{ marginBottom: '1rem' }}>
              Candidate: <strong style={{ color: '#e2e8f0' }}>{displayName(app)}</strong> · {app.email} ·{' '}
              <Link to="/admin/documents-verify" style={{ color: '#00d4ff' }}>
                ← All
              </Link>
            </p>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
              {Object.entries(counts).map(([k, v]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setFilter(k === filter ? 'All' : k)}
                  className="btn btn-outline"
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.8rem',
                    borderColor: filter === k ? '#00d4ff' : undefined,
                    color: filter === k ? '#00d4ff' : undefined,
                  }}
                >
                  {k}: {v}
                </button>
              ))}
            </div>

            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginTop: 0 }}>Checklist</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                    <th style={{ padding: '0.5rem' }}>Document</th>
                    <th style={{ padding: '0.5rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {DOC_TYPES.filter((t) => filter === 'All' || (docs[t] || 'Pending') === filter).map((t) => (
                    <tr key={t} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.55rem' }}>{t}</td>
                      <td style={{ padding: '0.55rem' }}>
                        <select
                          value={docs[t] || 'Pending'}
                          onChange={(e) => setStatus(t, e.target.value)}
                          style={{ background: '#0f172a', color: '#e2e8f0', padding: '0.3rem', borderRadius: 6 }}
                        >
                          <option>Pending</option>
                          <option>Under Review</option>
                          <option>Verified</option>
                          <option>Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={saveAll}>
                Save verification
              </button>
            </div>

            <div className="card">
              <h3 style={{ marginTop: 0 }}>Next steps</h3>
              <Link to={`/admin/joining?id=${app._id}`} className="btn btn-outline" style={{ marginRight: 8 }}>
                Joining Form
              </Link>
              <Link to={`/admin/onboarding?id=${app._id}`} className="btn btn-outline">
                Full Onboarding
              </Link>
            </div>
          </>
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
