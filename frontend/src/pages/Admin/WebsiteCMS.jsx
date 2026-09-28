import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminHero from '../../components/AdminHero';
import { useAuth } from '../../context/AuthContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { DEFAULT_SITE_CONTENT, loadSiteContent, saveSiteContent } from '../../utils/siteContent';

const TABS = [
  { key: 'company', label: '🏢 Company' },
  { key: 'home', label: '🏠 Home Hero' },
  { key: 'about', label: 'ℹ️ About' },
  { key: 'services', label: '🛠️ Services' },
  { key: 'industries', label: '🏭 Industries' },
  { key: 'careers', label: '💼 Careers' },
  { key: 'insights', label: '💡 Insights' },
  { key: 'contact', label: '📞 Contact' },
  { key: 'social', label: '🔗 Social' },
  { key: 'footer', label: '📄 Footer' },
  { key: 'blocks', label: '➕ Custom blocks' },
  { key: 'pages', label: '📑 New Pages Info' },
  { key: 'json', label: '{ } Raw JSON' },
];

export default function AdminWebsiteCMS() {
  const { user } = useAuth();
  const { content, update, reset, refresh } = useSiteContent();
  const [tab, setTab] = useState('company');
  const [draft, setDraft] = useState(() => loadSiteContent());
  const [msg, setMsg] = useState('');
  const [jsonText, setJsonText] = useState('');

  const syncDraft = () => {
    const c = loadSiteContent();
    setDraft(c);
    setJsonText(JSON.stringify(c, null, 2));
    refresh();
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="section container">
        <p>Full website edit — Super Admin / Founder only.</p>
        <Link to="/admin">← Back</Link>
      </div>
    );
  }

  const setPath = (section, field, value) => {
    setDraft((d) => ({
      ...d,
      [section]: { ...(d[section] || {}), [field]: value },
    }));
  };

  const save = () => {
    const saved = saveSiteContent(draft);
    update(saved);
    setMsg('Website content saved. Public pages update immediately (same browser). Export JSON for backup on hosting.');
    setJsonText(JSON.stringify(saved, null, 2));
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ds-website-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const importJson = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        setDraft(parsed);
        saveSiteContent(parsed);
        update(parsed);
        setMsg('Imported and saved.');
        setJsonText(JSON.stringify(parsed, null, 2));
      } catch {
        setMsg('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const serviceItems = draft.services?.items || [];
  const industryItems = draft.industries?.items || [];
  const customBlocks = draft.customBlocks || [];

  const field = (label, value, onChange, rows) => (
    <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
      {label}
      {rows ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.55rem', borderRadius: 8 }}
        />
      ) : (
        <input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.55rem', borderRadius: 8 }}
        />
      )}
    </label>
  );

  return (
    <div className="section page-bg-settings">
      <div className="container" style={{ maxWidth: 900 }}>
        <p>
          <Link to="/admin" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
        </p>
        <h1 className="section-title">✏️ Website CMS — Full edit</h1>
        <AdminHero variant="settings" showThumbs={false} />
        <p className="section-subtitle">
          Add · edit · delete · replace text on public pages. Saves in browser; use Export JSON after hosting to keep a backup.
          Last save: {content.updatedAt ? new Date(content.updatedAt).toLocaleString('en-IN') : 'never'}
        </p>
        {msg && <p style={{ color: '#34d399' }}>{msg}</p>}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1rem' }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={tab === t.key ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ fontSize: '0.8rem' }}
              onClick={() => {
                setTab(t.key);
                if (t.key === 'json') setJsonText(JSON.stringify(draft, null, 2));
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="card" style={{ marginBottom: '1rem' }}>
          {tab === 'company' && (
            <>
              <div className="card" style={{ marginBottom: '1rem' }}>
                <h4 style={{ marginTop: 0 }}>Branding</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Upload logo (saved in browser for preview; for production host upload to /public).</p>
                <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    try {
                      localStorage.setItem('ds_custom_logo', reader.result);
                      setMsg('Logo saved in this browser. Refresh site to see on Navbar if wired.');
                    } catch { setMsg('Logo too large for localStorage'); }
                  };
                  reader.readAsDataURL(file);
                }} />
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  <button type="button" className="btn btn-outline" onClick={() => { localStorage.removeItem('ds_custom_logo'); setMsg('Custom logo cleared'); }}>Reset Logo</button>
                </div>
              </div>

              {field('Company name', draft.company?.name, (v) => setPath('company', 'name', v))}
              {field('Logo URL (e.g. /logo.jpg)', draft.company?.logoUrl, (v) => setPath('company', 'logoUrl', v))}
              {field('Favicon URL', draft.company?.favicon, (v) => setPath('company', 'favicon', v))}
              {field('Tagline', draft.company?.tagline, (v) => setPath('company', 'tagline', v))}
              {field('Address', draft.company?.address, (v) => setPath('company', 'address', v), 2)}
              {field('Phone 1', draft.company?.phone1, (v) => setPath('company', 'phone1', v))}
              {field('Phone 2', draft.company?.phone2, (v) => setPath('company', 'phone2', v))}
              {field('Email', draft.company?.email, (v) => setPath('company', 'email', v))}
              {field('LinkedIn URL', draft.company?.linkedin, (v) => setPath('company', 'linkedin', v))}
              {field('Instagram URL', draft.company?.instagram, (v) => setPath('company', 'instagram', v))}
              {field('Bank account name', draft.company?.bankName, (v) => setPath('company', 'bankName', v))}
              {field('Bank account number', draft.company?.bankAccount, (v) => setPath('company', 'bankAccount', v))}
              {field('IFSC', draft.company?.bankIfsc, (v) => setPath('company', 'bankIfsc', v))}
              {field('SEO title', draft.company?.seoTitle, (v) => setPath('company', 'seoTitle', v))}
              {field('SEO description', draft.company?.seoDescription, (v) => setPath('company', 'seoDescription', v), 3)}
              {field('WhatsApp URL', draft.company?.whatsapp, (v) => setPath('company', 'whatsapp', v))}
            </>
          )}

          {tab === 'home' && (
            <>
              {field('Hero title', draft.home?.heroTitle, (v) => setPath('home', 'heroTitle', v))}
              {field('Hero subtitle', draft.home?.heroSubtitle, (v) => setPath('home', 'heroSubtitle', v), 3)}
              {field('Primary CTA label', draft.home?.ctaPrimary, (v) => setPath('home', 'ctaPrimary', v))}
              {field('Secondary CTA label', draft.home?.ctaSecondary, (v) => setPath('home', 'ctaSecondary', v))}
              {field('Stat: jobs', draft.home?.statsJobs, (v) => setPath('home', 'statsJobs', v))}
              {field('Stat: team', draft.home?.statsTeam, (v) => setPath('home', 'statsTeam', v))}
              {field('Stat: clients', draft.home?.statsClients, (v) => setPath('home', 'statsClients', v))}
            </>
          )}

          {tab === 'about' && (
            <>
              {field('Intro', draft.about?.intro, (v) => setPath('about', 'intro', v), 4)}
              {field('Mission', draft.about?.mission, (v) => setPath('about', 'mission', v), 3)}
              {field('Vision', draft.about?.vision, (v) => setPath('about', 'vision', v), 3)}
              {field('Values', draft.about?.values, (v) => setPath('about', 'values', v), 3)}
              {field('Founder short bio', draft.about?.founderBio, (v) => setPath('about', 'founderBio', v), 5)}
              {field('Hero image URL', draft.about?.heroImage, (v) => setPath('about', 'heroImage', v))}
            </>
          )}

          {tab === 'insights' && (
            <>
              {field('Insights page heading', draft.insights?.heading, (v) => setPath('insights', 'heading', v))}
              {field('Insights intro', draft.insights?.intro, (v) => setPath('insights', 'intro', v), 4)}
              {field('Featured article title', draft.insights?.featuredTitle, (v) => setPath('insights', 'featuredTitle', v))}
              {field('Featured article body', draft.insights?.featuredBody, (v) => setPath('insights', 'featuredBody', v), 6)}
            </>
          )}

          {tab === 'social' && (
            <>
              {field('LinkedIn', draft.company?.linkedin, (v) => setPath('company', 'linkedin', v))}
              {field('Instagram', draft.company?.instagram, (v) => setPath('company', 'instagram', v))}
              {field('WhatsApp', draft.company?.whatsapp, (v) => setPath('company', 'whatsapp', v))}
              {field('YouTube', draft.company?.youtube, (v) => setPath('company', 'youtube', v))}
              {field('X / Twitter', draft.company?.twitter, (v) => setPath('company', 'twitter', v))}
              {field('GitHub', draft.company?.github, (v) => setPath('company', 'github', v))}
              {field('Facebook', draft.company?.facebook, (v) => setPath('company', 'facebook', v))}
            </>
          )}

          {tab === 'services' && (
            <>
              {field('Heading', draft.services?.heading, (v) => setPath('services', 'heading', v))}
              <h4 style={{ color: '#00d4ff' }}>Service items</h4>
              {serviceItems.map((item, i) => (
                <div key={i} className="card" style={{ marginBottom: '0.5rem', background: 'rgba(15,23,42,0.5)' }}>
                  <input
                    value={item.title}
                    onChange={(e) => {
                      const items = [...serviceItems];
                      items[i] = { ...items[i], title: e.target.value };
                      setDraft((d) => ({ ...d, services: { ...d.services, items } }));
                    }}
                    placeholder="Title"
                    style={{ width: '100%', marginBottom: 6, padding: '0.45rem', borderRadius: 6 }}
                  />
                  <textarea
                    value={item.desc}
                    onChange={(e) => {
                      const items = [...serviceItems];
                      items[i] = { ...items[i], desc: e.target.value };
                      setDraft((d) => ({ ...d, services: { ...d.services, items } }));
                    }}
                    rows={2}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: 6 }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ marginTop: 6, fontSize: '0.75rem' }}
                    onClick={() => {
                      const items = serviceItems.filter((_, j) => j !== i);
                      setDraft((d) => ({ ...d, services: { ...d.services, items } }));
                    }}
                  >
                    Delete service
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-primary"
                style={{ fontSize: '0.85rem' }}
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    services: {
                      ...d.services,
                      items: [...serviceItems, { title: 'New service', desc: 'Description' }],
                    },
                  }))
                }
              >
                + Add service
              </button>
            </>
          )}

          {tab === 'industries' && (
            <>
              {field('Heading', draft.industries?.heading, (v) => setPath('industries', 'heading', v))}
              {industryItems.map((name, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <input
                    value={name}
                    onChange={(e) => {
                      const items = [...industryItems];
                      items[i] = e.target.value;
                      setDraft((d) => ({ ...d, industries: { ...d.industries, items } }));
                    }}
                    style={{ flex: 1, padding: '0.45rem', borderRadius: 6 }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ fontSize: '0.75rem' }}
                    onClick={() => {
                      const items = industryItems.filter((_, j) => j !== i);
                      setDraft((d) => ({ ...d, industries: { ...d.industries, items } }));
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-primary"
                style={{ fontSize: '0.85rem' }}
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    industries: { ...d.industries, items: [...industryItems, 'New industry'] },
                  }))
                }
              >
                + Add industry
              </button>
            </>
          )}

          {tab === 'careers' && (
            <>
              {field('Hero title', draft.careers?.heroTitle, (v) => setPath('careers', 'heroTitle', v))}
              {field('Hero subtitle', draft.careers?.heroSubtitle, (v) => setPath('careers', 'heroSubtitle', v), 3)}
            </>
          )}

          {tab === 'contact' && (
            <>
              {field('Heading', draft.contact?.heading, (v) => setPath('contact', 'heading', v))}
              {field('Blurb', draft.contact?.blurb, (v) => setPath('contact', 'blurb', v), 3)}
            </>
          )}

          {tab === 'footer' && field('Footer note', draft.footer?.note, (v) => setPath('footer', 'note', v), 2)}

          {tab === 'pages' && (
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Public pages available on the website</h3>
              <p style={{ color: '#94a3b8' }}>
                These pages are live in the frontend. Edit Home / About / Services / Contact content from the other tabs.
                Testimonials, Case Studies, Team, FAQ and Pricing have dedicated pages with built-in content.
              </p>
              <ul style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                <li><code>/testimonials</code> — Client reviews</li>
                <li><code>/case-studies</code> — Project case studies</li>
                <li><code>/team</code> — Team members</li>
                <li><code>/faq</code> — Frequently asked questions</li>
                <li><code>/pricing</code> — Packages & pricing</li>
                <li><code>/careers/resume-builder</code> — Resume (1-page A4) + Full CV builder</li>
                <li><code>/contact</code> — Contact form + map</li>
              </ul>
              <p style={{ color: '#94a3b8', marginTop: '1rem' }}>
                Tip: Use <strong>Home Hero</strong> tab to change the main homepage title, subtitle and CTAs.
                Use <strong>Raw JSON</strong> to export/import full site content.
              </p>
            </div>
          )}

          {tab === 'blocks' && (
            <>
              <p style={{ color: '#94a3b8' }}>Custom HTML-free text blocks for announcements on site.</p>
              {customBlocks.map((b, i) => (
                <div key={b.id || i} className="card" style={{ marginBottom: '0.5rem' }}>
                  <input
                    value={b.title}
                    onChange={(e) => {
                      const blocks = [...customBlocks];
                      blocks[i] = { ...blocks[i], title: e.target.value };
                      setDraft((d) => ({ ...d, customBlocks: blocks }));
                    }}
                    placeholder="Block title"
                    style={{ width: '100%', marginBottom: 6, padding: '0.45rem', borderRadius: 6 }}
                  />
                  <textarea
                    value={b.body}
                    onChange={(e) => {
                      const blocks = [...customBlocks];
                      blocks[i] = { ...blocks[i], body: e.target.value };
                      setDraft((d) => ({ ...d, customBlocks: blocks }));
                    }}
                    rows={3}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: 6 }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ marginTop: 6, fontSize: '0.75rem' }}
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        customBlocks: customBlocks.filter((_, j) => j !== i),
                      }))
                    }
                  >
                    Delete block
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    customBlocks: [
                      ...customBlocks,
                      { id: `blk-${Date.now()}`, title: 'New block', body: 'Content…' },
                    ],
                  }))
                }
              >
                + Add block
              </button>
            </>
          )}

          {tab === 'json' && (
            <>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Advanced: edit raw JSON then Apply.</p>
              <textarea
                value={jsonText || JSON.stringify(draft, null, 2)}
                onChange={(e) => setJsonText(e.target.value)}
                rows={18}
                style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.8rem', padding: '0.75rem', borderRadius: 8 }}
              />
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: 8 }}
                onClick={() => {
                  try {
                    const parsed = JSON.parse(jsonText);
                    setDraft(parsed);
                    setMsg('JSON applied to draft — click Save all.');
                  } catch {
                    setMsg('Invalid JSON.');
                  }
                }}
              >
                Apply JSON to draft
              </button>
            </>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <button type="button" className="btn btn-primary" onClick={save}>
            💾 Save all (publish)
          </button>
          <button type="button" className="btn btn-outline" onClick={syncDraft}>
            Reload from storage
          </button>
          <button type="button" className="btn btn-outline" onClick={exportJson}>
            Export JSON backup
          </button>
          <label className="btn btn-outline" style={{ cursor: 'pointer' }}>
            Import JSON
            <input
              type="file"
              accept="application/json,.json"
              hidden
              onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])}
            />
          </label>
          <button
            type="button"
            className="btn btn-outline"
            style={{ color: '#f87171' }}
            onClick={() => {
              if (window.confirm('Reset all website content to defaults?')) {
                reset();
                setDraft(DEFAULT_SITE_CONTENT);
                setMsg('Reset to defaults.');
              }
            }}
          >
            Reset defaults
          </button>
        </div>

        <p style={{ marginTop: '1.25rem', color: '#64748b', fontSize: '0.85rem', lineHeight: 1.6 }}>
          <strong>Hosting tip:</strong> localStorage is per device/browser. After deploy, open Admin → Website CMS once,
          Import your exported JSON, Save. For multi-admin production, connect the same JSON to your backend/DB later.
        </p>
      </div>
    </div>
  );
}
