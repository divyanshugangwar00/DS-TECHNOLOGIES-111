import { Link } from 'react-router-dom';
import { useSiteContent } from '../../context/SiteContentContext';
import './Hero.css';

export default function Hero() {
  const { content } = useSiteContent();
  const h = content.home || {};
  const c = content.company || {};

  const title = h.heroTitle || 'Building digital products that power real businesses';
  const subtitle =
    h.heroSubtitle ||
    'DS-TECHNOLOGIES designs and delivers custom software, MERN web apps, data-driven tools and career pathways for students — from Bareilly to clients across India.';

  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="container hero-content">
        <div className="hero-badge">{c.tagline || 'Imagine the future. Make it real.'}</div>
        <h1>
          {title.split('\\n').map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h1>
        <p className="hero-desc">{subtitle}</p>
        <div className="hero-actions">
          <Link to="/contact" className="btn btn-primary">
            {h.ctaSecondary || 'Contact us'}
          </Link>
          <Link to="/careers" className="btn btn-outline">
            {h.ctaPrimary || 'Explore careers'}
          </Link>
          <Link to="/services" className="btn btn-outline">
            Our Services
          </Link>
        </div>
        <div className="hero-stats">
          <div>
            <strong>{h.statsJobs || '1000+'}</strong>
            <span>Open roles / catalogue</span>
          </div>
          <div>
            <strong>{h.statsTeam || '200+'}</strong>
            <span>Team capacity</span>
          </div>
          <div>
            <strong>{h.statsClients || 'Growing'}</strong>
            <span>Clients & partners</span>
          </div>
          <div>
            <strong>1</strong>
            <span>HQ · Bareilly, UP</span>
          </div>
        </div>
      </div>
    </section>
  );
}
