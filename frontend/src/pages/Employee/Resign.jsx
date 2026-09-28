import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const KEY = 'ds_resignations';

const REASONS = [
  'Better opportunity',
  'Higher studies',
  'Relocation',
  'Personal / family',
  'Health',
  'Career change',
  'Other',
];

export default function EmployeeResign() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    department: user?.department || '',
    designation: user?.designation || '',
    lastWorkingDay: '',
    reason: '',
    feedback: '',
    bankAccount: '',
    ifsc: '',
    upi: '',
    salaryNote: 'Please credit final settlement / pending salary to the account below.',
  });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const [statusList, setStatusList] = useState([]);

  useEffect(() => {
    try {
      const all = JSON.parse(localStorage.getItem(KEY) || '[]');
      const mine = all.filter(
        (r) =>
          r.email === user?.email ||
          r.employeeId === user?._id ||
          r.employeeId === user?.id ||
          (user?.name && r.employeeName === user.name)
      );
      setStatusList(mine);
    } catch {
      setStatusList([]);
    }
  }, [user, done]);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    if (!form.reason || !form.lastWorkingDay) {
      setErr('Reason and last working day are required.');
      return;
    }
    const entry = {
      id: `res-${Date.now()}`,
      employeeId: user?._id || user?.id || '',
      employeeName: user?.name || user?.fullName || 'Employee',
      email: user?.email || '',
      phone: user?.phone || '',
      department: form.department || '—',
      designation: form.designation || '—',
      lastWorkingDay: form.lastWorkingDay,
      reason: form.reason,
      feedback: form.feedback,
      bankAccount: form.bankAccount,
      ifsc: form.ifsc,
      upi: form.upi,
      salaryNote: form.salaryNote,
      status: 'Submitted',
      salarySettlement: 'Pending HR',
      createdAt: new Date().toISOString(),
    };
    try {
      const list = JSON.parse(localStorage.getItem(KEY) || '[]');
      list.unshift(entry);
      localStorage.setItem(KEY, JSON.stringify(list));
      try {
        window.dispatchEvent(new Event('ds-resign-updated'));
      } catch (_) {}
    } catch (_) {}
    try {
      await api.post('/employees/resign', entry);
    } catch (_) {
      /* local storage is source of truth for admin panel list */
    }
    setDone(true);
    setMsg('Resignation submitted. HR / Admin can see it under Resign Letters. Final salary will be processed after clearance.');
  };

  if (done) {
    return (
      <div className="section page-bg-employee">
        <div className="container" style={{ maxWidth: 560 }}>
          <div className="card">
            <h1 className="section-title" style={{ fontSize: '1.5rem' }}>Resignation submitted</h1>
            <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>{msg}</p>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Keep checking notices / HR contact for exit formalities and final settlement.
            </p>
            <Link to="/employee" className="btn btn-primary">
              Back to portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section page-bg-employee">
      <div className="container" style={{ maxWidth: 560 }}>
        <h1 className="section-title">Resign</h1>
        {statusList.length > 0 && (
          <div className="card" style={{ marginBottom: '1rem', borderLeft: '4px solid #00d4ff' }}>
            <h3 style={{ marginTop: 0, color: '#e2e8f0' }}>My resignation status</h3>
            {statusList.map((r) => (
              <div key={r.id || r.createdAt} style={{ marginBottom: '0.75rem', color: '#cbd5e1', fontSize: '0.9rem' }}>
                <div>LWD: <strong>{r.lastWorkingDay || '—'}</strong> · Reason: {r.reason}</div>
                <div>
                  Status:{' '}
                  <strong style={{ color: r.status === 'Approved' || r.salarySettlement === 'Paid' ? '#34d399' : '#fbbf24' }}>
                    {r.status || 'Submitted'}
                  </strong>
                  {r.salarySettlement ? ` · Settlement: ${r.salarySettlement}` : ''}
                </div>
                {r.hrNote && <div style={{ color: '#94a3b8' }}>HR note: {r.hrNote}</div>}
              </div>
            ))}
          </div>
        )}
        <p className="section-subtitle">Submit resignation · HR receives it in Admin → Resign Letters</p>
        {err && <p style={{ color: '#f87171' }}>{err}</p>}
        {msg && <p style={{ color: '#34d399' }}>{msg}</p>}

        <form onSubmit={submit} className="card">
          <div className="form-group">
            <label>Employee</label>
            <input value={user?.name || user?.email || ''} readOnly style={{ opacity: 0.85 }} />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Department</label>
              <input
                placeholder="e.g. Engineering"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Designation</label>
              <input
                placeholder="e.g. Software Engineer"
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Last working day *</label>
            <input
              type="date"
              value={form.lastWorkingDay}
              onChange={(e) => setForm({ ...form, lastWorkingDay: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Reason *</label>
            <select
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              required
              style={{ background: '#0f172a', color: '#e2e8f0' }}
            >
              <option value="">Select…</option>
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Feedback (optional)</label>
            <textarea
              rows={3}
              placeholder="Any message for HR…"
              value={form.feedback}
              onChange={(e) => setForm({ ...form, feedback: e.target.value })}
            />
          </div>

          <h3 style={{ color: '#00d4ff', marginTop: '1.25rem' }}>Final salary / settlement payout</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            After clearance, HR can credit pending salary, leave encashment and dues here.
          </p>
          <div className="form-group">
            <label>Bank account number</label>
            <input
              value={form.bankAccount}
              onChange={(e) => setForm({ ...form, bankAccount: e.target.value })}
              placeholder="Account number for final settlement"
            />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>IFSC</label>
              <input value={form.ifsc} onChange={(e) => setForm({ ...form, ifsc: e.target.value })} placeholder="e.g. SBIN0001234" />
            </div>
            <div className="form-group">
              <label>UPI (optional)</label>
              <input value={form.upi} onChange={(e) => setForm({ ...form, upi: e.target.value })} placeholder="name@upi" />
            </div>
          </div>
          <div className="form-group">
            <label>Note to HR (salary)</label>
            <textarea
              rows={2}
              value={form.salaryNote}
              onChange={(e) => setForm({ ...form, salaryNote: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit Resignation
          </button>
        </form>
        <p style={{ marginTop: '1rem' }}>
          <Link to="/employee" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
