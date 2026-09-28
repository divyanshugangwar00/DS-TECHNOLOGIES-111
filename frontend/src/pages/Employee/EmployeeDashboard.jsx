import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [today, setToday] = useState(null);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const load = async () => {
    try {
      const [p, att] = await Promise.all([
        api.get('/employees/me').catch(() => ({ data: null })),
        api.get('/attendance/me').catch(() => ({ data: [] })),
      ]);
      setProfile(p.data);
      const list = att.data || [];
      const d = new Date().toISOString().slice(0, 10);
      const t = list.find((r) => {
        try {
          return new Date(r.date).toISOString().slice(0, 10) === d;
        } catch {
          return false;
        }
      });
      setToday(t || null);
    } catch (_) {}
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  const checkIn = async () => {
    setErr('');
    setMsg('');
    try {
      await api.post('/attendance/checkin');
      setMsg('Checked in successfully');
      load();
    } catch (e) {
      setErr(e.response?.data?.message || 'Check-in failed');
    }
  };

  const checkOut = async () => {
    setErr('');
    setMsg('');
    try {
      await api.post('/attendance/checkout');
      setMsg('Checked out successfully');
      load();
    } catch (e) {
      setErr(e.response?.data?.message || 'Check-out failed');
    }
  };

  if (!user) {
    return (
      <div className="section container">
        <p>Please login</p>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    );
  }

  const empId = profile?.employeeId || '—';
  const designation = profile?.designation || 'Team Member';
  const department = profile?.department || '—';
  const joining = profile?.joiningDate
    ? new Date(profile.joiningDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '—';

  const actions = [
    { to: '/employee/attendance', icon: '📅', title: 'Attendance', desc: 'History & records' },
    { to: '/employee/leave', icon: '🏖️', title: 'Apply Leave', desc: 'Sick / Casual / Annual' },
    { to: '/employee/profile', icon: '👤', title: 'My Profile', desc: 'View your details' },
    { to: '/employee/salary', icon: '💰', title: 'Salary', desc: 'Payslip view' },
    { to: '/employee/documents', icon: '📄', title: 'Documents', desc: 'Letters & files' },
    { to: '/employee/tasks', icon: '✅', title: 'My Tasks', desc: 'Assigned work' },
    { to: '/employee/notices', icon: '📢', title: 'Notices', desc: 'Company updates' },
    { to: '/employee/directory', icon: '👥', title: 'Directory', desc: 'Team contacts' },
    { to: '/employee/support', icon: '🎫', title: 'Support', desc: 'Raise ticket' },
    { to: '/employee/password', icon: '🔑', title: 'Password', desc: 'Change password' },
    { to: '/employee/resign', icon: '🚪', title: 'Resign', desc: 'Exit request' },
  ];

  const navLinks = [
    ['Dashboard', '/employee'],
    ['My Profile', '/employee/profile'],
    ['Attendance', '/employee/attendance'],
    ['Leave', '/employee/leave'],
    ['Salary', '/employee/salary'],
    ['Documents', '/employee/documents'],
    ['Tasks', '/employee/tasks'],
    ['Notices', '/employee/notices'],
    ['Support', '/employee/support'],
  ];

  return (
    <div className="section page-bg-employee">
      <div className="container">
        <h1 className="section-title">Employee Portal</h1>
        <p className="section-subtitle">
          Welcome, {user.name || 'Team member'} 👋
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '1.5rem',
          }}
        >
          {navLinks.map(([label, to]) => (
            <Link
              key={to}
              to={to}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 8,
                border: '1px solid rgba(0,212,255,0.25)',
                color: '#00d4ff',
                fontSize: '0.85rem',
                textDecoration: 'none',
                background: 'rgba(0,212,255,0.06)',
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Employee ID</div>
              <div style={{ fontWeight: 700 }}>{empId}</div>
            </div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Designation</div>
              <div style={{ fontWeight: 700 }}>{designation}</div>
            </div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Department</div>
              <div style={{ fontWeight: 700 }}>{department}</div>
            </div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Joining Date</div>
              <div style={{ fontWeight: 700 }}>{joining}</div>
            </div>
          </div>
        </div>

        {msg && <p style={{ color: '#10b981' }}>{msg}</p>}
        {err && <p style={{ color: '#fca5a5' }}>{err}</p>}

        <div className="card" style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Today&apos;s Attendance</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Check In</div>
              <div style={{ fontSize: '1.25rem', color: '#10b981', fontWeight: 600 }}>
                {today?.checkIn
                  ? new Date(today.checkIn).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '—'}
              </div>
            </div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Check Out</div>
              <div style={{ fontSize: '1.25rem', color: '#fbbf24', fontWeight: 600 }}>
                {today?.checkOut
                  ? new Date(today.checkOut).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '—'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={checkIn}
                disabled={!!today?.checkIn}
              >
                Check In
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={checkOut}
                disabled={!today?.checkIn || !!today?.checkOut}
              >
                Check Out
              </button>
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Quick Actions</h2>
        <div className="grid-3">
          {actions.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="card"
              style={{ display: 'block', textDecoration: 'none' }}
            >
              <h3 style={{ fontSize: '1rem', marginBottom: '0.35rem' }}>
                {a.icon} {a.title}
              </h3>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.85rem' }}>{a.desc}</p>
            </Link>
          ))}
        </div>

        <p style={{ marginTop: '1.5rem' }}>
          <Link to="/employee/resign" style={{ color: '#fca5a5' }}>
            Resign / Exit request →
          </Link>
        </p>
      </div>
    
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ color: '#38bdf8', marginTop: 0 }}>Employee portal modules (201–229)</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['Employee Login','Employee Dashboard','My Profile','Attendance','Check In','Check Out','Attendance History','Leave','Apply Leave','Leave History','Salary','Payslips','Documents','Tasks','Projects','Timesheet','Expenses','Reimbursement','Performance','Goals / KPI','Training','Courses','Notices','Company Directory','Support','Notifications','Resignation','Exit Process','Change Password'].map((x,i)=>(
              <span key={x} style={{ fontSize:'0.75rem', padding:'4px 8px', borderRadius:6, background:'rgba(148,163,184,0.15)', color:'#cbd5e1' }}>{201+i}. {x}</span>
            ))}
          </div>
        </div>
</div>
  );
}
