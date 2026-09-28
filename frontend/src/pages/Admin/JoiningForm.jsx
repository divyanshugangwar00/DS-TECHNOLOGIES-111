import { useEffect, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { getOfflineApps, updateOfflineApp } from '../../utils/offlineStore';

const emptyPersonal = {
  firstName: '',
  middleName: '',
  lastName: '',
  parentName: '',
  dateOfBirth: '',
  gender: '',
  bloodGroup: '',
  maritalStatus: '',
  nationality: 'Indian',
  profilePhoto: '',
  mobile: '',
  alternateMobile: '',
  personalEmail: '',
  currentAddress: '',
  permanentAddress: '',
  city: 'Bareilly',
  state: 'Uttar Pradesh',
  pinCode: '243503',
  emergencyContactName: '',
  emergencyContactNumber: '',
  emergencyContactRelation: '',
};

const emptyEdu = { qualification: '', institute: '', boardUniversity: '', passingYear: '', percentageCgpa: '' };
const emptyJob = {
  company: '',
  designation: '',
  department: '',
  joiningDate: '',
  leavingDate: '',
  lastSalary: '',
  experience: '',
  reasonForLeaving: '',
  previousEmployeeId: '',
  experienceLetter: '',
};

export default function AdminJoiningForm() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const appId = params.get('id');
  const [step, setStep] = useState(1);
  const [app, setApp] = useState(null);
  const [list, setList] = useState([]);
  const [form, setForm] = useState(emptyPersonal);
  const [education, setEducation] = useState([{ ...emptyEdu }]);
  const [isFresher, setIsFresher] = useState(false);
  const [prevJobs, setPrevJobs] = useState([{ ...emptyJob }]);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    const applyFound = (found) => {
      if (!found) return;
      setApp(found);
      const jf = found.joiningForm || {};
      let rawName = (found.name || '').trim();
      if ((!rawName || rawName.length <= 1) && found.email) {
        rawName = String(found.email).split('@')[0].replace(/[._0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
      }
      const nameParts = rawName.split(/\s+/).filter(Boolean);
      setForm({
        ...emptyPersonal,
        firstName: jf.firstName || nameParts[0] || '',
        middleName: jf.middleName || (nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : ''),
        lastName: jf.lastName || (nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''),
        parentName: jf.parentName || '',
        dateOfBirth: jf.dateOfBirth ? String(jf.dateOfBirth).slice(0, 10) : '',
        gender: jf.gender || '',
        bloodGroup: jf.bloodGroup || '',
        maritalStatus: jf.maritalStatus || '',
        nationality: jf.nationality || 'Indian',
        profilePhoto: jf.profilePhoto || '',
        mobile: jf.mobile || found.phone || '',
        alternateMobile: jf.alternateMobile || '',
        personalEmail: jf.personalEmail || found.email || '',
        currentAddress: jf.currentAddress || '',
        permanentAddress: jf.permanentAddress || '',
        city: jf.city || 'Bareilly',
        state: jf.state || 'Uttar Pradesh',
        pinCode: jf.pinCode || '243503',
        emergencyContactName: jf.emergencyContactName || '',
        emergencyContactNumber: jf.emergencyContactNumber || '',
        emergencyContactRelation: jf.emergencyContactRelation || '',
      });
      if (jf.educationRecords?.length) setEducation(jf.educationRecords.map((e) => ({ ...emptyEdu, ...e })));
      setIsFresher(!!jf.isFresher);
      if (jf.previousEmployment?.length) setPrevJobs(jf.previousEmployment.map((j) => ({ ...emptyJob, ...j })));
      if (jf.formStepCompleted >= 1) setStep(Math.min((jf.formStepCompleted || 0) + 1, 4));
    };

    api
      .get('/applications')
      .then((res) => {
        const data = res.data?.length ? res.data : getOfflineApps();
        setList(data);
        if (appId) applyFound(data.find((a) => a._id === appId));
      })
      .catch(() => {
        const data = getOfflineApps();
        setList(data);
        if (appId) applyFound(data.find((a) => a._id === appId));
        setError('');
      });
  };

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'hr')) load();
  }, [user, appId]);

    const displayName = (a) => {
    if (!a) return '—';
    const n = (a.name || '').trim();
    if (n && n.length > 1) return n;
    const jf = a.joiningForm || {};
    const fromForm = [jf.firstName, jf.middleName, jf.lastName].filter(Boolean).join(' ').trim();
    if (fromForm) return fromForm;
    if (a.email) return String(a.email).split('@')[0].replace(/[._]/g, ' ');
    return n || 'Candidate';
  };

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container page-bg-joining">
        <p>Access denied — Admin / HR only</p>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    );
  }

  const downloadJoiningPdf = () => {
    if (!app) return;
    const w = window.open('', '_blank');
    if (!w) return;
    const f = form || {};
    w.document.write(`<!DOCTYPE html><html><head><title>Joining Form - ${displayName(app)}</title>
      <style>body{font-family:system-ui;padding:28px;max-width:720px;margin:auto;color:#0f172a}
      h1,h2{color:#0369a1} table{width:100%;border-collapse:collapse;font-size:13px}
      td{padding:6px;border-bottom:1px solid #e2e8f0;vertical-align:top}
      .sig{display:flex;justify-content:space-between;margin-top:40px;font-size:12px;color:#64748b}
      .sig div{width:140px;text-align:center;border-top:1px solid #94a3b8;padding-top:6px}</style></head><body>
      <div style="display:flex;gap:12px;align-items:center;border-bottom:2px solid #0369a1;padding-bottom:12px">
        <img src="${window.location.origin}/logo.jpg" width="56" onerror="this.style.display='none'"/>
        <div><strong style="color:#0369a1;font-size:18px">DS-TECHNOLOGIES</strong><br/>
        <span style="font-size:12px;color:#64748b">Village Kuiya Rampur, Post Kakra Kalan, Faridpur, Bareilly, UP 243503<br/>7895733906 · divyanshugangwar950@gmail.com</span></div>
      </div>
      <h1>Employee Joining Form</h1>
      <p>Candidate: <strong>${app.name || ''}</strong> · ${app.email || ''}</p>
      <h2>Personal</h2>
      <table>
        <tr><td>Name</td><td>${f.firstName || ''} ${f.middleName || ''} ${f.lastName || ''}</td></tr>
        <tr><td>Father/Mother</td><td>${f.fatherName || ''}</td></tr>
        <tr><td>DOB / Gender</td><td>${f.dob || ''} / ${f.gender || ''}</td></tr>
        <tr><td>Blood / Marital</td><td>${f.bloodGroup || ''} / ${f.maritalStatus || ''}</td></tr>
      </table>
      <h2>Contact</h2>
      <table>
        <tr><td>Mobile</td><td>${f.mobile || app.phone || ''}</td></tr>
        <tr><td>Email</td><td>${f.personalEmail || app.email || ''}</td></tr>
        <tr><td>Address</td><td>${f.currentAddress || ''}</td></tr>
        <tr><td>City / State / PIN</td><td>${f.city || ''} / ${f.state || ''} / ${f.pin || ''}</td></tr>
        <tr><td>Emergency</td><td>${f.emergencyName || ''} · ${f.emergencyPhone || ''}</td></tr>
      </table>
      <h2>Education / Employment</h2>
      <p>Fresher: ${f.isFresher ? 'Yes' : 'No'}</p>
      <div class="sig"><div>Employee</div><div>HR Manager</div><div>CEO / Authorized</div></div>
      <script>window.onload=function(){window.print()}<\/script>
      </body></html>`);
    w.document.close();
  };

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const buildJoiningPayload = (completedStep) => ({
    ...form,
    formStepCompleted: completedStep,
    dateOfBirth: form.dateOfBirth || undefined,
    educationRecords: education.filter((e) => e.qualification || e.institute),
    isFresher,
    previousEmployment: isFresher ? [] : prevJobs.filter((j) => j.company || j.designation),
  });

  const saveStep = async (completedStep, nextStep) => {
    if (!app) return;
    setSaving(true);
    setError('');
    setMsg('');
    const pipeline =
      completedStep >= 4
        ? 'Document Verification'
        : completedStep >= 2
          ? 'Employee Form'
          : app.pipelineStep || 'Employee Form';
    const status = completedStep >= 4 ? 'Document Verification' : app.status;
    const payload = {
      joiningForm: buildJoiningPayload(completedStep),
      pipelineStep: pipeline,
      status,
    };
    try {
      await api.put(`/applications/${app._id}/status`, payload);
    } catch (_) {
      updateOfflineApp(app._id, {
        ...payload,
        joiningForm: { ...(app.joiningForm || {}), ...payload.joiningForm },
      });
    }
    setMsg(
      completedStep >= 4
        ? 'All joining steps saved (offline OK). Next: Document Verification'
        : `Step ${completedStep} saved`
    );
    if (nextStep) setStep(nextStep);
    setSaving(false);
    load();
  };

  const eligible = list.filter(
    (a) =>
      a.offerAccepted ||
      ['Offer', 'Selected', 'Document Verification', 'Joining', 'Onboarded'].includes(a.status) ||
      ['Offer', 'Employee Form', 'Document Verification', 'Joining'].includes(a.pipelineStep)
  );

  const steps = [
    [1, 'Personal'],
    [2, 'Contact'],
    [3, 'Education'],
    [4, 'Employment'],
  ];

  return (
    <div className="section page-bg-joining">
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 className="section-title">3. Employee Joining Form</h1>
        <AdminHero variant="default" />
        <p className="section-subtitle">Multi-step · Personal → Contact → Education → Employment</p>

        {error && <p style={{ color: '#fca5a5' }}>{error}</p>}
        {msg && <p style={{ color: '#10b981' }}>{msg}</p>}

        {!appId && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3>Select candidate</h3>
            {list.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>No applications yet. Careers page se apply karein.</p>
            ) : eligible.length === 0 ? (
              <div>
                <p style={{ color: '#fbbf24', marginBottom: '0.5rem' }}>Eligible nahi — Offer Accept / Selected status chahiye.</p>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>All applications ({list.length}):</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {list.slice(0, 20).map((a) => (
                    <li key={a._id} style={{ padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.85rem', color: '#94a3b8' }}>
                      {displayName(a)} · {a.email} · <span style={{ color: '#00d4ff' }}>{a.status}</span>
                      {' · '}
                      <Link to="/admin/applications" style={{ color: '#38bdf8' }}>Applications</Link>
                      {' / '}
                      <Link to="/admin/offer" style={{ color: '#38bdf8' }}>Offer</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {eligible.map((a) => (
                  <li key={a._id} style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <Link to={`/admin/joining?id=${a._id}`} style={{ color: '#00d4ff' }}>
                      {displayName(a)} — {a.status}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {app && (
          <>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {steps.map(([n, label]) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setStep(n)}
                  style={{
                    padding: '0.45rem 0.9rem',
                    borderRadius: 8,
                    border: step === n ? '1px solid #00d4ff' : '1px solid rgba(255,255,255,0.15)',
                    background: step === n ? 'rgba(0,212,255,0.2)' : 'transparent',
                    color: step === n ? '#00d4ff' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  Step {n}: {label}
                </button>
              ))}
            </div>

            <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
              Candidate: <strong style={{ color: '#e2e8f0' }}>{displayName(app)}</strong> · {app.email}
            </p>

            {step === 1 && (
              <div className="card">
                <h2 style={{ marginTop: 0, color: '#00d4ff' }}>Step 1 — Personal Information</h2>
                <div className="grid-2">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Middle Name</label>
                    <input value={form.middleName} onChange={(e) => set('middleName', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Father&apos;s / Mother&apos;s Name</label>
                    <input value={form.parentName} onChange={(e) => set('parentName', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input type="date" value={form.dateOfBirth} onChange={(e) => set('dateOfBirth', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select value={form.gender} onChange={(e) => set('gender', e.target.value)} style={{ background: '#0f172a', color: '#e2e8f0' }}>
                      <option value="">—</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Blood Group</label>
                    <select value={form.bloodGroup} onChange={(e) => set('bloodGroup', e.target.value)} style={{ background: '#0f172a', color: '#e2e8f0' }}>
                      <option value="">—</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((b) => (
                        <option key={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Marital Status</label>
                    <select value={form.maritalStatus} onChange={(e) => set('maritalStatus', e.target.value)} style={{ background: '#0f172a', color: '#e2e8f0' }}>
                      <option value="">—</option>
                      <option>Single</option>
                      <option>Married</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Nationality</label>
                    <input value={form.nationality} onChange={(e) => set('nationality', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Profile Photo URL</label>
                    <input value={form.profilePhoto} onChange={(e) => set('profilePhoto', e.target.value)} />
                  </div>
                </div>
                <button type="button" className="btn btn-primary" disabled={saving || !form.firstName || !form.lastName} onClick={() => saveStep(1, 2)}>
                  {saving ? 'Saving…' : 'Save & Continue → Contact'}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="card">
                <h2 style={{ marginTop: 0, color: '#00d4ff' }}>Step 2 — Contact Information</h2>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Mobile *</label>
                    <input value={form.mobile} onChange={(e) => set('mobile', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Alternate Mobile</label>
                    <input value={form.alternateMobile} onChange={(e) => set('alternateMobile', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Personal Email *</label>
                    <input type="email" value={form.personalEmail} onChange={(e) => set('personalEmail', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input value={form.city} onChange={(e) => set('city', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input value={form.state} onChange={(e) => set('state', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>PIN Code</label>
                    <input value={form.pinCode} onChange={(e) => set('pinCode', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Current Address</label>
                  <textarea rows={2} value={form.currentAddress} onChange={(e) => set('currentAddress', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Permanent Address</label>
                  <textarea rows={2} value={form.permanentAddress} onChange={(e) => set('permanentAddress', e.target.value)} />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label>Emergency Contact Name</label>
                    <input value={form.emergencyContactName} onChange={(e) => set('emergencyContactName', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Emergency Contact Number</label>
                    <input value={form.emergencyContactNumber} onChange={(e) => set('emergencyContactNumber', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Relation</label>
                    <input value={form.emergencyContactRelation} onChange={(e) => set('emergencyContactRelation', e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                  <button type="button" className="btn btn-primary" disabled={saving || !form.mobile || !form.personalEmail} onClick={() => saveStep(2, 3)}>
                    {saving ? 'Saving…' : 'Save & Continue → Education'}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="card">
                <h2 style={{ marginTop: 0, color: '#00d4ff' }}>Step 3 — Education Details</h2>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Multiple records · 10th, 12th, Graduation, etc.</p>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', minWidth: 640 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.15)', textAlign: 'left' }}>
                        <th style={{ padding: '0.5rem' }}>Qualification</th>
                        <th style={{ padding: '0.5rem' }}>Institute</th>
                        <th style={{ padding: '0.5rem' }}>Board/University</th>
                        <th style={{ padding: '0.5rem' }}>Year</th>
                        <th style={{ padding: '0.5rem' }}>% / CGPA</th>
                        <th style={{ padding: '0.5rem' }} />
                      </tr>
                    </thead>
                    <tbody>
                      {education.map((row, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                          {['qualification', 'institute', 'boardUniversity', 'passingYear', 'percentageCgpa'].map((field) => (
                            <td key={field} style={{ padding: '0.35rem' }}>
                              <input
                                value={row[field]}
                                placeholder={field === 'qualification' ? '10th / BCA' : ''}
                                onChange={(e) => {
                                  const next = [...education];
                                  next[i] = { ...next[i], [field]: e.target.value };
                                  setEducation(next);
                                }}
                                style={{ width: '100%', minWidth: 80, padding: '0.4rem', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: '#e2e8f0' }}
                              />
                            </td>
                          ))}
                          <td style={{ padding: '0.35rem' }}>
                            {education.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setEducation(education.filter((_, j) => j !== i))}
                                style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer' }}
                              >
                                ✕
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ marginTop: '0.75rem', marginBottom: '1rem' }}
                  onClick={() => setEducation([...education, { ...emptyEdu }])}
                >
                  + Add Education
                </button>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                  <button type="button" className="btn btn-primary" disabled={saving} onClick={() => saveStep(3, 4)}>
                    {saving ? 'Saving…' : 'Save & Continue → Employment'}
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="card">
                <h2 style={{ marginTop: 0, color: '#00d4ff' }}>Step 4 — Previous Employment</h2>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#e2e8f0' }}>
                  <input type="checkbox" checked={isFresher} onChange={(e) => setIsFresher(e.target.checked)} />
                  I am a Fresher (no previous employment)
                </label>

                {!isFresher && (
                  <>
                    {prevJobs.map((job, i) => (
                      <div
                        key={i}
                        style={{
                          marginBottom: '1rem',
                          padding: '1rem',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 12,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <strong>Experience #{i + 1}</strong>
                          {prevJobs.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setPrevJobs(prevJobs.filter((_, j) => j !== i))}
                              style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer' }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid-2">
                          {[
                            ['company', 'Previous Company'],
                            ['designation', 'Designation'],
                            ['department', 'Department'],
                            ['joiningDate', 'Joining Date'],
                            ['leavingDate', 'Leaving Date'],
                            ['lastSalary', 'Last Salary'],
                            ['experience', 'Experience (e.g. 2 years)'],
                            ['reasonForLeaving', 'Reason for Leaving'],
                            ['previousEmployeeId', 'Previous Employee ID'],
                            ['experienceLetter', 'Experience Letter URL'],
                          ].map(([key, label]) => (
                            <div className="form-group" key={key}>
                              <label>{label}</label>
                              <input
                                value={job[key]}
                                onChange={(e) => {
                                  const next = [...prevJobs];
                                  next[i] = { ...next[i], [key]: e.target.value };
                                  setPrevJobs(next);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button type="button" className="btn btn-outline" style={{ marginBottom: '1rem' }} onClick={() => setPrevJobs([...prevJobs, { ...emptyJob }])}>
                      + Add Previous Employment
                    </button>
                  </>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setStep(3)}>← Back</button>
                  <button type="button" className="btn btn-primary" disabled={saving} onClick={() => saveStep(4, null)}>
                    {saving ? 'Saving…' : 'Complete Joining Form · Next Documents'}
                  </button>
                  <Link to={`/admin/offer?id=${app._id}`} className="btn btn-outline">Offer Letter</Link>
                  <Link to={`/admin/documents-verify?id=${app._id}`} className="btn btn-outline">Document Verification →</Link>
                </div>
              </div>
            )}
          </>
        )}

        <p style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <button type="button" className="btn btn-primary" onClick={downloadJoiningPdf}>Download Joining PDF</button>
          <Link to="/admin/applications" style={{ color: '#00d4ff' }}>Applications</Link>
          <Link to="/admin" style={{ color: '#00d4ff' }}>← Dashboard</Link>
        </p>
      </div>
    </div>
  );
}
