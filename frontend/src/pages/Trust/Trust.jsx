import { Link } from 'react-router-dom';

export default function Trust() {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 className="section-title">Trust & company sections</h1>
        <p className="section-subtitle">
          Real credentials only — no fabricated client logos or awards. As the company grows, replace placeholders with verified items.
        </p>
        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3 style={{ color: '#38bdf8' }}>435–445 · What we show today</h3>
          <ul style={{ color: '#cbd5e1', lineHeight: 1.85 }}>
            <li><strong>Certifications (founder/team learning):</strong> IBM Python 101, IBM SQL 101, Power BI (Invertis), CodeAlpha Frontend Internship</li>
            <li><strong>Projects:</strong> Spam Email Detection, Stock Market Prediction, Job Portal (MERN)</li>
            <li><strong>HQ:</strong> Village Kuiya Rampur, Bareilly, UP · Phone 7895733906</li>
            <li><strong>Team:</strong> Listed on About → Leadership (real names only)</li>
            <li><strong>Statistics:</strong> Catalogue / capacity figures on Home are directional, not audited claims</li>
          </ul>
        </div>
        <div className="card">
          <h3 style={{ color: '#38bdf8' }}>Testimonials / partners</h3>
          <p style={{ color: '#94a3b8' }}>
            Client logos and paid testimonials will be added only after written permission. Until then this section stays honest and empty of fake brands.
          </p>
          <Link to="/about" className="btn btn-primary">About & leadership</Link>{' '}
          <Link to="/portfolio" className="btn btn-outline">Portfolio / projects</Link>
        </div>
      </div>
    </div>
  );
}
