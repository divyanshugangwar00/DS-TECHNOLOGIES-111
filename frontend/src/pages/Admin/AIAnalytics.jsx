import { useMemo, useState, useEffect } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function loadInvoices() {
  try {
    return JSON.parse(localStorage.getItem('ds_fin_invoices') || '[]');
  } catch {
    return [];
  }
}
function loadClients() {
  try {
    return JSON.parse(localStorage.getItem('ds_crm_clients') || '[]');
  } catch {
    return [];
  }
}
function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem('ds_project_tasks') || '[]');
  } catch {
    return [];
  }
}

export default function AdminAIAnalytics() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setInvoices(loadInvoices());
    setClients(loadClients());
    setTasks(loadTasks());
  }, []);

  const paidRevenue = useMemo(
    () => invoices.filter((i) => i.status === 'Paid').reduce((s, i) => s + (i.amount || 0) + (i.tax || 0), 0),
    [invoices]
  );
  const pending = useMemo(
    () => invoices.filter((i) => i.status === 'Pending').reduce((s, i) => s + (i.amount || 0) + (i.tax || 0), 0),
    [invoices]
  );

  // Simple predictive model: trailing paid * growth factor + portion of pending
  const forecast = useMemo(() => {
    const monthlyBase = paidRevenue / 6 || 50000;
    const growth = 1.08;
    return [1, 2, 3].map((m) => ({
      month: m,
      label: `Month +${m}`,
      amount: Math.round(monthlyBase * Math.pow(growth, m) + pending * 0.15 * m),
    }));
  }, [paidRevenue, pending]);

  const assignees = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      const a = t.assignee || 'Unassigned';
      if (!map[a]) map[a] = { name: a, total: 0, open: 0 };
      map[a].total += 1;
      if (t.status !== 'done') map[a].open += 1;
    });
    return Object.values(map).sort((a, b) => a.open - b.open);
  }, [tasks]);

  const retention = useMemo(() => {
    return clients.map((c, i) => {
      // heuristic score from status + value digits
      let score = c.status === 'Active' ? 72 : c.status === 'On Hold' ? 45 : 25;
      const val = parseInt(String(c.value || '0').replace(/\D/g, ''), 10) || 0;
      if (val > 500000) score += 15;
      else if (val > 100000) score += 8;
      score = Math.min(98, score + (i % 7));
      let risk = 'Low';
      if (score < 50) risk = 'High — may churn';
      else if (score < 70) risk = 'Medium — nurture';
      return { ...c, score, risk };
    });
  }, [clients]);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return <div className="section container"><p>AI Analytics — leadership only.</p><Link to="/login">Login</Link></div>;
  }

  return (
    <div className="section page-bg-ai">
      <div className="container" style={{ maxWidth: 1000 }}>
        <p><Link to="/admin" style={{ color: '#00d4ff' }}>← Dashboard</Link></p>
        <h1 className="section-title">📊 AI Analytics & Business Intelligence</h1>
        <AdminHero variant="ai" />
        <p className="section-subtitle">
          Predictive revenue, developer capacity hints, and client retention scores (rule-based AI using your CRM/finance data).
        </p>

        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Predictive revenue (next 3 months)</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Based on paid invoice history (₹{paidRevenue.toLocaleString('en-IN')}) and pending pipeline (₹{pending.toLocaleString('en-IN')}).
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
            {forecast.map((f) => (
              <div key={f.month} style={{ background: 'rgba(15,23,42,0.8)', borderRadius: 12, padding: '1rem', border: '1px solid rgba(0,212,255,0.15)' }}>
                <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{f.label}</div>
                <div style={{ color: '#34d399', fontWeight: 700, fontSize: '1.25rem' }}>₹{f.amount.toLocaleString('en-IN')}</div>
                <div style={{ marginTop: 8, height: 6, background: '#1e293b', borderRadius: 4 }}>
                  <div style={{ width: `${Math.min(100, f.amount / 5000)}%`, height: '100%', background: '#00d4ff', borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Resource optimization</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Developers with fewer open tasks are better candidates for new work.</p>
          {assignees.length === 0 && <p style={{ color: '#64748b' }}>No project tasks yet — add tasks in Project Management.</p>}
          {assignees.map((a) => (
            <div key={a.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: '#e2e8f0' }}>{a.name}</span>
              <span style={{ color: a.open === 0 ? '#34d399' : a.open < 3 ? '#fbbf24' : '#f87171', fontSize: '0.9rem' }}>
                {a.open} open / {a.total} total {a.open === 0 ? '· Available' : a.open < 3 ? '· Light load' : '· Busy'}
              </span>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Client retention score</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Heuristic from status + deal value. High score = happier / stickier.</p>
          {retention.length === 0 && <p style={{ color: '#64748b' }}>Add clients in CRM to see scores.</p>}
          {retention.map((c) => (
            <div key={c.id} className="card" style={{ marginBottom: '0.5rem', background: 'rgba(15,23,42,0.6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <strong style={{ color: '#e2e8f0' }}>{c.name}</strong>
                <span style={{ color: '#00d4ff', fontWeight: 700 }}>{c.score}/100</span>
              </div>
              <div style={{ height: 8, background: '#1e293b', borderRadius: 4, margin: '0.5rem 0' }}>
                <div style={{ width: `${c.score}%`, height: '100%', borderRadius: 4, background: c.score >= 70 ? '#34d399' : c.score >= 50 ? '#fbbf24' : '#f87171' }} />
              </div>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.88rem' }}>{c.risk} · {c.status} · ₹{c.value || '—'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
