import { useEffect, useMemo, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return fallback;
}

const DEMO_INVOICES = [
  {
    id: 'INV-2026-001',
    client: 'Bareilly Retail Mart',
    amount: 150000,
    tax: 27000,
    status: 'Paid',
    due: '2026-07-15',
    paidOn: '2026-07-10',
  },
  {
    id: 'INV-2026-002',
    client: 'UP Health Clinic Network',
    amount: 200000,
    tax: 36000,
    status: 'Pending',
    due: '2026-09-30',
    paidOn: '',
  },
];

const DEMO_EXPENSES = [
  { id: 'exp-1', category: 'Cloud / Hosting', note: 'AWS / VPS monthly', amount: 8500, date: '2026-08-01' },
  { id: 'exp-2', category: 'Software licenses', note: 'IDE / design tools', amount: 4200, date: '2026-08-05' },
  { id: 'exp-3', category: 'Office utilities', note: 'Internet + power share', amount: 3500, date: '2026-08-10' },
];

export default function AdminFinance() {
  const { user } = useAuth();
  const [tab, setTab] = useState('invoices'); // invoices | payments | expenses | payroll | reports
  const [invoices, setInvoices] = useState(() => load('ds_fin_invoices', DEMO_INVOICES));
  const [expenses, setExpenses] = useState(() => load('ds_fin_expenses', DEMO_EXPENSES));
  const [msg, setMsg] = useState('');

  const [invForm, setInvForm] = useState({
    client: '',
    amount: '',
    tax: '',
    due: '',
    status: 'Pending',
    notes: '',
  });
  const [expForm, setExpForm] = useState({
    category: 'Cloud / Hosting',
    note: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    localStorage.setItem('ds_fin_invoices', JSON.stringify(invoices));
  }, [invoices]);
  useEffect(() => {
    localStorage.setItem('ds_fin_expenses', JSON.stringify(expenses));
  }, [expenses]);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container">
        <p>Finance module — Admin / HR only. Treasury remains CEO-only.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  const isCeo = user.role === 'admin';

  const addInvoice = (e) => {
    e.preventDefault();
    const amount = Number(invForm.amount) || 0;
    const tax = invForm.tax !== '' ? Number(invForm.tax) : Math.round(amount * 0.18);
    const id = `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`;
    setInvoices((list) => [
      {
        id,
        client: invForm.client,
        amount,
        tax,
        status: invForm.status,
        due: invForm.due,
        paidOn: invForm.status === 'Paid' ? new Date().toISOString().slice(0, 10) : '',
        notes: invForm.notes,
      },
      ...list,
    ]);
    setInvForm({ client: '', amount: '', tax: '', due: '', status: 'Pending', notes: '' });
    setMsg(`Invoice ${id} created.`);
  };

  const setInvStatus = (id, status) => {
    setInvoices((list) =>
      list.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              status,
              paidOn: status === 'Paid' ? inv.paidOn || new Date().toISOString().slice(0, 10) : '',
            }
          : inv
      )
    );
  };

  const printInvoice = (inv) => {
    const total = (Number(inv.amount) || 0) + (Number(inv.tax) || 0);
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>${inv.id}</title>
      <style>
        body{font-family:system-ui;padding:40px;color:#0f172a;max-width:720px;margin:auto}
        .brand{color:#0369a1;font-weight:700;font-size:22px}
        .muted{color:#64748b;font-size:13px}
        table{width:100%;border-collapse:collapse;margin-top:24px}
        td,th{padding:10px;border-bottom:1px solid #e2e8f0;text-align:left}
        .total{font-size:18px;font-weight:700}
      </style></head><body>
      <div class="brand">DS-TECHNOLOGIES</div>
      <p class="muted">Village Kuiya Rampur, Post Kakra Kalan, Faridpur, Bareilly, UP 243503<br/>
      Phone: 7895733906 · 7454910637 · Email: divyanshugangwar950@gmail.com</p>
      <h1>Tax Invoice</h1>
      <p><b>${inv.id}</b> · Status: ${inv.status}</p>
      <p>Bill to: <b>${inv.client}</b></p>
      <p class="muted">Due: ${inv.due || '—'} · Paid on: ${inv.paidOn || '—'}</p>
      <table>
        <tr><th>Description</th><th>Amount (₹)</th></tr>
        <tr><td>Professional services / project delivery</td><td>${Number(inv.amount).toLocaleString('en-IN')}</td></tr>
        <tr><td>Tax (GST estimate)</td><td>${Number(inv.tax).toLocaleString('en-IN')}</td></tr>
        <tr><td class="total">Total</td><td class="total">₹${total.toLocaleString('en-IN')}</td></tr>
      </table>
      <p class="muted">${inv.notes || ''}</p>
      <p class="muted">This is a system-generated invoice from DS-TECHNOLOGIES Accounts.</p>
      <script>window.print()</script></body></html>`);
    w.document.close();
  };

  const addExpense = (e) => {
    e.preventDefault();
    setExpenses((list) => [
      {
        id: `exp-${Date.now()}`,
        category: expForm.category,
        note: expForm.note,
        amount: Number(expForm.amount) || 0,
        date: expForm.date,
      },
      ...list,
    ]);
    setExpForm({ category: 'Cloud / Hosting', note: '', amount: '', date: new Date().toISOString().slice(0, 10) });
    setMsg('Expense logged.');
  };

  const totals = useMemo(() => {
    const paid = invoices.filter((i) => i.status === 'Paid').reduce((s, i) => s + (i.amount || 0) + (i.tax || 0), 0);
    const pending = invoices.filter((i) => i.status === 'Pending').reduce((s, i) => s + (i.amount || 0) + (i.tax || 0), 0);
    const failed = invoices.filter((i) => i.status === 'Failed').reduce((s, i) => s + (i.amount || 0) + (i.tax || 0), 0);
    const exp = expenses.reduce((s, e) => s + (e.amount || 0), 0);
    return { paid, pending, failed, exp, profit: paid - exp };
  }, [invoices, expenses]);

  const tabs = [
    { key: 'invoices', label: '🧾 Invoices' },
    { key: 'payments', label: '💳 Payments' },
    { key: 'expenses', label: '📤 Expenses' },
    { key: 'payroll', label: '💰 Payroll' },
    { key: 'reports', label: '📊 Reports' },
  ];

  return (
    <div className="section page-bg-finance">
      <div className="container" style={{ maxWidth: 1100 }}>
        <p>
          <Link to="/admin" style={{ color: '#00d4ff' }}>
            ← Admin Dashboard
          </Link>
          {isCeo && (
            <>
              {' · '}
              <Link to="/admin/treasury" style={{ color: '#fbbf24' }}>
                Company Treasury (CEO)
              </Link>
            </>
          )}
        </p>
        <h1 className="section-title">💰 Finance, Billing & Payroll (Accounts)</h1>
        <AdminHero variant="finance" />
        <p className="section-subtitle">
          Invoices, payment status, expenses, payroll link and simple P&amp;L for DS-TECHNOLOGIES.
        </p>
        {msg && <p style={{ color: '#34d399' }}>{msg}</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '0.65rem', marginBottom: '1.25rem' }}>
          {[
            { label: 'Paid', v: totals.paid, c: '#34d399' },
            { label: 'Pending', v: totals.pending, c: '#fbbf24' },
            { label: 'Failed', v: totals.failed, c: '#f87171' },
            { label: 'Expenses', v: totals.exp, c: '#94a3b8' },
            { label: 'Est. profit', v: totals.profit, c: '#00d4ff' },
          ].map((x) => (
            <div key={x.label} className="card" style={{ padding: '0.75rem', margin: 0 }}>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{x.label}</div>
              <div style={{ color: x.c, fontWeight: 700, fontSize: '1.05rem' }}>₹{x.v.toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              className={tab === t.key ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ fontSize: '0.85rem' }}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'invoices' && (
          <>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Invoice generator</h3>
              <form onSubmit={addInvoice} style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: '0.5rem' }}>
                  <input placeholder="Client name *" value={invForm.client} onChange={(e) => setInvForm({ ...invForm, client: e.target.value })} required style={{ padding: '0.5rem', borderRadius: 8 }} />
                  <input placeholder="Amount ₹" type="number" value={invForm.amount} onChange={(e) => setInvForm({ ...invForm, amount: e.target.value })} required style={{ padding: '0.5rem', borderRadius: 8 }} />
                  <input placeholder="Tax ₹ (blank = 18%)" type="number" value={invForm.tax} onChange={(e) => setInvForm({ ...invForm, tax: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                  <input type="date" value={invForm.due} onChange={(e) => setInvForm({ ...invForm, due: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                  <select value={invForm.status} onChange={(e) => setInvForm({ ...invForm, status: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}>
                    <option>Pending</option>
                    <option>Paid</option>
                    <option>Failed</option>
                  </select>
                </div>
                <input placeholder="Notes" value={invForm.notes} onChange={(e) => setInvForm({ ...invForm, notes: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
                  Create invoice
                </button>
              </form>
            </div>
            {invoices.map((inv) => (
              <div key={inv.id} className="card" style={{ marginBottom: '0.55rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <strong style={{ color: '#e2e8f0' }}>{inv.id}</strong>
                  <span
                    style={{
                      color: inv.status === 'Paid' ? '#34d399' : inv.status === 'Failed' ? '#f87171' : '#fbbf24',
                      fontWeight: 600,
                    }}
                  >
                    {inv.status}
                  </span>
                </div>
                <p style={{ color: '#94a3b8', margin: '0.25rem 0' }}>
                  {inv.client} · ₹{(inv.amount + inv.tax).toLocaleString('en-IN')} (base {inv.amount.toLocaleString('en-IN')} + tax{' '}
                  {inv.tax.toLocaleString('en-IN')})
                </p>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                  Due {inv.due || '—'} · Paid {inv.paidOn || '—'}
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                  <button type="button" className="btn btn-primary" style={{ fontSize: '0.75rem' }} onClick={() => printInvoice(inv)}>
                    Print / PDF
                  </button>
                  {['Pending', 'Paid', 'Failed'].map((s) => (
                    <button key={s} type="button" className="btn btn-outline" style={{ fontSize: '0.75rem' }} onClick={() => setInvStatus(inv.id, s)}>
                      Mark {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'payments' && (
          <div className="card">
            <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Payment gateway status</h3>
            <p style={{ color: '#94a3b8' }}>
              Track incoming payments against invoices. Integrate Razorpay / Stripe later; status is managed here for now.
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.12)', textAlign: 'left', color: '#94a3b8' }}>
                  <th style={{ padding: '0.5rem' }}>Invoice</th>
                  <th style={{ padding: '0.5rem' }}>Client</th>
                  <th style={{ padding: '0.5rem' }}>Total</th>
                  <th style={{ padding: '0.5rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.5rem', color: '#e2e8f0' }}>{inv.id}</td>
                    <td style={{ padding: '0.5rem', color: '#cbd5e1' }}>{inv.client}</td>
                    <td style={{ padding: '0.5rem' }}>₹{(inv.amount + inv.tax).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.5rem', color: inv.status === 'Paid' ? '#34d399' : inv.status === 'Failed' ? '#f87171' : '#fbbf24' }}>
                      {inv.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'expenses' && (
          <>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Expense tracker</h3>
              <form onSubmit={addExpense} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '0.5rem', alignItems: 'end' }}>
                <select value={expForm.category} onChange={(e) => setExpForm({ ...expForm, category: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}>
                  <option>Cloud / Hosting</option>
                  <option>Software licenses</option>
                  <option>Office utilities</option>
                  <option>Travel</option>
                  <option>Marketing</option>
                  <option>Salaries advance</option>
                  <option>Other</option>
                </select>
                <input placeholder="Note" value={expForm.note} onChange={(e) => setExpForm({ ...expForm, note: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <input type="number" placeholder="Amount ₹" value={expForm.amount} onChange={(e) => setExpForm({ ...expForm, amount: e.target.value })} required style={{ padding: '0.5rem', borderRadius: 8 }} />
                <input type="date" value={expForm.date} onChange={(e) => setExpForm({ ...expForm, date: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <button type="submit" className="btn btn-primary">
                  Log expense
                </button>
              </form>
            </div>
            {expenses.map((ex) => (
              <div key={ex.id} className="card" style={{ marginBottom: '0.45rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <strong style={{ color: '#e2e8f0' }}>{ex.category}</strong>
                  <span style={{ color: '#64748b', marginLeft: 8 }}>{ex.date}</span>
                  <p style={{ margin: '0.2rem 0 0', color: '#94a3b8', fontSize: '0.88rem' }}>{ex.note}</p>
                </div>
                <div style={{ color: '#f87171', fontWeight: 600 }}>₹{Number(ex.amount).toLocaleString('en-IN')}</div>
              </div>
            ))}
          </>
        )}

        {tab === 'payroll' && (
          <div className="card">
            <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Payroll processing</h3>
            <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
              Salary calculation, bonuses, deductions and payslips are managed in the dedicated Payroll module (employee-wise
              slips with company logo and signatures).
            </p>
            <Link to="/admin/payroll" className="btn btn-primary">
              Open Payroll &amp; salary slips →
            </Link>
            {isCeo && (
              <p style={{ marginTop: '1rem' }}>
                <Link to="/admin/treasury" style={{ color: '#fbbf24' }}>
                  Company Treasury (CEO-only bank balance) →
                </Link>
              </p>
            )}
          </div>
        )}

        {tab === 'reports' && (
          <div className="card">
            <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Financial reports (summary)</h3>
            <ul style={{ color: '#cbd5e1', lineHeight: 1.9 }}>
              <li>
                <strong>Revenue (paid invoices):</strong> ₹{totals.paid.toLocaleString('en-IN')}
              </li>
              <li>
                <strong>Outstanding (pending):</strong> ₹{totals.pending.toLocaleString('en-IN')}
              </li>
              <li>
                <strong>Failed / declined:</strong> ₹{totals.failed.toLocaleString('en-IN')}
              </li>
              <li>
                <strong>Operating expenses:</strong> ₹{totals.exp.toLocaleString('en-IN')}
              </li>
              <li>
                <strong>Estimated profit (paid − expenses):</strong>{' '}
                <span style={{ color: totals.profit >= 0 ? '#34d399' : '#f87171' }}>₹{totals.profit.toLocaleString('en-IN')}</span>
              </li>
              <li>
                <strong>Tax collected (on invoices):</strong> ₹
                {invoices.reduce((s, i) => s + (i.status === 'Paid' ? i.tax || 0 : 0), 0).toLocaleString('en-IN')} (GST estimate)
              </li>
            </ul>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
              For formal books, export invoice/expense lists and reconcile with CA. Charts can be extended with a chart library later.
            </p>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                const rows = [
                  ['Type', 'Id', 'Party', 'Amount', 'Tax', 'Status', 'Date'],
                  ...invoices.map((i) => ['Invoice', i.id, i.client, i.amount, i.tax, i.status, i.due]),
                  ...expenses.map((e) => ['Expense', e.id, e.category, e.amount, '', '', e.date]),
                ];
                const csv = rows.map((r) => r.join(',')).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'ds-finance-export.csv';
                a.click();
              }}
            >
              Export CSV
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
