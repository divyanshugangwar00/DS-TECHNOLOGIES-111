import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';
import { PortfolioPreview } from './PortfolioBuilder';

export default function PublicPortfolio() {
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

      // 1) Same-browser local save (works without backend)
      try {
        const all = JSON.parse(localStorage.getItem('ds_portfolios') || '{}');
        const local = all[key] || all[slug];
        if (local && local.fullName) {
          if (!cancelled) {
            setData(local);
            setSource('local');
            setLoading(false);
          }
          // still try API in background to prefer server copy
        }
      } catch (_) {}

      // 2) Backend API
      try {
        const { data: doc } = await api.get(`/portfolios/${encodeURIComponent(key)}`);
        if (!cancelled && doc && doc.fullName) {
          setData(doc);
          setSource('server');
          setLoading(false);
          try {
            const all = JSON.parse(localStorage.getItem('ds_portfolios') || '{}');
            all[key] = doc;
            localStorage.setItem('ds_portfolios', JSON.stringify(all));
          } catch (__) {}
          return;
        }
      } catch (_) {
        // ignore
      }

      if (!cancelled) {
        setLoading((prev) => {
          // if local already set data, keep it
          return false;
        });
        setData((prev) => {
          if (prev) return prev;
          setErr('Portfolio not found. Open Portfolio Builder → fill form → click Save & get link, then open this URL again.');
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
        <p style={{ color: '#94a3b8' }}>Loading portfolio…</p>
      </div>
    );
  }

  if (err || !data) {
    return (
      <div className="section container" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
        <h1>Portfolio not found</h1>
        <p style={{ color: '#94a3b8', maxWidth: 480, margin: '0.75rem auto' }}>{err}</p>
        <ol style={{ color: '#cbd5e1', textAlign: 'left', maxWidth: 420, margin: '1rem auto', lineHeight: 1.7 }}>
          <li>Open <strong>Portfolio Builder</strong></li>
          <li>URL slug = <code>{slug}</code> (same as link)</li>
          <li>Click <strong>Save &amp; get link</strong></li>
          <li>Then open this page again</li>
        </ol>
        <Link to="/portfolio-builder" className="btn btn-primary">
          Create your portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="section" style={{ padding: '1.5rem 0 3rem' }}>
      <div className="container" style={{ maxWidth: 820 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: '#67e8f9', fontSize: '0.9rem' }}>
            ← DS-TECHNOLOGIES
          </Link>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {source === 'local' && (
              <span style={{ fontSize: '0.75rem', color: '#fbbf24' }}>Saved on this browser</span>
            )}
            <Link to="/portfolio-builder" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
              Build your own
            </Link>
          </div>
        </div>
        <PortfolioPreview form={data} />
      </div>
    </div>
  );
}
