import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminHero from '../../components/AdminHero';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const TYPES = ['Internship', 'Course Completion', 'Experience', 'Training', 'Appreciation'];

export default function AdminCertificateGenerator() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    type: 'Training',
    recipientName: '',
    recipientEmail: '',
    employeeId: '',
    courseOrRole: 'Full Stack Web Development (MERN Stack)',
    startDate: '',
    endDate: '',
    duration: '3 Months',
    issuedOn: new Date().toISOString().slice(0, 10),
    certificateId: `DS-${Date.now().toString(36).toUpperCase()}`,
    signatory: 'Divyanshu Gangwar',
    signatoryTitle: 'Founder & CEO, DS-TECHNOLOGIES',
    skills: 'HTML, CSS, JavaScript, React.js, Node.js, Express.js, MongoDB, Git',
    projectWork: 'Built and deployed real-world modules including portals, dashboards and API integrations under mentorship.',
    performance: 'Demonstrated consistency, problem-solving ability, teamwork and professional communication throughout the program.',
    remarks: 'We wish them success in all future academic and professional endeavours.',
  });

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'hr')) return;
    api.get('/employees').then((r) => setEmployees(r.data || [])).catch(() => {});
  }, [user]);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return <div className="section container"><p>Admin / HR only.</p><Link to="/admin">Back</Link></div>;
  }

  const onEmpSelect = (id) => {
    const e = employees.find((x) => x._id === id || x.employeeId === id);
    setForm((f) => ({
      ...f,
      employeeId: id,
      recipientName: e?.user?.name || e?.name || f.recipientName,
      recipientEmail: e?.user?.email || e?.email || f.recipientEmail,
    }));
  };

  const handlePrint = () => setTimeout(() => window.print(), 250);

  const inp = {
    width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #334155',
    background: '#0b1220', color: '#e2e8f0', marginTop: 4, display: 'block',
  };

  const periodText = (form.startDate || form.endDate)
    ? `from ${form.startDate || '—'} to ${form.endDate || '—'}`
    : (form.duration ? `for a duration of ${form.duration}` : '');

  return (
    <div>
      <AdminHero variant="certificates" showThumbs={false} />
      <div className="container section" style={{ paddingTop: '0.5rem' }}>
        <h1 className="section-title no-print" style={{ fontSize: '1.75rem' }}>Certificate Generator</h1>
        <p className="no-print" style={{ color: '#94a3b8', marginBottom: '1rem' }}>
          Landscape A4 · fill details · Print / Save as PDF
        </p>

        <div className="cert-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 320px) 1fr', gap: '1.25rem' }}>
          <div className="card no-print" style={{ maxHeight: '80vh', overflow: 'auto' }}>
            <h3 style={{ marginTop: 0 }}>Certificate details</h3>
            <label>Type<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={inp}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></label>
            <label style={{ display: 'block', marginTop: 8 }}>Employee
              <select value={form.employeeId} onChange={(e) => onEmpSelect(e.target.value)} style={inp}>
                <option value="">— Manual entry —</option>
                {employees.map((e) => (
                  <option key={e._id || e.employeeId} value={e._id || e.employeeId}>
                    {e.user?.name || e.name} ({e.employeeId || ''})
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: 'block', marginTop: 8 }}>Recipient name *<input style={inp} value={form.recipientName} onChange={(e) => setForm({ ...form, recipientName: e.target.value })} /></label>
            <label style={{ display: 'block', marginTop: 8 }}>Email<input style={inp} value={form.recipientEmail} onChange={(e) => setForm({ ...form, recipientEmail: e.target.value })} /></label>
            <label style={{ display: 'block', marginTop: 8 }}>Program / Course / Role<input style={inp} value={form.courseOrRole} onChange={(e) => setForm({ ...form, courseOrRole: e.target.value })} /></label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
              <label>Start<input type="date" style={inp} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></label>
              <label>End<input type="date" style={inp} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></label>
            </div>
            <label style={{ display: 'block', marginTop: 8 }}>Duration<input style={inp} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></label>
            <label style={{ display: 'block', marginTop: 8 }}>Skills covered<textarea style={{ ...inp, minHeight: 52 }} value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} /></label>
            <label style={{ display: 'block', marginTop: 8 }}>Project / work done<textarea style={{ ...inp, minHeight: 52 }} value={form.projectWork} onChange={(e) => setForm({ ...form, projectWork: e.target.value })} /></label>
            <label style={{ display: 'block', marginTop: 8 }}>Performance note<textarea style={{ ...inp, minHeight: 52 }} value={form.performance} onChange={(e) => setForm({ ...form, performance: e.target.value })} /></label>
            <label style={{ display: 'block', marginTop: 8 }}>Closing wish<textarea style={{ ...inp, minHeight: 44 }} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} /></label>
            <label style={{ display: 'block', marginTop: 8 }}>Issued on<input type="date" style={inp} value={form.issuedOn} onChange={(e) => setForm({ ...form, issuedOn: e.target.value })} /></label>
            <label style={{ display: 'block', marginTop: 8 }}>Certificate ID<input style={inp} value={form.certificateId} onChange={(e) => setForm({ ...form, certificateId: e.target.value })} /></label>
            <label style={{ display: 'block', marginTop: 8 }}>Signatory<input style={inp} value={form.signatory} onChange={(e) => setForm({ ...form, signatory: e.target.value })} /></label>
            <label style={{ display: 'block', marginTop: 8 }}>Signatory title<input style={inp} value={form.signatoryTitle} onChange={(e) => setForm({ ...form, signatoryTitle: e.target.value })} /></label>
            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-primary" onClick={handlePrint}>Print / Save PDF</button>
              <Link to="/admin" className="btn btn-outline">Dashboard</Link>
            </div>
          </div>

          <div id="cert-print" className="ds-cert">
            <div className="ds-cert-inner">
              <div className="ds-cert-ornament" />
              <div className="ds-cert-top">
                <img src="/logo.jpg" alt="DS" className="ds-cert-logo" onError={(e) => { e.target.style.display = 'none'; }} />
                <div>
                  <div className="ds-cert-org">DS-TECHNOLOGIES</div>
                  <div className="ds-cert-addr">Village Kuiya Rampur, Post Kakra Kalan, Faridpur, Bareilly, Uttar Pradesh – 243503, India</div>
                  <div className="ds-cert-addr">Phone: +91 78957 33906 · +91 74549 10637 · Email: divyanshugangwar950@gmail.com</div>
                </div>
              </div>

              <div className="ds-cert-ribbon">CERTIFICATE OF {form.type.toUpperCase()}</div>

              <p className="ds-cert-intro">This is to certify that</p>
              <h1 className="ds-cert-name">{form.recipientName || 'Recipient Name'}</h1>

              <p className="ds-cert-body">
                has successfully completed the <strong>{form.courseOrRole || 'program'}</strong>
                {periodText ? ` ${periodText}` : ''} under the guidance of the technical team at <strong>DS-TECHNOLOGIES</strong>, Bareilly.
              </p>

              {form.skills && (
                <p className="ds-cert-body">
                  <strong>Skills & technologies covered:</strong> {form.skills}
                </p>
              )}
              {form.projectWork && (
                <p className="ds-cert-body">
                  <strong>Practical / project work:</strong> {form.projectWork}
                </p>
              )}
              {form.performance && (
                <p className="ds-cert-body">
                  <strong>Performance:</strong> {form.performance}
                </p>
              )}
              {form.remarks && <p className="ds-cert-note">{form.remarks}</p>}

              <p className="ds-cert-body ds-cert-small">
                This certificate is issued as a formal recognition of the above completion and may be verified with DS-TECHNOLOGIES using the certificate number mentioned below.
              </p>

              <div className="ds-cert-footer">
                <div className="ds-cert-sign-block">
                  <div className="ds-cert-sign-line" />
                  <div className="ds-cert-sign-name">{form.signatory}</div>
                  <div className="ds-cert-sign-role">{form.signatoryTitle}</div>
                  <div className="ds-cert-sign-role">Authorized Signatory</div>
                </div>
                <div className="ds-cert-meta">
                  <div><strong>Certificate No:</strong> {form.certificateId}</div>
                  <div><strong>Date of Issue:</strong> {form.issuedOn}</div>
                  {form.duration && <div><strong>Duration:</strong> {form.duration}</div>}
                  <div>Place: Bareilly, Uttar Pradesh, India</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ds-cert {
          background: #e2e8f0;
          color: #0f172a;
          border-radius: 12px;
          padding: 10px;
          box-shadow: 0 16px 50px rgba(0,0,0,0.35);
        }
        .ds-cert-inner {
          position: relative;
          border: 3px solid #1e3a8a;
          outline: 2px solid #c4b5fd;
          outline-offset: 5px;
          padding: 22px 28px 18px;
          background:
            radial-gradient(circle at 100% 0%, rgba(59,130,246,0.07), transparent 45%),
            radial-gradient(circle at 0% 100%, rgba(124,58,237,0.06), transparent 40%),
            #ffffff;
          min-height: 520px;
        }
        .ds-cert-top { display: flex; align-items: center; gap: 14px; margin-bottom: 6px; }
        .ds-cert-logo { width: 58px; height: 58px; object-fit: contain; border-radius: 8px; }
        .ds-cert-org { font-size: 17px; font-weight: 800; letter-spacing: 0.14em; color: #1e3a8a; }
        .ds-cert-addr { font-size: 10.5px; color: #64748b; line-height: 1.35; }
        .ds-cert-ribbon {
          margin: 12px 0 10px; text-align: center; font-size: 14px; font-weight: 800;
          letter-spacing: 0.2em; color: #fff;
          background: linear-gradient(90deg, #1d4ed8, #7c3aed, #0891b2);
          padding: 9px 14px; border-radius: 6px;
        }
        .ds-cert-intro { text-align: center; color: #475569; margin: 8px 0 2px; font-size: 13px; }
        .ds-cert-name {
          text-align: center; font-family: Georgia, 'Times New Roman', serif;
          font-size: 26px; color: #1e3a8a; margin: 4px 0 10px; font-weight: 700;
          border-bottom: 2px solid #c4b5fd; padding-bottom: 6px;
        }
        .ds-cert-body { text-align: center; color: #334155; line-height: 1.55; margin: 6px auto; font-size: 12.5px; max-width: 92%; }
        .ds-cert-small { font-size: 11px; color: #64748b; margin-top: 10px; }
        .ds-cert-note { text-align: center; font-style: italic; color: #475569; margin: 8px auto; font-size: 12.5px; max-width: 90%; }
        .ds-cert-footer { display: flex; justify-content: space-between; gap: 20px; margin-top: 22px; align-items: flex-end; }
        .ds-cert-sign-line { width: 170px; border-top: 1px solid #64748b; margin-bottom: 5px; }
        .ds-cert-sign-name { font-weight: 700; font-size: 13px; }
        .ds-cert-sign-role { font-size: 10.5px; color: #64748b; }
        .ds-cert-meta { text-align: right; font-size: 11px; color: #475569; line-height: 1.55; }
        @media (max-width: 900px) {
          .cert-layout { grid-template-columns: 1fr !important; }
        }
        @media print {
          body * { visibility: hidden !important; }
          #cert-print, #cert-print * { visibility: visible !important; }
          #cert-print {
            position: absolute; left: 0; top: 0; width: 100%;
            box-shadow: none; background: #fff; padding: 0; border-radius: 0;
          }
          .ds-cert-inner { min-height: auto; outline-offset: 3px; }
          .no-print, .navbar, footer, .admin-hero-banner, .admin-thumb-grid { display: none !important; }
          @page { size: A4 landscape; margin: 10mm; }
        }
      `}</style>
    </div>
  );
}
