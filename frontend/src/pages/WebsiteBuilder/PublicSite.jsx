import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';
import SitePreview from './SitePreview';

export default function PublicSite() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [source, setSource] = useState('');

  useEffect(() => {
    let cancelled = false;
    const key = String(slug || '').toLowerCase().trim();

    async function load() {
      setLoading(true);
      setErr('');
      setData(null);

      try {
        const all = JSON.parse(localStorage.getItem('ds_sites') || '{}');
        const local = all[key] || all[slug];
        if (local && local.title) {
          if (!cancelled) {
            setData(local);
            setSource('local');
            setLoading(false);
          }
        }
      } catch (_) {}

      try {
        const { data: doc } = await api.get(`/sites/${encodeURIComponent(key)}`);
        if (!cancelled && doc && doc.title) {
          setData(doc);
          setSource('server');
          setLoading(false);
          try {
            const all = JSON.parse(localStorage.getItem('ds_sites') || '{}');
            all[key] = doc;
            localStorage.setItem('ds_sites', JSON.stringify(all));
          } catch (__) {}
          return;
        }
      } catch (_) {}

      if (!cancelled) {
        setLoading(false);
        setData((prev) => {
          if (prev) return prev;
          setErr('Site not found. Open Website Builder → choose template → Save & get link.');
          return null;
        });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="section container" style={{ padding: '3rem 1rem' }}>
        <p style={{ color: '#94a3b8' }}>Loading website…</p>
      </div>
    );
  }

  if (err || !data) {
    return (
      <div className="section container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <h1>Website not found</h1>
        <p style={{ color: '#94a3b8' }}>{err}</p>
        <Link to="/website-builder" className="btn btn-primary">
          Create a website
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#020617', padding: '1rem 0 2rem' }}>
      <div className="container" style={{ maxWidth: 900 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <Link to="/" style={{ color: '#a78bfa', fontSize: '0.9rem' }}>
            ← DS-TECHNOLOGIES
          </Link>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {source === 'local' && <span style={{ fontSize: '0.75rem', color: '#fbbf24' }}>This browser</span>}
            <Link to="/website-builder" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
              Build your site
            </Link>
          </div>
        </div>
        <SitePreview site={data} />
      </div>
    </div>
  );
}
