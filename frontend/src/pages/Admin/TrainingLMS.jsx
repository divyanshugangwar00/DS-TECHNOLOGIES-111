import { useEffect, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function load(key, fb) {
  try {
    const r = localStorage.getItem(key);
    if (r) return JSON.parse(r);
  } catch {}
  return fb;
}

const DEMO_COURSES = [
  {
    id: 'lms-1',
    title: 'Company onboarding & culture',
    type: 'Video / Doc',
    level: 'Intern',
    link: '',
    description: 'Welcome kit, code of conduct, tools access, reporting structure.',
  },
  {
    id: 'lms-2',
    title: 'Git & coding guidelines',
    type: 'Guide',
    level: 'Junior',
    link: 'https://github.com',
    description: 'Branching, PR review, commit messages, DS coding standards.',
  },
  {
    id: 'lms-3',
    title: 'React + Node project starter',
    type: 'Project doc',
    level: 'Fresher',
    link: '',
    description: 'Sample architecture, folder structure, API patterns used at DS-TECHNOLOGIES.',
  },
];

export default function AdminTrainingLMS() {
  const { user } = useAuth();
  const [tab, setTab] = useState('lms');
  const [courses, setCourses] = useState(() => load('ds_lms_courses', DEMO_COURSES));
  const [tests, setTests] = useState(() => load('ds_lms_tests', []));
  const [results, setResults] = useState(() => load('ds_lms_results', []));
  const [msg, setMsg] = useState('');
  const [cForm, setCForm] = useState({ title: '', type: 'Guide', level: 'Intern', link: '', description: '' });
  const [tForm, setTForm] = useState({ title: '', durationMin: 30, passScore: 60, questionsNote: '' });
  const [rForm, setRForm] = useState({ candidate: '', testTitle: '', score: '', status: 'Pass' });

  useEffect(() => { localStorage.setItem('ds_lms_courses', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem('ds_lms_tests', JSON.stringify(tests)); }, [tests]);
  useEffect(() => { localStorage.setItem('ds_lms_results', JSON.stringify(results)); }, [results]);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container">
        <p>Training center — Admin / HR.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  return (
    <div className="section page-bg-training">
      <div className="container" style={{ maxWidth: 960 }}>
        <p>
          <Link to="/admin" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
        </p>
        <h1 className="section-title">🎓 Training & Onboarding Center</h1>
        <AdminHero variant="training" />
        <p className="section-subtitle">
          LMS materials for interns and freshers, plus assessment records after training.
        </p>
        {msg && <p style={{ color: '#34d399' }}>{msg}</p>}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
          <button type="button" className={tab === 'lms' ? 'btn btn-primary' : 'btn btn-outline'} onClick={() => setTab('lms')}>
            📚 LMS library
          </button>
          <button type="button" className={tab === 'tests' ? 'btn btn-primary' : 'btn btn-outline'} onClick={() => setTab('tests')}>
            ✍️ Tests & assessment
          </button>
          <button type="button" className={tab === 'results' ? 'btn btn-primary' : 'btn btn-outline'} onClick={() => setTab('results')}>
            📈 Results
          </button>
        </div>

        {tab === 'lms' && (
          <>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Add training material</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!cForm.title.trim()) return;
                  setCourses((c) => [{ id: `lms-${Date.now()}`, ...cForm }, ...c]);
                  setCForm({ title: '', type: 'Guide', level: 'Intern', link: '', description: '' });
                  setMsg('Material added to LMS.');
                }}
                style={{ display: 'grid', gap: '0.5rem' }}
              >
                <input
                  placeholder="Title *"
                  value={cForm.title}
                  onChange={(e) => setCForm({ ...cForm, title: e.target.value })}
                  required
                  style={{ padding: '0.5rem', borderRadius: 8 }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                  <select
                    value={cForm.type}
                    onChange={(e) => setCForm({ ...cForm, type: e.target.value })}
                    style={{ padding: '0.5rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}
                  >
                    <option>Video / Doc</option>
                    <option>Guide</option>
                    <option>Project doc</option>
                    <option>Slide deck</option>
                    <option>Checklist</option>
                  </select>
                  <select
                    value={cForm.level}
                    onChange={(e) => setCForm({ ...cForm, level: e.target.value })}
                    style={{ padding: '0.5rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}
                  >
                    <option>Intern</option>
                    <option>Fresher</option>
                    <option>Junior</option>
                    <option>All staff</option>
                  </select>
                  <input
                    placeholder="Link (Drive / YouTube / Git)"
                    value={cForm.link}
                    onChange={(e) => setCForm({ ...cForm, link: e.target.value })}
                    style={{ padding: '0.5rem', borderRadius: 8 }}
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={cForm.description}
                  onChange={(e) => setCForm({ ...cForm, description: e.target.value })}
                  rows={2}
                  style={{ padding: '0.5rem', borderRadius: 8 }}
                />
                <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
                  Publish to LMS
                </button>
              </form>
            </div>
            {courses.map((c) => (
              <div key={c.id} className="card" style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <strong style={{ color: '#e2e8f0' }}>{c.title}</strong>
                  <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    {c.type} · {c.level}
                  </span>
                </div>
                <p style={{ color: '#cbd5e1', margin: '0.35rem 0', fontSize: '0.9rem' }}>{c.description}</p>
                {c.link && (
                  <a href={c.link} target="_blank" rel="noreferrer" style={{ color: '#00d4ff', fontSize: '0.85rem' }}>
                    Open resource →
                  </a>
                )}
                <div>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ marginTop: 8, fontSize: '0.75rem' }}
                    onClick={() => setCourses((list) => list.filter((x) => x.id !== c.id))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'tests' && (
          <>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Create assessment</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setTests((t) => [{ id: `test-${Date.now()}`, ...tForm, createdAt: new Date().toISOString() }, ...t]);
                  setTForm({ title: '', durationMin: 30, passScore: 60, questionsNote: '' });
                  setMsg('Test template saved.');
                }}
                style={{ display: 'grid', gap: '0.5rem', maxWidth: 520 }}
              >
                <input
                  placeholder="Test title (e.g. Junior JS coding)"
                  value={tForm.title}
                  onChange={(e) => setTForm({ ...tForm, title: e.target.value })}
                  required
                  style={{ padding: '0.5rem', borderRadius: 8 }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <input
                    type="number"
                    placeholder="Duration (min)"
                    value={tForm.durationMin}
                    onChange={(e) => setTForm({ ...tForm, durationMin: e.target.value })}
                    style={{ padding: '0.5rem', borderRadius: 8 }}
                  />
                  <input
                    type="number"
                    placeholder="Pass score %"
                    value={tForm.passScore}
                    onChange={(e) => setTForm({ ...tForm, passScore: e.target.value })}
                    style={{ padding: '0.5rem', borderRadius: 8 }}
                  />
                </div>
                <textarea
                  placeholder="Topics / question bank notes (or external HackerRank link)"
                  value={tForm.questionsNote}
                  onChange={(e) => setTForm({ ...tForm, questionsNote: e.target.value })}
                  rows={3}
                  style={{ padding: '0.5rem', borderRadius: 8 }}
                />
                <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
                  Save test
                </button>
              </form>
            </div>
            {tests.map((t) => (
              <div key={t.id} className="card" style={{ marginBottom: '0.45rem' }}>
                <strong style={{ color: '#e2e8f0' }}>{t.title}</strong>
                <p style={{ color: '#94a3b8', margin: '0.25rem 0', fontSize: '0.9rem' }}>
                  {t.durationMin} min · Pass ≥ {t.passScore}%
                </p>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>{t.questionsNote}</p>
              </div>
            ))}
            {!tests.length && <p style={{ color: '#64748b' }}>No tests yet.</p>}
          </>
        )}

        {tab === 'results' && (
          <>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Record test result</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setResults((r) => [
                    { id: `res-${Date.now()}`, ...rForm, at: new Date().toISOString() },
                    ...r,
                  ]);
                  setRForm({ candidate: '', testTitle: '', score: '', status: 'Pass' });
                  setMsg('Result saved.');
                }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '0.5rem' }}
              >
                <input
                  placeholder="Candidate name"
                  value={rForm.candidate}
                  onChange={(e) => setRForm({ ...rForm, candidate: e.target.value })}
                  required
                  style={{ padding: '0.5rem', borderRadius: 8 }}
                />
                <input
                  list="test-titles"
                  placeholder="Test title"
                  value={rForm.testTitle}
                  onChange={(e) => setRForm({ ...rForm, testTitle: e.target.value })}
                  style={{ padding: '0.5rem', borderRadius: 8 }}
                />
                <datalist id="test-titles">
                  {tests.map((t) => (
                    <option key={t.id} value={t.title} />
                  ))}
                </datalist>
                <input
                  type="number"
                  placeholder="Score %"
                  value={rForm.score}
                  onChange={(e) => setRForm({ ...rForm, score: e.target.value })}
                  style={{ padding: '0.5rem', borderRadius: 8 }}
                />
                <select
                  value={rForm.status}
                  onChange={(e) => setRForm({ ...rForm, status: e.target.value })}
                  style={{ padding: '0.5rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}
                >
                  <option>Pass</option>
                  <option>Fail</option>
                  <option>Retake</option>
                </select>
                <button type="submit" className="btn btn-primary">
                  Save result
                </button>
              </form>
            </div>
            {results.map((r) => (
              <div key={r.id} className="card" style={{ marginBottom: '0.4rem' }}>
                <strong style={{ color: '#e2e8f0' }}>{r.candidate}</strong> · {r.testTitle}
                <span style={{ marginLeft: 8, color: r.status === 'Pass' ? '#34d399' : '#f87171' }}>
                  {r.score}% · {r.status}
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
