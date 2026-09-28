import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function buildSlip(empLike) {
  const ctcMonthly = Number(empLike?.salary) || 20000;
  const basic = Math.round(ctcMonthly * 0.5);
  const hra = Math.round(basic * 0.4);
  const da = Math.round(basic * 0.1);
  const conveyance = 1600;
  const medical = 1250;
  const special = Math.max(0, ctcMonthly - basic - hra - da - conveyance - medical);
  const bonus = Math.round(ctcMonthly * 0.05);
  const overtime = 0;
  const gross = basic + hra + da + conveyance + medical + special + bonus + overtime;
  const pf = Math.round(Math.min(basic, 15000) * 0.12);
  const esi = gross <= 21000 ? Math.round(gross * 0.0075) : 0;
  const professionalTax = gross > 10000 ? 200 : 0;
  const totalDed = pf + esi + professionalTax;
  const net = gross - totalDed;
  return {
    name: empLike?.user?.name || empLike?.name || 'Employee',
    employeeId: empLike?.employeeId || '—',
    designation: empLike?.designation || '—',
    department: empLike?.department || '—',
    month: new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
    earnings: [
      ['Basic Pay', basic],
      ['HRA', hra],
      ['DA', da],
      ['Conveyance', conveyance],
      ['Medical', medical],
      ['Special Allowance', special],
      ['Bonus / Incentive', bonus],
      ['Overtime', overtime],
    ],
    deductions: [
      ['PF (12%)', pf],
      ['ESI', esi],
      ['Professional Tax', professionalTax],
    ],
    gross,
    totalDed,
    net,
    ctcMonthly,
  };
}

export default function EmployeeSalary() {
  const { user } = useAuth();
  const [p, setP] = useState(null);
  const [showSlip, setShowSlip] = useState(false);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api.get('/employees/me').then((r) => setP(r.data)).catch(() => {
      setP({ salary: 20000, user: { name: user?.name }, employeeId: '—', designation: 'Employee', department: '—' });
    });
    try {
      const all = JSON.parse(localStorage.getItem('ds_salary_payments') || '[]');
      const mine = all.filter(
        (x) =>
          x.email === user?.email ||
          x.name === user?.name ||
          (user?._id && String(x.empMongoId) === String(user._id))
      );
      const raw = localStorage.getItem('ds_my_payments_' + (user?._id || ''));
      const extra = raw ? JSON.parse(raw) : [];
      setPayments([...(mine || []), ...(extra || [])]);
    } catch {
      setPayments([]);
    }
  }, [user]);

  const slip = buildSlip(p || {});
  const month = slip.month;

  return (
    <div className="section page-bg-employee">
      <div className="container" style={{ maxWidth: 560 }}>
        <h1 className="section-title">💰 Salary</h1>
        <p className="section-subtitle">Earnings & deductions · Bank details restricted</p>

        <div className="card" style={{ marginBottom: '1rem' }}>
          <p style={{ color: '#94a3b8' }}>Month: {month}</p>
          <p style={{ color: '#94a3b8' }}>
            Payment status:{' '}
            <span style={{ color: payments.length ? '#34d399' : '#fbbf24' }}>
              {payments.length ? 'Salary credited (see below)' : 'Awaiting Finance / HR'}
            </span>
          </p>
        </div>
        {payments.length > 0 && (
          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3 style={{ color: '#e2e8f0', marginTop: 0 }}>Received payments</h3>
            <ul style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              {payments.slice(0, 10).map((pay) => (
                <li key={pay.id}>
                  {pay.month || '—'} · ₹{Number(pay.net || 0).toLocaleString('en-IN')} · {pay.status} ·{' '}
                  {pay.at ? new Date(pay.at).toLocaleDateString('en-IN') : ''}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="card">
          <h3 style={{ marginBottom: '0.75rem' }}>Earnings</h3>
          {slip.earnings.map(([l, a]) => (
            <p key={l}>
              {l}: ₹{a.toLocaleString('en-IN')}
            </p>
          ))}
          <p style={{ fontWeight: 600 }}>Gross: ₹{slip.gross.toLocaleString('en-IN')}</p>
          <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '1rem 0' }} />
          <h3 style={{ marginBottom: '0.75rem' }}>Deductions</h3>
          {slip.deductions.map(([l, a]) => (
            <p key={l}>
              {l}: −₹{a.toLocaleString('en-IN')}
            </p>
          ))}
          <p style={{ fontSize: '1.25rem', color: '#10b981', fontWeight: 700, marginTop: '1rem' }}>
            Net salary: ₹{slip.net.toLocaleString('en-IN')}
          </p>
          <button type="button" className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setShowSlip(true)}>
            View Slip / PDF
          </button>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '1rem' }}>
            Bank account numbers are not shown here for security.
          </p>
        </div>

        {showSlip && (
          <div
            className="no-print"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.8)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              padding: '1.5rem',
              overflowY: 'auto',
            }}
            onClick={() => setShowSlip(false)}
          >
            <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 560 }}>
              <div id="payslip-print" style={{ background: '#fff', color: '#0f172a', borderRadius: 12, padding: '1.5rem' }}>
                <div style={{ borderBottom: '2px solid #0369a1', paddingBottom: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src="/logo.jpg"
                    alt="DS-TECHNOLOGIES"
                    style={{ width: 52, height: 52, objectFit: 'contain', borderRadius: 8 }}
                    onError={(e) => { e.target.onerror = null; e.target.src = '/logo.svg'; }}
                  />
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0369a1' }}>DS-TECHNOLOGIES</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Village Kuiya Rampur, Faridpur, Bareilly, UP 243503</div>
                  </div>
                </div>
                <h2 style={{ textAlign: 'center', fontSize: '1.1rem' }}>SALARY SLIP — {slip.month}</h2>
                <p>
                  <strong>{slip.name}</strong> · {slip.employeeId}
                  <br />
                  {slip.designation} · {slip.department}
                </p>
                <table style={{ width: '100%', fontSize: '0.9rem' }}>
                  <tbody>
                    {slip.earnings.map(([l, a]) => (
                      <tr key={l}>
                        <td>{l}</td>
                        <td style={{ textAlign: 'right' }}>₹{a.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                    <tr style={{ fontWeight: 700 }}>
                      <td>Gross</td>
                      <td style={{ textAlign: 'right' }}>₹{slip.gross.toLocaleString('en-IN')}</td>
                    </tr>
                    {slip.deductions.map(([l, a]) => (
                      <tr key={l}>
                        <td>{l}</td>
                        <td style={{ textAlign: 'right' }}>−₹{a.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                    <tr style={{ fontWeight: 800, color: '#047857', fontSize: '1.05rem' }}>
                      <td>Net Payable</td>
                      <td style={{ textAlign: 'right' }}>₹{slip.net.toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, fontSize: 11, color: '#64748b' }}>
                  <div style={{ textAlign: 'center', width: '30%' }}>
                    {(typeof localStorage !== 'undefined' && (localStorage.getItem('ds_sig_hr') || localStorage.getItem('ds_hr_signature'))) ? (
                      <img src={localStorage.getItem('ds_sig_hr') || localStorage.getItem('ds_hr_signature')} alt="" style={{ maxHeight: 36, margin: '0 auto 4px', display: 'block' }} />
                    ) : (
                      <div style={{ height: 36 }} />
                    )}
                    <div style={{ borderTop: '1px solid #94a3b8', paddingTop: 4 }}>HR Manager</div>
                  </div>
                  <div style={{ textAlign: 'center', width: '30%' }}>
                    {typeof localStorage !== 'undefined' && localStorage.getItem('ds_sig_manager') ? (
                      <img src={localStorage.getItem('ds_sig_manager')} alt="" style={{ maxHeight: 36, margin: '0 auto 4px', display: 'block' }} />
                    ) : (
                      <div style={{ height: 36 }} />
                    )}
                    <div style={{ borderTop: '1px solid #94a3b8', paddingTop: 4 }}>Manager</div>
                  </div>
                  <div style={{ textAlign: 'center', width: '30%' }}>
                    <div style={{ height: 36 }} />
                    <div style={{ borderTop: '1px solid #94a3b8', paddingTop: 4 }}>Employee</div>
                  </div>
                </div>
                <p style={{ marginTop: 12, fontSize: 10, color: '#94a3b8' }}>
                  Computer-generated · DS-TECHNOLOGIES · 7895733906
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', justifyContent: 'center' }}>
                <button type="button" className="btn btn-primary" onClick={() => window.print()}>
                  Print / Save PDF
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setShowSlip(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <p style={{ marginTop: '1rem' }}>
          <Link to="/employee" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
