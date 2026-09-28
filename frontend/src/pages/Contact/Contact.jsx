import { useSiteContent } from '../../context/SiteContentContext';
import { useState } from 'react';
import api from '../../services/api';
import ErrorMessage from '../../components/ErrorMessage';

export default function Contact() {
  const { content } = useSiteContent();
  const contactCms = content.contact || {};
  const co = content.company || {};
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', subject: '', message: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/contact', form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send. Please email us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="section page-bg-contact">
        <div className="container" style={{ maxWidth: 500, textAlign: 'center' }}>
          <div className="card" style={{ padding: '3rem' }}>
            <h2>Thank You!</h2>
            <p style={{ color: '#94a3b8', marginTop: '1rem' }}>
              We have received your message and will get back to you shortly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 900 }}>
        <h1 className="section-title">Let’s Connect</h1>
        <p className="section-subtitle">
          Tell us about your project or opportunity. We respond quickly.
        </p>

        <div className="grid-2">
          <form onSubmit={handleSubmit} className="card">
            <ErrorMessage message={error} />
            <div className="form-group">
              <label>Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Company</label>
              <input name="company" value={form.company} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input name="subject" value={form.subject} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Message *</label>
              <textarea name="message" value={form.message} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Office Address</h3>
              <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
                <strong>DS-TECHNOLOGIES</strong><br />
                Village Kuiya Rampur<br />
                Post Kakra Kalan, Faridpur<br />
                Bareilly, Uttar Pradesh – 243503<br />
                India
              </p>
            </div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Direct Contact</h3>
              <p style={{ color: '#cbd5e1', lineHeight: 1.8 }}>
                📱 <a href="tel:+917895733906" style={{ color: '#00d4ff' }}>+91 78957 33906</a><br />
                📱 <a href="tel:+917454910637" style={{ color: '#00d4ff' }}>+91 74549 10637</a><br />
                📧 <a href="mailto:divyanshugangwar950@gmail.com" style={{ color: '#00d4ff' }}>
                  divyanshugangwar950@gmail.com
                </a>
              </p>
            </div>
            <div className="card">
              <h3 style={{ marginBottom: '0.75rem' }}>Founder</h3>
              <p style={{ color: '#cbd5e1' }}>
                Divyanshu Gangwar<br />
                BCA – Invertis University<br />
                Currently pursuing MCA
              </p>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: '2.5rem', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ margin: 0 }}>Find Us on Map</h3>
            <p style={{ color: '#94a3b8', margin: '0.35rem 0 0', fontSize: '0.9rem' }}>
              Village Kuiya Rampur, Faridpur, Bareilly, UP – 243503
            </p>
          </div>
          <div style={{ width: '100%', height: 320, background: '#0f172a' }}>
            <iframe
              title="DS-TECHNOLOGIES Location"
              src="https://www.google.com/maps?q=Faridpur+Bareilly+Uttar+Pradesh&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
