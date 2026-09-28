import { useState } from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
  { id: 159, title: 'Support' },
  { id: 160, title: 'Create Ticket' },
  { id: 161, title: 'My Tickets' },
  { id: 162, title: 'Ticket Details' },
  { id: 163, title: 'Ticket Messages' },
  { id: 164, title: 'Attachments' },
  { id: 165, title: 'Ticket Priority' },
  { id: 166, title: 'Ticket Category' },
  { id: 167, title: 'Ticket Status' },
  { id: 168, title: 'Assigned Employee' },
  { id: 169, title: 'Ticket History' },
  { id: 170, title: 'Feedback' },
];

const FLOW = ['Open', 'Assigned', 'In Progress', 'Waiting', 'Resolved', 'Closed'];

export default function Support() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [msg, setMsg] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const tickets = JSON.parse(localStorage.getItem('ds_support_tickets') || '[]');
    tickets.unshift({
      id: Date.now(),
      subject,
      body,
      priority,
      status: 'Open',
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('ds_support_tickets', JSON.stringify(tickets));
    setMsg('Ticket created (saved locally + visible in My Tickets list).');
    setSubject('');
    setBody('');
  };

  const tickets = JSON.parse(localStorage.getItem('ds_support_tickets') || '[]');

  return (
    <div className="section page-bg-support">
      <div className="container" style={{ maxWidth: 1000 }}>
        <h1 className="section-title">Support / Ticketing</h1>
        <p className="section-subtitle">Create and track support tickets. Status flow: Open → Assigned → In Progress → Waiting → Resolved → Closed.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8, marginBottom: '1.25rem' }}>
          {FEATURES.map((f) => (
            <div key={f.id} className="card" style={{ padding: '0.65rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{f.id}</div>
              <div style={{ color: '#e2e8f0', fontSize: '0.85rem' }}>{f.title}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3 style={{ color: '#38bdf8', marginTop: 0 }}>Status pipeline</h3>
          <p style={{ color: '#cbd5e1' }}>{FLOW.join(' → ')}</p>
        </div>

        <form className="card" onSubmit={submit} style={{ marginBottom: '1rem' }}>
          <h3 style={{ color: '#e2e8f0', marginTop: 0 }}>Create ticket</h3>
          <input required placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: '100%', marginBottom: 8, padding: 10, borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0' }} />
          <textarea required placeholder="Describe the issue" value={body} onChange={(e) => setBody(e.target.value)} rows={4} style={{ width: '100%', marginBottom: 8, padding: 10, borderRadius: 8, border: '1px solid #334155', background: '#0f172a', color: '#e2e8f0' }} />
          <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ marginBottom: 8, padding: 8, borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}>
            <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
          </select>
          <div><button type="submit" className="btn btn-primary">Submit ticket</button></div>
          {msg && <p style={{ color: '#4ade80' }}>{msg}</p>}
        </form>

        <div className="card">
          <h3 style={{ color: '#e2e8f0', marginTop: 0 }}>My tickets</h3>
          {tickets.length === 0 && <p style={{ color: '#94a3b8' }}>No tickets yet.</p>}
          {tickets.map((t) => (
            <div key={t.id} style={{ borderTop: '1px solid #334155', padding: '0.75rem 0' }}>
              <strong style={{ color: '#7dd3fc' }}>{t.subject}</strong>
              <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{t.status} · {t.priority} · {new Date(t.createdAt).toLocaleString()}</div>
              <p style={{ color: '#cbd5e1', margin: '0.35rem 0 0' }}>{t.body}</p>
            </div>
          ))}
        </div>

        <p style={{ marginTop: '1rem' }}>
          <Link to="/contact" className="btn btn-outline">Contact form</Link>{' '}
          <a className="btn btn-primary" href="https://wa.me/917895733906" target="_blank" rel="noreferrer">WhatsApp</a>
        </p>
      </div>
    </div>
  );
}
