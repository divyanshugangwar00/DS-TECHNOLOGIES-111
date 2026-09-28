import { useEffect, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const KEY = 'ds_company_treasury';
const DEFAULT_BALANCE = 999999999999; // ₹ (as requested – company account seed)

function isCeo(user) {
  if (!user) return false;
  if (user.role === 'admin' && /divyanshu|founder|ceo/i.test(user.email || user.name || '')) return true;
  if (user.role === 'admin' && user.isFounder) return true;
  // Primary: only explicit founder/ceo flag or known founder email
  const email = (user.email || '').toLowerCase();
  if (email.includes('divyanshugangwar') || email === 'admin@dstechnologies.com') return true;
  if (/founder|ceo/i.test(user.designation || '')) return true;
  return false;
}

export default function AdminTreasury() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(DEFAULT_BALANCE);
  const [ledger, setLedger] = useState([]);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (raw && typeof raw.balance === 'number') {
        setBalance(raw.balance);
        setLedger(raw.ledger || []);
      } else {
        const init = {
          balance: DEFAULT_BALANCE,
          ledger: [
            {
              id: '1',
              type: 'credit',
              amount: DEFAULT_BALANCE,
              note: 'Company account opening balance (CEO seed)',
              at: new Date().toISOString(),
            },
          ],
        };
        localStorage.setItem(KEY, JSON.stringify(init));
        setBalance(init.balance);
        setLedger(init.ledger);
      }
    } catch {
      setBalance(DEFAULT_BALANCE);
    }
  }, []);

  if (!user) {
    return (
      <div className="section container">
        <p>Login required</p>
      </div>
    );
  }

  if (!isCeo(user)) {
    return (
      <div className="section page-bg-admin">
        <div className="container" style={{ maxWidth: 520 }}>
          <div className="card">
            <h2 style={{ color: '#fca5a5' }}>🔒 Access denied</h2>
            <p style={{ color: '#cbd5e1' }}>
              Company Treasury / Bank Account sirf <strong>Founder & CEO</strong> dekh / chal sakte hain. HR,
              Manager, Employee ke liye band hai.
            </p>
            <Link to="/admin" style={{ color: '#00d4ff' }}>
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const persist = (b, l) => {
    setBalance(b);
    setLedger(l);
    localStorage.setItem(KEY, JSON.stringify({ balance: b, ledger: l }));
  };

  const addTxn = (type) => {
    const n = Number(amount);
    if (!n || n <= 0) {
      setMsg('Valid amount daalein');
      return;
    }
    const entry = {
      id: Date.now().toString(),
      type,
      amount: n,
      note: note || (type === 'credit' ? 'Deposit' : 'Withdrawal'),
      at: new Date().toISOString(),
      by: user.name || user.email,
    };
    const nextBal = type === 'credit' ? balance + n : balance - n;
    if (nextBal < 0) {
      setMsg('Insufficient balance');
      return;
    }
    persist(nextBal, [entry, ...ledger]);
    setAmount('');
    setNote('');
    setMsg(type === 'credit' ? 'Amount credited' : 'Amount debited');
  };

  return (
    <div className="section page-bg-admin">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 className="section-title">🏦 Company Treasury</h1>
        <AdminHero variant="default" />
        <p className="section-subtitle">
          DS-TECHNOLOGIES official account · CEO only · Not visible to HR / employees
        </p>
        {msg && <p style={{ color: '#10b981' }}>{msg}</p>}

        <div className="card" style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Available balance</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', letterSpacing: 0.5 }}>
            ₹{balance.toLocaleString('en-IN')}
          </div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: 6 }}>
            Account: DS-TECHNOLOGIES · Bareilly · Controlled by Founder & CEO
          </div>
        </div>

        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ marginTop: 0, color: '#38bdf8' }}>Add / Withdraw</h3>
          <div className="grid-2">
            <div className="form-group">
              <label>Amount (₹)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
            </div>
            <div className="form-group">
              <label>Note</label>
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Purpose" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-primary" onClick={() => addTxn('credit')}>
              + Credit (add money)
            </button>
            <button type="button" className="btn btn-outline" onClick={() => addTxn('debit')}>
              − Debit (pay out)
            </button>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Ledger</h3>
          {ledger.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No transactions</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                  <th style={{ padding: '0.4rem' }}>Date</th>
                  <th style={{ padding: '0.4rem' }}>Type</th>
                  <th style={{ padding: '0.4rem' }}>Amount</th>
                  <th style={{ padding: '0.4rem' }}>Note</th>
                </tr>
              </thead>
              <tbody>
                {ledger.slice(0, 50).map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.4rem' }}>{new Date(r.at).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.4rem', color: r.type === 'credit' ? '#10b981' : '#fca5a5' }}>
                      {r.type}
                    </td>
                    <td style={{ padding: '0.4rem' }}>₹{Number(r.amount).toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.4rem', color: '#94a3b8' }}>{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p style={{ marginTop: '1rem' }}>
          <Link to="/admin" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
