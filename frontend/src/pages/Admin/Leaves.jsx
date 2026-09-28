import { useEffect, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminLeaves() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [slip, setSlip] = useState(null);
  const [dept, setDept] = useState('All');

  const load = () => {
    api
      .get('/leaves')
      .then((res) => {
        let list = res.data || [];
        try {
          const local = JSON.parse(localStorage.getItem('ds_all_leaves') || '[]');
          if (local.length) {
            const ids = new Set(list.map((x) => x._id || x.id));
            local.forEach((x) => {
              if (!ids.has(x._id) && !ids.has(x.id)) list.push(x);
            });
          }
        } catch (_) {}
        setLeaves(list);
      })
      .catch(() => {
        try {
          setLeaves(JSON.parse(localStorage.getItem('ds_all_leaves') || '[]'));
        } catch {
          setLeaves([]);
        }
        setError('API offline — showing local leave requests');
      });
  };

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'hr')) load();
  }, [user]);

  const setStatus = async (id, status) => {
    try {
      await api.put(`/leaves/${id}/status`, { status });
    } catch (e) {
      /* offline: still update local */
    }
    // Always sync local so employee portal sees Approve/Reject
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith('ds_my_leaves_'));
      keys.forEach((k) => {
        const arr = JSON.parse(localStorage.getItem(k) || '[]');
        const next = arr.map((l) =>
          l._id === id || l.id === id ? { ...l, status, reviewedAt: new Date().toISOString() } : l
        );
        localStorage.setItem(k, JSON.stringify(next));
      });
      const all = JSON.parse(localStorage.getItem('ds_all_leaves') || '[]');
      const nextAll = all.map((l) =>
        l._id === id || l.id === id ? { ...l, status, reviewedAt: new Date().toISOString() } : l
      );
      localStorage.setItem('ds_all_leaves', JSON.stringify(nextAll));
      window.dispatchEvent(new Event('ds-leaves-updated'));
    } catch (_) {}
    setLeaves((prev) => prev.map((l) => (l._id === id || l.id === id ? { ...l, status } : l)));
    setMsg(`Leave ${status} — employee will see this on Leave page`);
    load();
  };

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container">
        <p>Access denied</p>
      </div>
    );
  }

  const depts = ['All', ...new Set(leaves.map((l) => l.department || l.employee?.department).filter(Boolean))];
  const filtered = leaves.filter((l) => dept === 'All' || (l.department || l.employee?.department || '') === dept);

  const openSlip = (l) => setSlip(l);

  return (
    <div className="section page-bg-leaves">
      <div className="container">
        <h1 className="section-title">🏖️ Leave Management</h1>
        <AdminHero variant="default" />
        <p className="section-subtitle">Approve / Reject · Check · Save · Leave slip like payslip</p>
        {error && <p style={{ color: '#fca5a5' }}>{error}</p>}
        {msg && <p style={{ color: '#10b981' }}>{msg}</p>}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#94a3b8', marginRight: 8 }}>Department:</label>
          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            style={{ padding: '0.5rem 1rem', background: '#0f172a', color: '#e2e8f0', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)' }}
          >
            {depts.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="card" style={{ overflowX: 'auto' }}>
          {filtered.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No leave requests.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem' }}>S.No</th>
                  <th style={{ padding: '0.75rem' }}>Employee</th>
                  <th style={{ padding: '0.75rem' }}>Emp ID</th>
                  <th style={{ padding: '0.75rem' }}>Dept</th>
                  <th style={{ padding: '0.75rem' }}>Type</th>
                  <th style={{ padding: '0.75rem' }}>From</th>
                  <th style={{ padding: '0.75rem' }}>To</th>
                  <th style={{ padding: '0.75rem' }}>Days</th>
                  <th style={{ padding: '0.75rem' }}>Reason</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l, idx) => (
                  <tr key={l.id || l._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem' }}>{idx + 1}</td>
                    <td style={{ padding: '0.75rem' }}>{l.employeeName || l.employee?.user?.name || l.name || l.user?.name || '—'}</td>
                    <td style={{ padding: '0.75rem' }}>{l.employeeId || l.employee?.employeeId || l.empId || l.employee?.user?.employeeId || '—'}</td>
                    <td style={{ padding: '0.75rem' }}>{l.department || l.employee?.department || '—'}</td>
                    <td style={{ padding: '0.75rem' }}>{l.type}</td>
                    <td style={{ padding: '0.75rem' }}>{new Date(l.fromDate).toLocaleDateString()}</td>
                    <td style={{ padding: '0.75rem' }}>{new Date(l.toDate).toLocaleDateString()}</td>
                    <td style={{ padding: '0.75rem' }}>{l.days}</td>
                    <td style={{ padding: '0.75rem' }}>{l.reason || '—'}</td>
                    <td
                      style={{
                        padding: '0.75rem',
                        color: l.status === 'Approved' ? '#10b981' : l.status === 'Rejected' ? '#fca5a5' : '#fbbf24',
                      }}
                    >
                      {l.status}
                    </td>
                    <td style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', marginRight: 6 }}
                        onClick={() => openSlip(l)}
                      >
                        View Slip
                      </button>
                      {l.status === 'Pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => setStatus(l._id, 'Approved')}
                            style={{
                              marginRight: 6,
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.75rem',
                              background: 'rgba(16,185,129,0.2)',
                              border: '1px solid #10b981',
                              borderRadius: 6,
                              color: '#10b981',
                            }}
                          >
                            ✓ Approve / Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setStatus(l._id, 'Rejected')}
                            style={{
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.75rem',
                              background: 'rgba(239,68,68,0.15)',
                              border: '1px solid #ef4444',
                              borderRadius: 6,
                              color: '#fca5a5',
                            }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {slip && (
          <div
            className="no-print"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.75)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              padding: '1.5rem',
              overflowY: 'auto',
            }}
            onClick={() => setSlip(null)}
          >
            <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 520 }}>
              <div id="leave-slip-print" style={{ background: '#fff', color: '#0f172a', borderRadius: 12, padding: '1.5rem' }}>
                <div style={{ borderBottom: '2px solid #0369a1', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 800, color: '#0369a1', fontSize: '1.1rem' }}>DS-TECHNOLOGIES</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Leave Application Slip</div>
                </div>
                <h2 style={{ textAlign: 'center', fontSize: '1.05rem' }}>LEAVE SLIP</h2>
                <table style={{ width: '100%', fontSize: '0.9rem' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '0.35rem 0' }}>Employee Name</td>
                      <td>{slip.employeeName || slip.name || slip.employee?.user?.name || '—'}</td>
                    </tr>
                    <tr>
                      <td>Employee ID</td>
                      <td>{slip.employeeId || slip.empId || slip.employee?.employeeId || '—'}</td>
                    </tr>
                    <tr>
                      <td>Department</td>
                      <td>{slip.department || slip.employee?.department || '—'}</td>
                    </tr>
                    <tr>
                      <td>Applied Date</td>
                      <td>{new Date(slip.createdAt || slip.appliedAt || Date.now()).toLocaleDateString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td>Type</td>
                      <td>{slip.type}</td>
                    </tr>
                    <tr>
                      <td>From – To</td>
                      <td>
                        {new Date(slip.fromDate).toLocaleDateString('en-IN')} – {new Date(slip.toDate).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                    <tr>
                      <td>Days</td>
                      <td>{slip.days}</td>
                    </tr>
                    <tr>
                      <td>Reason</td>
                      <td>{slip.reason || '—'}</td>
                    </tr>
                    <tr>
                      <td>Status</td>
                      <td style={{ fontWeight: 700 }}>{slip.status}</td>
                    </tr>
                  </tbody>
                </table>
                <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '1rem' }}>
                  Computer-generated · DS-TECHNOLOGIES · Bareilly
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'center' }}>
                <button type="button" className="btn btn-primary" onClick={() => window.print()}>
                  Print / PDF
                </button>
                {slip.status === 'Pending' && (
                  <>
                    <button type="button" className="btn btn-primary" onClick={() => { setStatus(slip._id, 'Approved'); setSlip(null); }}>
                      Approve & Save
                    </button>
                    <button type="button" className="btn btn-outline" onClick={() => { setStatus(slip._id, 'Rejected'); setSlip(null); }}>
                      Reject
                    </button>
                  </>
                )}
                <button type="button" className="btn btn-outline" onClick={() => setSlip(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
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
