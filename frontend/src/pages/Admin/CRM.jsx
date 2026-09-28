import { useEffect, useMemo, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const LEAD_STAGES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'];
const CLIENT_STATUSES = ['Active', 'On Hold', 'Closed'];

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return fallback;
}

const DEMO_CLIENTS = [
  {
    id: 'cli-1',
    name: 'Bareilly Retail Mart',
    contact: 'Amit Sharma',
    email: 'amit@retailmart.example',
    phone: '9876500001',
    services: 'E-commerce website + inventory API',
    contract: 'Annual · FY 2026',
    status: 'Active',
    value: '4,50,000',
  },
  {
    id: 'cli-2',
    name: 'UP Health Clinic Network',
    contact: 'Dr. Neha Verma',
    email: 'neha@uphealth.example',
    phone: '9876500002',
    services: 'Patient portal · appointment system',
    contract: 'Project · 6 months',
    status: 'Active',
    value: '7,20,000',
  },
];

export default function AdminCRM() {
  const { user } = useAuth();
  const [tab, setTab] = useState('clients'); // clients | leads | logs | proposals
  const [clients, setClients] = useState(() => load('ds_crm_clients', DEMO_CLIENTS));
  const [leads, setLeads] = useState(() => load('ds_crm_leads', []));
  const [logs, setLogs] = useState(() => load('ds_crm_logs', []));
  const [proposals, setProposals] = useState(() => load('ds_crm_proposals', []));
  const [webContacts, setWebContacts] = useState([]);
  const [msg, setMsg] = useState('');

  const [cForm, setCForm] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    services: '',
    contract: '',
    status: 'Active',
    value: '',
  });
  const [lForm, setLForm] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'Website Contact',
    message: '',
    stage: 'New',
  });
  const [logForm, setLogForm] = useState({
    clientOrLead: '',
    type: 'Email',
    note: '',
  });
  const [pForm, setPForm] = useState({
    title: '',
    client: '',
    amount: '',
    validTill: '',
    status: 'Draft',
    body: '',
  });

  useEffect(() => {
    localStorage.setItem('ds_crm_clients', JSON.stringify(clients));
  }, [clients]);
  useEffect(() => {
    localStorage.setItem('ds_crm_leads', JSON.stringify(leads));
  }, [leads]);
  useEffect(() => {
    localStorage.setItem('ds_crm_logs', JSON.stringify(logs));
  }, [logs]);
  useEffect(() => {
    localStorage.setItem('ds_crm_proposals', JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    if (!user) return;
    api
      .get('/contact')
      .then((res) => {
        const data = res.data || [];
        setWebContacts(data);
        // merge website inquiries into leads if empty pipeline
        if (leads.length === 0 && data.length) {
          const mapped = data.slice(0, 30).map((c, i) => ({
            id: `web-${c._id || i}`,
            name: c.name || 'Visitor',
            email: c.email || '',
            phone: c.phone || '',
            source: 'Website Contact',
            message: c.message || c.subject || '',
            stage: 'New',
            createdAt: c.createdAt || new Date().toISOString(),
          }));
          setLeads(mapped);
        }
      })
      .catch(() => {});
  }, [user]);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container">
        <p>CRM — Admin / HR only.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  const addClient = (e) => {
    e.preventDefault();
    if (!cForm.name.trim()) return;
    setClients((list) => [{ id: `cli-${Date.now()}`, ...cForm }, ...list]);
    setCForm({ name: '', contact: '', email: '', phone: '', services: '', contract: '', status: 'Active', value: '' });
    setMsg('Client saved.');
  };

  const addLead = (e) => {
    e.preventDefault();
    if (!lForm.name.trim()) return;
    setLeads((list) => [
      { id: `lead-${Date.now()}`, ...lForm, createdAt: new Date().toISOString() },
      ...list,
    ]);
    setLForm({ name: '', email: '', phone: '', source: 'Website Contact', message: '', stage: 'New' });
    setMsg('Lead added to pipeline.');
  };

  const setLeadStage = (id, stage) => {
    setLeads((list) => list.map((l) => (l.id === id ? { ...l, stage } : l)));
  };

  const convertLead = (lead) => {
    setClients((list) => [
      {
        id: `cli-${Date.now()}`,
        name: lead.name,
        contact: lead.name,
        email: lead.email,
        phone: lead.phone,
        services: lead.message?.slice(0, 80) || 'To be scoped',
        contract: 'Pending',
        status: 'Active',
        value: '',
      },
      ...list,
    ]);
    setLeadStage(lead.id, 'Won');
    setMsg('Lead converted to client.');
    setTab('clients');
  };

  const addLog = (e) => {
    e.preventDefault();
    if (!logForm.note.trim()) return;
    setLogs((list) => [
      {
        id: `log-${Date.now()}`,
        ...logForm,
        at: new Date().toISOString(),
        by: user.email,
      },
      ...list,
    ]);
    setLogForm({ clientOrLead: logForm.clientOrLead, type: 'Email', note: '' });
    setMsg('Communication logged.');
  };

  const addProposal = (e) => {
    e.preventDefault();
    if (!pForm.title.trim()) return;
    setProposals((list) => [
      { id: `prop-${Date.now()}`, ...pForm, createdAt: new Date().toISOString() },
      ...list,
    ]);
    setPForm({ title: '', client: '', amount: '', validTill: '', status: 'Draft', body: '' });
    setMsg('Proposal saved.');
  };

  const printProposal = (p) => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>${p.title}</title>
      <style>body{font-family:system-ui;padding:32px;color:#0f172a}h1{color:#0369a1}
      .meta{color:#64748b;font-size:14px}pre{white-space:pre-wrap;line-height:1.6}</style></head><body>
      <h1>DS-TECHNOLOGIES — Proposal</h1>
      <p class="meta">Village Kuiya Rampur, Faridpur, Bareilly UP 243503 · 7895733906</p>
      <h2>${p.title}</h2>
      <p><b>Client:</b> ${p.client || '—'} · <b>Amount:</b> ₹${p.amount || '—'} · <b>Valid till:</b> ${p.validTill || '—'} · <b>Status:</b> ${p.status}</p>
      <pre>${p.body || ''}</pre>
      <p class="meta">Generated ${new Date().toLocaleString()}</p>
      <script>window.print()</script></body></html>`);
    w.document.close();
  };

  const stagesCount = useMemo(() => {
    const m = Object.fromEntries(LEAD_STAGES.map((s) => [s, 0]));
    leads.forEach((l) => {
      m[l.stage] = (m[l.stage] || 0) + 1;
    });
    return m;
  }, [leads]);

  const tabs = [
    { key: 'clients', label: '🏢 Client Database' },
    { key: 'leads', label: '📥 Lead Pipeline' },
    { key: 'logs', label: '💬 Communication Logs' },
    { key: 'proposals', label: '📄 Proposals & Quotes' },
  ];

  return (
    <div className="section page-bg-crm">
      <div className="container" style={{ maxWidth: 1100 }}>
        <p>
          <Link to="/admin" style={{ color: '#00d4ff' }}>
            ← Admin Dashboard
          </Link>
        </p>
        <h1 className="section-title">🤝 Client & Lead Management (CRM)</h1>
        <AdminHero variant="crm" />
        <p className="section-subtitle">
          Clients, website inquiries, communication history, and proposal drafts for DS-TECHNOLOGIES.
        </p>
        {msg && <p style={{ color: '#34d399' }}>{msg}</p>}

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

        {tab === 'clients' && (
          <>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Add client</h3>
              <form onSubmit={addClient} style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '0.5rem' }}>
                  <input placeholder="Company / client name *" value={cForm.name} onChange={(e) => setCForm({ ...cForm, name: e.target.value })} required style={{ padding: '0.5rem', borderRadius: 8 }} />
                  <input placeholder="Contact person" value={cForm.contact} onChange={(e) => setCForm({ ...cForm, contact: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                  <input placeholder="Email" value={cForm.email} onChange={(e) => setCForm({ ...cForm, email: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                  <input placeholder="Phone" value={cForm.phone} onChange={(e) => setCForm({ ...cForm, phone: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                  <input placeholder="Contract (e.g. Annual)" value={cForm.contract} onChange={(e) => setCForm({ ...cForm, contract: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                  <input placeholder="Deal value ₹" value={cForm.value} onChange={(e) => setCForm({ ...cForm, value: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                  <select value={cForm.status} onChange={(e) => setCForm({ ...cForm, status: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}>
                    {CLIENT_STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <input placeholder="Active services" value={cForm.services} onChange={(e) => setCForm({ ...cForm, services: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
                  Save client
                </button>
              </form>
            </div>
            <div style={{ display: 'grid', gap: '0.65rem' }}>
              {clients.map((c) => (
                <div key={c.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <strong style={{ color: '#e2e8f0' }}>{c.name}</strong>
                    <span style={{ color: c.status === 'Active' ? '#34d399' : '#94a3b8', fontSize: '0.85rem' }}>{c.status}</span>
                  </div>
                  <p style={{ color: '#94a3b8', margin: '0.35rem 0', fontSize: '0.9rem' }}>
                    {c.contact} · {c.email} · {c.phone}
                  </p>
                  <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.9rem' }}>Services: {c.services}</p>
                  <p style={{ color: '#64748b', margin: '0.35rem 0 0', fontSize: '0.85rem' }}>
                    Contract: {c.contract || '—'} · Value: ₹{c.value || '—'}
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ marginTop: 8, fontSize: '0.75rem' }}
                    onClick={() => setClients((list) => list.filter((x) => x.id !== c.id))}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'leads' && (
          <>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
              {LEAD_STAGES.map((s) => (
                <span key={s} className="card" style={{ padding: '0.4rem 0.75rem', margin: 0, fontSize: '0.8rem' }}>
                  {s}: <strong style={{ color: '#00d4ff' }}>{stagesCount[s] || 0}</strong>
                </span>
              ))}
            </div>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Add lead / inquiry</h3>
              <form onSubmit={addLead} style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '0.5rem' }}>
                  <input placeholder="Name *" value={lForm.name} onChange={(e) => setLForm({ ...lForm, name: e.target.value })} required style={{ padding: '0.5rem', borderRadius: 8 }} />
                  <input placeholder="Email" value={lForm.email} onChange={(e) => setLForm({ ...lForm, email: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                  <input placeholder="Phone" value={lForm.phone} onChange={(e) => setLForm({ ...lForm, phone: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                  <select value={lForm.source} onChange={(e) => setLForm({ ...lForm, source: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}>
                    <option>Website Contact</option>
                    <option>Get a Quote</option>
                    <option>WhatsApp</option>
                    <option>Referral</option>
                    <option>Walk-in</option>
                  </select>
                </div>
                <textarea placeholder="Inquiry message" value={lForm.message} onChange={(e) => setLForm({ ...lForm, message: e.target.value })} rows={2} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
                  Add to pipeline
                </button>
              </form>
              <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.75rem' }}>
                Website Contact form entries can appear here ({webContacts.length} loaded from API when available).
              </p>
            </div>
            <div style={{ display: 'grid', gap: '0.65rem' }}>
              {leads.map((l) => (
                <div key={l.id} className="card">
                  <strong style={{ color: '#e2e8f0' }}>{l.name}</strong>
                  <span style={{ color: '#64748b', marginLeft: 8, fontSize: '0.85rem' }}>{l.source}</span>
                  <p style={{ color: '#94a3b8', margin: '0.25rem 0', fontSize: '0.88rem' }}>
                    {l.email} · {l.phone}
                  </p>
                  <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.9rem' }}>{l.message}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8, alignItems: 'center' }}>
                    <select
                      value={l.stage}
                      onChange={(e) => setLeadStage(l.id, e.target.value)}
                      style={{ padding: '0.35rem', borderRadius: 6, background: '#0f172a', color: '#e2e8f0', fontSize: '0.8rem' }}
                    >
                      {LEAD_STAGES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <button type="button" className="btn btn-primary" style={{ fontSize: '0.75rem' }} onClick={() => convertLead(l)}>
                      Convert to client
                    </button>
                    <button type="button" className="btn btn-outline" style={{ fontSize: '0.75rem' }} onClick={() => setLeads((list) => list.filter((x) => x.id !== l.id))}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {!leads.length && <p style={{ color: '#94a3b8' }}>No leads yet — add manually or wait for Contact form submissions.</p>}
            </div>
          </>
        )}

        {tab === 'logs' && (
          <>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Log communication</h3>
              <form onSubmit={addLog} style={{ display: 'grid', gap: '0.5rem', maxWidth: 560 }}>
                <input
                  list="crm-parties"
                  placeholder="Client or lead name"
                  value={logForm.clientOrLead}
                  onChange={(e) => setLogForm({ ...logForm, clientOrLead: e.target.value })}
                  style={{ padding: '0.5rem', borderRadius: 8 }}
                />
                <datalist id="crm-parties">
                  {clients.map((c) => (
                    <option key={c.id} value={c.name} />
                  ))}
                  {leads.map((l) => (
                    <option key={l.id} value={l.name} />
                  ))}
                </datalist>
                <select value={logForm.type} onChange={(e) => setLogForm({ ...logForm, type: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}>
                  <option>Email</option>
                  <option>Meeting</option>
                  <option>Call</option>
                  <option>Chat / WhatsApp</option>
                  <option>Site visit</option>
                </select>
                <textarea placeholder="Notes / outcome" value={logForm.note} onChange={(e) => setLogForm({ ...logForm, note: e.target.value })} rows={3} required style={{ padding: '0.5rem', borderRadius: 8 }} />
                <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
                  Save log
                </button>
              </form>
            </div>
            {logs.map((log) => (
              <div key={log.id} className="card" style={{ marginBottom: '0.5rem' }}>
                <strong style={{ color: '#38bdf8' }}>{log.type}</strong> · {log.clientOrLead || 'General'}
                <p style={{ color: '#cbd5e1', margin: '0.35rem 0' }}>{log.note}</p>
                <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>
                  {new Date(log.at).toLocaleString()} · {log.by}
                </p>
              </div>
            ))}
            {!logs.length && <p style={{ color: '#94a3b8' }}>No communication logs yet.</p>}
          </>
        )}

        {tab === 'proposals' && (
          <>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Proposal & quotation maker</h3>
              <form onSubmit={addProposal} style={{ display: 'grid', gap: '0.5rem' }}>
                <input placeholder="Proposal title *" value={pForm.title} onChange={(e) => setPForm({ ...pForm, title: e.target.value })} required style={{ padding: '0.5rem', borderRadius: 8 }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: '0.5rem' }}>
                  <input list="crm-parties" placeholder="Client name" value={pForm.client} onChange={(e) => setPForm({ ...pForm, client: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                  <input placeholder="Amount ₹" value={pForm.amount} onChange={(e) => setPForm({ ...pForm, amount: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                  <input type="date" value={pForm.validTill} onChange={(e) => setPForm({ ...pForm, validTill: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                  <select value={pForm.status} onChange={(e) => setPForm({ ...pForm, status: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}>
                    <option>Draft</option>
                    <option>Sent</option>
                    <option>Accepted</option>
                    <option>Rejected</option>
                  </select>
                </div>
                <textarea
                  placeholder="Scope, deliverables, timeline, terms…"
                  value={pForm.body}
                  onChange={(e) => setPForm({ ...pForm, body: e.target.value })}
                  rows={5}
                  style={{ padding: '0.5rem', borderRadius: 8 }}
                />
                <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
                  Save proposal
                </button>
              </form>
            </div>
            {proposals.map((p) => (
              <div key={p.id} className="card" style={{ marginBottom: '0.65rem' }}>
                <strong style={{ color: '#e2e8f0' }}>{p.title}</strong>
                <p style={{ color: '#94a3b8', margin: '0.25rem 0', fontSize: '0.9rem' }}>
                  {p.client} · ₹{p.amount || '—'} · {p.status} · valid {p.validTill || '—'}
                </p>
                <p style={{ color: '#cbd5e1', fontSize: '0.88rem', whiteSpace: 'pre-wrap' }}>{p.body?.slice(0, 200)}{(p.body || '').length > 200 ? '…' : ''}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button type="button" className="btn btn-primary" style={{ fontSize: '0.8rem' }} onClick={() => printProposal(p)}>
                    Print / PDF
                  </button>
                  <button type="button" className="btn btn-outline" style={{ fontSize: '0.8rem' }} onClick={() => setProposals((list) => list.filter((x) => x.id !== p.id))}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
