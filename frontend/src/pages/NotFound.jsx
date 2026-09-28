import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '4rem 1.5rem'
    }}>
      <div>
        <div style={{
          fontSize: '6rem', fontWeight: 800, lineHeight: 1,
          background: 'linear-gradient(135deg, #0066ff, #00d4ff)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
        }}>404</div>
        <h1 style={{ fontSize: '1.75rem', margin: '1rem 0 0.5rem' }}>Page not found</h1>
        <p style={{ color: '#94a3b8', maxWidth: 420, margin: '0 auto 2rem' }}>
          The page you are looking for does not exist or has been moved. Let’s get you back on track.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">Go Home</Link>
          <Link to="/contact" className="btn btn-outline">Contact Us</Link>
          <Link to="/services" className="btn btn-outline">Services</Link>
        </div>
      </div>
    </div>
  );
}
