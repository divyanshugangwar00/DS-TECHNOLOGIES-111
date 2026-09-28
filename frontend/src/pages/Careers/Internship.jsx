import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SIG_KEYS = {
  hr: 'ds_cert_sig_hr',
  manager: 'ds_cert_sig_manager',
  founder: 'ds_cert_sig_founder',
};

function loadSig(key) {
  try {
    return localStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

function qrUrl(data) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(data)}`;
}


const FIELD_OPTIONS = [
  'Software / IT / Digital Solutions',
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'MERN Stack',
  'Python / Data Science',
  'Web Development',
  'Mobile App Development',
  'UI / UX Design',
  'Cloud & DevOps',
  'Database Administration',
  'Cyber Security',
  'Digital Marketing',
  'Business Analytics',
  'Power BI / Data Analytics',
  'Machine Learning / AI',
  'Quality Assurance / Testing',
  'Human Resources',
  'Operations & Management',
];

function monthsBetween(from, to) {
  if (!from || !to) return '';
  try {
    const a = new Date(from + 'T00:00:00');
    const b = new Date(to + 'T00:00:00');
    if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return '';
    if (b < a) return 'Invalid (To must be after From)';
    // Inclusive day count
    const totalDays = Math.round((b - a) / 86400000) + 1;
    // Month span with day fraction (e.g. 01-09 to 30-11 ≈ 3 months)
    let monthDiff =
      (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
    const dayFrac = (b.getDate() - a.getDate()) / 30;
    const approx = monthDiff + dayFrac;
    if (totalDays <= 14) {
      return totalDays === 1 ? '1 day' : `${totalDays} days`;
    }
    // Prefer whole months for certificates
    let rounded = Math.round(approx);
    if (rounded < 1) rounded = 1;
    // If span covers 3 calendar months (Sep–Nov), prefer 3
    const calMonths =
      (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth()) + 1;
    if (a.getDate() === 1 && b.getDate() >= 28) {
      rounded = Math.max(rounded, calMonths);
    }
    if (rounded === 1) return '1 month';
    return `${rounded} months`;
  } catch {
    return '';
  }
}

function fmtLong(d) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return d;
  }
}

export default function Internship() {
  const { user } = useAuth();
  const canEdit =
    user &&
    (user.role === 'admin' ||
      user.role === 'hr' ||
      /manager|founder|ceo|chro|lead/i.test(user.role || '') ||
      /manager|founder|ceo|hr/i.test(user.designation || ''));

  const [tab, setTab] = useState('internship'); // internship | course | offer
  const [personName, setPersonName] = useState('Divyanshu Gangwar');
  const [personId, setPersonId] = useState('DST-INT-001');
  const [course, setCourse] = useState('Frontend Development');
  const [field, setField] = useState('Software / IT / Digital Solutions');
  const [duration, setDuration] = useState('3 months');
  const [fromDate, setFromDate] = useState('2025-09-01');
  const [toDate, setToDate] = useState('2025-11-30');
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [grade, setGrade] = useState('Successfully completed');
  const [programTitle, setProgramTitle] = useState('Python 101 for Data Science');
  const [msg, setMsg] = useState('');

  // Auto duration from From–To dates
  useEffect(() => {
    const d = monthsBetween(fromDate, toDate);
    if (d) setDuration(d);
  }, [fromDate, toDate]);

  const [sigHr, setSigHr] = useState(() => loadSig(SIG_KEYS.hr));
  const [sigManager, setSigManager] = useState(() => loadSig(SIG_KEYS.manager));
  const [sigFounder, setSigFounder] = useState(() => loadSig(SIG_KEYS.founder));
  const [sigLabelHr, setSigLabelHr] = useState(() => localStorage.getItem('ds_sig_label_hr') || 'HR Manager');
  const [sigLabelManager, setSigLabelManager] = useState(
    () => localStorage.getItem('ds_sig_label_manager') || 'Manager / Team Lead'
  );
  const [sigLabelFounder, setSigLabelFounder] = useState(
    () => localStorage.getItem('ds_sig_label_founder') || 'Founder / CEO'
  );

  useEffect(() => {
    setSigHr(loadSig(SIG_KEYS.hr));
    setSigManager(loadSig(SIG_KEYS.manager));
    setSigFounder(loadSig(SIG_KEYS.founder));
  }, []);

  const onSig = (key, setter) => (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) {
      setMsg('Max 2 MB image');
      return;
    }
    const r = new FileReader();
    r.onload = () => {
      try {
        localStorage.setItem(key, r.result);
        setter(r.result);
        setMsg('Signature saved');
      } catch {
        setMsg('Storage full — try smaller image');
      }
    };
    r.readAsDataURL(f);
  };

  const verifyUrl = `https://dstechnologies.com/verify/${personId || 'DST'}-${issueDate}`;
  const qr = qrUrl(verifyUrl);

  const paperLandscape = {
    background: '#fff',
    color: '#0f172a',
    width: '100%',
    maxWidth: 1000,
    minHeight: 560,
    margin: '0 auto',
    padding: '28px 36px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
    position: 'relative',
    fontFamily: 'Georgia, "Times New Roman", serif',
    overflow: 'hidden',
    boxSizing: 'border-box',
  };

  const paperPortrait = {
    background: '#fff',
    color: '#0f172a',
    width: '100%',
    maxWidth: 720,
    minHeight: 900,
    margin: '0 auto',
    padding: '32px 36px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
    position: 'relative',
    fontFamily: 'Georgia, "Times New Roman", serif',
    overflow: 'hidden',
    boxSizing: 'border-box',
  };

  const printDoc = () => {
    // Portrait for offer letter; landscape for certificates
    let styleEl = document.getElementById('ds-print-page-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'ds-print-page-style';
      document.head.appendChild(styleEl);
    }
    const orient = tab === 'offer' ? 'portrait' : 'landscape';
    styleEl.textContent = `@media print { @page { size: A4 ${orient}; margin: 12mm; } }`;
    setTimeout(() => window.print(), 150);
  };

  return (
    <div className="section page-bg-careers">
      <div className="container">
        <h1 className="section-title">Internship · Course · Offer Letters</h1>
        <p className="section-subtitle">
          DS-TECHNOLOGIES official documents — Internship certificate, Course completion certificate, Internship offer letter
        </p>

        <div className="no-print" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {[
            ['internship', '🎓 Internship Certificate'],
            ['course', '📜 Course Certificate'],
            ['offer', '📨 Offer Letter'],
          ].map(([k, label]) => (
            <button
              key={k}
              type="button"
              className={tab === k ? 'btn btn-primary' : 'btn btn-outline'}
              onClick={() => setTab(k)}
            >
              {label}
            </button>
          ))}
        </div>

        {canEdit ? (
          <div className="card no-print" style={{ marginBottom: '1.5rem', border: '1px solid rgba(0,212,255,0.35)' }}>
            <h3 style={{ color: '#00d4ff', marginTop: 0 }}>Document editor (Admin / HR / Manager)</h3>
            {msg && <p style={{ color: '#10b981' }}>{msg}</p>}
            <div className="grid-2">
              <div className="form-group">
                <label>Full name *</label>
                <input value={personName} onChange={(e) => setPersonName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Student / Employee ID *</label>
                <input value={personId} onChange={(e) => setPersonId(e.target.value)} placeholder="DST-INT-001 / DST-STU-012" />
              </div>
              {tab === 'course' && (
                <div className="form-group">
                  <label>Course / Program title *</label>
                  <input value={programTitle} onChange={(e) => setProgramTitle(e.target.value)} />
                </div>
              )}
              {tab !== 'course' && (
                <div className="form-group">
                  <label>Field / Domain *</label>
                  <select value={field} onChange={(e) => setField(e.target.value)} style={{ width: '100%', padding: '0.5rem', background: '#0f172a', color: '#e2e8f0', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)' }}>
                    {FIELD_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="form-group">
                <label>Course / Qualification</label>
                <input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="BCA / Frontend / MCA" />
              </div>
              <div className="form-group">
                <label>Duration (auto from dates)</label>
                <input
                  value={duration}
                  readOnly
                  title="Auto-calculated from From and To dates"
                  style={{
                    opacity: 0.95,
                    color: duration.startsWith('Invalid') ? '#f87171' : '#e2e8f0',
                    borderColor: duration.startsWith('Invalid') ? '#f87171' : undefined,
                  }}
                />
              </div>
              <div className="form-group">
                <label>From</label>
                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label>To</label>
                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Issue date</label>
                <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
              </div>
              {tab === 'course' && (
                <div className="form-group">
                  <label>Result / Grade line</label>
                  <input value={grade} onChange={(e) => setGrade(e.target.value)} />
                </div>
              )}
            </div>

            <h4 style={{ color: '#94a3b8' }}>Signatures (upload image)</h4>
            <div className="grid-2">
              {[
                [SIG_KEYS.hr, sigHr, setSigHr, sigLabelHr, setSigLabelHr],
                [SIG_KEYS.manager, sigManager, setSigManager, sigLabelManager, setSigLabelManager],
                [SIG_KEYS.founder, sigFounder, setSigFounder, sigLabelFounder, setSigLabelFounder],
              ].map(([key, val, setter, label, setLabel]) => (
                <div key={key} className="form-group" style={{ border: '1px solid rgba(255,255,255,0.08)', padding: 10, borderRadius: 8 }}>
                  <input
                    value={label}
                    onChange={(e) => {
                      setLabel(e.target.value);
                      try {
                        localStorage.setItem(
                          key === SIG_KEYS.hr
                            ? 'ds_sig_label_hr'
                            : key === SIG_KEYS.manager
                              ? 'ds_sig_label_manager'
                              : 'ds_sig_label_founder',
                          e.target.value
                        );
                      } catch {}
                    }}
                    style={{ width: '100%', marginBottom: 6, background: '#0f172a', color: '#e2e8f0', border: '1px solid #334155', borderRadius: 4, padding: 4 }}
                  />
                  <input type="file" accept="image/*" onChange={onSig(key, setter)} />
                  {val ? (
                    <img src={val} alt="" style={{ height: 40, marginTop: 6, background: '#fff', padding: 4, borderRadius: 4 }} />
                  ) : (
                    <p style={{ color: '#64748b', fontSize: '0.75rem' }}>No file yet</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card no-print" style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', margin: 0 }}>
              Preview only. Edit & download: <strong style={{ color: '#e2e8f0' }}>Admin / HR / Manager</strong>
            </p>
          </div>
        )}

        {/* ========== INTERNSHIP CERTIFICATE ========== */}
        {tab === 'internship' && (
          <div className="card" style={{ background: 'transparent', boxShadow: 'none' }}>
            <div id="ds-cert-internship" style={paperLandscape}>
              <div>
                <div style={{ padding: 0 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      <img
                        src="/logo.jpg"
                        alt="DS-TECHNOLOGIES"
                        style={{ width: 72, height: 72, objectFit: 'contain', borderRadius: 10, border: '2px solid #e2e8f0' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = '/logo.svg'; }}
                      />
                      <div>
                        <div style={{ fontWeight: 900, fontSize: '1.35rem', color: '#0369a1', fontFamily: 'system-ui,sans-serif', letterSpacing: 0.5 }}>DS-TECHNOLOGIES</div>
                        <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'system-ui,sans-serif', marginTop: 2 }}>
                          Village Kuiya Rampur, Faridpur, Bareilly, UP 243503
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'system-ui,sans-serif' }}>
                          Ph: 7895733906 · 7454910637
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <img src={qr} alt="QR verify" width={90} height={90} style={{ border: '2px solid #e2e8f0', borderRadius: 6, display: 'block' }} />
                      <div style={{ fontSize: 10, color: '#0f172a', fontFamily: 'system-ui,sans-serif', marginTop: 6, fontWeight: 700, lineHeight: 1.25 }}>
                        EMP / STU ID<br />{personId || '—'}
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <div style={{ textAlign: 'center', marginTop: 28 }}>
                    <div style={{ fontSize: 12, letterSpacing: 4, color: '#0369a1', fontFamily: 'system-ui,sans-serif', fontWeight: 600 }}>OFFICIAL DOCUMENT</div>
                    <h2 style={{ margin: '10px 0 6px', fontSize: '2rem', letterSpacing: 1.5, fontWeight: 800, color: '#0f172a' }}>CERTIFICATE OF INTERNSHIP</h2>
                    <div style={{ height: 4, width: 140, background: 'linear-gradient(90deg, #0369a1, #0ea5e9)', margin: '0 auto 20px', borderRadius: 2 }} />
                    <div style={{ color: '#64748b', fontSize: 14 }}>This certificate is proudly presented to</div>
                    <div style={{ fontSize: '2.1rem', fontWeight: 700, color: '#0369a1', margin: '14px 0 8px', fontStyle: 'italic', fontFamily: 'Georgia, "Times New Roman", serif' }}>{personName}</div>
                    <p style={{ marginTop: 20, lineHeight: 1.8, fontSize: 15, maxWidth: 580, marginLeft: 'auto', marginRight: 'auto', color: '#334155' }}>
                      in recognition of successful completion of the <strong>Internship Programme</strong> at{' '}
                      <strong>DS-TECHNOLOGIES</strong> in the field of <strong>{field}</strong>
                      {duration ? <> for a duration of <strong>{duration}</strong></> : null}
                      {fromDate || toDate ? <> ({fmtLong(fromDate)} to {fmtLong(toDate)})</> : null}
                      , demonstrating dedication, learning ability and professional conduct.
                    </p>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 14, fontFamily: 'system-ui,sans-serif' }}>
                      Date of issue: <strong>{fmtLong(issueDate)}</strong>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 44, gap: 16, fontFamily: 'system-ui,sans-serif', fontSize: 12, color: '#475569' }}>
                    {[
                      [sigLabelHr, sigHr],
                      [sigLabelManager, sigManager],
                      [sigLabelFounder, sigFounder],
                    ].map(([label, sig]) => (
                      <div key={label} style={{ flex: 1, textAlign: 'center' }}>
                        {sig ? <img src={sig} alt="" style={{ maxHeight: 48, maxWidth: 130, display: 'block', margin: '0 auto 6px' }} /> : <div style={{ height: 48 }} />}
                        <div style={{ borderTop: '1.5px solid #94a3b8', paddingTop: 8 }}>{label}</div>
                        {String(label).toLowerCase().includes('founder') && (
                          <div style={{ color: '#0369a1', fontWeight: 700, marginTop: 2 }}>Divyanshu Gangwar</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p style={{ textAlign: 'center', fontSize: 10, color: '#94a3b8', marginTop: 18, fontFamily: 'system-ui,sans-serif' }}>
                    Verify: {verifyUrl}
                  </p>
                </div>
              </div>
            </div>
            {(
              <div className="no-print" style={{ textAlign: 'center', marginTop: 12 }}>
                <button type="button" className="btn btn-primary" onClick={printDoc}>
                  Print / Download PDF
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========== COURSE CERTIFICATE ========== */}
        {tab === 'course' && (
          <div className="card" style={{ background: 'transparent', boxShadow: 'none' }}>
            <div id="ds-cert-course" style={paperLandscape}>
                <div style={{ padding: 0 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      <img
                        src="/logo.jpg"
                        alt="DS-TECHNOLOGIES"
                        style={{ width: 68, height: 68, objectFit: 'contain', borderRadius: 10, border: '2px solid #e0f2fe' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = '/logo.svg'; }}
                      />
                      <div>
                        <div style={{ fontWeight: 900, fontSize: '1.3rem', color: '#0369a1', fontFamily: 'system-ui,sans-serif' }}>DS-TECHNOLOGIES</div>
                        <div style={{ fontSize: 12, color: '#64748b', fontFamily: 'system-ui,sans-serif', marginTop: 2 }}>Learning & Skills · Bareilly, Uttar Pradesh</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <img src={qr} alt="QR" width={86} height={86} style={{ border: '2px solid #e0f2fe', borderRadius: 6, display: 'block' }} />
                      
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ textAlign: 'center', margin: '32px 0 10px' }}>
                    <div style={{ letterSpacing: 5, fontSize: 13, color: '#0369a1', fontFamily: 'system-ui,sans-serif', fontWeight: 600 }}>CERTIFICATE OF COMPLETION</div>
                    <div style={{ height: 3, width: 100, background: 'linear-gradient(90deg, #0ea5e9, #0369a1)', margin: '12px auto 18px', borderRadius: 2 }} />
                    <div style={{ color: '#64748b', fontSize: 14 }}>This is to certify that</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, margin: '14px 0 10px', color: '#0f172a', fontStyle: 'italic', fontFamily: 'Georgia, "Times New Roman", serif' }}>{personName}</div>
                    <div style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 540, margin: '0 auto', color: '#334155' }}>
                      successfully completed and received a passing grade in
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0369a1', margin: '16px 0 8px' }}>{programTitle}</div>
                    <div style={{ fontSize: 14, color: '#475569' }}>
                      ({course || 'Professional program'} · provided by DS-TECHNOLOGIES)
                    </div>
                    <p style={{ fontSize: 14, color: '#64748b', marginTop: 14 }}>{grade}</p>
                    <div style={{ fontSize: 13, marginTop: 18, color: '#475569', fontFamily: 'system-ui,sans-serif' }}>
                      {fmtLong(fromDate)} — {fmtLong(toDate)}
                      <br />
                      <strong>Issued: {fmtLong(issueDate)}</strong>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 40, fontFamily: 'system-ui,sans-serif', fontSize: 12 }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      {sigFounder ? <img src={sigFounder} alt="" style={{ maxHeight: 52, margin: '0 auto', display: 'block' }} /> : <div style={{ height: 52 }} />}
                      <div style={{ borderTop: '1.5px solid #94a3b8', marginTop: 6, paddingTop: 8 }}>Founder & CEO</div>
                      <div style={{ color: '#0369a1', fontWeight: 700, marginTop: 2 }}>Divyanshu Gangwar</div>
                    </div>
                    <div style={{ textAlign: 'center', flex: 1, alignSelf: 'flex-end' }}>
                      <div style={{ fontWeight: 800, color: '#0369a1', fontSize: 14 }}>DS-TECHNOLOGIES</div>
                      <div style={{ color: '#64748b', marginTop: 2 }}>Training Division</div>
                    </div>
                  </div>
                  <p style={{ textAlign: 'center', fontSize: 10, color: '#94a3b8', marginTop: 16, fontFamily: 'system-ui,sans-serif' }}>
                    Authenticity: {verifyUrl}
                  </p>
                </div>
            </div>
            {(
              <div className="no-print" style={{ textAlign: 'center', marginTop: 12 }}>
                <button type="button" className="btn btn-primary" onClick={printDoc}>
                  Print / Download PDF
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========== OFFER LETTER ========== */}
        {tab === 'offer' && (
          <div className="card" style={{ background: 'transparent', boxShadow: 'none' }}>
            <div id="ds-offer-letter" style={paperPortrait}>
                <div style={{ padding: 0 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, gap: 14 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <img
                        src="/logo.jpg"
                        alt="DS-TECHNOLOGIES"
                        style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 10, border: '2px solid #e2e8f0' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = '/logo.svg'; }}
                      />
                      <div>
                        <div style={{ fontWeight: 900, fontSize: '1.25rem', color: '#0369a1', fontFamily: 'system-ui,sans-serif' }}>DS-TECHNOLOGIES</div>
                        <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'system-ui,sans-serif', marginTop: 2 }}>
                          Village Kuiya Rampur, Post Kakra Kalan, Faridpur, Bareilly, UP 243503
                        </div>
                        <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'system-ui,sans-serif' }}>
                          Email: divyanshugangwar950@gmail.com · Ph: 7895733906
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <img src={qr} alt="QR" width={78} height={78} style={{ border: '2px solid #e2e8f0', borderRadius: 6, display: 'block' }} />
                      
                    </div>
                  </div>

                  <h2 style={{ textAlign: 'center', letterSpacing: 3, fontSize: '1.45rem', margin: '4px 0 22px', fontFamily: 'system-ui,sans-serif', fontWeight: 800, color: '#0f172a' }}>
                    INTERNSHIP OFFER LETTER
                  </h2>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontFamily: 'system-ui,sans-serif', marginBottom: 14, color: '#334155' }}>
                    <div><strong>{fmtLong(issueDate)}</strong></div>
                    <div><strong>STUDENT / EMP ID:</strong> {personId}</div>
                  </div>

                  <div style={{ fontSize: 14.5, lineHeight: 1.8, fontFamily: 'system-ui,sans-serif', color: '#1e293b' }}>
                    <p style={{ marginBottom: 12 }}>
                      <strong>Name:</strong> {personName}<br />
                      <strong style={{ color: '#0369a1' }}>Welcome to DS-TECHNOLOGIES</strong>
                    </p>
                    <p style={{ marginBottom: 12 }}>
                      Congratulations! We are delighted to offer you an <strong>{field || 'Software / IT / Digital Solutions'} Internship</strong> at
                      DS-TECHNOLOGIES. This letter confirms your selection effective from <strong>{fmtLong(fromDate)}</strong> to{' '}
                      <strong>{fmtLong(toDate)}</strong>
                      {duration ? <> (duration: <strong>{duration}</strong>)</> : null}.
                    </p>
                    <p style={{ marginBottom: 12 }}>
                      This internship is a learning opportunity. You will receive orientation, hands-on project work, and mentorship under our
                      engineering / operations team. You are expected to perform assigned work to the best of your ability and follow company policies.
                    </p>
                    <p style={{ marginBottom: 12 }}>
                      On successful completion you may receive an official <strong>Certificate of Internship</strong> from DS-TECHNOLOGIES. High
                      performers may be considered for full-time conversion subject to business needs.
                    </p>
                    <p style={{ marginBottom: 16 }}>We look forward to a fruitful association.</p>
                    <p>
                      Sincerely,<br /><br />
                      {sigFounder ? (
                        <img src={sigFounder} alt="sign" style={{ maxHeight: 50, display: 'block', marginBottom: 4 }} />
                      ) : (
                        <span style={{ fontStyle: 'italic', display: 'block', marginBottom: 4 }}>________________</span>
                      )}
                      <strong style={{ color: '#0369a1' }}>Divyanshu Gangwar</strong><br />
                      Founder & CEO, DS-TECHNOLOGIES
                    </p>
                  </div>

                  <div style={{
                    marginTop: 28,
                    paddingTop: 14,
                    borderTop: '1.5px solid #e2e8f0',
                    fontSize: 12,
                    color: '#64748b',
                    fontFamily: 'system-ui,sans-serif',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 8,
                  }}>
                    <span>📞 7895733906 · 7454910637</span>
                    <span>✉️ divyanshugangwar950@gmail.com</span>
                    <span>📍 Faridpur, Bareilly, UP</span>
                  </div>
                </div>
            </div>
            {(
              <div className="no-print" style={{ textAlign: 'center', marginTop: 12 }}>
                <button type="button" className="btn btn-primary" onClick={printDoc}>
                  Print / Download PDF
                </button>
              </div>
            )}
          </div>
        )}

        <div className="no-print" style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/careers/jobs" className="btn btn-primary" style={{ marginRight: 8 }}>
            View Jobs / Intern openings
          </Link>
          <Link to="/careers/apply" className="btn btn-outline">
            Apply Now
          </Link>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #ds-cert-internship, #ds-cert-internship *,
          #ds-cert-course, #ds-cert-course *,
          #ds-offer-letter, #ds-offer-letter * {
            visibility: visible !important;
          }
          #ds-cert-internship, #ds-cert-course, #ds-offer-letter {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: none !important;
            min-height: auto !important;
            margin: 0 !important;
            padding: 12mm 14mm !important;
            box-shadow: none !important;
            border: none !important;
            background: #fff !important;
            z-index: 99999 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print, .navbar, footer, header, nav { display: none !important; visibility: hidden !important; }
        }
      `}</style>

    </div>
  );
}
