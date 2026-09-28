import { Link } from 'react-router-dom';
import { useSiteContent } from '../../context/SiteContentContext';
import './Footer.css';

export default function Footer() {
  const { content } = useSiteContent();
  const co = content.company || {};
  const foot = content.footer || {};
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/logo.jpg" alt="DS-TECHNOLOGIES" />
            <span>{co.name || "DS-TECHNOLOGIES"}</span>
          </div>
          <p>
            Empowering businesses with modern technology solutions in software development,
            cloud, AI and digital transformation — from Bareilly to the world.
          </p>
          <div className="footer-social" style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <a href="https://www.linkedin.com/in/divyanshu-gangwar-0b4982274" target="_blank" rel="noreferrer" title="LinkedIn" style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,119,181,0.2)', border: '1px solid #0077b5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0a66c2', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>in</a>
            <a href="https://www.instagram.com/divyanshu_gangwar_" target="_blank" rel="noreferrer" title="Instagram" style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(225,48,108,0.15)', border: '1px solid #e1306c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e1306c', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>IG</a>
            <a href="https://wa.me/qr/M32HXMK4XY45A1" target="_blank" rel="noreferrer" title="WhatsApp" style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(37,211,102,0.15)', border: '1px solid #25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25d366', fontWeight: 700, fontSize: '0.75rem', textDecoration: 'none' }}>WA</a>
            <a href="mailto:divyanshugangwar950@gmail.com" title="Email" style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,212,255,0.15)', border: '1px solid #00d4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00d4ff', fontWeight: 700, fontSize: '0.75rem', textDecoration: 'none' }}>@</a>
            <a href="tel:+917895733906" title="Call" style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontWeight: 700, fontSize: '0.75rem', textDecoration: 'none' }}>☎</a>
          </div>
        </div>

        <div>
          <h4>Services</h4>
          <ul>
            <li><Link to="/services">Software Development</Link></li>
            <li><Link to="/services">Cloud Solutions</Link></li>
            <li><Link to="/services">AI & Data</Link></li>
            <li><Link to="/services">Cybersecurity</Link></li>
          </ul>
        </div>

        <div>
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">Who We Are</Link></li>
            <li><Link to="/team">Our Team</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/testimonials">Testimonials</Link></li>
            <li><Link to="/case-studies">Case Studies</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/insights">Insights</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul>
            <li>Village Kuiya Rampur</li>
            <li>Post Kakra Kalan, Faridpur</li>
            <li>Bareilly, UP – 243503</li>
            <li><a href="tel:+917895733906">+91 78957 33906</a></li>
            <li><a href="tel:+917454910637">+91 74549 10637</a></li>
            <li><a href="mailto:divyanshugangwar950@gmail.com">divyanshugangwar950@gmail.com</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} DS-TECHNOLOGIES. All rights reserved. | Founded by Divyanshu Gangwar</p>
        </div>
      </div>
      <div className="container" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '1rem 0', marginTop: '1rem', color: '#64748b', fontSize: '0.85rem', textAlign: 'center' }}>
        {foot.note || '© DS-TECHNOLOGIES'}
        {' · '}
        {co.phone1} · {co.email}
      </div>
      <div style={{ textAlign: 'center', padding: '0.75rem', fontSize: '0.8rem', color: '#64748b' }}>
    <Link to="/legal/privacy" style={{ color: '#94a3b8', margin: '0 8px' }}>Privacy</Link>
    <Link to="/legal/terms" style={{ color: '#94a3b8', margin: '0 8px' }}>Terms</Link>
    <Link to="/legal/cookies" style={{ color: '#94a3b8', margin: '0 8px' }}>Cookies</Link>
    <Link to="/trust" style={{ color: '#94a3b8', margin: '0 8px' }}>Trust</Link>
    <Link to="/faq" style={{ color: '#94a3b8', margin: '0 8px' }}>FAQ</Link>
    <Link to="/pricing" style={{ color: '#94a3b8', margin: '0 8px' }}>Pricing</Link>
  </div>
</footer>
  );
}
