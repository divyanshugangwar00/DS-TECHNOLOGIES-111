import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { JOBS_CATALOG } from '../../data/jobsCatalog';

const EXP_FILTERS = ['Fresher / Students', '0-1 years', '0-2 years', '1-3 years', '2-5 years', '3-6 years', 'Executives / 5+ years'];
const TYPE_FILTERS = ['Full-time', 'Internship', 'Part-time', 'Contract', 'Fresher'];
const DEPT_FILTERS = [
  'Engineering', 'Software Development', 'Data & AI', 'Cloud & DevOps', 'Cyber Security',
  'HR', 'Sales', 'Marketing', 'Operations', 'Customer Support', 'Finance', 'Design',
];

export default function Jobs() {
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [exp, setExp] = useState([]);
  const [types, setTypes] = useState([]);
  const [depts, setDepts] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const toggle = (list, setList, val) => {
    setList((prev) => (prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]));
    setPage(1);
  };

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return JOBS_CATALOG.filter((j) => {
      if (qq) {
        const blob = `${j.title} ${j.department} ${j.location} ${j.course} ${j.type}`.toLowerCase();
        if (!blob.includes(qq)) return false;
      }
      if (exp.length) {
        const ok = exp.some(
          (e) =>
            (j.experience || '').toLowerCase().includes(e.toLowerCase().slice(0, 6)) ||
            (e.includes('Fresher') && /fresher|intern|student|0-1/i.test(j.experience + j.type))
        );
        if (!ok) return false;
      }
      if (types.length) {
        const ok = types.some(
          (t) => j.type === t || (t === 'Fresher' && /fresher|intern/i.test(j.type + j.experience))
        );
        if (!ok) return false;
      }
      if (depts.length && !depts.includes(j.department)) return false;
      return true;
    });
  }, [q, exp, types, depts]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const slice = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="section page-bg-careers">
      <div className="container" style={{ maxWidth: 1100 }}>
        <nav style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
          <Link to="/" style={{ color: '#94a3b8' }}>Home</Link>
          {' / '}
          <Link to="/careers" style={{ color: '#94a3b8' }}>Careers</Link>
          {' / '}
          <Link to="/careers#join" style={{ color: '#94a3b8' }}>Join DS-TECHNOLOGIES</Link>
          {' / '}
          <span style={{ color: '#00d4ff' }}>Job search</span>
        </nav>

        <div
          style={{
            background: 'linear-gradient(135deg,#0c4a6e,#1e3a5f)',
            borderRadius: 12,
            padding: '1.5rem 1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <h1 style={{ margin: '0 0 1rem', color: '#fff', fontSize: '1.75rem' }}>Job search</h1>
          <div
            style={{
              display: 'flex',
              background: 'rgba(15,23,42,0.9)',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.12)',
              overflow: 'hidden',
              maxWidth: 560,
            }}
          >
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search jobs by location, profession or keywords"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#e2e8f0',
                padding: '0.85rem 1.2rem',
                outline: 'none',
              }}
            />
            <button type="button" className="btn btn-primary" style={{ borderRadius: 999, margin: 4 }}>
              →
            </button>
          </div>
          <p style={{ color: '#94a3b8', margin: '0.75rem 0 0', fontSize: '0.85rem' }}>
            {filtered.length.toLocaleString('en-IN')} open roles · jobs + internships
          </p>
        </div>

        <div className="jobs-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.25rem' }}>
          <div>
            {slice.map((j) => (
              <Link
                key={j._id}
                to={`/careers/jobs/${j._id}`}
                state={{ job: j }}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  background: 'rgba(15,23,42,0.75)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 10,
                  padding: '1rem 1.15rem',
                  marginBottom: '0.65rem',
                  color: 'inherit',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '1.05rem' }}>{j.title} →</h3>
                    <p style={{ margin: '0.35rem 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>{j.location}</p>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#cbd5e1' }}>
                    <div>{j.department}</div>
                    <div style={{ color: '#64748b' }}>{j.type}</div>
                    <div style={{ color: '#94a3b8' }}>{j.experience}</div>
                  </div>
                </div>
              </Link>
            ))}
            {slice.length === 0 && (
              <p style={{ color: '#94a3b8' }}>No jobs match. Clear filters or change keyword.</p>
            )}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: '1.25rem', flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                ‹
              </button>
              {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
                const n = Math.min(totalPages, Math.max(1, page - 4)) + i;
                if (n > totalPages) return null;
                return (
                  <button
                    key={n}
                    type="button"
                    className={n === page ? 'btn btn-primary' : 'btn btn-outline'}
                    style={{ minWidth: 36, padding: '0.35rem 0.5rem' }}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                );
              })}
              <button
                type="button"
                className="btn btn-outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                ›
              </button>
            </div>
          </div>

          <aside
            style={{
              background: 'rgba(15,23,42,0.9)',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '1rem',
              height: 'fit-content',
              position: 'sticky',
              top: 88,
            }}
          >
            <h3 style={{ margin: '0 0 0.75rem', color: '#e2e8f0', fontSize: '1rem' }}>Filters</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: 4 }}>Experience level</p>
            {EXP_FILTERS.map((e) => (
              <label key={e} style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: 4 }}>
                <input type="checkbox" checked={exp.includes(e)} onChange={() => toggle(exp, setExp, e)} /> {e}
              </label>
            ))}
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0.85rem 0 4px' }}>Type</p>
            {TYPE_FILTERS.map((e) => (
              <label key={e} style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: 4 }}>
                <input type="checkbox" checked={types.includes(e)} onChange={() => toggle(types, setTypes, e)} /> {e}
              </label>
            ))}
            <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0.85rem 0 4px' }}>Department</p>
            {DEPT_FILTERS.map((e) => (
              <label key={e} style={{ display: 'block', fontSize: '0.82rem', color: '#cbd5e1', marginBottom: 4 }}>
                <input type="checkbox" checked={depts.includes(e)} onChange={() => toggle(depts, setDepts, e)} /> {e}
              </label>
            ))}
            <button
              type="button"
              className="btn btn-outline"
              style={{ width: '100%', marginTop: 12 }}
              onClick={() => {
                setExp([]);
                setTypes([]);
                setDepts([]);
                setQ('');
                setPage(1);
              }}
            >
              Clear
            </button>
          </aside>
        </div>

        <p style={{ marginTop: '1.5rem' }}>
          <Link to="/careers" style={{ color: '#00d4ff' }}>← Careers</Link>
          {' · '}
          <Link to="/careers/internship" style={{ color: '#00d4ff' }}>Internship</Link>
        </p>
      </div>
      <style>{`@media (max-width:860px){.jobs-layout{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
