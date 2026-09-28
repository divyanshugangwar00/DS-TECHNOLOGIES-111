import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const KEY = 'ds_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch (_) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try { localStorage.setItem(KEY, 'accepted'); } catch (_) {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: 'rgba(17, 24, 39, 0.97)', borderTop: '1px solid rgba(255,255,255,0.1)',
      padding: '1rem 1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem',
      alignItems: 'center', justifyContent: 'space-between', backdropFilter: 'blur(8px)'
    }}>
      <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0, maxWidth: 720, lineHeight: 1.5 }}>
        We use cookies and similar technologies to improve your experience and analyse site usage.
        By continuing you agree to our{' '}
        <Link to="/legal/cookies" style={{ color: '#60a5fa' }}>Cookie Policy</Link>
        {' '}and{' '}
        <Link to="/legal/privacy" style={{ color: '#60a5fa' }}>Privacy Policy</Link>.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
        <Link to="/legal/cookies" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          Learn more
        </Link>
        <button onClick={accept} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
          Accept
        </button>
      </div>
    </div>
  );
}
