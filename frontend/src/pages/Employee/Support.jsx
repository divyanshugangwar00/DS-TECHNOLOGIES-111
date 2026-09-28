import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function EmployeeSupport() {
  const [sent, setSent] = useState(false);
  const [cat, setCat] = useState('HR Help');
  return (
    <div className="section page-bg-admin">
      <div className="container" style={{ maxWidth: 520 }}>
        <h1 className="section-title">🎫 Support</h1>
        <div className="card" style={{ marginBottom: '1rem' }}>
          <p style={{ margin: 0, color: '#cbd5e1' }}><strong>HR Help:</strong> soni@dstechnologies.com</p>
          <p style={{ margin: '0.35rem 0 0', color: '#cbd5e1' }}><strong>Admin:</strong> admin@dstechnologies.com · 7895733906</p>
        </div>
        {sent ? (
          <div className="card"><p style={{ color: '#10b981' }}>Ticket submitted ({cat}). Team will respond via email / WhatsApp.</p></div>
        ) : (
          <form className="card" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <div className="form-group">
              <label>Category</label>
              <select value={cat} onChange={(e) => setCat(e.target.value)} style={{ background: '#0f172a', color: '#e2e8f0' }}>
                <option>HR Help</option>
                <option>IT Support</option>
                <option>Salary Problem</option>
                <option>Leave Problem</option>
                <option>Raise Complaint</option>
                <option>Contact Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea rows={4} required placeholder="Describe your issue…" />
            </div>
            <button type="submit" className="btn btn-primary">Submit Ticket</button>
          </form>
        )}
        <p style={{ marginTop: '1rem' }}><Link to="/employee" style={{ color: '#00d4ff' }}>← Dashboard</Link></p>
      </div>
    </div>
  );
}
