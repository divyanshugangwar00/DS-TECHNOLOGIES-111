import { useEffect, useState, useMemo } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const PAY_KEY = 'ds_salary_payments';

function ensureBank(emp, idx = 0) {
  if (emp.bankAccount && emp.bankAccount !== 'Not on file') return emp;
  const n = String(10000000000 + (idx + 1) * 137 + (emp.employeeId || '').length * 99).slice(-11);
  const ifsc = 'SBIN000' + String(1000 + (idx % 900)).padStart(4, '0');
  return {
    ...emp,
    bankAccount: n,
    ifsc,
    bankName: emp.bankName || 'State Bank of India',
    upi: emp.upi || `${(emp.user?.name || emp.name || 'user').toLowerCase().replace(/\s+/g, '')}@sbi`,
    bankAccountName: emp.bankAccountName || emp.user?.name || emp.name || '',
  };
}

function bankOf(emp) {
  return {
    accountName: emp.bankAccountName || emp.user?.name || emp.name || '—',
    accountNo: emp.bankAccount || emp.accountNumber || emp.bankAccountNumber || 'Not on file',
    ifsc: emp.ifsc || emp.bankIfsc || '—',
    bankName: emp.bankName || '—',
    upi: emp.upi || emp.upiId || '—',
  };
}

function buildSlip(emp) {
  const ctcMonthly = Number(emp.salary) || 20000;
  const basic = Math.round(ctcMonthly * 0.5);
  const hra = Math.round(basic * 0.4);
  const da = Math.round(basic * 0.1);
  const conveyance = 1600;
  const medical = 1250;
  const special = Math.max(0, ctcMonthly - basic - hra - da - conveyance - medical);
  const bonus = Math.round(ctcMonthly * 0.05);
  const gross = basic + hra + da + conveyance + medical + special + bonus;
  const pf = Math.round(Math.min(basic, 15000) * 0.12);
  const esi = gross <= 21000 ? Math.round(gross * 0.0075) : 0;
  const professionalTax = gross > 10000 ? 200 : 0;
  const totalDed = pf + esi + professionalTax;
  const net = gross - totalDed;
  const bank = bankOf(emp);
  return {
    emp,
    bank,
    month: new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
    payDate: new Date().toLocaleDateString('en-IN'),
    ctcMonthly,
    earnings: [
      { label: 'Basic Pay', amount: basic },
      { label: 'HRA', amount: hra },
      { label: 'DA', amount: da },
      { label: 'Conveyance', amount: conveyance },
      { label: 'Medical', amount: medical },
      { label: 'Special Allowance', amount: special },
      { label: 'Bonus / Incentive', amount: bonus },
    ],
    deductions: [
      { label: 'PF (12%)', amount: pf },
      { label: 'ESI', amount: esi },
      { label: 'Professional Tax', amount: professionalTax },
    ],
    gross,
    totalDed,
    net,
  };
}

function loadPayments() {
  try {
    return JSON.parse(localStorage.getItem(PAY_KEY) || '[]');
  } catch {
    return [];
  }
}

export default function AdminPayroll() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'list';
  const [employees, setEmployees] = useState([]);
  const [slip, setSlip] = useState(null);
  const [q, setQ] = useState('');
  const [dept, setDept] = useState('All');
  const [payments, setPayments] = useState(loadPayments);
  const [msg, setMsg] = useState('');
  const [editBank, setEditBank] = useState(null);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'hr')) return;
    const offline = () => {
      try {
        const raw = localStorage.getItem('ds_employees') || localStorage.getItem('employees');
        if (raw) return JSON.parse(raw);
      } catch (_) {}
      return [];
    };
    api
      .get('/employees')
      .then((res) => {
        let list = res.data || [];
        if (!list.length) list = offline();
        if (user?.role === 'hr') {
          const hide = /founder|chairman|ceo|cto|cio|coo|cfo|cmo|chro|board|managing director|co-founder/i;
          list = list.filter((e) => !hide.test(e.designation || '') && e.department !== 'Leadership');
        }
        setEmployees((list || []).map((e, i) => ensureBank(e, i)));
      })
      .catch(() => setEmployees((offline() || []).map((e, i) => ensureBank(e, i))));
  }, [user]);

  const depts = useMemo(() => {
    const s = new Set(employees.map((e) => e.department).filter(Boolean));
    return ['All', ...Array.from(s).sort()];
  }, [employees]);

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const name = (e.user?.name || e.name || '').toLowerCase();
      const id = (e.employeeId || '').toLowerCase();
      const des = (e.designation || '').toLowerCase();
      const okQ = !q || name.includes(q.toLowerCase()) || id.includes(q.toLowerCase()) || des.includes(q.toLowerCase());
      const okD = dept === 'All' || e.department === dept;
      return okQ && okD;
    });
  }, [employees, q, dept]);

  const setTab = (t) => setSearchParams({ tab: t });

  const lastPay = (empId) => payments.find((p) => p.employeeId === empId || p.empMongoId === empId);

  const sendSalary = (emp) => {
    const s = buildSlip(emp);
    const bank = s.bank;
    if (!bank.accountNo || bank.accountNo === 'Not on file') {
      setMsg('Bank account missing — edit account details first, then send.');
      setEditBank(emp);
      return;
    }
    const entry = {
      id: `pay-${Date.now()}`,
      employeeId: emp.employeeId,
      empMongoId: emp._id,
      name: emp.user?.name || emp.name,
      net: s.net,
      month: s.month,
      accountNo: bank.accountNo,
      ifsc: bank.ifsc,
      status: 'Sent',
      at: new Date().toISOString(),
      by: user?.email || 'admin',
    };
    const next = [entry, ...payments];
    setPayments(next);
    localStorage.setItem(PAY_KEY, JSON.stringify(next));
    // employee can see on salary page
    try {
      const key = 'ds_my_payments_' + (emp._id || emp.employeeId);
      const mine = JSON.parse(localStorage.getItem(key) || '[]');
      mine.unshift(entry);
      localStorage.setItem(key, JSON.stringify(mine));
    } catch (_) {}
    setMsg(`Salary marked SENT for ${entry.name}: ₹${s.net.toLocaleString('en-IN')} → A/C ${bank.accountNo}`);
    setSlip({ ...s, paid: true, paidAt: entry.at });
  };

  const saveBank = () => {
    if (!editBank) return;
    const next = employees.map((e) =>
      e._id === editBank._id || e.employeeId === editBank.employeeId ? { ...e, ...editBank } : e
    );
    setEmployees(next);
    try {
      localStorage.setItem('ds_employees', JSON.stringify(next));
    } catch (_) {}
    setEditBank(null);
    setMsg('Bank details saved for payroll.');
  };

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container">
        <p>Access denied</p>
      </div>
    );
  }

  return (
    <div className="section page-bg-payroll">
      <div className="container" style={{ maxWidth: 1100 }}>
        <p>
          <Link to="/admin" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
        </p>
        <h1 className="section-title">💰 Payroll / Salary</h1>
        <AdminHero variant="finance" />
        {msg && <p style={{ color: '#34d399' }}>{msg}</p>}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1rem' }}>
          {[
            { id: 'list', label: '📋 Salary list' },
            { id: 'slips', label: '📄 Salary Slips' },
            { id: 'payments', label: '💸 Payments / Send' },
            { id: 'accounts', label: '🏦 Account details' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              className={tab === t.id ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ fontSize: '0.85rem' }}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
          <input
            placeholder="Search employee / ID / designation"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ flex: 1, minWidth: 200, padding: '0.5rem 0.75rem', borderRadius: 8 }}
          />
          <select value={dept} onChange={(e) => setDept(e.target.value)} style={{ padding: '0.5rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}>
            {depts.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        {tab === 'accounts' && (
          <div className="card" style={{ marginBottom: '1rem' }}>
            <p style={{ color: '#94a3b8' }}>Bank / UPI details required before salary transfer. Edit and save.</p>
          </div>
        )}

        {tab === 'payments' && (
          <div className="card" style={{ marginBottom: '1rem' }}>
            <strong style={{ color: '#38bdf8' }}>Send salary</strong>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Net pay is calculated from CTC. Click <strong>Send salary</strong> after account details are filled. Record is saved for employee portal.
            </p>
          </div>
        )}

        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '0.75rem' }}>S.No</th>
                <th style={{ padding: '0.75rem' }}>Employee</th>
                <th style={{ padding: '0.75rem' }}>ID</th>
                <th style={{ padding: '0.75rem' }}>Designation</th>
                <th style={{ padding: '0.75rem' }}>Department</th>
                {(tab === 'list' || tab === 'slips') && <th style={{ padding: '0.75rem' }}>Monthly CTC</th>}
                {(tab === 'payments' || tab === 'accounts') && <th style={{ padding: '0.75rem' }}>Account / IFSC</th>}
                {tab === 'payments' && <th style={{ padding: '0.75rem' }}>Net</th>}
                {tab === 'payments' && <th style={{ padding: '0.75rem' }}>Last status</th>}
                <th style={{ padding: '0.75rem' }}>Date</th>
                <th style={{ padding: '0.75rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp, idx) => {
                const s = buildSlip(emp);
                const b = s.bank;
                const lp = lastPay(emp.employeeId) || lastPay(emp._id);
                return (
                  <tr key={emp._id || emp.employeeId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.65rem' }}>{idx + 1}</td>
                    <td style={{ padding: '0.65rem' }}>{emp.user?.name || emp.name || '—'}</td>
                    <td style={{ padding: '0.65rem' }}>{emp.employeeId}</td>
                    <td style={{ padding: '0.65rem' }}>{emp.designation}</td>
                    <td style={{ padding: '0.65rem' }}>{emp.department}</td>
                    {(tab === 'list' || tab === 'slips') && (
                      <td style={{ padding: '0.65rem', color: '#10b981', fontWeight: 600 }}>
                        ₹{s.ctcMonthly.toLocaleString('en-IN')}
                      </td>
                    )}
                    {(tab === 'payments' || tab === 'accounts') && (
                      <td style={{ padding: '0.65rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                        {b.accountNo}
                        <br />
                        <span style={{ color: '#64748b' }}>{b.ifsc} · {b.bankName}</span>
                        {b.upi !== '—' && (
                          <>
                            <br />
                            <span style={{ color: '#94a3b8' }}>UPI: {b.upi}</span>
                          </>
                        )}
                      </td>
                    )}
                    {tab === 'payments' && (
                      <td style={{ padding: '0.65rem', color: '#38bdf8', fontWeight: 600 }}>
                        ₹{s.net.toLocaleString('en-IN')}
                      </td>
                    )}
                    {tab === 'payments' && (
                      <td style={{ padding: '0.65rem', color: lp ? '#34d399' : '#fbbf24' }}>
                        {lp ? `${lp.status} (${new Date(lp.at).toLocaleDateString('en-IN')})` : 'Pending'}
                      </td>
                    )}
                    <td style={{ padding: '0.65rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                      {lp ? new Date(lp.at).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ padding: '0.65rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {(tab === 'list' || tab === 'slips') && (
                          <button type="button" className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }} onClick={() => setSlip(s)}>
                            View Slip
                          </button>
                        )}
                        {(tab === 'accounts' || tab === 'payments') && (
                          <button
                            type="button"
                            className="btn btn-outline"
                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                            onClick={() =>
                              setEditBank({
                                ...emp,
                                bankAccount: b.accountNo === 'Not on file' ? '' : b.accountNo,
                                ifsc: b.ifsc === '—' ? '' : b.ifsc,
                                bankName: b.bankName === '—' ? '' : b.bankName,
                                upi: b.upi === '—' ? '' : b.upi,
                                bankAccountName: b.accountName,
                              })
                            }
                          >
                            Edit account
                          </button>
                        )}
                        {tab === 'payments' && (
                          <button type="button" className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }} onClick={() => sendSalary(emp)}>
                            Send salary
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!filtered.length && <p style={{ color: '#94a3b8', padding: '1rem' }}>No employees found.</p>}
        </div>

        {tab === 'payments' && payments.length > 0 && (
          <div className="card" style={{ marginTop: '1rem' }}>
            <h3 style={{ color: '#e2e8f0' }}>Recent transfers</h3>
            <ul style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              {payments.slice(0, 15).map((p) => (
                <li key={p.id}>
                  {p.name} · ₹{Number(p.net).toLocaleString('en-IN')} · {p.accountNo} · {p.status} ·{' '}
                  {new Date(p.at).toLocaleString('en-IN')}
                </li>
              ))}
            </ul>
          </div>
        )}

        {editBank && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              padding: 16,
            }}
          >
            <div className="card" style={{ maxWidth: 420, width: '100%' }}>
              <h3>Bank details — {editBank.user?.name || editBank.name}</h3>
              <label style={{ display: 'block', marginBottom: 8, color: '#94a3b8', fontSize: '0.85rem' }}>
                Account holder
                <input
                  value={editBank.bankAccountName || ''}
                  onChange={(e) => setEditBank({ ...editBank, bankAccountName: e.target.value })}
                  style={{ width: '100%', marginTop: 4, padding: 8, borderRadius: 6 }}
                />
              </label>
              <label style={{ display: 'block', marginBottom: 8, color: '#94a3b8', fontSize: '0.85rem' }}>
                Account number
                <input
                  value={editBank.bankAccount || ''}
                  onChange={(e) => setEditBank({ ...editBank, bankAccount: e.target.value })}
                  style={{ width: '100%', marginTop: 4, padding: 8, borderRadius: 6 }}
                />
              </label>
              <label style={{ display: 'block', marginBottom: 8, color: '#94a3b8', fontSize: '0.85rem' }}>
                IFSC
                <input
                  value={editBank.ifsc || ''}
                  onChange={(e) => setEditBank({ ...editBank, ifsc: e.target.value })}
                  style={{ width: '100%', marginTop: 4, padding: 8, borderRadius: 6 }}
                />
              </label>
              <label style={{ display: 'block', marginBottom: 8, color: '#94a3b8', fontSize: '0.85rem' }}>
                Bank name
                <input
                  value={editBank.bankName || ''}
                  onChange={(e) => setEditBank({ ...editBank, bankName: e.target.value })}
                  style={{ width: '100%', marginTop: 4, padding: 8, borderRadius: 6 }}
                />
              </label>
              <label style={{ display: 'block', marginBottom: 8, color: '#94a3b8', fontSize: '0.85rem' }}>
                UPI
                <input
                  value={editBank.upi || ''}
                  onChange={(e) => setEditBank({ ...editBank, upi: e.target.value })}
                  style={{ width: '100%', marginTop: 4, padding: 8, borderRadius: 6 }}
                />
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn btn-primary" onClick={saveBank}>
                  Save
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setEditBank(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {slip && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              padding: 16,
              overflow: 'auto',
            }}
          >
            <div
              className="salary-slip-print"
              style={{
                maxWidth: 560,
                width: '100%',
                background: '#ffffff',
                color: '#0f172a',
                borderRadius: 12,
                padding: '1.5rem',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ borderBottom: '3px solid #0369a1', paddingBottom: 12, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                  src="/logo.jpg"
                  alt="DS-TECHNOLOGIES"
                  style={{ width: 52, height: 52, objectFit: 'contain', borderRadius: 8 }}
                  onError={(e) => { e.target.onerror = null; e.target.src = '/logo.svg'; }}
                />
                <div>
                  <div style={{ fontWeight: 800, color: '#0369a1', fontSize: '1.15rem' }}>DS-TECHNOLOGIES — Salary Slip</div>
                  <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                    Village Kuiya Rampur, Faridpur, Bareilly UP 243503 · {slip.month}
                  </div>
                  {slip.paid && (
                    <div style={{ marginTop: 6, color: '#059669', fontWeight: 700, fontSize: '0.85rem' }}>
                      ✓ PAID / SENT {slip.paidAt ? new Date(slip.paidAt).toLocaleString('en-IN') : ''}
                    </div>
                  )}
                </div>
              </div>
              <p style={{ color: '#0f172a', margin: '0 0 8px' }}>
                <strong>{slip.emp.user?.name || slip.emp.name}</strong> · {slip.emp.employeeId}
                <br />
                <span style={{ color: '#334155' }}>
                  {slip.emp.designation} · {slip.emp.department}
                </span>
              </p>
              <p style={{ fontSize: '0.85rem', color: '#334155' }}>
                A/C: {slip.bank.accountNo} · IFSC: {slip.bank.ifsc} · {slip.bank.bankName}
              </p>
              <h4 style={{ color: '#0f172a', marginBottom: 4 }}>Earnings</h4>
              <ul style={{ color: '#0f172a', marginTop: 0 }}>
                {slip.earnings.map((e) => (
                  <li key={e.label}>
                    {e.label}: ₹{e.amount.toLocaleString('en-IN')}
                  </li>
                ))}
              </ul>
              <h4 style={{ color: '#0f172a', marginBottom: 4 }}>Deductions</h4>
              <ul style={{ color: '#0f172a', marginTop: 0 }}>
                {slip.deductions.map((e) => (
                  <li key={e.label}>
                    {e.label}: ₹{e.amount.toLocaleString('en-IN')}
                  </li>
                ))}
              </ul>
              <p style={{ color: '#0f172a', fontSize: '1.05rem' }}>
                <strong>Gross:</strong> ₹{slip.gross.toLocaleString('en-IN')} ·{' '}
                <strong style={{ color: '#059669' }}>Net: ₹{slip.net.toLocaleString('en-IN')}</strong>
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button type="button" className="btn btn-primary" onClick={() => window.print()}>
                  Print / PDF
                </button>
                <button type="button" className="btn btn-outline" style={{ color: '#0f172a', borderColor: '#94a3b8' }} onClick={() => setSlip(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
