import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { SITE_TEMPLATES } from './templates';
import SitePreview from './SitePreview';

const SAMPLE = {
  title: 'Sunrise Cafe',
  slug: 'sunrise-cafe',
  siteType: 'cafe',
  template: 'cafe',
  tagline: 'Fresh coffee · Homemade snacks · Wi‑Fi',
  about: 'Family-run cafe in Bareilly serving fresh coffee, sandwiches and desserts. Perfect for students and remote work.',
  services: 'Coffee, Snacks, Sandwiches, Desserts, Wi-Fi, Takeaway',
  phone: '+91 98765 43210',
  email: 'hello@sunrisecafe.in',
  whatsapp: '919876543210',
  address: 'Civil Lines',
  city: 'Bareilly, UP',
  hours: '9 AM – 10 PM',
  logoUrl: '',
  heroImage: '',
  ctaText: 'Order on WhatsApp',
  ctaLink: '',
  socialInstagram: '',
  socialFacebook: '',
  ownerName: 'Rahul Sharma',
};

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
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
  boxSizing: 'border-box',
};

export default function WebsiteBuilder() {
  const [form, setForm] = useState({ ...SAMPLE });
  const [saving, setSaving] = useState(false);
  const [savedPath, setSavedPath] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('edit');

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const slug = form.slug || slugify(form.title);
  const shareUrl = `${origin}/site/${slug}`;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setError('');
    setSavedPath('');
    if (!form.title.trim()) {
      setError('Site title is required');
      return;
    }
    const finalSlug = slugify(form.slug || form.title);
    const payload = { ...form, slug: finalSlug };

    try {
      const all = JSON.parse(localStorage.getItem('ds_sites') || '{}');
      all[finalSlug] = payload;
      localStorage.setItem('ds_sites', JSON.stringify(all));
    } catch (_) {}

    setSaving(true);
    setForm((f) => ({ ...f, slug: finalSlug }));
    setSavedPath(`/site/${finalSlug}`);

    try {
      const { data } = await api.post('/sites', payload);
      setSavedPath(data?.path || `/site/${finalSlug}`);
      setForm((f) => ({ ...f, slug: data?.slug || finalSlug }));
      setError('');
    } catch (e) {
      setError(
        `Saved on this browser. Server: ${e?.response?.data?.message || e.message || 'offline'}. Hosting + MongoDB ke baad har device pe chalega.`
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
      prompt('Copy link:', shareUrl);
    }
  };

  return (
    <div className="section" style={{ minHeight: '100vh', paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ color: '#a78bfa', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em' }}>NO CODING · 10 TEMPLATES</p>
            <h1 className="section-title" style={{ fontSize: '1.85rem', margin: '0.25rem 0' }}>
              Website Builder
            </h1>
            <p style={{ color: '#94a3b8', maxWidth: 560, margin: 0 }}>
              Business, cafe, coaching, clinic, shop, NGO — form bharo, template choose karo, save karo.
              Link milegi: <code style={{ color: '#e2e8f0' }}>{origin}/site/your-name</code>
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
          <div className="card" style={{ marginTop: '1rem', padding: '1rem', borderColor: 'rgba(167,139,250,0.45)' }}>
            {savedPath && (
              <>
                <div style={{ color: '#c4b5fd', fontWeight: 700, marginBottom: 6 }}>Website link ready</div>
                <div style={{ wordBreak: 'break-all', color: '#e2e8f0' }}>{shareUrl}</div>
                <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <button type="button" className="btn btn-primary" onClick={copyLink}>
                    Copy link
                  </button>
                  <Link className="btn btn-outline" to={savedPath} target="_blank" rel="noreferrer">
                    Open website
                  </Link>
                </div>
              </>
            )}
            {error && <p style={{ color: '#fbbf24', margin: savedPath ? '0.75rem 0 0' : 0, fontSize: '0.9rem' }}>{error}</p>}
          </div>
        )}

        {tab === 'edit' ? (
          <>
            <h3 style={{ marginTop: '1.5rem', color: '#e2e8f0' }}>Choose template (10)</h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: 10,
                marginBottom: '1.25rem',
              }}
            >
              {SITE_TEMPLATES.map((t) => {
                const active = form.template === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      set('template', t.id);
                      set('siteType', t.type);
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '0.85rem',
                      borderRadius: 12,
                      border: active ? `2px solid ${t.colors.accent}` : '1px solid rgba(148,163,184,0.25)',
                      background: t.colors.bg,
                      color: t.colors.text,
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.72rem', color: t.colors.muted, marginTop: 4 }}>{t.desc}</div>
                  </button>
                );
              })}
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <label>
                  Site title *
                  <input value={form.title} onChange={(e) => set('title', e.target.value)} style={inp} />
                </label>
                <label>
                  URL slug
                  <input
                    value={form.slug}
                    onChange={(e) => set('slug', slugify(e.target.value))}
                    placeholder="my-shop"
                    style={inp}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/site/{slug || '…'}</span>
                </label>
                <label>
                  Tagline
                  <input value={form.tagline} onChange={(e) => set('tagline', e.target.value)} style={inp} />
                </label>
                <label>
                  Owner / contact name
                  <input value={form.ownerName} onChange={(e) => set('ownerName', e.target.value)} style={inp} />
                </label>
                <label>
                  Phone
                  <input value={form.phone} onChange={(e) => set('phone', e.target.value)} style={inp} />
                </label>
                <label>
                  WhatsApp (with country code)
                  <input value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} style={inp} placeholder="9198xxxxxxxx" />
                </label>
                <label>
                  Email
                  <input value={form.email} onChange={(e) => set('email', e.target.value)} style={inp} />
                </label>
                <label>
                  City
                  <input value={form.city} onChange={(e) => set('city', e.target.value)} style={inp} />
                </label>
                <label>
                  Address
                  <input value={form.address} onChange={(e) => set('address', e.target.value)} style={inp} />
                </label>
                <label>
                  Hours
                  <input value={form.hours} onChange={(e) => set('hours', e.target.value)} style={inp} />
                </label>
                <label>
                  Button text
                  <input value={form.ctaText} onChange={(e) => set('ctaText', e.target.value)} style={inp} />
                </label>
                <label>
                  Button link (optional)
                  <input value={form.ctaLink} onChange={(e) => set('ctaLink', e.target.value)} style={inp} placeholder="https://..." />
                </label>
                <label>
                  Instagram URL
                  <input value={form.socialInstagram} onChange={(e) => set('socialInstagram', e.target.value)} style={inp} />
                </label>
                <label>
                  Facebook URL
                  <input value={form.socialFacebook} onChange={(e) => set('socialFacebook', e.target.value)} style={inp} />
                </label>
                <label>
                  Hero image URL (optional)
                  <input value={form.heroImage} onChange={(e) => set('heroImage', e.target.value)} style={inp} />
                </label>
              </div>
              <label style={{ display: 'block', marginTop: '1rem' }}>
                About
                <textarea value={form.about} onChange={(e) => set('about', e.target.value)} rows={3} style={inp} />
              </label>
              <label style={{ display: 'block', marginTop: '0.75rem' }}>
                Services (comma separated)
                <input value={form.services} onChange={(e) => set('services', e.target.value)} style={inp} />
              </label>
            </div>
          </>
        ) : (
          <div style={{ marginTop: '1.25rem' }}>
            <SitePreview site={form} />
          </div>
        )}
      </div>
    </div>
  );
}
