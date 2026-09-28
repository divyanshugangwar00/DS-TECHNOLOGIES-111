import { useEffect, useMemo, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const KANBAN_COLS = [
  { key: 'todo', label: 'To-Do', color: '#94a3b8' },
  { key: 'progress', label: 'In Progress', color: '#38bdf8' },
  { key: 'qa', label: 'In QA', color: '#fbbf24' },
  { key: 'done', label: 'Completed', color: '#34d399' },
];

const PRIORITIES = ['Critical', 'High', 'Medium', 'Low'];
const PROJECT_TYPES = ['Software', 'Web App', 'Mobile App', 'Cloud / DevOps', 'AI / Data', 'Internal HR', 'Other'];

const DEMO_PROJECTS = [
  {
    id: 'prj-1',
    name: 'DS Client Portal',
    type: 'Web App',
    status: 'progress',
    description: 'Client-facing dashboard for project status, invoices and support tickets.',
    repo: 'https://github.com/ds-technologies/client-portal',
    startDate: '2026-06-01',
    endDate: '2026-10-15',
    lead: 'Rohit Kumar',
    team: 'Frontend + Backend',
    milestones: [
      { title: 'UI wireframes', date: '2026-06-20', done: true },
      { title: 'Auth + API', date: '2026-07-30', done: true },
      { title: 'Beta release', date: '2026-09-15', done: false },
      { title: 'Production', date: '2026-10-15', done: false },
    ],
  },
  {
    id: 'prj-2',
    name: 'Mobile Attendance App',
    type: 'Mobile App',
    status: 'todo',
    description: 'Android/iOS check-in with geo-fence and offline sync for field staff.',
    repo: 'https://gitlab.com/ds-technologies/attendance-app',
    startDate: '2026-08-01',
    endDate: '2026-12-01',
    lead: 'Nikhil Gangwar',
    team: 'Mobile',
    milestones: [
      { title: 'Prototype', date: '2026-08-25', done: false },
      { title: 'Beta test', date: '2026-10-10', done: false },
    ],
  },
  {
    id: 'prj-3',
    name: 'HR Onboarding Suite',
    type: 'Internal HR',
    status: 'qa',
    description: 'Offer → joining form → document verify → employee ID pipeline.',
    repo: 'https://github.com/ds-technologies/hr-suite',
    startDate: '2026-04-01',
    endDate: '2026-09-01',
    lead: 'Soni',
    team: 'Full stack',
    milestones: [
      { title: 'Offer PDF', date: '2026-05-01', done: true },
      { title: 'Doc verify', date: '2026-07-01', done: true },
      { title: 'Hardening', date: '2026-08-20', done: false },
    ],
  },
];

function loadProjects() {
  try {
    const raw = localStorage.getItem('ds_projects');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {}
  return DEMO_PROJECTS;
}

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem('ds_project_tasks') || '[]');
  } catch {
    return [];
  }
}

export default function AdminProjects() {
  const { user } = useAuth();
  const [tab, setTab] = useState('board'); // board | kanban | tasks | milestones
  const [projects, setProjects] = useState(loadProjects);
  const [tasks, setTasks] = useState(loadTasks);
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [msg, setMsg] = useState('');

  const [pForm, setPForm] = useState({
    name: '',
    type: 'Web App',
    status: 'todo',
    description: '',
    repo: '',
    startDate: '',
    endDate: '',
    lead: '',
    team: '',
  });

  const [tForm, setTForm] = useState({
    title: '',
    projectId: '',
    assignee: '',
    priority: 'Medium',
    status: 'todo',
    deadline: '',
    filesNote: '',
  });

  const [mForm, setMForm] = useState({ projectId: '', title: '', date: '' });

  useEffect(() => {
    localStorage.setItem('ds_projects', JSON.stringify(projects));
  }, [projects]);
  useEffect(() => {
    localStorage.setItem('ds_project_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (!user) return;
    api
      .get('/employees')
      .then((res) => setEmployees(res.data || []))
      .catch(() => {});
  }, [user]);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container">
        <p>Project Management — Admin / HR (and tech leads) only.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  const selected = projects.find((p) => p.id === selectedId) || null;

  const addProject = (e) => {
    e.preventDefault();
    if (!pForm.name.trim()) return;
    const row = {
      id: `prj-${Date.now()}`,
      ...pForm,
      milestones: [],
    };
    setProjects((p) => [row, ...p]);
    setPForm({
      name: '',
      type: 'Web App',
      status: 'todo',
      description: '',
      repo: '',
      startDate: '',
      endDate: '',
      lead: '',
      team: '',
    });
    setMsg('Project added to board.');
    setTab('board');
  };

  const updateProjectStatus = (id, status) => {
    setProjects((list) => list.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const removeProject = (id) => {
    if (!window.confirm('Delete this project and its board card?')) return;
    setProjects((list) => list.filter((p) => p.id !== id));
    setTasks((list) => list.filter((t) => t.projectId !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!tForm.title.trim()) return;
    const row = {
      id: `task-${Date.now()}`,
      ...tForm,
      createdAt: new Date().toISOString(),
      createdBy: user.email,
    };
    setTasks((t) => [row, ...t]);
    setTForm({
      title: '',
      projectId: tForm.projectId,
      assignee: '',
      priority: 'Medium',
      status: 'todo',
      deadline: '',
      filesNote: '',
    });
    setMsg('Task assigned.');
    setTab('kanban');
  };

  const moveTask = (id, status) => {
    setTasks((list) => list.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const removeTask = (id) => {
    setTasks((list) => list.filter((t) => t.id !== id));
  };

  const addMilestone = (e) => {
    e.preventDefault();
    if (!mForm.projectId || !mForm.title.trim()) return;
    setProjects((list) =>
      list.map((p) =>
        p.id === mForm.projectId
          ? {
              ...p,
              milestones: [...(p.milestones || []), { title: mForm.title, date: mForm.date, done: false }],
            }
          : p
      )
    );
    setMForm({ projectId: mForm.projectId, title: '', date: '' });
    setMsg('Milestone added.');
  };

  const toggleMilestone = (projectId, index) => {
    setProjects((list) =>
      list.map((p) => {
        if (p.id !== projectId) return p;
        const ms = [...(p.milestones || [])];
        ms[index] = { ...ms[index], done: !ms[index].done };
        return { ...p, milestones: ms };
      })
    );
  };

  const tasksByCol = useMemo(() => {
    const map = { todo: [], progress: [], qa: [], done: [] };
    tasks.forEach((t) => {
      const k = map[t.status] ? t.status : 'todo';
      map[k].push(t);
    });
    return map;
  }, [tasks]);

  const priorityColor = (p) => {
    if (p === 'Critical' || p === 'High') return '#f87171';
    if (p === 'Medium') return '#fbbf24';
    return '#94a3b8';
  };

  const tabs = [
    { key: 'board', label: '📁 Project Board' },
    { key: 'kanban', label: '📋 Kanban / Sprint' },
    { key: 'tasks', label: '✅ Task Allocator' },
    { key: 'milestones', label: '🎯 Milestones' },
  ];

  return (
    <div className="section page-bg-projects">
      <div className="container" style={{ maxWidth: 1100 }}>
        <p style={{ marginBottom: '0.5rem' }}>
          <Link to="/admin" style={{ color: '#00d4ff' }}>
            ← Admin Dashboard
          </Link>
        </p>
        <h1 className="section-title">📁 Project Management (Development Tracker)</h1>
        <AdminHero variant="projects" />
        <p className="section-subtitle">
          Software, web and mobile projects — board, Kanban columns, task assignment, milestones and safe repo links.
        </p>
        {msg && (
          <p style={{ color: '#34d399', marginBottom: '0.75rem' }} onAnimationEnd={() => {}}>
            {msg}
          </p>
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              className={tab === t.key ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ fontSize: '0.85rem' }}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* PROJECT BOARD */}
        {tab === 'board' && (
          <>
            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Add project</h3>
              <form onSubmit={addProject} style={{ display: 'grid', gap: '0.65rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '0.65rem' }}>
                  <input
                    placeholder="Project name *"
                    value={pForm.name}
                    onChange={(e) => setPForm({ ...pForm, name: e.target.value })}
                    required
                    style={{ padding: '0.55rem', borderRadius: 8 }}
                  />
                  <select
                    value={pForm.type}
                    onChange={(e) => setPForm({ ...pForm, type: e.target.value })}
                    style={{ padding: '0.55rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}
                  >
                    {PROJECT_TYPES.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                  <select
                    value={pForm.status}
                    onChange={(e) => setPForm({ ...pForm, status: e.target.value })}
                    style={{ padding: '0.55rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}
                  >
                    {KANBAN_COLS.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <input
                    placeholder="Tech lead / manager"
                    value={pForm.lead}
                    onChange={(e) => setPForm({ ...pForm, lead: e.target.value })}
                    style={{ padding: '0.55rem', borderRadius: 8 }}
                  />
                  <input
                    type="date"
                    value={pForm.startDate}
                    onChange={(e) => setPForm({ ...pForm, startDate: e.target.value })}
                    style={{ padding: '0.55rem', borderRadius: 8 }}
                  />
                  <input
                    type="date"
                    value={pForm.endDate}
                    onChange={(e) => setPForm({ ...pForm, endDate: e.target.value })}
                    style={{ padding: '0.55rem', borderRadius: 8 }}
                  />
                </div>
                <input
                  placeholder="GitHub / GitLab repository URL"
                  value={pForm.repo}
                  onChange={(e) => setPForm({ ...pForm, repo: e.target.value })}
                  style={{ padding: '0.55rem', borderRadius: 8 }}
                />
                <input
                  placeholder="Team (e.g. Frontend + Backend)"
                  value={pForm.team}
                  onChange={(e) => setPForm({ ...pForm, team: e.target.value })}
                  style={{ padding: '0.55rem', borderRadius: 8 }}
                />
                <textarea
                  placeholder="Description"
                  value={pForm.description}
                  onChange={(e) => setPForm({ ...pForm, description: e.target.value })}
                  rows={2}
                  style={{ padding: '0.55rem', borderRadius: 8 }}
                />
                <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
                  Add to Project Board
                </button>
              </form>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1rem' }}>
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="card"
                  style={{
                    borderColor:
                      p.status === 'done'
                        ? 'rgba(52,211,153,0.35)'
                        : p.status === 'qa'
                          ? 'rgba(251,191,36,0.35)'
                          : 'rgba(0,212,255,0.12)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: KANBAN_COLS.find((c) => c.key === p.status)?.color || '#94a3b8',
                        fontWeight: 600,
                      }}
                    >
                      {KANBAN_COLS.find((c) => c.key === p.status)?.label || p.status} · {p.type}
                    </span>
                    <button type="button" className="btn btn-outline" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }} onClick={() => removeProject(p.id)}>
                      Delete
                    </button>
                  </div>
                  <h3 style={{ margin: '0.5rem 0 0.35rem', color: '#e2e8f0', fontSize: '1.1rem' }}>{p.name}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.55, margin: '0 0 0.5rem' }}>{p.description}</p>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0 0 0.35rem' }}>
                    Lead: {p.lead || '—'} · Team: {p.team || '—'}
                  </p>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0 0 0.5rem' }}>
                    {p.startDate || '—'} → {p.endDate || '—'}
                  </p>
                  {p.repo && (
                    <a href={p.repo} target="_blank" rel="noreferrer" style={{ color: '#00d4ff', fontSize: '0.85rem', wordBreak: 'break-all' }}>
                      🔗 Repository
                    </a>
                  )}
                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {KANBAN_COLS.map((c) => (
                      <button
                        key={c.key}
                        type="button"
                        className="btn btn-outline"
                        style={{
                          fontSize: '0.7rem',
                          padding: '0.25rem 0.45rem',
                          opacity: p.status === c.key ? 1 : 0.55,
                          borderColor: p.status === c.key ? c.color : undefined,
                        }}
                        onClick={() => updateProjectStatus(p.id, c.key)}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: '0.75rem', fontSize: '0.8rem' }}
                    onClick={() => {
                      setSelectedId(p.id);
                      setTab('milestones');
                    }}
                  >
                    Milestones ({(p.milestones || []).length})
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* KANBAN */}
        {tab === 'kanban' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(180px, 1fr))', gap: '0.75rem', overflowX: 'auto' }}>
            {KANBAN_COLS.map((col) => (
              <div
                key={col.key}
                style={{
                  background: 'rgba(15,23,42,0.85)',
                  borderRadius: 12,
                  border: `1px solid ${col.color}33`,
                  minHeight: 320,
                  padding: '0.75rem',
                }}
              >
                <h3 style={{ margin: '0 0 0.75rem', color: col.color, fontSize: '0.95rem' }}>
                  {col.label} ({tasksByCol[col.key].length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {tasksByCol[col.key].map((t) => {
                    const prj = projects.find((p) => p.id === t.projectId);
                    return (
                      <div
                        key={t.id}
                        style={{
                          background: 'rgba(30,41,59,0.9)',
                          borderRadius: 10,
                          padding: '0.65rem',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <strong style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>{t.title}</strong>
                        <p style={{ margin: '0.25rem 0', color: '#64748b', fontSize: '0.75rem' }}>{prj?.name || 'No project'}</p>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: priorityColor(t.priority) }}>
                          {t.priority} · {t.assignee || 'Unassigned'}
                        </p>
                        {t.deadline && (
                          <p style={{ margin: '0.2rem 0 0', color: '#94a3b8', fontSize: '0.75rem' }}>Due {t.deadline}</p>
                        )}
                        {t.filesNote && (
                          <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.72rem' }}>📎 {t.filesNote}</p>
                        )}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                          {KANBAN_COLS.filter((c) => c.key !== col.key).map((c) => (
                            <button
                              key={c.key}
                              type="button"
                              onClick={() => moveTask(t.id, c.key)}
                              style={{
                                fontSize: '0.65rem',
                                padding: '0.15rem 0.35rem',
                                borderRadius: 6,
                                border: '1px solid rgba(255,255,255,0.12)',
                                background: 'transparent',
                                color: c.color,
                                cursor: 'pointer',
                              }}
                            >
                              → {c.label}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => removeTask(t.id)}
                            style={{
                              fontSize: '0.65rem',
                              padding: '0.15rem 0.35rem',
                              borderRadius: 6,
                              border: '1px solid rgba(248,113,113,0.3)',
                              background: 'transparent',
                              color: '#f87171',
                              cursor: 'pointer',
                            }}
                          >
                            Del
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TASK ALLOCATOR */}
        {tab === 'tasks' && (
          <div className="card">
            <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Task Allocator</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Create tasks, set priority, assign developers, note attachments, and push to Kanban.
            </p>
            <form onSubmit={addTask} style={{ display: 'grid', gap: '0.65rem', maxWidth: 560 }}>
              <input
                placeholder="Task title *"
                value={tForm.title}
                onChange={(e) => setTForm({ ...tForm, title: e.target.value })}
                required
                style={{ padding: '0.55rem', borderRadius: 8 }}
              />
              <select
                value={tForm.projectId}
                onChange={(e) => setTForm({ ...tForm, projectId: e.target.value })}
                style={{ padding: '0.55rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}
              >
                <option value="">— Project (optional) —</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <input
                list="dev-list"
                placeholder="Assign to (developer / name)"
                value={tForm.assignee}
                onChange={(e) => setTForm({ ...tForm, assignee: e.target.value })}
                style={{ padding: '0.55rem', borderRadius: 8 }}
              />
              <datalist id="dev-list">
                {employees.slice(0, 80).map((e) => (
                  <option key={e._id || e.id || e.email} value={e.name || e.fullName} />
                ))}
              </datalist>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                <select
                  value={tForm.priority}
                  onChange={(e) => setTForm({ ...tForm, priority: e.target.value })}
                  style={{ padding: '0.55rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
                <select
                  value={tForm.status}
                  onChange={(e) => setTForm({ ...tForm, status: e.target.value })}
                  style={{ padding: '0.55rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}
                >
                  {KANBAN_COLS.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={tForm.deadline}
                  onChange={(e) => setTForm({ ...tForm, deadline: e.target.value })}
                  style={{ padding: '0.55rem', borderRadius: 8 }}
                />
              </div>
              <input
                placeholder="Attachment note (file names / drive link)"
                value={tForm.filesNote}
                onChange={(e) => setTForm({ ...tForm, filesNote: e.target.value })}
                style={{ padding: '0.55rem', borderRadius: 8 }}
              />
              <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
                Create & assign task
              </button>
            </form>
            <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.85rem' }}>
              Total tasks: {tasks.length}. Move cards on the Kanban tab.
            </p>
          </div>
        )}

        {/* MILESTONES */}
        {tab === 'milestones' && (
          <>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Add milestone / deadline</h3>
              <form onSubmit={addMilestone} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr auto', gap: '0.5rem', alignItems: 'end' }}>
                <select
                  value={mForm.projectId}
                  onChange={(e) => setMForm({ ...mForm, projectId: e.target.value })}
                  required
                  style={{ padding: '0.55rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}
                >
                  <option value="">Select project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="Milestone title"
                  value={mForm.title}
                  onChange={(e) => setMForm({ ...mForm, title: e.target.value })}
                  required
                  style={{ padding: '0.55rem', borderRadius: 8 }}
                />
                <input
                  type="date"
                  value={mForm.date}
                  onChange={(e) => setMForm({ ...mForm, date: e.target.value })}
                  style={{ padding: '0.55rem', borderRadius: 8 }}
                />
                <button type="submit" className="btn btn-primary">
                  Add
                </button>
              </form>
            </div>
            {projects.map((p) => (
              <div key={p.id} className="card" style={{ marginBottom: '0.75rem' }}>
                <h3 style={{ margin: '0 0 0.5rem', color: '#e2e8f0' }}>{p.name}</h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: 0 }}>
                  Target end: {p.endDate || '—'} · Status:{' '}
                  {KANBAN_COLS.find((c) => c.key === p.status)?.label}
                </p>
                {(p.milestones || []).length === 0 && (
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No milestones yet.</p>
                )}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {(p.milestones || []).map((m, i) => (
                    <li
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '0.4rem 0',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <input type="checkbox" checked={!!m.done} onChange={() => toggleMilestone(p.id, i)} />
                      <span style={{ color: m.done ? '#34d399' : '#e2e8f0', textDecoration: m.done ? 'line-through' : 'none' }}>
                        {m.title}
                      </span>
                      <span style={{ color: '#64748b', fontSize: '0.8rem', marginLeft: 'auto' }}>{m.date || '—'}</span>
                    </li>
                  ))}
                </ul>
                {p.repo && (
                  <p style={{ marginTop: '0.75rem' }}>
                    <a href={p.repo} target="_blank" rel="noreferrer" style={{ color: '#00d4ff' }}>
                      🔗 {p.repo}
                    </a>
                  </p>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
