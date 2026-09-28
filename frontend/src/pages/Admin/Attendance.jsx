import { useEffect, useState, useMemo, useCallback } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { notifyAttendance } from '../../utils/notify';

const LS_KEY = 'ds_attendance_marks';

function loadLocalMarks() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveLocalMarks(marks) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(marks));
  } catch (_) {}
}

export default function AdminAttendance() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const viewMode = searchParams.get('view') === 'today' ? 'today' : 'mark';
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [dateFilter, setDateFilter] = useState(() => new Date().toISOString().slice(0, 10));
  const [deptFilter, setDeptFilter] = useState('All');
  const [marks, setMarks] = useState(() => loadLocalMarks());
  const [busy, setBusy] = useState(null);
  const [lockedDates, setLockedDates] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ds_att_locked') || '{}'); } catch { return {}; }
  });
  const isLocked = !!lockedDates[dateFilter];

  const keyOf = (empId, date) => `${empId}-${date}`;

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'hr')) return;

    api
      .get('/employees')
      .then((res) => setEmployees(res.data || []))
      .catch(() => setError('Employees load failed — seedEmployees.js chalao'));

    api
      .get('/attendance')
      .then((res) => {
        const data = res.data || [];
        setMarks((prev) => {
          const next = { ...prev };
          data.forEach((r) => {
            const id = r.employee?._id || r.employee;
            if (!id) return;
            let d;
            try {
              d = new Date(r.date).toISOString().slice(0, 10);
            } catch {
              return;
            }
            const st =
              r.status === 'Absent'
                ? 'Absent'
                : r.status === 'Half-day'
                  ? 'Half-day'
                  : r.checkIn || r.status === 'Present'
                    ? 'Present'
                    : r.status;
            if (st) next[keyOf(id, d)] = st;
          });
          saveLocalMarks(next);
          return next;
        });
      })
      .catch(() => {
        /* offline — localStorage marks use */
      });
  }, [user]);

  const departments = useMemo(() => {
    const s = new Set();
    employees.forEach((e) => {
      if (e.department) s.add(e.department);
    });
    return ['All', ...Array.from(s).sort()];
  }, [employees]);

  const filteredEmps = useMemo(() => {
    if (deptFilter === 'All') return employees;
    return employees.filter((e) => e.department === deptFilter);
  }, [employees, deptFilter]);

  const { presentCount, absentCount, halfCount } = useMemo(() => {
    let presentCount = 0;
    let absentCount = 0;
    let halfCount = 0;
    const suffix = `-${dateFilter}`;
    Object.keys(marks).forEach((k) => {
      if (!k.endsWith(suffix)) return;
      if (marks[k] === 'Present') presentCount += 1;
      if (marks[k] === 'Absent') absentCount += 1;
      if (marks[k] === 'Half-day') halfCount += 1;
    });
    return { presentCount, absentCount, halfCount };
  }, [marks, dateFilter]);

  const applyMark = useCallback(
    async (emp, status) => {
        if (lockedDates[dateFilter]) { setMsg('This date is saved & locked — change date or contact admin'); return; }

      if (!emp?._id) return;
      const key = keyOf(emp._id, dateFilter);
      setBusy(key);

      // Instant UI update
      setMarks((prev) => {
        const next = { ...prev, [key]: status };
        saveLocalMarks(next);
        return next;
      });
      setMsg(`${emp.user?.name || emp.employeeId || 'Employee'} → ${status}`);
      setError('');

      // WhatsApp / Email alert to employee
      try {
        if (status === 'Present' || status === 'Absent' || status === 'Half-day') {
          notifyAttendance({
            name: emp.user?.name || emp.name,
            phone: emp.user?.phone || emp.phone || emp.mobile,
            email: emp.user?.email || emp.email,
            status,
            date: dateFilter,
            openWhatsApp: false,
          });
        }
      } catch (_) {}

      try {
        await api.post('/attendance/mark', {
          employeeId: emp._id,
          status,
          date: dateFilter,
        });
      } catch (err) {
        // keep local mark even if API fails (offline)
        const m = err.response?.data?.message;
        if (m) setError(`Saved locally. Server: ${m}`);
      } finally {
        setBusy(null);
      }
    },
    [dateFilter]
  );

  const markAll = async (status) => {
    for (const emp of filteredEmps) {
      await applyMark(emp, status);
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container">
        <p>Only Leadership / HR can view attendance.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  const stylePresent = (active) => ({
    marginRight: 6,
    padding: '0.4rem 0.85rem',
    fontSize: '0.8rem',
    fontWeight: 700,
    borderRadius: 8,
    cursor: 'pointer',
    border: active ? '2px solid #10b981' : '1px solid #10b981',
    background: active ? '#10b981' : 'rgba(16,185,129,0.12)',
    color: active ? '#041016' : '#34d399',
    boxShadow: active ? '0 0 12px rgba(16,185,129,0.5)' : 'none',
  });

  const styleAbsent = (active) => ({
    marginRight: 6,
    padding: '0.4rem 0.85rem',
    fontSize: '0.8rem',
    fontWeight: 700,
    borderRadius: 8,
    cursor: 'pointer',
    border: active ? '2px solid #ef4444' : '1px solid #ef4444',
    background: active ? '#ef4444' : 'rgba(239,68,68,0.12)',
    color: active ? '#fff' : '#fca5a5',
    boxShadow: active ? '0 0 12px rgba(239,68,68,0.45)' : 'none',
  });

  const styleHalf = (active) => ({
    padding: '0.4rem 0.75rem',
    fontSize: '0.8rem',
    fontWeight: 700,
    borderRadius: 8,
    cursor: 'pointer',
    border: active ? '2px solid #f59e0b' : '1px solid #f59e0b',
    background: active ? '#f59e0b' : 'rgba(245,158,11,0.12)',
    color: active ? '#041016' : '#fbbf24',
  });

  return (
    <div className="section page-bg-attendance">
      <div className="container">
        <h1 className="section-title">Team Attendance</h1>
        <AdminHero variant="attendance" />
        <p className="section-subtitle">Department-wise · Present / Absent / Half-day · instant color change</p>

        {error && <p style={{ color: '#fca5a5' }}>{error}</p>}
        {msg && <p style={{ color: '#10b981' }}>{msg}</p>}

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '1.25rem',
            alignItems: 'center',
          }}
        >
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              padding: '0.6rem',
              background: '#0f172a',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 8,
              color: '#e2e8f0',
            }}
          />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            style={{
              padding: '0.6rem 1rem',
              background: '#0f172a',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 8,
              color: '#e2e8f0',
            }}
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <span style={{ color: '#10b981', fontWeight: 700 }}>Present: {presentCount}</span>
          <span style={{ color: '#fca5a5', fontWeight: 700 }}>Absent: {absentCount}</span>
          <span style={{ color: '#fbbf24', fontWeight: 700 }}>Half: {halfCount}</span>
          {(viewMode === 'mark' || viewMode === 'today') && (
          <>
          <button type="button" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => markAll('Present')}>
            All Present
          </button>
          <button type="button" className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => markAll('Absent')}>
            All Absent
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', fontWeight: 700 }}
            onClick={async () => {
              setMsg('Saving attendance…');
              let ok = 0;
              let fail = 0;
              for (const emp of filteredEmps) {
                const st = marks[keyOf(emp._id, dateFilter)];
                if (!st) continue;
                try {
                  await api.post('/attendance/mark', { employeeId: emp._id, status: st, date: dateFilter });
                  ok += 1;
                } catch {
                  fail += 1;
                }
              }
              saveLocalMarks(marks);
              setMsg(`Attendance saved · ${ok} records${fail ? ` · ${fail} offline/fail` : ''} · Locked for this date`);
              const nextLock = { ...lockedDates, [dateFilter]: true };
              setLockedDates(nextLock);
              localStorage.setItem('ds_att_locked', JSON.stringify(nextLock));
            }}
          >
            💾 Save Attendance
          </button>
          <Link to="/admin/attendance-history" className="btn btn-outline" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}>
            View / edit full history
          </Link>
          
          {isLocked && <span style={{ color: '#fbbf24', fontSize: '0.85rem' }}>Saved & locked for this date</span>}
          </>
          )}
        </div>

        <div className="card" style={{ marginBottom: '1.5rem', overflowX: 'auto' }}>
          <h3 style={{ marginBottom: '1rem' }}>
              {viewMode === 'today' ? `Today's status (${filteredEmps.length} employees)` : `Mark attendance (${filteredEmps.length} employees)`}
            </h3>
          {filteredEmps.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No employees. Backend: <code>node seedEmployees.js</code></p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>Sr. No.</th>
                  <th style={{ padding: '0.5rem' }}>Name</th>
                  <th style={{ padding: '0.5rem' }}>Employee ID</th>
                  <th style={{ padding: '0.5rem' }}>Department</th>
                  <th style={{ padding: '0.5rem' }}>Mark</th>
                  <th style={{ padding: '0.5rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmps.map((emp, i) => {
                  const st = marks[keyOf(emp._id, dateFilter)];
                  const isBusy = busy === keyOf(emp._id, dateFilter);
                  return (
                    <tr
                      key={emp._id}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        background:
                          st === 'Present'
                            ? 'rgba(16,185,129,0.14)'
                            : st === 'Absent'
                              ? 'rgba(239,68,68,0.12)'
                              : st === 'Half-day'
                                ? 'rgba(245,158,11,0.12)'
                                : 'transparent',
                      }}
                    >
                      <td style={{ padding: '0.5rem', color: '#64748b' }}>{i + 1}</td>
                      <td style={{ padding: '0.5rem' }}>{emp.user?.name || '—'}</td>
                      <td style={{ padding: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>{emp.employeeId}</td>
                      <td style={{ padding: '0.5rem' }}>{emp.department}</td>
                      <td style={{ padding: '0.5rem', whiteSpace: 'nowrap' }}>
                        <button
                          type="button"
                          disabled={isBusy || isLocked}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); applyMark(emp, 'Present'); }}
                          style={stylePresent(st === 'Present')}
                        >
                          {st === 'Present' ? '✓ Present' : 'Present'}
                        </button>
                        <button
                          type="button"
                          disabled={isBusy || isLocked}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); applyMark(emp, 'Absent'); }}
                          style={styleAbsent(st === 'Absent')}
                        >
                          {st === 'Absent' ? '✓ Absent' : 'Absent'}
                        </button>
                        <button
                          type="button"
                          disabled={isBusy || isLocked}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); applyMark(emp, 'Half-day'); }}
                          style={styleHalf(st === 'Half-day')}
                        >
                          {st === 'Half-day' ? '✓ Half' : 'Half'}
                        </button>
                      </td>
                      <td style={{ padding: '0.5rem', fontWeight: 700, color: st === 'Present' ? '#10b981' : st === 'Absent' ? '#fca5a5' : st === 'Half-day' ? '#fbbf24' : '#64748b' }}>
                        {st || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <p>
          <Link to="/admin" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
