import { getTemplate } from './templates';

function splitServices(text) {
  return String(text || '')
    .split(/[,\n|]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function SitePreview({ site }) {
  const tpl = getTemplate(site?.template);
  const c = tpl.colors;
  const services = splitServices(site?.services);
  const wa = (site?.whatsapp || site?.phone || '').replace(/\D/g, '');

  return (
    <div
      style={{
        background: c.bg,
        color: c.text,
        borderRadius: 16,
        overflow: 'hidden',
        border: `1px solid ${c.accent}33`,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Hero */}
      <div
        style={{
          padding: '2.5rem 1.5rem',
          background: site?.heroImage
            ? `linear-gradient(105deg, ${c.bg}ee 0%, ${c.bg}99 60%), url(${site.heroImage}) center/cover`
            : `linear-gradient(135deg, ${c.bg} 0%, ${c.card} 100%)`,
          borderBottom: `3px solid ${c.accent}`,
        }}
      >
        <div style={{ fontSize: '0.75rem', letterSpacing: '0.12em', color: c.accent, fontWeight: 700 }}>
          {tpl.name.toUpperCase()}
        </div>
        <h1 style={{ margin: '0.5rem 0 0.35rem', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800 }}>
          {site?.title || 'Your Site Title'}
        </h1>
        <p style={{ margin: 0, color: c.muted, maxWidth: 520, fontSize: '1.05rem' }}>
          {site?.tagline || 'Your tagline goes here'}
        </p>
        <div style={{ marginTop: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {(site?.ctaLink || site?.phone || wa) && (
            <a
              href={site?.ctaLink || (wa ? `https://wa.me/${wa}` : `tel:${site?.phone}`)}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-block',
                padding: '0.65rem 1.25rem',
                borderRadius: 10,
                background: c.accent,
                color: c.bg === '#f8fafc' || c.bg.startsWith('#f') ? '#0f172a' : '#0b1220',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              {site?.ctaText || 'Contact us'}
            </a>
          )}
          {site?.phone && (
            <a href={`tel:${site.phone}`} style={{ color: c.accent, alignSelf: 'center', textDecoration: 'none' }}>
              {site.phone}
            </a>
          )}
        </div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {site?.about && (
          <section style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ color: c.accent, fontSize: '1.1rem', margin: '0 0 0.5rem' }}>About</h2>
            <p style={{ margin: 0, lineHeight: 1.65, color: c.muted, whiteSpace: 'pre-wrap' }}>{site.about}</p>
          </section>
        )}

        {services.length > 0 && (
          <section style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ color: c.accent, fontSize: '1.1rem', margin: '0 0 0.75rem' }}>Services</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
              {services.map((s) => (
                <div
                  key={s}
                  style={{
                    background: c.card,
                    padding: '0.85rem 1rem',
                    borderRadius: 12,
                    border: `1px solid ${c.accent}44`,
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          </section>
        )}

        <section
          style={{
            background: c.card,
            borderRadius: 12,
            padding: '1rem 1.15rem',
            border: `1px solid ${c.accent}33`,
          }}
        >
          <h2 style={{ color: c.accent, fontSize: '1.1rem', margin: '0 0 0.65rem' }}>Contact</h2>
          <div style={{ color: c.muted, fontSize: '0.92rem', lineHeight: 1.7 }}>
            {site?.ownerName && <div>Contact person: {site.ownerName}</div>}
            {site?.email && <div>Email: {site.email}</div>}
            {site?.phone && <div>Phone: {site.phone}</div>}
            {site?.whatsapp && <div>WhatsApp: {site.whatsapp}</div>}
            {(site?.address || site?.city) && (
              <div>
                {[site.address, site.city].filter(Boolean).join(', ')}
              </div>
            )}
            {site?.hours && <div>Hours: {site.hours}</div>}
            <div style={{ marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {site?.socialInstagram && (
                <a href={site.socialInstagram.startsWith('http') ? site.socialInstagram : `https://${site.socialInstagram}`} target="_blank" rel="noreferrer" style={{ color: c.accent }}>
                  Instagram
                </a>
              )}
              {site?.socialFacebook && (
                <a href={site.socialFacebook.startsWith('http') ? site.socialFacebook : `https://${site.socialFacebook}`} target="_blank" rel="noreferrer" style={{ color: c.accent }}>
                  Facebook
                </a>
              )}
            </div>
          </div>
        </section>

        <p style={{ marginTop: '1.5rem', fontSize: '0.72rem', color: c.muted, textAlign: 'center' }}>
          Built with DS-TECHNOLOGIES Website Builder · Template: {tpl.name}
        </p>
      </div>
    </div>
  );
}
