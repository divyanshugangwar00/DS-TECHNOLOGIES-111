import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function EmployeeAttendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  const load = () => {
    api
      .get('/attendance/my')
      .then((res) => setRecords(res.data || []))
      .catch(() => {
        try {
          const local = JSON.parse(localStorage.getItem('ds_my_attendance') || '[]');
          setRecords(local.filter((r) => r.email === user?.email || !r.email));
        } catch {
          setRecords([]);
        }
      });
  };

  useEffect(() => {
    load();
  }, [user]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const today = records.find((r) => {
    try {
      return new Date(r.date).toISOString().slice(0, 10) === todayStr;
    } catch {
      return false;
    }
  });

  const persistLocal = (next) => {
    localStorage.setItem('ds_my_attendance', JSON.stringify(next));
    setRecords(next);
  };

  const checkIn = async () => {
    if (today?.checkIn) {
      setError('Already checked in today');
      return;
    }
    setBusy('in');
    setError('');
    setMsg('');
    const now = new Date().toISOString();
    try {
      await api.post('/attendance/check-in');
      setMsg('Checked in ✓');
      load();
    } catch (_) {
      const row = {
        _id: 'local-' + Date.now(),
        date: todayStr,
        checkIn: now,
        checkOut: null,
        status: 'Present',
        email: user?.email,
      };
      const others = records.filter((r) => {
        try {
          return new Date(r.date).toISOString().slice(0, 10) !== todayStr;
        } catch {
          return true;
        }
      });
      persistLocal([row, ...others]);
      setMsg('Checked in (offline) ✓');
    }
    setBusy('');
  };

  const checkOut = async () => {
    if (!today?.checkIn) {
      setError('Pehle Check In karein');
      return;
    }
    if (today?.checkOut) {
      setError('Already checked out today');
      return;
    }
    setBusy('out');
    setError('');
    setMsg('');
    const now = new Date().toISOString();
    try {
      await api.post('/attendance/check-out');
      setMsg('Checked out ✓');
      load();
    } catch (_) {
      const next = records.map((r) => {
        try {
          if (new Date(r.date).toISOString().slice(0, 10) === todayStr) {
            return { ...r, checkOut: now, status: 'Present' };
          }
        } catch {}
        return r;
      });
      persistLocal(next);
      setMsg('Checked out (offline) ✓');
    }
    setBusy('');
  };

  const present = records.filter((r) => r.status === 'Present' || r.checkIn).length;
  const absent = records.filter((r) => r.status === 'Absent').length;
  const late = records.filter((r) => r.status === 'Late').length;

  return (
    <div className="section page-bg-employee">
      <div className="container">
        <h1 className="section-title">My Attendance</h1>
        <p className="section-subtitle">Check-In morning · Check-Out evening · History alag</p>

        {msg && <p style={{ color: '#10b981' }}>{msg}</p>}
        {error && <p style={{ color: '#fca5a5' }}>{error}</p>}

        <div className="card" style={{ marginBottom: '1rem' }}>
          <p style={{ color: '#94a3b8', marginBottom: '0.75rem' }}>
            Today:{' '}
            <strong style={{ color: '#e2e8f0' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
            </strong>
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Check-In time</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: today?.checkIn ? '#10b981' : '#64748b' }}>
                {today?.checkIn ? new Date(today.checkIn).toLocaleTimeString('en-IN') : '— not yet —'}
              </div>
            </div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Check-Out time</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: today?.checkOut ? '#38bdf8' : '#64748b' }}>
                {today?.checkOut ? new Date(today.checkOut).toLocaleTimeString('en-IN') : '— not yet —'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={checkIn}
              disabled={!!today?.checkIn || busy === 'in'}
              style={{ opacity: today?.checkIn ? 0.5 : 1 }}
            >
              {busy === 'in' ? '…' : today?.checkIn ? '✓ Already Checked In' : '🟢 Check In'}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={checkOut}
              disabled={!today?.checkIn || !!today?.checkOut || busy === 'out'}
              style={{ opacity: !today?.checkIn || today?.checkOut ? 0.5 : 1 }}
            >
              {busy === 'out' ? '…' : today?.checkOut ? '✓ Already Checked Out' : '🔴 Check Out'}
            </button>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1rem',
          }}
        >
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: '#10b981', fontSize: '1.4rem', fontWeight: 700 }}>{present}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Present days</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: '#fca5a5', fontSize: '1.4rem', fontWeight: 700 }}>{absent}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Absent</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: '#fbbf24', fontSize: '1.4rem', fontWeight: 700 }}>{late}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Late</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ color: '#00d4ff', fontSize: '1.4rem', fontWeight: 700 }}>{records.length}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Total records</div>
          </div>
        </div>

        <div className="card" style={{ overflowX: 'auto' }}>
          <h3 style={{ marginBottom: '1rem' }}>History (In ≠ Out)</h3>
          {records.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No records yet. Subah Check In, shaam Check Out.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                  <th style={{ padding: '0.6rem' }}>Date</th>
                  <th style={{ padding: '0.6rem' }}>Check-In</th>
                  <th style={{ padding: '0.6rem' }}>Check-Out</th>
                  <th style={{ padding: '0.6rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id || r.date} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.6rem' }}>{new Date(r.date).toLocaleDateString('en-IN')}</td>
                    <td style={{ padding: '0.6rem', color: '#10b981' }}>
                      {r.checkIn ? new Date(r.checkIn).toLocaleTimeString('en-IN') : '—'}
                    </td>
                    <td style={{ padding: '0.6rem', color: '#38bdf8' }}>
                      {r.checkOut ? new Date(r.checkOut).toLocaleTimeString('en-IN') : '—'}
                    </td>
                    <td style={{ padding: '0.6rem', color: r.status === 'Absent' ? '#fca5a5' : '#10b981' }}>
                      {r.status || (r.checkIn ? 'Present' : '—')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <p style={{ marginTop: '1rem' }}>
          <Link to="/employee" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
