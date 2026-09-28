import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import ErrorMessage from '../../components/ErrorMessage';
import { useAuth } from '../../context/AuthContext';

function isMongoId(id) {
  return typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id);
}

function isCatalogJobId(id) {
  if (!id) return true;
  const s = String(id);
  return s.startsWith('sample') || s.startsWith('dst-job') || !isMongoId(s);
}

export default function ApplyForm() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    coverLetter: '',
    experience: '',
    course: '',
    currentCompany: '',
    expectedSalary: '',
  });
  const [resume, setResume] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const saveLocalApplication = () => {
    const entry = {
      id: `app-${Date.now()}`,
      jobId: jobId || 'catalog',
      jobCode: jobId,
      ...form,
      resumeName: resume?.name || 'resume.pdf',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    try {
      const prev = JSON.parse(localStorage.getItem('ds_applications') || '[]');
      prev.unshift(entry);
      localStorage.setItem('ds_applications', JSON.stringify(prev));
    } catch (_) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!resume) {
      setError('Resume is required');
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('jobId', jobId || '');
    Object.keys(form).forEach((k) => data.append(k, form[k] ?? ''));
    data.append('jobTitle', jobId || 'DS-TECHNOLOGIES Position');
    data.append('resume', resume);

    try {
      // Always try the backend first. Catalog IDs such as dst-job-1 are
      // resolved by the backend through Job.jobCode/Job.slug.
      await api.post('/applications', data);
      setSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || '';
      // Keep the presentation/demo usable when the API or MongoDB is offline.
      if (!err.response || /Job not found|ObjectId|Cast|Network Error|ECONNREFUSED/i.test(msg)) {
        saveLocalApplication();
        setSuccess(true);
      } else {
        setError(msg || 'Failed to submit application. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="section">
        <div className="container" style={{ maxWidth: 600, textAlign: 'center' }}>
          <div className="card" style={{ padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h2>Application Submitted!</h2>
            <p style={{ color: '#94a3b8', margin: '1rem 0 2rem' }}>
              Thank you for applying{jobId ? ` (ref: ${jobId})` : ''}. Our team will review your profile and contact you
              soon.
            </p>
            <Link to="/careers/jobs" className="btn btn-primary">
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section page-bg-careers">
      <div className="container" style={{ maxWidth: 640 }}>
        <h1 className="section-title">Apply for Position</h1>
        <p className="section-subtitle">Fill in your details and upload your resume.</p>
        {jobId && (
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>Position ref: {jobId}</p>
        )}

        <div className="card">
          {error && <ErrorMessage message={error} />}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Current / Last Company</label>
              <input name="currentCompany" value={form.currentCompany} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Years of Experience</label>
              <input name="experience" value={form.experience} onChange={handleChange} placeholder="e.g. fresher / 2 years" />
            </div>
            <div className="form-group">
              <label>Course / Qualification *</label>
              <select name="course" value={form.course} onChange={handleChange} required>
                <option value="">Select course</option>
                <option value="B.Tech">B.Tech</option>
                <option value="BCA">BCA</option>
                <option value="BSc">BSc</option>
                <option value="MCA">MCA</option>
                <option value="M.Tech">M.Tech</option>
                <option value="MSc">MSc</option>
                <option value="Diploma">Diploma</option>
                <option value="B.Com">B.Com</option>
                <option value="MBA">MBA</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Expected Salary</label>
              <input name="expectedSalary" value={form.expectedSalary} onChange={handleChange} placeholder="e.g. 3-5 LPA" />
            </div>
            <div className="form-group">
              <label>Cover Letter</label>
              <textarea name="coverLetter" value={form.coverLetter} onChange={handleChange} rows={4} />
            </div>
            <div className="form-group">
              <label>Resume / File *</label>
              <input
                type="file"
                accept="*/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setResume(file);
                  setError('');
                }}
                required
              />
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                All file formats are accepted. No application-level file-size limit is set.
              </p>
              {resume && (
                <p style={{ color: '#22c55e', fontSize: '0.85rem', marginTop: '0.35rem', wordBreak: 'break-word' }}>
                  ✓ Selected: {resume.name} ({(resume.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              )}
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Submitting…' : 'Submit Application'}
            </button>
          </form>
        </div>
        <p style={{ marginTop: '1rem' }}>
          <Link to="/careers/jobs" style={{ color: '#00d4ff' }}>
            ← Back to jobs
          </Link>
        </p>
      </div>
    </div>
  );
}
