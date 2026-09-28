import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const emptyEdu = () => ({ id: uid(), degree: '', institution: '', year: '', score: '' });
const emptyExp = () => ({ id: uid(), title: '', company: '', duration: '', points: '' });
const emptyProj = () => ({ id: uid(), title: '', tech: '', description: '' });

const RESUME_SAMPLE = {
  mode: 'resume',
  fullName: 'Aarav Sharma',
  headline: 'Frontend Developer · React',
  email: 'aarav.sharma@email.com',
  phone: '+91 98765 43210',
  city: 'Bareilly, UP',
  linkedin: 'linkedin.com/in/aarav-dev',
  github: 'github.com/aarav-dev',
  summary: 'Frontend developer with strong React skills. Built responsive UIs and integrated REST APIs. Seeking a full-time role in a product team.',
  skills: 'React, JavaScript, HTML, CSS, Tailwind, Git, REST APIs',
  education: [{ id: uid(), degree: 'BCA', institution: 'XYZ College, Bareilly', year: '2024', score: '78%' }],
  experience: [{ id: uid(), title: 'Web Intern', company: 'DS-TECHNOLOGIES', duration: 'Jun–Aug 2025', points: 'Built admin dashboard screens in React\nFixed UI bugs and improved form validation' }],
  projects: [{ id: uid(), title: 'Job Portal UI', tech: 'React, Vite', description: 'Multi-page careers portal with filters and apply form.' }],
  certifications: '',
  languages: 'English, Hindi',
};

const CV_SAMPLE = {
  mode: 'resume',
  fullName: 'Aarav Sharma',
  headline: 'Full Stack Developer | MERN | Open Source',
  email: 'aarav.sharma@email.com',
  phone: '+91 98765 43210',
  city: 'Bareilly, Uttar Pradesh, India',
  linkedin: 'linkedin.com/in/aarav-dev',
  github: 'github.com/aarav-dev · portfolio.example.com',
  summary: 'Detail-oriented full stack developer with hands-on experience across the MERN stack. Comfortable owning features from UI to API design, writing clean components, and collaborating with designers and backend engineers. Interested in scalable web products, developer tools, and continuous learning.',
  skills: 'React, Node.js, Express, MongoDB, JavaScript, TypeScript, HTML5, CSS3, Tailwind, Redux, Git, GitHub, REST, JWT, Postman, Vite',
  education: [
    { id: uid(), degree: 'Bachelor of Computer Applications (BCA)', institution: 'XYZ College, MJP Rohilkhand University', year: '2021–2024', score: '78%' },
    { id: uid(), degree: 'Senior Secondary (12th)', institution: 'ABC Intermediate College', year: '2021', score: '82%' },
  ],
  experience: [
    { id: uid(), title: 'Full Stack Intern', company: 'DS-TECHNOLOGIES, Bareilly', duration: 'Jun 2025 – Aug 2025', points: 'Developed modules for employee attendance and job applications\nIntegrated Node/Express APIs with React admin panel\nParticipated in code reviews and daily stand-ups' },
    { id: uid(), title: 'Freelance Web Developer', company: 'Self-employed', duration: '2024 – Present', points: 'Delivered landing pages and small business websites\nManaged hosting, forms, and basic SEO setup' },
  ],
  projects: [
    { id: uid(), title: 'Company Careers Portal', tech: 'React, Node, MongoDB', description: 'End-to-end job listing, apply flow, and admin shortlisting dashboard with file upload for resumes.' },
    { id: uid(), title: 'Attendance Tracker', tech: 'React, Express', description: 'Department filters, Present/Absent/Half-day marking, and history export for HR teams.' },
    { id: uid(), title: 'Personal Portfolio', tech: 'HTML, CSS, JS', description: 'Responsive portfolio with project gallery and contact form.' },
  ],
  certifications: 'Web Development Bootcamp — 2024\nJavaScript Algorithms — freeCodeCamp\nGit & GitHub Essentials',
  languages: 'English (Professional), Hindi (Native)',
};

const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  border: '1px solid #334155', background: '#0b1220', color: '#e2e8f0', outline: 'none', fontSize: '0.95rem',
};

function Section({ title, children, action }) {
  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

export default function ResumeBuilder() {
  const [form, setForm] = useState({ ...RESUME_SAMPLE, mode: 'resume' });
  const [tab, setTab] = useState('builder');

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const updateList = (key, id, field, value) =>
    setForm((f) => ({ ...f, [key]: f[key].map((i) => (i.id === id ? { ...i, [field]: value } : i)) }));
  const addItem = (key, factory) => setForm((f) => ({ ...f, [key]: [...f[key], factory()] }));
  const removeItem = (key, id) => setForm((f) => ({ ...f, [key]: f[key].filter((i) => i.id !== id) }));

  const switchMode = (mode) => {
    if (mode === 'resume') {
      setForm((f) => ({
        ...RESUME_SAMPLE,
        ...f,
        mode: 'resume',
        summary: f.summary?.length > 280 ? f.summary.slice(0, 280) : f.summary,
        experience: (f.experience || []).slice(0, 2),
        projects: (f.projects || []).slice(0, 2),
        education: (f.education || []).slice(0, 2),
        certifications: '',
      }));
    } else {
      setForm((f) => ({
        ...f,
        mode: 'resume',
        // keep user data; expand capacity — if mostly empty load CV sample structure
      }));
    }
    setTab('builder');
  };

  const loadSample = (mode) => {
    setForm({ ...RESUME_SAMPLE, mode: 'resume' });
    setTab('builder');
  };

  const handlePrint = () => {
    setTimeout(() => window.print(), 150);
  };

  const isResume = form.mode === 'resume';

  const completion = useMemo(() => {
    const checks = [form.fullName, form.email, form.phone, form.summary, form.skills, form.education?.[0]?.degree, form.experience?.[0]?.title || form.projects?.[0]?.title];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [form]);

  const renderPaper = () => (
    <div id="resume-print-area" className={`rb-paper ${isResume ? 'rb-a4-resume' : 'rb-cv'}`}>
      <header className="rb-header">
        <h1>{form.fullName || 'Your Name'}</h1>
        <div className="rb-headline">{form.headline || (isResume ? 'Role / Title' : 'Professional Title')}</div>
        <div className="rb-contact">
          {[form.email, form.phone, form.city, form.linkedin, form.github].filter(Boolean).join('  ·  ')}
        </div>
      </header>

      {form.summary && (
        <section className="rb-sec">
          <h2>{isResume ? 'Summary' : 'Professional Profile'}</h2>
          <p>{form.summary}</p>
        </section>
      )}

      {form.skills && (
        <section className="rb-sec">
          <h2>{isResume ? 'Skills' : 'Technical Skills'}</h2>
          <p>{form.skills}</p>
        </section>
      )}

      {(form.experience || []).some((e) => e.title || e.company) && (
        <section className="rb-sec">
          <h2>{isResume ? 'Experience' : 'Work Experience'}</h2>
          {form.experience.map((e) =>
            e.title || e.company ? (
              <div key={e.id} className="rb-item">
                <div className="rb-item-main">
                  <strong>{e.title}</strong>
                  <span>{e.company}</span>
                  {e.points && (
                    <ul className="rb-bullets">
                      {e.points.split('\n').filter(Boolean).map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="rb-item-side">{e.duration}</div>
              </div>
            ) : null
          )}
        </section>
      )}

      {(form.projects || []).some((p) => p.title) && (
        <section className="rb-sec">
          <h2>{isResume ? 'Projects' : 'Key Projects'}</h2>
          {form.projects.map((p) =>
            p.title ? (
              <div key={p.id} style={{ marginBottom: 8 }}>
                <strong>{p.title}</strong>
                {p.tech && <span style={{ color: '#64748b' }}> — {p.tech}</span>}
                {p.description && <p style={{ margin: '2px 0 0' }}>{p.description}</p>}
              </div>
            ) : null
          )}
        </section>
      )}

      {(form.education || []).some((e) => e.degree) && (
        <section className="rb-sec">
          <h2>Education</h2>
          {form.education.map((e) =>
            e.degree ? (
              <div key={e.id} className="rb-item">
                <div className="rb-item-main">
                  <strong>{e.degree}</strong>
                  <span>{e.institution}{e.score ? ` · ${e.score}` : ''}</span>
                </div>
                <div className="rb-item-side">{e.year}</div>
              </div>
            ) : null
          )}
        </section>
      )}

      {!isResume && form.certifications && (
        <section className="rb-sec">
          <h2>Certifications</h2>
          <ul className="rb-bullets">
            {form.certifications.split('\n').filter(Boolean).map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </section>
      )}

      {form.languages && (
        <section className="rb-sec">
          <h2>Languages</h2>
          <p>{form.languages}</p>
        </section>
      )}

      {!isResume && (
        <section className="rb-sec">
          <h2>Declaration</h2>
          <p style={{ fontSize: '10pt', color: '#475569' }}>
            I hereby declare that the information provided above is true to the best of my knowledge.
          </p>
        </section>
      )}
    </div>
  );

  return (
    <div className="rb-page">
      <div className="container section" style={{ paddingTop: '6.5rem' }}>
        <div className="rb-hero card">
          <div>
            <div className="rb-kicker">DS-TECHNOLOGIES · SMART RESUME STUDIO</div>
            <h1 style={{ margin: '0.35rem 0', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
              {isResume ? (
                <>Build a <span style={{ color: '#22d3ee' }}>1-page Resume</span> that feels like you.</>
              ) : (
                <>Build a <span style={{ color: '#c4b5fd' }}>detailed CV</span> for complete profiles.</>
              )}
            </h1>
            <p style={{ color: '#94a3b8', margin: 0, maxWidth: 560 }}>
              'A4 single-page professional resume — short summary, top skills, 1–2 roles, key projects. Best for job applications & ATS.'
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#67e8f9' }}>{completion}%</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Profile complete</div>
          </div>
        </div>

        <div className="rb-tabs no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '1rem 0' }}>
          <button type="button" className="btn btn-primary" onClick={handlePrint}>Print / Save PDF</button>
          <button type="button" className="btn btn-outline" onClick={() => loadSample('resume')}>
            Load Resume sample
          </button>
          <Link to="/portfolio-builder" className="btn btn-outline">Portfolio Builder</Link>
        </div>

        {true && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px', gap: '1rem' }} className="rb-grid">
            <div>
              <div className="card" style={{ marginBottom: '1rem', borderColor: isResume ? 'rgba(34,211,238,0.35)' : 'rgba(167,139,250,0.4)' }}>
                <strong style={{ color: isResume ? '#22d3ee' : '#c4b5fd' }}>
                  {isResume ? 'Resume mode active' : 'Resume mode active'}
                </strong>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: '6px 0 0' }}>
                  {isResume
                    ? 'Keep content short. Extra CV-only sections (long certs list, declaration) stay hidden.'
                    : 'All sections unlocked: multiple jobs, certifications, longer summary, declaration on print.'}
                </p>
              </div>

              <Section title="Identity">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <label style={{ display: 'block' }}>Full name<input style={inputStyle} value={form.fullName} onChange={(e) => update('fullName', e.target.value)} /></label>
                  <label style={{ display: 'block' }}>Headline<input style={inputStyle} value={form.headline} onChange={(e) => update('headline', e.target.value)} placeholder={isResume ? 'e.g. React Developer' : 'e.g. Full Stack Developer | MERN'} /></label>
                  <label style={{ display: 'block' }}>Email<input style={inputStyle} value={form.email} onChange={(e) => update('email', e.target.value)} /></label>
                  <label style={{ display: 'block' }}>Phone<input style={inputStyle} value={form.phone} onChange={(e) => update('phone', e.target.value)} /></label>
                  <label style={{ display: 'block' }}>City<input style={inputStyle} value={form.city} onChange={(e) => update('city', e.target.value)} /></label>
                  <label style={{ display: 'block' }}>LinkedIn<input style={inputStyle} value={form.linkedin} onChange={(e) => update('linkedin', e.target.value)} /></label>
                  <label style={{ display: 'block', gridColumn: '1 / -1' }}>GitHub / Portfolio<input style={inputStyle} value={form.github} onChange={(e) => update('github', e.target.value)} /></label>
                </div>
              </Section>

              <Section title={isResume ? 'Professional Summary (2–3 lines max)' : 'Career Summary (detailed)'}>
                <textarea
                  style={{ ...inputStyle, minHeight: isResume ? 72 : 130, resize: 'vertical' }}
                  value={form.summary}
                  onChange={(e) => update('summary', e.target.value)}
                  placeholder={isResume ? 'Short, punchy summary for recruiters…' : 'Longer professional narrative, goals, strengths…'}
                />
              </Section>

              <Section title={isResume ? 'Core Skills' : 'Technical & Soft Skills'}>
                <input style={inputStyle} value={form.skills} onChange={(e) => update('skills', e.target.value)} placeholder={isResume ? 'React, JS, CSS…' : 'List tools, languages, frameworks, soft skills…'} />
              </Section>

              <Section title="Education" action={<button type="button" className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => addItem('education', emptyEdu)}>+ Add</button>}>
                {form.education.map((edu) => (
                  <div key={edu.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <input style={inputStyle} placeholder="Degree" value={edu.degree} onChange={(e) => updateList('education', edu.id, 'degree', e.target.value)} />
                    <input style={inputStyle} placeholder="Institution" value={edu.institution} onChange={(e) => updateList('education', edu.id, 'institution', e.target.value)} />
                    <input style={inputStyle} placeholder="Year" value={edu.year} onChange={(e) => updateList('education', edu.id, 'year', e.target.value)} />
                    <input style={inputStyle} placeholder="Score" value={edu.score} onChange={(e) => updateList('education', edu.id, 'score', e.target.value)} />
                    {form.education.length > 1 && (
                      <button type="button" style={{ ...inputStyle, color: '#f87171', cursor: 'pointer', gridColumn: '1 / -1' }} onClick={() => removeItem('education', edu.id)}>Remove</button>
                    )}
                  </div>
                ))}
              </Section>

              <Section
                title={isResume ? 'Experience / Internships (1–2 max ideal)' : 'Work Experience (all roles)'}
                action={<button type="button" className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => addItem('experience', emptyExp)}>+ Add</button>}
              >
                {form.experience.map((exp) => (
                  <div key={exp.id} style={{ marginBottom: '0.85rem', paddingBottom: '0.75rem', borderBottom: '1px solid #1e293b' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <input style={inputStyle} placeholder="Title" value={exp.title} onChange={(e) => updateList('experience', exp.id, 'title', e.target.value)} />
                      <input style={inputStyle} placeholder="Company" value={exp.company} onChange={(e) => updateList('experience', exp.id, 'company', e.target.value)} />
                      <input style={inputStyle} placeholder="Duration" value={exp.duration} onChange={(e) => updateList('experience', exp.id, 'duration', e.target.value)} />
                    </div>
                    <textarea style={{ ...inputStyle, minHeight: isResume ? 56 : 90, marginTop: 6 }} placeholder="Bullet points — one per line" value={exp.points} onChange={(e) => updateList('experience', exp.id, 'points', e.target.value)} />
                    {form.experience.length > 1 && (
                      <button type="button" style={{ ...inputStyle, color: '#f87171', cursor: 'pointer', marginTop: 4 }} onClick={() => removeItem('experience', exp.id)}>Remove</button>
                    )}
                  </div>
                ))}
              </Section>

              <Section
                title={isResume ? 'Projects (highlight 1–2)' : 'Projects (portfolio depth)'}
                action={<button type="button" className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.8rem' }} onClick={() => addItem('projects', emptyProj)}>+ Add</button>}
              >
                {form.projects.map((p) => (
                  <div key={p.id} style={{ marginBottom: '0.75rem' }}>
                    <input style={inputStyle} placeholder="Project title" value={p.title} onChange={(e) => updateList('projects', p.id, 'title', e.target.value)} />
                    <input style={{ ...inputStyle, marginTop: 4 }} placeholder="Tech stack" value={p.tech} onChange={(e) => updateList('projects', p.id, 'tech', e.target.value)} />
                    <textarea style={{ ...inputStyle, minHeight: isResume ? 48 : 72, marginTop: 4 }} placeholder="Description" value={p.description} onChange={(e) => updateList('projects', p.id, 'description', e.target.value)} />
                    {form.projects.length > 1 && (
                      <button type="button" style={{ ...inputStyle, color: '#f87171', cursor: 'pointer', marginTop: 4 }} onClick={() => removeItem('projects', p.id)}>Remove</button>
                    )}
                  </div>
                ))}
              </Section>

              {!isResume && (
                <Section title="Certifications (CV only)">
                  <textarea style={{ ...inputStyle, minHeight: 80 }} value={form.certifications} onChange={(e) => update('certifications', e.target.value)} placeholder="One certification per line" />
                </Section>
              )}

              <Section title="Languages">
                <input style={inputStyle} value={form.languages} onChange={(e) => update('languages', e.target.value)} placeholder="English, Hindi…" />
              </Section>
            </div>

            <div className="card" style={{ height: 'fit-content', position: 'sticky', top: 90 }}>
              <h3 style={{ marginTop: 0 }}>{isResume ? 'Resume checklist' : 'CV checklist'}</h3>
              <ul style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.75, paddingLeft: '1.1rem' }}>
                {isResume ? (
                  <>
                    <li>One A4 page only</li>
                    <li>Short summary (2–3 lines)</li>
                    <li>Top 6–10 skills</li>
                    <li>1–2 jobs or internships</li>
                    <li>Strong project bullets</li>
                  </>
                ) : (
                  <>
                    <li>Full education timeline</li>
                    <li>All relevant work history</li>
                    <li>Certifications section</li>
                    <li>Longer professional profile</li>
                    <li>Declaration on final page</li>
                  </>
                )}
              </ul>
              <div style={{ marginTop: '1rem', color: '#67e8f9' }}>{completion}% ready</div>
              <button type="button" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={handlePrint}>Print / Save PDF</button>
              <button type="button" className="btn btn-outline" style={{ width: '100%', marginTop: '0.5rem' }} onClick={() => loadSample('resume')}>
                Fill sample Resume
              </button>
              <Link to="/portfolio-builder" className="btn btn-outline" style={{ width: '100%', marginTop: '0.5rem', display: 'inline-flex', justifyContent: 'center' }}>Portfolio Builder</Link>
              <Link to="/careers" className="btn btn-outline" style={{ width: '100%', marginTop: '0.5rem', display: 'inline-flex', justifyContent: 'center' }}>Back to Careers</Link>
            </div>
          </div>
        )}

        <div className="preview-hidden-on-screen" aria-hidden="true">
          {renderPaper()}
        </div>
      </div>

      <style>{`
        .rb-page {
          min-height: 100vh;
          background:
            radial-gradient(ellipse at 10% 0%, rgba(34,211,238,0.12), transparent 40%),
            radial-gradient(ellipse at 90% 10%, rgba(167,139,250,0.14), transparent 35%),
            radial-gradient(ellipse at 50% 100%, rgba(244,114,182,0.08), transparent 40%),
            #050814;
        }
        .rb-hero {
          display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;
          background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,27,75,0.5));
          border: 1px solid rgba(103,232,249,0.2);
        }
        .rb-kicker { font-size: 0.72rem; letter-spacing: 0.14em; color: #67e8f9; font-weight: 700; }
        .preview-hidden-on-screen { position: absolute; left: -9999px; top: 0; }
        .rb-paper { background: #fff; color: #0f172a; margin: 0 auto; box-shadow: 0 12px 40px rgba(0,0,0,0.35); }
        .rb-a4-resume { width: 210mm; max-width: 100%; min-height: 297mm; padding: 14mm 16mm; font-size: 10.5pt; line-height: 1.35; }
        .rb-cv { width: 210mm; max-width: 100%; min-height: 297mm; padding: 16mm 18mm; font-size: 11pt; line-height: 1.45; }
        .rb-header { border-bottom: 2px solid #1e40af; padding-bottom: 8px; margin-bottom: 12px; }
        .rb-header h1 { margin: 0; font-size: 22pt; color: #0f172a; }
        .rb-headline { color: #1d4ed8; font-weight: 600; margin-top: 2px; }
                .rb-contact { font-size: 9pt; color: #475569; margin-top: 4px; }
        .rb-sec { margin-bottom: 10px; }
        .rb-sec h2 { font-size: 11pt; text-transform: uppercase; letter-spacing: 0.06em; color: #1e40af; border-bottom: 1px solid #cbd5e1; margin: 0 0 6px; padding-bottom: 2px; }
        .rb-sec p { margin: 0; color: #1e293b; }
        .rb-item { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 6px; }
        .rb-item-main { display: flex; flex-direction: column; }
        .rb-item-side { color: #64748b; font-size: 9.5pt; white-space: nowrap; }
        .rb-bullets { margin: 4px 0 0; padding-left: 18px; color: #1e293b; }
        .rb-bullets li { margin-bottom: 2px; }
        @media (max-width: 900px) { .rb-grid { grid-template-columns: 1fr !important; } }
        @media print {
          @page { size: A4 portrait; margin: 12mm; }
          html, body {
            background: #fff !important;
            color: #000 !important;
            height: auto !important;
            overflow: visible !important;
          }
          body * { visibility: hidden !important; }
          #resume-print-area,
          #resume-print-area * {
            visibility: visible !important;
          }
          .preview-hidden-on-screen {
            position: static !important;
            left: auto !important;
            top: auto !important;
          }
          #resume-print-area {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            right: 0 !important;
            width: 210mm !important;
            max-width: 100% !important;
            min-height: auto !important;
            margin: 0 auto !important;
            padding: 12mm 14mm !important;
            box-shadow: none !important;
            background: #ffffff !important;
            color: #0f172a !important;
            z-index: 99999 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print,
          .navbar,
          header.navbar,
          footer,
          .rb-hero,
          .rb-tabs,
          .rb-page > .container > .rb-grid {
            display: none !important;
            visibility: hidden !important;
          }
        }
      `}</style>
    </div>
  );
}
