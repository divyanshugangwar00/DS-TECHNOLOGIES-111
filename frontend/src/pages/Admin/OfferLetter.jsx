import { useEffect, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { getOfflineApps, updateOfflineApp } from '../../utils/offlineStore';

function displayName(a) {
  if (!a) return '—';
  const n = (a.name || '').trim();
  if (n && n.length > 1) return n;
  const jf = a.joiningForm || {};
  const fromForm = [jf.firstName, jf.middleName, jf.lastName].filter(Boolean).join(' ').trim();
  if (fromForm) return fromForm;
  if (a.email) return String(a.email).split('@')[0].replace(/[._]/g, ' ');
  return n || 'Candidate';
}

const emptyForm = {
  candidateName: '',
  candidateEmail: '',
  candidatePhone: '',
  positionSelected: '',
  departmentSelected: '',
  ctc: '',
  offerPackage: '',
  joiningDate: '',
  workLocation: 'Bareilly / Hybrid / Remote',
  workingHours: '9:30 AM – 6:30 PM',
  probationPeriod: '3 months',
  noticePeriod: '30 days',
  employmentType: 'Full-time',
  reportingManager: '',
  education: '',
  experienceType: 'Fresher',
  experienceYears: '',
  aadhaar: '',
  pan: '',
  address: '',
};

export default function AdminOfferLetter() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const appId = params.get('id');
  const [app, setApp] = useState(null);
  const [list, setList] = useState([]);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [form, setForm] = useState(emptyForm);

  const applyApp = (found) => {
    if (!found) return;
    setApp(found);
    const n = (found.name || '').trim();
    const safeName =
      n && n.length > 1
        ? n
        : found.email
          ? String(found.email).split('@')[0].replace(/[._]/g, ' ')
          : n;
    setForm({
      ...emptyForm,
      candidateName: safeName,
      candidateEmail: found.email || '',
      candidatePhone: found.phone || '',
      positionSelected: found.positionSelected || found.job?.title || '',
      departmentSelected: found.departmentSelected || found.job?.department || '',
      ctc: found.ctc || found.offerPackage || '',
      offerPackage: found.offerPackage || found.ctc || '',
      joiningDate: found.joiningDate ? String(found.joiningDate).slice(0, 10) : '',
      workLocation: found.workLocation || 'Bareilly / Hybrid / Remote',
      workingHours: found.workingHours || '9:30 AM – 6:30 PM',
      probationPeriod: found.probationPeriod || '3 months',
      noticePeriod: found.noticePeriod || '30 days',
      employmentType: found.employmentType || 'Full-time',
      reportingManager: found.reportingManager || '',
      education: found.course || found.joiningForm?.educationRecords?.[0]?.qualification || '',
      experienceType: found.joiningForm?.isFresher ? 'Fresher' : 'Experienced',
      experienceYears: found.experience || '',
      address: found.joiningForm?.currentAddress || '',
    });
  };

  const load = () => {
    api
      .get('/applications')
      .then((res) => {
        const data = res.data?.length ? res.data : getOfflineApps();
        setList(Array.isArray(data) ? data : []);
        if (appId) applyApp((data || []).find((a) => a._id === appId));
      })
      .catch(() => {
        const data = getOfflineApps();
        setList(Array.isArray(data) ? data : []);
        if (appId) applyApp((data || []).find((a) => a._id === appId));
      });
  };

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'hr')) load();
  }, [user, appId]);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container">
        <p>Access denied — Admin / HR only</p>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    );
  }

  const saveOffer = async (e) => {
    e.preventDefault();
    if (!app) return;
    setError('');
    setMsg('');
    const payload = {
      status: 'Offer',
      pipelineStep: 'Offer',
      selectionStatus: 'Selected',
      ...form,
      offerPackage: form.ctc || form.offerPackage,
      ctc: form.ctc || form.offerPackage,
    };
    try {
      const { data } = await api.put(`/applications/${app._id}/status`, payload);
      setApp(data);
    } catch (_) {
      const data = updateOfflineApp(app._id, payload);
      setApp(data);
    }
    setMsg('Offer letter details saved');
    load();
  };

  const respond = async (accept) => {
    if (!app) return;
    const payload = {
      offerAccepted: accept,
      offerRejected: !accept,
      status: accept ? 'Document Verification' : 'Rejected',
      pipelineStep: accept ? 'Employee Form' : '',
    };
    try {
      const { data } = await api.put(`/applications/${app._id}/status`, payload);
      setApp(data);
    } catch (_) {
      updateOfflineApp(app._id, payload);
    }
    setMsg(accept ? 'Offer accepted → Joining / Documents next' : 'Offer rejected');
    load();
  };

  const selectedApps = list.filter(
    (a) =>
      ['Selected', 'Accepted', 'Offer', 'Document Verification', 'Joining', 'Onboarded'].includes(a.status) ||
      a.selectionStatus === 'Selected' ||
      a.offerAccepted
  );

  const filteredList = list.filter(
    (a) => deptFilter === 'All' || a.job?.department === deptFilter || a.departmentSelected === deptFilter
  );
  const filteredSelected = selectedApps.filter(
    (a) => deptFilter === 'All' || a.job?.department === deptFilter || a.departmentSelected === deptFilter
  );

  const printOffer = () => window.print();

  return (
    <div className="section page-bg-offer">
      <div className="container">
        <h1 className="section-title">2. Offer Letter</h1>
        <AdminHero variant="default" />
        <p className="section-subtitle">
          Selected candidates · Generate offer · Print/PDF · Accept / Reject → next step
        </p>
        {error && <p style={{ color: '#fca5a5' }}>{error}</p>}
        {msg && <p style={{ color: '#10b981' }}>{msg}</p>}

        {!appId && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3>Select candidate</h3>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              style={{
                marginBottom: '0.75rem',
                padding: '0.4rem 0.75rem',
                background: '#0f172a',
                color: '#e2e8f0',
                borderRadius: 8,
              }}
            >
              <option value="All">All Departments</option>
              {['Engineering', 'HR', 'Operations', 'Sales', 'Finance', 'Technology', 'Marketing', 'Leadership'].map(
                (d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                )
              )}
            </select>

            {list.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>
                No applications yet. Careers se apply karein, phir Applications me status “Selected” karein.
              </p>
            ) : filteredSelected.length === 0 ? (
              <div>
                <p style={{ color: '#fbbf24' }}>
                  Selected / Offer candidates nahi mile. Neeche all applications — Applications se Selected mark
                  karein ya seedha offer form kholo.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {filteredList.slice(0, 40).map((a) => (
                    <li
                      key={a._id}
                      style={{
                        padding: '0.5rem 0',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        fontSize: '0.9rem',
                      }}
                    >
                      <span style={{ color: '#e2e8f0' }}>{displayName(a)}</span>
                      <span style={{ color: '#94a3b8' }}> · {a.email} · </span>
                      <span style={{ color: '#00d4ff' }}>{a.status}</span>
                      {' · '}
                      <Link to="/admin/applications" style={{ color: '#38bdf8' }}>
                        Applications
                      </Link>
                      {' · '}
                      <Link to={`/admin/offer?id=${a._id}`} style={{ color: '#34d399' }}>
                        Open offer
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {filteredSelected.map((a) => (
                  <li
                    key={a._id}
                    style={{ padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <Link to={`/admin/offer?id=${a._id}`} style={{ color: '#00d4ff' }}>
                      {displayName(a)} — {a.positionSelected || a.job?.title || 'Role'} ({a.status})
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {app && (
          <>
            <p style={{ marginBottom: '1rem' }}>
              Candidate:{' '}
              <strong style={{ color: '#e2e8f0' }}>{displayName(app)}</strong> · {app.email} ·{' '}
              <Link to="/admin/offer" style={{ color: '#00d4ff' }}>
                ← All candidates
              </Link>
            </p>

            <form onSubmit={saveOffer} className="card" style={{ marginBottom: '1.5rem' }}>
              <h3>Offer details</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label>Candidate Name *</label>
                  <input
                    value={form.candidateName}
                    onChange={(e) => setForm({ ...form, candidateName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    value={form.candidateEmail}
                    onChange={(e) => setForm({ ...form, candidateEmail: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Position / Designation *</label>
                  <input
                    value={form.positionSelected}
                    onChange={(e) => setForm({ ...form, positionSelected: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    value={form.departmentSelected}
                    onChange={(e) => setForm({ ...form, departmentSelected: e.target.value })}
                    required
                    style={{ background: '#0f172a', color: '#e2e8f0' }}
                  >
                    <option value="">Select</option>
                    {['Engineering', 'HR', 'Operations', 'Sales', 'Finance', 'Technology', 'Marketing', 'Leadership'].map(
                      (d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label>CTC / Monthly (₹)</label>
                  <input
                    value={form.ctc}
                    onChange={(e) => setForm({ ...form, ctc: e.target.value })}
                    placeholder="e.g. 25000"
                  />
                </div>
                <div className="form-group">
                  <label>Joining Date</label>
                  <input
                    type="date"
                    value={form.joiningDate}
                    onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Work Location</label>
                  <input
                    value={form.workLocation}
                    onChange={(e) => setForm({ ...form, workLocation: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Working Hours</label>
                  <input
                    value={form.workingHours}
                    onChange={(e) => setForm({ ...form, workingHours: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Probation Period</label>
                  <input
                    value={form.probationPeriod}
                    onChange={(e) => setForm({ ...form, probationPeriod: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Notice Period</label>
                  <input
                    value={form.noticePeriod}
                    onChange={(e) => setForm({ ...form, noticePeriod: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Employment Type</label>
                  <select
                    value={form.employmentType}
                    onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
                    style={{ background: '#0f172a', color: '#e2e8f0' }}
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Internship</option>
                    <option>Contract</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Reporting Manager</label>
                  <input
                    value={form.reportingManager}
                    onChange={(e) => setForm({ ...form, reportingManager: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                Save Offer Details
              </button>
            </form>

            <div
              id="offer-letter-print"
              className="card"
              style={{ background: '#fff', color: '#0f172a', maxWidth: 720, margin: '0 auto 1.5rem' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  borderBottom: '2px solid #0369a1',
                  paddingBottom: '1rem',
                  marginBottom: '1.25rem',
                }}
              >
                <img src="/logo.jpg" alt="DS-TECHNOLOGIES" style={{ width: 56, height: 56, objectFit: 'contain' }} />
                <div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0369a1' }}>DS-TECHNOLOGIES</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Village Kuiya Rampur, Faridpur, Bareilly, UP 243503 · 7895733906
                  </div>
                </div>
              </div>
              <h2 style={{ textAlign: 'center', color: '#0f172a' }}>OFFER OF EMPLOYMENT</h2>
              <p>
                Dear <strong>{form.candidateName || displayName(app)}</strong>,
              </p>
              <p>
                We are pleased to offer you the position of <strong>{form.positionSelected || '—'}</strong> in the{' '}
                <strong>{form.departmentSelected || '—'}</strong> department at <strong>DS-TECHNOLOGIES</strong>.
              </p>
              <table style={{ width: '100%', fontSize: '0.95rem', margin: '1rem 0' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '0.35rem 0' }}>Candidate Name</td>
                    <td>{form.candidateName || displayName(app)}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.35rem 0' }}>Designation</td>
                    <td>{form.positionSelected}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.35rem 0' }}>Department</td>
                    <td>{form.departmentSelected}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.35rem 0' }}>CTC / Salary</td>
                    <td>{form.ctc ? `₹${form.ctc}` : '—'}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.35rem 0' }}>Joining Date</td>
                    <td>{form.joiningDate || '—'}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.35rem 0' }}>Location</td>
                    <td>{form.workLocation}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.35rem 0' }}>Employment Type</td>
                    <td>{form.employmentType}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.35rem 0' }}>Probation / Notice</td>
                    <td>
                      {form.probationPeriod} / {form.noticePeriod}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p style={{ fontSize: '0.9rem', color: '#475569' }}>
                Please confirm acceptance of this offer. On acceptance, complete joining form and document verification.
              </p>
              <p style={{ marginTop: '2rem' }}>
                Regards,
                <br />
                <strong>HR · DS-TECHNOLOGIES</strong>
              </p>
            </div>

            <div className="no-print" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <button type="button" className="btn btn-primary" onClick={printOffer}>
                Print / PDF
              </button>
              <button type="button" className="btn btn-primary" onClick={() => respond(true)}>
                Accept Offer
              </button>
              <button type="button" className="btn btn-outline" onClick={() => respond(false)}>
                Reject Offer
              </button>
              <Link to={`/admin/joining?id=${app._id}`} className="btn btn-outline">
                Joining Form →
              </Link>
            </div>
          </>
        )}

        <p>
          <Link to="/admin" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
