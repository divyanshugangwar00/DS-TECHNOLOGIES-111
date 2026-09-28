import { useEffect, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const STEPS = [
  'Bank Details',
  'Nominee',
  'Policies',
  'Declaration',
  'HR Verification',
  'Employee ID & Account',
];

export default function AdminOnboarding() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const appId = params.get('id');
  const [step, setStep] = useState(0);
  const [app, setApp] = useState(null);
  const [list, setList] = useState([]);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [loginInfo, setLoginInfo] = useState(null);

  const [bank, setBank] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
    branch: '',
    accountType: 'Savings',
  });
  const [nominee, setNominee] = useState({
    name: '',
    relation: '',
    phone: '',
    address: '',
    sharePercent: '100',
  });
  const [policies, setPolicies] = useState({
    codeOfConduct: false,
    dataPrivacy: false,
    attendancePolicy: false,
    leavePolicy: false,
  });
  const [declaration, setDeclaration] = useState({
    agreed: false,
    eSignName: '',
    eSignDate: new Date().toISOString().slice(0, 10),
    place: 'Bareilly',
  });
  const [hr, setHr] = useState({
    personalOk: false,
    documentsOk: false,
    bankOk: false,
    approved: false,
    remarks: '',
  });

  const load = () => {
    api
      .get('/applications')
      .then((res) => {
        const data = res.data || [];
        setList(data);
        if (!appId) return;
        const found = data.find((a) => a._id === appId);
        if (!found) return;
        setApp(found);
        if (found.bankDetails) setBank((b) => ({ ...b, ...found.bankDetails }));
        if (found.nominee) setNominee((n) => ({ ...n, ...found.nominee }));
        if (found.policiesAccepted) setPolicies((p) => ({ ...p, ...found.policiesAccepted }));
        if (found.declaration) {
          setDeclaration((d) => ({
            ...d,
            ...found.declaration,
            eSignDate: found.declaration.eSignDate
              ? new Date(found.declaration.eSignDate).toISOString().slice(0, 10)
              : d.eSignDate,
          }));
        }
        if (found.hrVerification) setHr((h) => ({ ...h, ...found.hrVerification }));
      })
      .catch((e) => setError(e.response?.data?.message || 'Load failed'));
  };

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'hr')) load();
  }, [user, appId]);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container">
        <p>Access denied</p>
      </div>
    );
  }

  const put = async (body, successMsg) => {
    setSaving(true);
    setError('');
    setMsg('');
    try {
      const { data } = await api.put(`/applications/${app._id}/status`, body);
      setApp(data);
      setMsg(successMsg);
      load();
      return data;
    } catch (ex) {
      setError(ex.response?.data?.message || 'Save failed');
      return null;
    } finally {
      setSaving(false);
    }
  };

  const generateId = () => {
    const year = new Date().getFullYear().toString().slice(-2);
    const rand = String(Math.floor(1000 + Math.random() * 9000));
    return `DST-${year}-${rand}`;
  };

  const createEmployeeAccount = async () => {
    if (!app) return;
    setSaving(true);
    setError('');
    setMsg('');
    try {
      const empId = app.generatedEmployeeId || generateId();
      const password = 'Ds@2026';
      const email =
        app.email?.includes('@') ? app.email.replace(/@.*/, '') + '.emp@dstechnologies.com' : `emp${Date.now()}@dstechnologies.com`;
      // Prefer original email for login if available
      const loginEmail = app.email || email;
      let userId;
      try {
        const { data: newUser } = await api.post('/auth/register', {
          name: app.name,
          email: loginEmail,
          password,
          phone: app.phone || app.joiningForm?.mobile || '',
        });
        userId = newUser._id;
      } catch (regErr) {
        // user may exist — still try employee create with note
        setError(
          (regErr.response?.data?.message || 'Register') +
            ' — agar user pehle se hai to Employees se manually link karein. Employee ID: ' +
            empId
        );
      }

      if (userId) {
        await api.post('/employees', {
          userId,
          employeeId: empId,
          department: app.departmentSelected || app.job?.department || 'Operations',
          designation: app.positionSelected || app.job?.title || 'Employee',
          joiningDate: app.joiningDate || new Date().toISOString(),
          workLocation: app.workLocation || 'Bareilly / Hybrid',
          employmentType: app.employmentType || 'Full-time',
          salary: undefined,
          personalEmail: app.joiningForm?.personalEmail || app.email,
          companyEmail: loginEmail,
        });
      }

      await api.put(`/applications/${app._id}/status`, {
        status: 'Onboarded',
        pipelineStep: 'Completed',
        generatedEmployeeId: empId,
        employeeAccountCreated: true,
        joiningConfirmed: true,
        hrVerification: {
          ...hr,
          approved: true,
          approvedBy: user.name || user.email,
          approvedAt: new Date().toISOString(),
        },
      });

      setLoginInfo({
        employeeId: empId,
        email: loginEmail,
        password,
      });
      setMsg('Joining confirmed · Employee account ready');
      load();
    } catch (ex) {
      setError(ex.response?.data?.message || 'Employee create failed');
    } finally {
      setSaving(false);
    }
  };

  const eligible = list.filter(
    (a) =>
      a.offerAccepted ||
      ['Selected', 'Offer', 'Document Verification', 'Joining', 'Onboarded', 'HR Verification', 'HR Approval'].includes(
        a.status
      )
  );

  return (
    <div className="section page-bg-admin">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 className="section-title">Full Onboarding Pipeline</h1>
        <AdminHero variant="default" />
        <p className="section-subtitle">
          Bank → Nominee → Policies → Declaration → HR Verify → Employee ID → Login
        </p>
        {error && <p style={{ color: '#fca5a5' }}>{error}</p>}
        {msg && <p style={{ color: '#10b981' }}>{msg}</p>}

        {!appId && (
          <div className="card">
            <h3>Select candidate</h3>
            {eligible.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>Offer accept / documents ke baad candidates.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {eligible.map((a) => (
                  <li key={a._id} style={{ padding: '0.5rem 0' }}>
                    <Link to={`/admin/onboarding?id=${a._id}`} style={{ color: '#00d4ff' }}>
                      {a.name} — {a.status}
                      {a.generatedEmployeeId ? ` · ${a.generatedEmployeeId}` : ''}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {app && (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
              {STEPS.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStep(i)}
                  style={{
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.75rem',
                    borderRadius: 8,
                    border: step === i ? '1px solid #00d4ff' : '1px solid rgba(255,255,255,0.12)',
                    background: step === i ? 'rgba(0,212,255,0.2)' : 'transparent',
                    color: step === i ? '#00d4ff' : '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  {i + 1}. {s}
                </button>
              ))}
            </div>
            <p style={{ color: '#94a3b8' }}>
              <strong style={{ color: '#e2e8f0' }}>{app.name}</strong> · {app.email}
            </p>

            {/* Quick links earlier steps */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', margin: '0.75rem 0 1.25rem' }}>
              <Link to={`/admin/joining?id=${app._id}`} style={{ color: '#00d4ff', fontSize: '0.85rem' }}>
                Joining Form
              </Link>
              <Link to={`/admin/documents-verify?id=${app._id}`} style={{ color: '#00d4ff', fontSize: '0.85rem' }}>
                Documents
              </Link>
              <Link to={`/admin/offer?id=${app._id}`} style={{ color: '#00d4ff', fontSize: '0.85rem' }}>
                Offer
              </Link>
            </div>

            {step === 0 && (
              <div className="card">
                <h3>Bank Details</h3>
                <div className="grid-2">
                  {Object.entries({
                    accountHolderName: 'Account Holder Name',
                    bankName: 'Bank Name',
                    accountNumber: 'Account Number',
                    ifsc: 'IFSC',
                    branch: 'Branch',
                    accountType: 'Account Type',
                  }).map(([k, label]) => (
                    <div className="form-group" key={k}>
                      <label>{label}</label>
                      <input value={bank[k] || ''} onChange={(e) => setBank({ ...bank, [k]: e.target.value })} />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={saving}
                  onClick={async () => {
                    await put({ bankDetails: bank, pipelineStep: 'Onboarding', status: 'Joining' }, 'Bank saved');
                    setStep(1);
                  }}
                >
                  Save & Continue
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="card">
                <h3>Nominee / Emergency</h3>
                <div className="grid-2">
                  {Object.entries({
                    name: 'Nominee Name',
                    relation: 'Relation',
                    phone: 'Phone',
                    address: 'Address',
                    sharePercent: 'Share %',
                  }).map(([k, label]) => (
                    <div className="form-group" key={k}>
                      <label>{label}</label>
                      <input value={nominee[k] || ''} onChange={(e) => setNominee({ ...nominee, [k]: e.target.value })} />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={saving}
                  onClick={async () => {
                    await put({ nominee }, 'Nominee saved');
                    setStep(2);
                  }}
                >
                  Save & Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="card">
                <h3>Company Policies</h3>
                {[
                  ['codeOfConduct', 'I accept the Code of Conduct'],
                  ['dataPrivacy', 'I accept Data Privacy & Confidentiality policy'],
                  ['attendancePolicy', 'I accept Attendance policy'],
                  ['leavePolicy', 'I accept Leave policy'],
                ].map(([k, label]) => (
                  <label key={k} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', color: '#e2e8f0' }}>
                    <input
                      type="checkbox"
                      checked={!!policies[k]}
                      onChange={(e) => setPolicies({ ...policies, [k]: e.target.checked })}
                    />
                    {label}
                  </label>
                ))}
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={saving || !Object.values(policies).every(Boolean)}
                  onClick={async () => {
                    await put({ policiesAccepted: policies }, 'Policies accepted');
                    setStep(3);
                  }}
                >
                  Accept Policies & Continue
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="card">
                <h3>Declaration + E-Sign</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  I hereby declare that the information provided in this form is true and correct to the best of my
                  knowledge. I understand that false information may lead to termination of employment.
                </p>
                <label style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', color: '#e2e8f0' }}>
                  <input
                    type="checkbox"
                    checked={declaration.agreed}
                    onChange={(e) => setDeclaration({ ...declaration, agreed: e.target.checked })}
                  />
                  I agree to the declaration above
                </label>
                <div className="grid-2">
                  <div className="form-group">
                    <label>E-Sign (Full Name) *</label>
                    <input
                      value={declaration.eSignName}
                      onChange={(e) => setDeclaration({ ...declaration, eSignName: e.target.value })}
                      placeholder="Type full name as signature"
                    />
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={declaration.eSignDate}
                      onChange={(e) => setDeclaration({ ...declaration, eSignDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Place</label>
                    <input
                      value={declaration.place}
                      onChange={(e) => setDeclaration({ ...declaration, place: e.target.value })}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={saving || !declaration.agreed || !declaration.eSignName}
                  onClick={async () => {
                    await put(
                      {
                        declaration: { ...declaration, eSignDate: declaration.eSignDate },
                        status: 'HR Verification',
                        pipelineStep: 'Onboarding',
                      },
                      'Submitted for HR Verification'
                    );
                    setStep(4);
                  }}
                >
                  SUBMIT for HR Verification
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="card">
                <h3>HR Verification & Approval</h3>
                {[
                  ['personalOk', 'Personal / Contact / Education verified'],
                  ['documentsOk', 'Identity & documents verified'],
                  ['bankOk', 'Bank & nominee verified'],
                ].map(([k, label]) => (
                  <label key={k} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', color: '#e2e8f0' }}>
                    <input type="checkbox" checked={!!hr[k]} onChange={(e) => setHr({ ...hr, [k]: e.target.checked })} />
                    {label}
                  </label>
                ))}
                <div className="form-group">
                  <label>HR Remarks</label>
                  <textarea rows={2} value={hr.remarks} onChange={(e) => setHr({ ...hr, remarks: e.target.value })} />
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={saving || !hr.personalOk || !hr.documentsOk || !hr.bankOk}
                  onClick={async () => {
                    await put(
                      {
                        hrVerification: {
                          ...hr,
                          approved: true,
                          approvedBy: user.name || user.email,
                          approvedAt: new Date().toISOString(),
                        },
                        status: 'HR Approval',
                        pipelineStep: 'Employee ID',
                      },
                      'HR Approved → Generate Employee ID'
                    );
                    setStep(5);
                  }}
                >
                  HR APPROVAL
                </button>
              </div>
            )}

            {step === 5 && (
              <div className="card">
                <h3>Employee ID · Account · Joining Confirmed</h3>
                {app.generatedEmployeeId && (
                  <p style={{ color: '#10b981' }}>
                    Employee ID: <strong>{app.generatedEmployeeId}</strong>
                    {app.employeeAccountCreated ? ' · Account created' : ''}
                    {app.joiningConfirmed ? ' · Joining confirmed' : ''}
                  </p>
                )}
                {loginInfo && (
                  <div
                    style={{
                      margin: '1rem 0',
                      padding: '1rem',
                      background: 'rgba(16,185,129,0.12)',
                      borderRadius: 12,
                    }}
                  >
                    <p>
                      <strong>Employee Login</strong>
                    </p>
                    <p>ID: {loginInfo.employeeId}</p>
                    <p>Email: {loginInfo.email}</p>
                    <p>Password: {loginInfo.password}</p>
                    <Link to="/login" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                      Open Login
                    </Link>
                  </div>
                )}
                <button type="button" className="btn btn-primary" disabled={saving || app.joiningConfirmed} onClick={createEmployeeAccount}>
                  {saving ? 'Creating…' : app.joiningConfirmed ? 'Already Joined' : 'Generate ID + Create Account + Confirm Joining'}
                </button>
              </div>
            )}
          </>
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
