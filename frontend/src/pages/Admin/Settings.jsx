import { useState, useEffect } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DEFAULT = {
  companyName: 'DS-TECHNOLOGIES',
  address: 'Village Kuiya Rampur, Post Kakra Kalan, Faridpur, Bareilly, UP – 243503',
  phone1: '7895733906',
  phone2: '7454910637',
  email: 'divyanshugangwar950@gmail.com',
  linkedin: 'https://www.linkedin.com/in/divyanshu-gangwar-0b4982274',
  instagram: 'https://www.instagram.com/divyanshu_gangwar_',
  whatsapp: 'https://wa.me/qr/M32HXMK4XY45A1',
  websiteTitle: 'DS-TECHNOLOGIES | Digital Solutions',
};

export default function AdminSettings() {
  const { user } = useAuth();
  const [form, setForm] = useState(DEFAULT);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ds_settings');
      if (raw) setForm({ ...DEFAULT, ...JSON.parse(raw) });
    } catch (_) {}
  }, []);

  if (!user || user.role !== 'admin') {
    return (
      <div className="section container">
        <p>Only Super Admin / Founder can change Settings.</p>
        <Link to="/admin">← Dashboard</Link>
      </div>
    );
  }

  const save = (e) => {
    e.preventDefault();
    localStorage.setItem('ds_settings', JSON.stringify(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="section page-bg-admin">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 className="section-title">Settings</h1>
        <AdminHero variant="default" />
        <p className="section-subtitle">Company & social links (saved in browser for now)</p>
        {saved && <p style={{ color: '#10b981' }}>Saved successfully</p>}
        <form onSubmit={save} className="card">
          <div className="form-group">
            <label>Company Name</label>
            <input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label>Phone 1</label>
              <input value={form.phone1} onChange={(e) => setForm({ ...form, phone1: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Phone 2</label>
              <input value={form.phone2} onChange={(e) => setForm({ ...form, phone2: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label>LinkedIn</label>
            <input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Instagram</label>
            <input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
          </div>
          <div className="form-group">
            <label>WhatsApp Link</label>
            <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Website Title</label>
            <input value={form.websiteTitle} onChange={(e) => setForm({ ...form, websiteTitle: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary">Save Settings</button>
        </form>
        <p style={{ marginTop: '1rem' }}><Link to="/admin" style={{ color: '#00d4ff' }}>← Dashboard</Link></p>
      </div>
    </div>
  );
}
