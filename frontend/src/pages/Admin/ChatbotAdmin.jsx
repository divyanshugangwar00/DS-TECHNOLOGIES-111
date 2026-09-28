import { useState, useEffect } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DEFAULT = {
  enabled: true,
  welcome: 'Namaste! Main DS-TECHNOLOGIES assistant hoon. Jobs, courses, services, contact — kuch bhi poochiye.',
  faqs: [
    { q: 'Jobs kahan dekhen?', a: 'Careers → Jobs page pe saari open positions hain.' },
    { q: 'Apply kaise karein?', a: 'Job open karke Apply form bharein — course select zaroori hai.' },
    { q: 'Contact?', a: 'Phone 7895733906 / 7454910637, Email divyanshugangwar950@gmail.com, Bareilly UP 243503.' },
  ],
};

export default function ChatbotAdmin() {
  const { user } = useAuth();
  const [cfg, setCfg] = useState(DEFAULT);
  const [saved, setSaved] = useState(false);
  const [faqQ, setFaqQ] = useState('');
  const [faqA, setFaqA] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ds_chatbot');
      if (raw) setCfg({ ...DEFAULT, ...JSON.parse(raw) });
    } catch (_) {}
  }, []);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return <div className="section container"><p>Access denied</p></div>;
  }

  const save = () => {
    localStorage.setItem('ds_chatbot', JSON.stringify(cfg));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addFaq = () => {
    if (!faqQ.trim() || !faqA.trim()) return;
    setCfg({ ...cfg, faqs: [...(cfg.faqs || []), { q: faqQ, a: faqA }] });
    setFaqQ('');
    setFaqA('');
  };

  return (
    <div className="section page-bg-admin">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 className="section-title">AI Chatbot Management</h1>
        <AdminHero variant="default" />
        {saved && <p style={{ color: '#10b981' }}>Saved — refresh site to apply on chatbot</p>}
        <div className="card" style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input type="checkbox" checked={cfg.enabled} onChange={(e) => setCfg({ ...cfg, enabled: e.target.checked })} />
            Enable Chatbot
          </label>
        </div>
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="form-group">
            <label>Welcome Message</label>
            <textarea rows={3} value={cfg.welcome} onChange={(e) => setCfg({ ...cfg, welcome: e.target.value })} />
          </div>
        </div>
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3>FAQs</h3>
          <ul style={{ color: '#cbd5e1', margin: '1rem 0' }}>
            {(cfg.faqs || []).map((f, i) => (
              <li key={i} style={{ marginBottom: '0.75rem' }}>
                <strong style={{ color: '#00d4ff' }}>{f.q}</strong>
                <div>{f.a}</div>
              </li>
            ))}
          </ul>
          <div className="form-group">
            <label>New question</label>
            <input value={faqQ} onChange={(e) => setFaqQ(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Answer</label>
            <textarea rows={2} value={faqA} onChange={(e) => setFaqA(e.target.value)} />
          </div>
          <button type="button" className="btn btn-outline" onClick={addFaq}>Add FAQ</button>
        </div>
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3>Knowledge (auto answers)</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Chatbot already covers: Jobs, Courses, Services, Industries, Contact, Location, Career, Apply process, Company info.
            Extra FAQs upar se add karein.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={save}>Save Chatbot Settings</button>
        <p style={{ marginTop: '1rem' }}><Link to="/admin" style={{ color: '#00d4ff' }}>← Dashboard</Link></p>
      </div>
    </div>
  );
}
