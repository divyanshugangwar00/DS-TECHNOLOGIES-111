import { useEffect, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../../components/ErrorMessage';

const DEPTS = ['Engineering', 'Data & AI', 'Cloud', 'Cybersecurity', 'Consulting', 'HR', 'Sales', 'Marketing', 'Operations', 'Design', 'Finance', 'Leadership', 'Medical', 'Healthcare IT', 'Technology'];
const TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'];
const empty = {
  title: '',
  department: 'Engineering',
  location: 'Bareilly / Hybrid / Remote',
  type: 'Full-time',
  experience: '0-2 years',
  salaryRange: '',
  description: '',
  requirements: '',
  responsibilities: '',
  skills: '',
  openings: 1,
  status: 'Open',
};

export default function AdminJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filterDept, setFilterDept] = useState('All');

  const fetchJobs = () => {
    api.get('/jobs').then((res) => setJobs(res.data || [])).catch(console.error);
  };

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'hr')) fetchJobs();
  }, [user]);

  const openCreate = () => {
    setEditId(null);
    setForm(empty);
    setShowForm(true);
  };

  const openEdit = (job) => {
    setEditId(job._id);
    setForm({
      title: job.title || '',
      department: job.department || 'Engineering',
      location: job.location || '',
      type: job.type || 'Full-time',
      experience: job.experience || '',
      salaryRange: job.salaryRange || '',
      description: job.description || '',
      requirements: (job.requirements || []).join(', '),
      responsibilities: (job.responsibilities || []).join(', '),
      skills: (job.skills || []).join(', '),
      openings: job.openings || 1,
      status: job.status || 'Open',
    });
    setShowForm(true);
  };

  const payload = () => ({
    title: form.title,
    department: form.department,
    location: form.location,
    type: form.type,
    experience: form.experience,
    salaryRange: form.salaryRange,
    description: form.description,
    requirements: form.requirements.split(',').map((s) => s.trim()).filter(Boolean),
    responsibilities: form.responsibilities.split(',').map((s) => s.trim()).filter(Boolean),
    skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
    openings: Number(form.openings) || 1,
    status: form.status,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editId) await api.put(`/jobs/${editId}`, payload());
      else await api.post('/jobs', payload());
      setShowForm(false);
      setEditId(null);
      setForm(empty);
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const setStatus = async (id, status) => {
    try {
      await api.put(`/jobs/${id}`, { status });
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || 'Status update failed');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this job permanently?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return <div className="section container"><p>Access denied</p></div>;
  }

  const list = filterDept === 'All' ? jobs : jobs.filter((j) => j.department === filterDept);

  return (
    <div className="section page-bg-admin">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 className="section-title" style={{ margin: 0 }}>Manage Jobs</h1>
        <AdminHero variant="default" />
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} style={{ padding: '0.5rem', background: '#0f172a', color: '#e2e8f0', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)' }}>
              <option value="All">All Departments</option>
              {DEPTS.map((d) => <option key={d}>{d}</option>)}
            </select>
            <button type="button" className="btn btn-primary" onClick={openCreate}>+ New Job / Internship</button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>{editId ? 'Edit Job' : 'Add Job / Internship'}</h3>
            <ErrorMessage message={error} />
            <div className="grid-2">
              <div className="form-group">
                <label>Job Position / Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Frontend Intern" />
              </div>
              <div className="form-group">
                <label>Department *</label>
                <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} style={{ background: '#0f172a', color: '#e2e8f0' }}>
                  {DEPTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Employment Type (Internship option)</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ background: '#0f172a', color: '#e2e8f0' }}>
                  {TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Experience</label>
                <input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="Fresher / 0-2 years" />
              </div>
              <div className="form-group">
                <label>Salary / Stipend package</label>
                <input value={form.salaryRange} onChange={(e) => setForm({ ...form, salaryRange: e.target.value })} placeholder="₹10,000 – ₹15,000 / month" />
              </div>
              <div className="form-group">
                <label>Vacancies</label>
                <input type="number" min={1} value={form.openings} onChange={(e) => setForm({ ...form, openings: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={{ background: '#0f172a', color: '#e2e8f0' }}>
                  <option>Open</option>
                  <option>Closed</option>
                  <option>Draft</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Job Description *</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Required course / education (comma separated)</label>
              <input value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} placeholder="BCA, B.Tech, MCA, Diploma" />
            </div>
            <div className="form-group">
              <label>Responsibilities (comma separated)</label>
              <input value={form.responsibilities} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Required skills (comma separated)</label>
              <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, Communication" />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving…' : editId ? 'Update Job' : 'Create Job'}</button>
              <button type="button" className="btn btn-outline" onClick={() => { setShowForm(false); setEditId(null); }}>Cancel</button>
            </div>
          </form>
        )}

        <div className="grid-2">
          {list.map((job) => (
            <div className="card" key={job._id}>
              <h3>{job.title}</h3>
              <p style={{ color: '#00d4ff' }}>{job.department} · {job.type}</p>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{job.location} · {job.experience}</p>
              {job.salaryRange && <p style={{ color: '#10b981' }}>{job.salaryRange}</p>}
              <p style={{ marginTop: '0.5rem' }}>
                <span style={{ padding: '0.2rem 0.5rem', borderRadius: 8, fontSize: '0.75rem', background: job.status === 'Open' ? 'rgba(16,185,129,0.2)' : 'rgba(148,163,184,0.2)', color: job.status === 'Open' ? '#10b981' : '#94a3b8' }}>{job.status}</span>
                {job.openings ? ` · ${job.openings} opening(s)` : ''}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
                <button type="button" className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => openEdit(job)}>Edit</button>
                {job.status !== 'Open' && <button type="button" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: 6, border: '1px solid #10b981', background: 'rgba(16,185,129,0.15)', color: '#10b981' }} onClick={() => setStatus(job._id, 'Open')}>Reopen</button>}
                {job.status === 'Open' && <button type="button" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: 6, border: '1px solid #fbbf24', background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }} onClick={() => setStatus(job._id, 'Closed')}>Close</button>}
                <button type="button" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', borderRadius: 6, border: '1px solid #ef4444', background: 'rgba(239,68,68,0.12)', color: '#fca5a5' }} onClick={() => remove(job._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
        {list.length === 0 && <p style={{ color: '#94a3b8' }}>No jobs. Create one or run seedJobs.js</p>}
        <p style={{ marginTop: '1.5rem' }}><Link to="/admin" style={{ color: '#00d4ff' }}>← Dashboard</Link></p>
      </div>
    </div>
  );
}
