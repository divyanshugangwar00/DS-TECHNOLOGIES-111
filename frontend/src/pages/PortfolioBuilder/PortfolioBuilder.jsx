import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const emptyProject = () => ({ title: '', tech: '', description: '', link: '' });

const SAMPLE = {
  fullName: 'Divyanshu Gangwar',
  slug: 'divyanshu',
  headline: 'Frontend Developer · React · MERN',
  email: 'hello@example.com',
  phone: '+91 98765 43210',
  city: 'Bareilly, UP',
  about:
    'Building clean web apps and learning full-stack development. Interested in product UI, APIs and campus tech projects.',
  skills: 'React, JavaScript, HTML, CSS, Node.js, MongoDB, Git',
  education: 'BCA · XYZ College · 2024',
  experience: 'Web Intern — DS-TECHNOLOGIES (2025)\nBuilt UI screens and integrated REST APIs.',
  projects: [
    {
      title: 'Job Portal UI',
      tech: 'React, Vite',
      description: 'Careers portal with filters and apply flow.',
      link: '',
    },
  ],
  github: 'github.com/username',
  linkedin: 'linkedin.com/in/username',
  website: '',
  template: 'dark',
};

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export default function PortfolioBuilder() {
  const [form, setForm] = useState({ ...SAMPLE, projects: SAMPLE.projects.map((p) => ({ ...p })) });
  const [saving, setSaving] = useState(false);
  const [savedPath, setSavedPath] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('edit'); // edit | preview

  const publicOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const slug = form.slug || slugify(form.fullName);
  const shareUrl = `${publicOrigin}/p/${slug}`;

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const updateProject = (i, key, value) => {
    setForm((f) => {
      const projects = [...(f.projects || [])];
      projects[i] = { ...projects[i], [key]: value };
      return { ...f, projects };
    });
  };

  const addProject = () => setForm((f) => ({ ...f, projects: [...(f.projects || []), emptyProject()] }));
  const removeProject = (i) =>
    setForm((f) => ({ ...f, projects: (f.projects || []).filter((_, idx) => idx !== i) }));

  const handleSave = async () => {
    setError('');
    setSavedPath('');
    if (!form.fullName.trim()) {
      setError('Full name is required');
      return;
    }
    const finalSlug = slugify(form.slug || form.fullName);
    const payload = {
      ...form,
      slug: finalSlug,
      projects: (form.projects || []).filter((p) => p.title || p.description),
    };

    // Always save locally first so /p/slug works in this browser even if API is down
    try {
      const all = JSON.parse(localStorage.getItem('ds_portfolios') || '{}');
      all[finalSlug] = payload;
      localStorage.setItem('ds_portfolios', JSON.stringify(all));
    } catch (_) {}

    setSaving(true);
    setForm((f) => ({ ...f, slug: finalSlug }));
    setSavedPath(`/p/${finalSlug}`);

    try {
      const { data } = await api.post('/portfolios', payload);
      const path = data?.path || `/p/${finalSlug}`;
      setSavedPath(path);
      setForm((f) => ({ ...f, slug: data?.slug || finalSlug }));
      setError('');
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'API save failed';
      setError(
        `Saved in this browser. Link works here. Server note: ${msg}. Hosting + MongoDB ke baad har device pe chalega.`
      );
    } finally {
      setSaving(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied!');
    } catch {
      prompt('Copy this link:', shareUrl);
    }
  };

  const skillsList = useMemo(
    () =>
      String(form.skills || '')
        .split(/[,|\n]/)
        .map((s) => s.trim())
        .filter(Boolean),
    [form.skills]
  );

  return (
    <div className="page-bg-portfolio section" style={{ minHeight: '100vh', paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ color: '#67e8f9', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em' }}>NO CODING NEEDED</p>
            <h1 className="section-title" style={{ fontSize: '1.85rem', margin: '0.25rem 0' }}>
              Portfolio Builder
            </h1>
            <p style={{ color: '#94a3b8', maxWidth: 560, margin: 0 }}>
              Fill the form → save → get a shareable link like your website URL, under this site:
              <br />
              <code style={{ color: '#e2e8f0' }}>{publicOrigin}/p/your-name</code>
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <button type="button" className={`btn ${tab === 'edit' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('edit')}>
              Edit
            </button>
            <button type="button" className={`btn ${tab === 'preview' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setTab('preview')}>
              Preview
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save & get link'}
            </button>
          </div>
        </div>

        {(savedPath || error) && (
          <div
            className="card"
            style={{
              marginTop: '1rem',
              padding: '1rem',
              borderColor: error && !savedPath ? 'rgba(248,113,113,0.5)' : 'rgba(52,211,153,0.4)',
            }}
          >
            {savedPath && (
              <>
                <div style={{ color: '#34d399', fontWeight: 700, marginBottom: 6 }}>Portfolio link ready</div>
                <div style={{ wordBreak: 'break-all', color: '#e2e8f0' }}>{shareUrl}</div>
                <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <button type="button" className="btn btn-primary" onClick={copyLink}>
                    Copy link
                  </button>
                  <Link className="btn btn-outline" to={savedPath} target="_blank" rel="noreferrer">
                    Open portfolio
                  </Link>
                </div>
              </>
            )}
            {error && <p style={{ color: '#fbbf24', margin: savedPath ? '0.75rem 0 0' : 0, fontSize: '0.9rem' }}>{error}</p>}
          </div>
        )}

        {tab === 'edit' ? (
          <div className="card" style={{ marginTop: '1.25rem', padding: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <label>
                Full name *
                <input value={form.fullName} onChange={(e) => set('fullName', e.target.value)} style={inp} />
              </label>
              <label>
                URL slug (link name)
                <input
                  value={form.slug}
                  onChange={(e) => set('slug', slugify(e.target.value))}
                  placeholder="your-name"
                  style={inp}
                />
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/p/{slug || '…'}</span>
              </label>
              <label>
                Headline
                <input value={form.headline} onChange={(e) => set('headline', e.target.value)} style={inp} />
              </label>
              <label>
                Email
                <input value={form.email} onChange={(e) => set('email', e.target.value)} style={inp} />
              </label>
              <label>
                Phone
                <input value={form.phone} onChange={(e) => set('phone', e.target.value)} style={inp} />
              </label>
              <label>
                City
                <input value={form.city} onChange={(e) => set('city', e.target.value)} style={inp} />
              </label>
              <label>
                GitHub
                <input value={form.github} onChange={(e) => set('github', e.target.value)} style={inp} />
              </label>
              <label>
                LinkedIn
                <input value={form.linkedin} onChange={(e) => set('linkedin', e.target.value)} style={inp} />
              </label>
              <label>
                Website
                <input value={form.website} onChange={(e) => set('website', e.target.value)} style={inp} />
              </label>
              <label>
                Template
                <select value={form.template} onChange={(e) => set('template', e.target.value)} style={inp}>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="minimal">Minimal</option>
                </select>
              </label>
            </div>

            <label style={{ display: 'block', marginTop: '1rem' }}>
              About
              <textarea value={form.about} onChange={(e) => set('about', e.target.value)} rows={3} style={inp} />
            </label>
            <label style={{ display: 'block', marginTop: '0.75rem' }}>
              Skills (comma separated)
              <input value={form.skills} onChange={(e) => set('skills', e.target.value)} style={inp} />
            </label>
            <label style={{ display: 'block', marginTop: '0.75rem' }}>
              Education
              <textarea value={form.education} onChange={(e) => set('education', e.target.value)} rows={2} style={inp} />
            </label>
            <label style={{ display: 'block', marginTop: '0.75rem' }}>
              Experience
              <textarea value={form.experience} onChange={(e) => set('experience', e.target.value)} rows={3} style={inp} />
            </label>

            <div style={{ marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>Projects</h3>
                <button type="button" className="btn btn-outline" onClick={addProject}>
                  + Project
                </button>
              </div>
              {(form.projects || []).map((p, i) => (
                <div key={i} className="card" style={{ marginTop: 10, padding: 12, background: 'rgba(0,0,0,0.25)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
                    <input placeholder="Title" value={p.title} onChange={(e) => updateProject(i, 'title', e.target.value)} style={inp} />
                    <input placeholder="Tech" value={p.tech} onChange={(e) => updateProject(i, 'tech', e.target.value)} style={inp} />
                    <input placeholder="Link (optional)" value={p.link} onChange={(e) => updateProject(i, 'link', e.target.value)} style={inp} />
                  </div>
                  <textarea
                    placeholder="Description"
                    value={p.description}
                    onChange={(e) => updateProject(i, 'description', e.target.value)}
                    rows={2}
                    style={{ ...inp, marginTop: 8 }}
                  />
                  <button type="button" className="btn btn-outline" style={{ marginTop: 8 }} onClick={() => removeProject(i)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ marginTop: '1.25rem' }}>
            <PortfolioPreview form={form} skillsList={skillsList} />
          </div>
        )}
      </div>
    </div>
  );
}

const inp = {
  display: 'block',
  width: '100%',
  marginTop: 6,
  padding: '0.55rem 0.7rem',
  borderRadius: 10,
  border: '1px solid rgba(148,163,184,0.25)',
  background: 'rgba(15,23,42,0.85)',
  color: '#f1f5f9',
};

export function PortfolioPreview({ form, skillsList }) {
  const t = form.template || 'dark';
  const bg = t === 'light' ? '#f8fafc' : t === 'minimal' ? '#0f172a' : '#030712';
  const text = t === 'light' ? '#0f172a' : '#e2e8f0';
  const muted = t === 'light' ? '#475569' : '#94a3b8';
  const accent = t === 'minimal' ? '#a78bfa' : '#22d3ee';
  const cardBg = t === 'light' ? '#fff' : 'rgba(15,23,42,0.9)';

  const skills =
    skillsList ||
    String(form.skills || '')
      .split(/[,|\n]/)
      .map((s) => s.trim())
      .filter(Boolean);

  return (
    <div style={{ background: bg, color: text, borderRadius: 16, padding: '1.5rem', border: '1px solid rgba(148,163,184,0.2)' }}>
      <h1 style={{ margin: 0, fontSize: '1.75rem' }}>{form.fullName || 'Your Name'}</h1>
      <p style={{ color: accent, margin: '0.35rem 0' }}>{form.headline}</p>
      <p style={{ color: muted, fontSize: '0.9rem' }}>
        {[form.email, form.phone, form.city].filter(Boolean).join(' · ')}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8, fontSize: '0.85rem' }}>
        {form.github && <span style={{ color: muted }}>GitHub: {form.github}</span>}
        {form.linkedin && <span style={{ color: muted }}>LinkedIn: {form.linkedin}</span>}
        {form.website && <span style={{ color: muted }}>Web: {form.website}</span>}
      </div>

      {form.about && (
        <section style={{ marginTop: '1.25rem' }}>
          <h3 style={{ color: accent, marginBottom: 6 }}>About</h3>
          <p style={{ margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{form.about}</p>
        </section>
      )}

      {skills.length > 0 && (
        <section style={{ marginTop: '1.25rem' }}>
          <h3 style={{ color: accent, marginBottom: 8 }}>Skills</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {skills.map((s) => (
              <span
                key={s}
                style={{
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: cardBg,
                  border: `1px solid ${accent}55`,
                  fontSize: '0.8rem',
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {form.education && (
        <section style={{ marginTop: '1.25rem' }}>
          <h3 style={{ color: accent, marginBottom: 6 }}>Education</h3>
          <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: muted }}>{form.education}</p>
        </section>
      )}

      {form.experience && (
        <section style={{ marginTop: '1.25rem' }}>
          <h3 style={{ color: accent, marginBottom: 6 }}>Experience</h3>
          <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: muted }}>{form.experience}</p>
        </section>
      )}

      {(form.projects || []).filter((p) => p.title).length > 0 && (
        <section style={{ marginTop: '1.25rem' }}>
          <h3 style={{ color: accent, marginBottom: 10 }}>Projects</h3>
          <div style={{ display: 'grid', gap: 10 }}>
            {(form.projects || [])
              .filter((p) => p.title)
              .map((p, i) => (
                <div key={i} style={{ background: cardBg, padding: 12, borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)' }}>
                  <strong>{p.title}</strong>
                  {p.tech && <div style={{ color: accent, fontSize: '0.8rem' }}>{p.tech}</div>}
                  {p.description && <p style={{ margin: '6px 0 0', color: muted, fontSize: '0.9rem' }}>{p.description}</p>}
                  {p.link && (
                    <a href={p.link.startsWith('http') ? p.link : `https://${p.link}`} target="_blank" rel="noreferrer" style={{ color: accent, fontSize: '0.85rem' }}>
                      {p.link}
                    </a>
                  )}
                </div>
              ))}
          </div>
        </section>
      )}

      <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: muted }}>Built with DS-TECHNOLOGIES Portfolio Builder</p>
    </div>
  );
}
