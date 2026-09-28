import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AdminHero from '../../components/AdminHero';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function AdminAttendanceHistory() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState(params.get('employeeId') || '');
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editStatus, setEditStatus] = useState('Present');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'hr')) return;
    api.get('/employees').then((r) => setEmployees(r.data || [])).catch(() => setEmployees([]));
  }, [user]);

  const loadHistory = async (id = employeeId) => {
    if (!id) { setRows([]); return; }
    setLoading(true);
    setMsg('');
    try {
      const r = await api.get(`/attendance/employee/${id}`);
      setRows(r.data || []);
    } catch (e) {
      setMsg(e.response?.data?.message || 'Could not load history (API offline?)');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) loadHistory(employeeId);
  }, [employeeId]);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return <div className="section container"><p>Admin / HR only</p></div>;
  }

  const selected = employees.find((e) => e._id === employeeId || e.employeeId === employeeId);
  const name = selected?.user?.name || selected?.name || '—';
  const empCode = selected?.employeeId || '—';

  const saveEdit = async () => {
    if (!employeeId || !editDate || !editStatus) {
      alert('Select employee, date and status');
      return;
    }
    try {
      await api.post('/attendance/mark', { employeeId, status: editStatus, date: editDate });
      setMsg(`Updated ${editDate} → ${editStatus}. Email alert sent if SMTP is configured.`);
      loadHistory(employeeId);
    } catch (e) {
      setMsg(e.response?.data?.message || 'Save failed');
    }
  };

  return (
    <div>
      <AdminHero variant="attendance" />
      <div className="container section" style={{ paddingTop: '0.5rem' }}>
        <h1 className="section-title" style={{ fontSize: '1.7rem' }}>Attendance records · view & edit</h1>
        <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
          Kisi bhi employee ki puri attendance history dekho, Present / Absent / Half edit karo.
        </p>

        <div className="card" style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: 8 }}>
            Select employee
            <select
              value={employeeId}
              onChange={(e) => {
                setEmployeeId(e.target.value);
                setParams(e.target.value ? { employeeId: e.target.value } : {});
              }}
              style={{
                width: '100%', marginTop: 6, padding: '0.6rem', borderRadius: 8,
                background: '#0b1220', color: '#e2e8f0', border: '1px solid #334155',
              }}
            >
              <option value="">— Choose —</option>
              {employees.map((e) => (
                <option key={e._id} value={e._id}>
                  {(e.user?.name || e.name || 'Employee')} · {e.employeeId || e._id?.slice(-6)}
                </option>
              ))}
            </select>
          </label>
          {employeeId && (
            <p style={{ color: '#67e8f9', margin: '0.5rem 0 0' }}>
              <strong>{name}</strong> · ID: {empCode}
            </p>
          )}
        </div>

        {employeeId && (
          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3 style={{ marginTop: 0 }}>Edit / mark for a date</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'end' }}>
              <label>Date
                <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)}
                  style={{ display: 'block', marginTop: 4, padding: 8, borderRadius: 8, background: '#0b1220', color: '#e2e8f0', border: '1px solid #334155' }} />
              </label>
              <label>Status
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}
                  style={{ display: 'block', marginTop: 4, padding: 8, borderRadius: 8, background: '#0b1220', color: '#e2e8f0', border: '1px solid #334155' }}>
                  <option>Present</option>
                  <option>Absent</option>
                  <option>Half-day</option>
                  <option>Leave</option>
                  <option>Holiday</option>
                </select>
              </label>
              <button type="button" className="btn btn-primary" onClick={saveEdit}>Save mark</button>
              <button type="button" className="btn btn-outline" onClick={() => loadHistory()}>Refresh</button>
            </div>
            {msg && <p style={{ color: '#fbbf24', marginTop: 10 }}>{msg}</p>}
          </div>
        )}

        <div className="card" style={{ overflowX: 'auto' }}>
          <h3 style={{ marginTop: 0 }}>History {loading ? '(loading…)' : rows.length ? `(${rows.length})` : ''}</h3>
          {!employeeId && <p style={{ color: '#64748b' }}>Employee select karo.</p>}
          {employeeId && !loading && rows.length === 0 && <p style={{ color: '#64748b' }}>No records yet.</p>}
          {rows.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                  <th style={{ padding: 8 }}>Sr. No.</th>
                  <th style={{ padding: 8 }}>Date</th>
                  <th style={{ padding: 8 }}>Status</th>
                  <th style={{ padding: 8 }}>Check-in</th>
                  <th style={{ padding: 8 }}>Check-out</th>
                  <th style={{ padding: 8 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const d = r.date ? new Date(r.date).toISOString().slice(0, 10) : '—';
                  return (
                    <tr key={r._id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: 8 }}>{i + 1}</td>
                      <td style={{ padding: 8 }}>{d}</td>
                      <td style={{ padding: 8, fontWeight: 700, color: r.status === 'Present' ? '#34d399' : r.status === 'Absent' ? '#fca5a5' : '#fbbf24' }}>{r.status}</td>
                      <td style={{ padding: 8 }}>{r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : '—'}</td>
                      <td style={{ padding: 8 }}>{r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : '—'}</td>
                      <td style={{ padding: 8 }}>
                        <button type="button" className="btn btn-outline" style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                          onClick={() => { setEditDate(d); setEditStatus(r.status || 'Present'); }}>
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <p style={{ marginTop: 16 }}>
          <Link to="/admin/attendance" style={{ color: '#67e8f9' }}>← Daily mark sheet</Link>
          {' · '}
          <Link to="/admin" style={{ color: '#67e8f9' }}>Dashboard</Link>
        </p>
      </div>
    </div>
  );
}
