import { useEffect, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import api, { API_ORIGIN } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { notifyJobSelected, notifyJobRejected } from '../../utils/notify';
import ErrorMessage from '../../components/ErrorMessage';
import { getOfflineApps, updateOfflineApp, saveOfflineApps } from '../../utils/offlineStore';

const STATUSES = [
  'Under Review',
  'Shortlisted',
  'Interview',
  'Selected',
  'Offer',
  'Document Verification',
  'Joining',
  'Onboarded',
  'Accepted',
  'Rejected',
];

const PIPELINE = [
  'Interview',
  'Selection',
  'Offer',
  'Employee Form',
  'Document Verification',
  'Joining',
  'Employee ID',
  'Onboarding',
  'Completed',
];

const emptySelection = {
  interviewDate: '',
  joiningDate: '',
  reportingManager: '',
  workLocation: 'Bareilly / Hybrid',
  employmentType: 'Full-time',
  departmentSelected: '',
  positionSelected: '',
  offerPackage: '',
  notes: '',
};

export default function AdminApplications() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectionId, setSelectionId] = useState(null);
  const [form, setForm] = useState(emptySelection);
  const [saving, setSaving] = useState(false);

  const fetchApps = () => {
    api
      .get('/applications')
      .then((res) => {
        const data = res.data || [];
        if (data.length) setApps(data);
        else setApps(getOfflineApps());
      })
      .catch(() => {
        setApps(getOfflineApps());
        setError('');
      });
  };

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'hr')) fetchApps();
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      if (status === 'Selected' || status === 'Accepted' || status === 'Offer') {
        const app = apps.find((a) => a._id === id);
        setSelectionId(id);
        setForm({
          ...emptySelection,
          positionSelected: app?.positionSelected || app?.job?.title || '',
          departmentSelected: app?.departmentSelected || app?.job?.department || '',
          workLocation: app?.workLocation || 'Bareilly / Hybrid',
          employmentType: app?.employmentType || 'Full-time',
          interviewDate: app?.interviewDate ? String(app.interviewDate).slice(0, 10) : '',
          joiningDate: app?.joiningDate ? String(app.joiningDate).slice(0, 10) : '',
          reportingManager: app?.reportingManager || '',
          offerPackage: app?.offerPackage || '',
          notes: app?.notes || '',
        });
        return;
      }
      const app = apps.find((a) => a._id === id);
      try {
        await api.put(`/applications/${id}/status`, { status });
      } catch (_) {
        updateOfflineApp(id, { status });
      }
      try {
        const name = app?.name || app?.applicantName || app?.user?.name;
        const phone = app?.phone || app?.mobile || app?.user?.phone;
        const email = app?.email || app?.user?.email;
        const jobTitle = app?.job?.title || app?.jobTitle || 'the applied role';
        if (status === 'Selected' || status === 'Shortlisted' || status === 'Accepted' || status === 'Offer') {
          notifyJobSelected({ name, phone, email, jobTitle });
        } else if (status === 'Rejected') {
          notifyJobRejected({ name, phone, email, jobTitle });
        }
      } catch (_) {}
      fetchApps();
    } catch (err) {
      updateOfflineApp(id, { status });
      fetchApps();
    }
  };

  const submitSelection = async (e) => {
    e.preventDefault();
    if (!selectionId) return;
    setSaving(true);
    setError('');
    const payload = {
      status: 'Selected',
      selectionStatus: 'Selected',
      pipelineStep: 'Selection',
      interviewDate: form.interviewDate || undefined,
      joiningDate: form.joiningDate || undefined,
      reportingManager: form.reportingManager,
      workLocation: form.workLocation,
      employmentType: form.employmentType,
      departmentSelected: form.departmentSelected,
      positionSelected: form.positionSelected,
      offerPackage: form.offerPackage,
      notes: form.notes,
    };
    try {
      await api.put(`/applications/${selectionId}/status`, payload);
    } catch (_) {
      updateOfflineApp(selectionId, payload);
    }
    setSelectionId(null);
    setForm(emptySelection);
    setSaving(false);
    fetchApps();
  };

  const setPipeline = async (id, step) => {
    const statusMap = {
      Interview: 'Interview',
      Selection: 'Selected',
      Offer: 'Offer',
      'Document Verification': 'Document Verification',
      Joining: 'Joining',
      Onboarding: 'Onboarded',
      Completed: 'Onboarded',
    };
    const payload = {
      pipelineStep: step,
      status: statusMap[step] || undefined,
      selectionStatus: step === 'Selection' ? 'Selected' : undefined,
    };
    try {
      await api.put(`/applications/${id}/status`, payload);
    } catch (_) {
      updateOfflineApp(id, payload);
    }
    fetchApps();
  };

  const removeApp = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await api.delete(`/applications/${id}`);
      fetchApps();
    } catch (err) {
      setApps((prev) => prev.filter((a) => a._id !== id));
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container">
        <p>Access denied</p>
      </div>
    );
  }

  const filtered = filter === 'All' ? apps : apps.filter((a) => a.status === filter);

  return (
    <div className="section page-bg-admin">
      <div className="container">
        <h1 className="section-title">📄 Applications & Hiring Pipeline</h1>
        <AdminHero variant="default" />
        <p className="section-subtitle">
          Interview → Selection → Offer → Documents → Joining → Employee ID → Onboarding
        </p>
        <ErrorMessage message={error} />

        {/* Selection Confirmation Modal */}
        {selectionId && (
          <form onSubmit={submitSelection} className="card" style={{ marginBottom: '1.5rem', border: '1px solid rgba(0,212,255,0.35)' }}>
            <h2 style={{ marginTop: 0, color: '#00d4ff' }}>1. Selection Confirmation</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Candidate select hone ke baad ye details save karein.
            </p>
            {(() => {
              const app = apps.find((a) => a._id === selectionId);
              return (
                <p style={{ color: '#cbd5e1' }}>
                  <strong>Candidate:</strong> {app?.name} · {app?.email}
                  <br />
                  <strong>Application ID:</strong> {selectionId}
                </p>
              );
            })()}
            <div className="grid-2">
              <div className="form-group">
                <label>Job Position *</label>
                <input
                  value={form.positionSelected}
                  onChange={(e) => setForm({ ...form, positionSelected: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Department *</label>
                <input
                  value={form.departmentSelected}
                  onChange={(e) => setForm({ ...form, departmentSelected: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Interview Date</label>
                <input
                  type="date"
                  value={form.interviewDate}
                  onChange={(e) => setForm({ ...form, interviewDate: e.target.value })}
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
                <label>Reporting Manager</label>
                <input
                  value={form.reportingManager}
                  onChange={(e) => setForm({ ...form, reportingManager: e.target.value })}
                  placeholder="e.g. Rohit Kumar"
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
                <label>Offer / Package (optional)</label>
                <input
                  value={form.offerPackage}
                  onChange={(e) => setForm({ ...form, offerPackage: e.target.value })}
                  placeholder="₹25,000 / month"
                />
              </div>
            </div>
            <div className="form-group">
              <label>HR Notes</label>
              <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <p style={{ color: '#10b981', fontSize: '0.9rem' }}>Selection Status: <strong>Selected</strong></p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Confirm Selection'}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setSelectionId(null)}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {['All', ...STATUSES].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.15)',
                background: filter === s ? 'rgba(0,212,255,0.2)' : 'transparent',
                color: filter === s ? '#00d4ff' : '#94a3b8',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="card">
            <p>No applications in this filter. Backend + apply form se applications aayengi.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map((app) => (
              <div className="card" key={app._id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <h3 style={{ marginBottom: '0.35rem' }}>{app.name || '—'}</h3>
                    <p style={{ color: '#94a3b8', margin: 0 }}>
                      {app.email}
                      {app.phone ? ` · ${app.phone}` : ''}
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0.25rem 0' }}>
                      Application ID: {app._id}
                    </p>
                    <p style={{ color: '#00d4ff', marginTop: '0.5rem' }}>
                      Job: {app.positionSelected || app.job?.title || '—'}{' '}
                      {(app.departmentSelected || app.job?.department) &&
                        `(${app.departmentSelected || app.job?.department})`}
                    </p>
                    {app.course && (
                      <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Course: {app.course}</p>
                    )}
                    {app.selectionStatus === 'Selected' || app.status === 'Selected' || app.status === 'Accepted' ? (
                      <div
                        style={{
                          marginTop: '0.75rem',
                          padding: '0.75rem',
                          background: 'rgba(16,185,129,0.1)',
                          borderRadius: 8,
                          fontSize: '0.85rem',
                          color: '#cbd5e1',
                        }}
                      >
                        <strong style={{ color: '#10b981' }}>Selection confirmed</strong>
                        <div>Type: {app.employmentType || '—'}</div>
                        <div>Location: {app.workLocation || '—'}</div>
                        <div>Manager: {app.reportingManager || '—'}</div>
                        <div>
                          Joining:{' '}
                          {app.joiningDate ? new Date(app.joiningDate).toLocaleDateString() : '—'}
                        </div>
                        {app.offerPackage && <div>Package: {app.offerPackage}</div>}
                      </div>
                    ) : null}
                    {app.resume && (
                      <a
                        href={app.resume?.startsWith('http') ? app.resume : `${API_ORIGIN}${app.resume || ''}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#00d4ff', fontSize: '0.9rem', display: 'inline-block', marginTop: '0.5rem' }}
                      >
                        📎 Resume
                      </a>
                    )}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                      {app.email && (
                        <a
                          className="btn btn-outline"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                          href={`mailto:${app.email}?subject=DS-TECHNOLOGIES – ${app.status}`}
                        >
                          📧 Email
                        </a>
                      )}
                      {app.phone && (
                        <a
                          className="btn btn-outline"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                          href={`https://wa.me/91${String(app.phone).replace(/\D/g, '').slice(-10)}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          WhatsApp
                        </a>
                      )}
                      {(app.status === 'Selected' || app.status === 'Offer' || app.selectionStatus === 'Selected') && (
                        <Link
                          to={`/admin/offer?id=${app._id}`}
                          className="btn btn-outline"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: '#10b981' }}
                        >
                          Offer Letter
                        </Link>
                      )}
                      {(app.offerAccepted || app.pipelineStep === 'Employee Form' || app.status === 'Document Verification') && (
                        <Link
                          to={`/admin/joining?id=${app._id}`}
                          className="btn btn-outline"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: '#fbbf24' }}
                        >
                          Joining Form
                        </Link>
                      )}
                      <Link
                        to={`/admin/documents-verify?id=${app._id}`}
                        className="btn btn-outline"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: '#a78bfa' }}
                      >
                        Documents
                      </Link>
                      <Link
                        to={`/admin/onboarding?id=${app._id}`}
                        className="btn btn-outline"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: '#34d399' }}
                      >
                        Onboarding
                      </Link>
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', color: '#fca5a5' }}
                        onClick={() => removeApp(app._id)}
                      >
                        Delete
                      </button>
                    </div>
                    {/* Pipeline steps */}
                    <div style={{ marginTop: '0.85rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.35rem' }}>
                        Pipeline: {app.pipelineStep || '—'}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {PIPELINE.map((step) => (
                          <button
                            key={step}
                            type="button"
                            onClick={() => setPipeline(app._id, step)}
                            style={{
                              padding: '0.2rem 0.45rem',
                              fontSize: '0.7rem',
                              borderRadius: 6,
                              border: '1px solid rgba(255,255,255,0.12)',
                              background:
                                app.pipelineStep === step ? 'rgba(0,212,255,0.25)' : 'rgba(255,255,255,0.04)',
                              color: app.pipelineStep === step ? '#00d4ff' : '#94a3b8',
                              cursor: 'pointer',
                            }}
                          >
                            {step}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.3rem 0.7rem',
                        borderRadius: 12,
                        fontSize: '0.8rem',
                        background: 'rgba(0,102,255,0.15)',
                        color: '#00d4ff',
                        marginBottom: '0.75rem',
                      }}
                    >
                      {app.status}
                    </span>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', maxWidth: 300 }}>
                      {STATUSES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => updateStatus(app._id, s)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.72rem',
                            background: app.status === s ? 'rgba(0,102,255,0.3)' : 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 6,
                            color: 'white',
                            cursor: 'pointer',
                          }}
                        >
                          {s === 'Selected' ? '✓ Select' : s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <p style={{ marginTop: '1.5rem' }}>
          <Link to="/admin" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
