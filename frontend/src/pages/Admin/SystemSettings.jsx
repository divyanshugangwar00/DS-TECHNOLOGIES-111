import { useEffect, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DEFAULT_COMPANY = {
  name: 'DS-TECHNOLOGIES',
  address: 'Village Kuiya Rampur, Post Kakra Kalan, Faridpur, Bareilly, Uttar Pradesh 243503',
  phone1: '7895733906',
  phone2: '7454910637',
  email: 'divyanshugangwar950@gmail.com',
  altEmail: 'admin@dstechnologies.com',
  gstin: '',
  pan: '',
  linkedin: 'https://www.linkedin.com/in/divyanshu-gangwar-0b4982274',
  instagram: 'https://www.instagram.com/divyanshu_gangwar_',
  whatsapp: 'https://wa.me/917895733906',
  websiteTitle: 'DS-TECHNOLOGIES — IT & Software',
  seoDescription: 'Custom software, web, mobile and digital solutions from Bareilly, India.',
};

const DEFAULT_SERVICES = [
  { id: 1, name: 'Custom Software Development', stack: 'Node, React, Python, Java', package: 'Project-based' },
  { id: 2, name: 'Web Applications', stack: 'React, Next.js, Express', package: 'Fixed / T&M' },
  { id: 3, name: 'Mobile Apps', stack: 'React Native, Flutter', package: 'Milestone' },
  { id: 4, name: 'Cloud & DevOps', stack: 'AWS, Docker, CI/CD', package: 'Retainer' },
];

const DEFAULT_CMS = {
  homeHero: 'Your next role. Make it real. — DS-TECHNOLOGIES builds software and careers.',
  aboutBlurb: 'Growing technology partner based in Bareilly delivering software, AI-ready systems and people.',
  careersCta: 'Explore jobs and internships across technology, commerce and more.',
};

const DEFAULT_API = {
  paymentGateway: 'Not configured (Razorpay / Stripe)',
  smsProvider: 'Not configured',
  awsRegion: 'ap-south-1',
  awsNotes: 'Use IAM roles; never commit secrets to git.',
  emailSmtp: 'Configured via backend nodemailer / .env',
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return fallback;
}

export default function AdminSystemSettings() {
  const { user } = useAuth();
  const [tab, setTab] = useState('company');
  const [company, setCompany] = useState(() => load('ds_settings_company', DEFAULT_COMPANY));
  const [services, setServices] = useState(() => load('ds_settings_services', DEFAULT_SERVICES));
  const [cms, setCms] = useState(() => load('ds_settings_cms', DEFAULT_CMS));
  const [apiCfg, setApiCfg] = useState(() => load('ds_settings_api', DEFAULT_API));
  const [svcForm, setSvcForm] = useState({ name: '', stack: '', package: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    localStorage.setItem('ds_settings_company', JSON.stringify(company));
  }, [company]);
  useEffect(() => {
    localStorage.setItem('ds_settings_services', JSON.stringify(services));
  }, [services]);
  useEffect(() => {
    localStorage.setItem('ds_settings_cms', JSON.stringify(cms));
  }, [cms]);
  useEffect(() => {
    localStorage.setItem('ds_settings_api', JSON.stringify(apiCfg));
  }, [apiCfg]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="section container">
        <p>System & website configuration — Super Admin / Founder only.</p>
        <Link to="/admin">← Back</Link>
      </div>
    );
  }

  const saveMsg = (t) => setMsg(t);

  return (
    <div className="section page-bg-settings">
      <div className="container" style={{ maxWidth: 900 }}>
        <p>
          <Link to="/admin" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
        </p>
        <h1 className="section-title">⚙️ System & Website Configuration</h1>
        <AdminHero variant="settings" />
        <p className="section-subtitle">CMS text, service catalogue, company profile and integration notes.</p>
        {msg && <p style={{ color: '#34d399' }}>{msg}</p>}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
          {[
            ['company', '🏢 Company profile'],
            ['cms', '📝 CMS content'],
            ['services', '🛠️ Service catalogue'],
            ['api', '🔌 API & integrations'],
          ].map(([k, l]) => (
            <button key={k} type="button" className={tab === k ? 'btn btn-primary' : 'btn btn-outline'} style={{ fontSize: '0.85rem' }} onClick={() => setTab(k)}>
              {l}
            </button>
          ))}
        </div>

        {tab === 'company' && (
          <div className="card">
            <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Company profiles</h3>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {Object.entries(company).map(([key, val]) => (
                <label key={key} style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                  {key}
                  <input
                    value={val}
                    onChange={(e) => setCompany({ ...company, [key]: e.target.value })}
                    style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.5rem', borderRadius: 8 }}
                  />
                </label>
              ))}
            </div>
            <button type="button" className="btn btn-primary" style={{ marginTop: '0.75rem' }} onClick={() => saveMsg('Company profile saved (browser). Sync to backend .env / Settings when deploying.')}>
              Save company profile
            </button>
          </div>
        )}

        {tab === 'cms' && (
          <div className="card">
            <h3 style={{ marginTop: 0, color: '#00d4ff' }}>CMS content manager</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Edit key public website blurbs. Full page builders can extend these keys.</p>
            {Object.entries(cms).map(([key, val]) => (
              <label key={key} style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                {key}
                <textarea
                  value={val}
                  onChange={(e) => setCms({ ...cms, [key]: e.target.value })}
                  rows={3}
                  style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.5rem', borderRadius: 8 }}
                />
              </label>
            ))}
            <button type="button" className="btn btn-primary" onClick={() => saveMsg('CMS content saved locally.')}>
              Save CMS
            </button>
            <p style={{ marginTop: '1rem' }}>
              <Link to="/admin/notices" style={{ color: '#00d4ff' }}>
                Notices / Insights admin →
              </Link>
            </p>
          </div>
        )}

        {tab === 'services' && (
          <>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Add service offering</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!svcForm.name.trim()) return;
                  setServices((s) => [...s, { id: Date.now(), ...svcForm }]);
                  setSvcForm({ name: '', stack: '', package: '' });
                  saveMsg('Service added.');
                }}
                style={{ display: 'grid', gap: '0.5rem' }}
              >
                <input placeholder="Service name" value={svcForm.name} onChange={(e) => setSvcForm({ ...svcForm, name: e.target.value })} required style={{ padding: '0.5rem', borderRadius: 8 }} />
                <input placeholder="Tech stack" value={svcForm.stack} onChange={(e) => setSvcForm({ ...svcForm, stack: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <input placeholder="Package / pricing model" value={svcForm.package} onChange={(e) => setSvcForm({ ...svcForm, package: e.target.value })} style={{ padding: '0.5rem', borderRadius: 8 }} />
                <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
                  Add to catalogue
                </button>
              </form>
            </div>
            {services.map((s) => (
              <div key={s.id} className="card" style={{ marginBottom: '0.5rem' }}>
                <strong style={{ color: '#e2e8f0' }}>{s.name}</strong>
                <p style={{ color: '#94a3b8', margin: '0.25rem 0', fontSize: '0.9rem' }}>Stack: {s.stack}</p>
                <p style={{ color: '#64748b', margin: 0, fontSize: '0.85rem' }}>Package: {s.package}</p>
                <button type="button" className="btn btn-outline" style={{ marginTop: 8, fontSize: '0.75rem' }} onClick={() => setServices((list) => list.filter((x) => x.id !== s.id))}>
                  Remove
                </button>
              </div>
            ))}
          </>
        )}

        {tab === 'api' && (
          <div className="card">
            <h3 style={{ marginTop: 0, color: '#00d4ff' }}>API & integrations</h3>
            <p style={{ color: '#fbbf24', fontSize: '0.9rem' }}>Store only non-secret labels here. Real keys belong in server `.env`.</p>
            {Object.entries(apiCfg).map(([key, val]) => (
              <label key={key} style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.65rem' }}>
                {key}
                <input
                  value={val}
                  onChange={(e) => setApiCfg({ ...apiCfg, [key]: e.target.value })}
                  style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.5rem', borderRadius: 8 }}
                />
              </label>
            ))}
            <button type="button" className="btn btn-primary" onClick={() => saveMsg('Integration notes saved.')}>
              Save integration notes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
