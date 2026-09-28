import { useEffect, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../../components/ErrorMessage';
import AdminListToolbar, { exportRowsToCsv } from '../../components/Admin/AdminListToolbar';

const DESIGNATIONS = [
  'Founder & CEO', 'Co-Founder', 'Chairman', 'Managing Director', 'Director',
  'CTO – Chief Technology Officer', 'COO – Chief Operating Officer', 'CFO', 'CMO – Chief Marketing Officer', 'CHRO', 'VP Engineering', 'Director – HR',
  'General Manager', 'Senior Manager – Engineering', 'Manager – Operations', 'Manager – HR', 'Manager – Sales',
  'Team Lead – Frontend', 'Team Lead – Backend', 'Senior Software Engineer', 'Software Engineer',
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Junior Developer',
  'Intern – Software', 'Trainee – Software', 'HR Executive', 'Business Development Executive',
  'IT Support Executive', 'Accounts Assistant', 'Customer Support Executive', 'Doctor', 'Staff Nurse',
];

const DEPARTMENTS = [
  'Leadership', 'Technology', 'Engineering', 'Operations', 'HR', 'Sales', 'Marketing',
  'Finance', 'Data & AI', 'Design', 'Cloud', 'Cybersecurity', 'Consulting', 'Medical', 'Healthcare IT',
];

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  password: 'Ds@2026',
  employeeId: '',
  department: 'Engineering',
  designation: 'Software Engineer',
  joiningDate: new Date().toISOString().slice(0, 10),
  workLocation: 'Bareilly / Hybrid',
  salary: '',
  personalEmail: '',
  gender: '',
  address: '',
  city: 'Bareilly',
  state: 'Uttar Pradesh',
  pin: '243503',
  emergencyContact: '',
  employmentType: 'Full Time',
  skills: '',
  qualification: '',
  experienceYears: '',
  role: 'employee',
  isActive: true,
};

export default function AdminEmployees() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [selectedIds, setSelectedIds] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterDept, setFilterDept] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const [replaceId, setReplaceId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const isFounder = user?.role === 'admin';

  const fetchEmployees = () => {
    const offline = () => {
      try {
        return JSON.parse(localStorage.getItem('ds_employees') || '[]');
      } catch {
        return [];
      }
    };
    api
      .get('/employees')
      .then((res) => {
        const apiList = res.data || [];
        const local = offline();
        if (apiList.length) {
          setEmployees(apiList);
          try {
            localStorage.setItem('ds_employees', JSON.stringify(apiList));
          } catch (_) {}
        } else {
          setEmployees(local);
        }
      })
      .catch(() => {
        setEmployees(offline());
        setError(''); // offline list is OK — no scary top error
      });
  };

  const persistLocal = (list) => {
    setEmployees(list);
    try {
      localStorage.setItem('ds_employees', JSON.stringify(list));
    } catch (_) {}
  };

  const isMongoId = (id) => typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id);

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'hr')) fetchEmployees();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setFieldErrors({});

    const fe = {};
    if (!editId && !form.name.trim()) fe.name = 'Full name required';
    if (!editId && !form.email.trim()) fe.email = 'Company email required';
    if (!editId && !form.employeeId.trim()) fe.employeeId = 'Employee ID required';
    if (!form.department) fe.department = 'Department required';
    if (!form.designation) fe.designation = 'Designation required';
    if (Object.keys(fe).length) {
      setFieldErrors(fe);
      setError('Please fix the highlighted fields');
      setLoading(false);
      return;
    }

    const localRecord = () => ({
      _id: `local-${Date.now()}`,
      employeeId: form.employeeId || `DST-EMP-${Date.now().toString().slice(-4)}`,
      department: form.department,
      designation: form.designation,
      joiningDate: form.joiningDate,
      workLocation: form.workLocation,
      salary: form.salary ? Number(form.salary) : 0,
      personalEmail: form.personalEmail,
      companyEmail: form.email,
      gender: form.gender,
      address: form.address,
      city: form.city,
      state: form.state,
      pin: form.pin,
      emergencyContact: form.emergencyContact,
      employmentType: form.employmentType,
      skills: form.skills,
      qualification: form.qualification,
      experienceYears: form.experienceYears,
      role: form.role,
      isActive: form.isActive !== false,
      user: { name: form.name, email: form.email, phone: form.phone, role: form.role },
      bankAccount: form.bankAccount || '',
      ifsc: form.ifsc || '',
      bankName: form.bankName || 'SBI',
      upi: form.upi || '',
    });

    try {
      if (editId) {
        const body = {
          department: form.department,
          designation: form.designation,
          workLocation: form.workLocation,
          salary: form.salary ? Number(form.salary) : undefined,
          personalEmail: form.personalEmail,
          gender: form.gender,
          address: form.address,
          city: form.city,
          state: form.state,
          pin: form.pin,
          emergencyContact: form.emergencyContact,
          employmentType: form.employmentType,
          skills: form.skills,
          qualification: form.qualification,
          experienceYears: form.experienceYears,
          joiningDate: form.joiningDate,
          isActive: form.isActive,
        };
        let ok = false;
        if (isMongoId(editId)) {
          try {
            await api.put(`/employees/${editId}`, body);
            ok = true;
          } catch (_) {}
        }
        if (!ok) {
          const next = employees.map((emp) =>
            emp._id === editId || emp.employeeId === editId
              ? { ...emp, ...body, user: { ...(emp.user || {}), name: form.name || emp.user?.name, email: form.email || emp.user?.email, phone: form.phone || emp.user?.phone } }
              : emp
          );
          persistLocal(next);
        }
        setSuccess('Employee updated');
      } else {
        if (replaceId && isMongoId(replaceId)) {
          try {
            await api.delete(`/employees/${replaceId}`);
          } catch (_) {}
        }
        let created = null;
        try {
          const { data: newUser } = await api.post('/auth/register', {
            name: form.name,
            email: form.email,
            password: form.password || 'Ds@2026',
            phone: form.phone,
          });
          const { data: emp } = await api.post('/employees', {
            userId: newUser._id,
            employeeId: form.employeeId || `DST-EMP-${Date.now().toString().slice(-4)}`,
            department: form.department,
            designation: form.designation,
            joiningDate: form.joiningDate,
            workLocation: form.workLocation,
            salary: form.salary ? Number(form.salary) : undefined,
            personalEmail: form.personalEmail,
            companyEmail: form.email,
            gender: form.gender,
            address: form.address,
            city: form.city,
            state: form.state,
            pin: form.pin,
            emergencyContact: form.emergencyContact,
            employmentType: form.employmentType,
            skills: form.skills,
            qualification: form.qualification,
            experienceYears: form.experienceYears,
            role: form.role,
            isActive: form.isActive,
          });
          created = emp;
        } catch (err) {
          const msg = err.response?.data?.message || '';
          if (/email|exists|duplicate/i.test(msg)) {
            setFieldErrors({ email: 'Email already exists — change Company Email' });
            setError('Company Email already registered');
            setLoading(false);
            return;
          }
          created = localRecord();
        }

        let next = employees.slice();
        if (replaceId) {
          next = next.filter((e) => e._id !== replaceId && e.employeeId !== replaceId);
        }
        next = next.filter((e) => e.employeeId !== created.employeeId);
        next.unshift(created);
        persistLocal(next);
        setSuccess(
          (replaceId ? 'Replaced: ' : 'Added: ') +
            `${form.name} (${created.employeeId}) · Login ${form.email} / ${form.password || 'Ds@2026'}`
        );
      }
      setShowForm(false);
      setReplaceId(null);
      setEditId(null);
      setForm(emptyForm);
      fetchEmployees();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed';
      if (/not found/i.test(msg)) {
        setFieldErrors({ employeeId: 'Server record missing — use Replace again to save locally' });
        setError('Employee not found on server. Form will save to local employee list on retry.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id, name) => {
    if (!isFounder) {
      setError('Only Founder / full Admin can remove people.');
      return;
    }
    if (!window.confirm(`Remove ${name} from organization?`)) return;
    try {
      if (isMongoId(id)) {
        try {
          await api.delete(`/employees/${id}`);
        } catch (_) {}
      }
      const next = employees.filter((e) => e._id !== id && e.employeeId !== id);
      persistLocal(next);
      setSuccess(`${name} removed`);
    } catch (err) {
      setError(err.response?.data?.message || 'Remove failed');
    }
  };


  const startEdit = (emp) => {
    setEditId(emp._id);
    setReplaceId(null);
    setForm({
      ...emptyForm,
      name: emp.user?.name || '',
      email: emp.user?.email || '',
      phone: emp.user?.phone || '',
      employeeId: emp.employeeId || '',
      department: emp.department || 'Engineering',
      designation: emp.designation || '',
      joiningDate: emp.joiningDate ? new Date(emp.joiningDate).toISOString().slice(0, 10) : emptyForm.joiningDate,
      workLocation: emp.workLocation || 'Bareilly / Hybrid',
      salary: emp.salary || '',
      personalEmail: emp.personalEmail || '',
      gender: emp.gender || '',
      address: emp.address || '',
      city: emp.city || 'Bareilly',
      state: emp.state || 'Uttar Pradesh',
      pin: emp.pin || '243503',
      emergencyContact: emp.emergencyContact || '',
      employmentType: emp.employmentType || 'Full Time',
      skills: (emp.skills || []).join(', '),
      qualification: emp.qualification || '',
      experienceYears: emp.experienceYears || '',
      isActive: emp.isActive !== false,
    });
    setShowForm(true);
  };

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return <div className="section container"><p>Access denied</p></div>;
  }

  const filtered = employees.filter((e) => {
    const okD = !filterDept || e.department === filterDept;
    const q = searchQ.trim().toLowerCase();
    if (!q) return okD;
    const blob = [
      e.employeeId,
      e.user?.name,
      e.name,
      e.designation,
      e.department,
      e.user?.email,
      e.companyEmail,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return okD && blob.includes(q);
  });

  return (
    <div className="section page-bg-employees">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h1 className="section-title" style={{ margin: 0 }}>Organization & Employees</h1>
            <p className="section-subtitle" style={{ margin: '0.35rem 0 0' }}>Add / Edit / Replace · DST-EMP-001 style IDs</p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setReplaceId(null); setForm(emptyForm); }}>
            {showForm ? 'Cancel' : '+ Add Employee'}
          </button>
        </div>

        <ErrorMessage message={error} />
        {Object.keys(fieldErrors).length > 0 && (
          <div className="card" style={{ borderColor: '#f87171', marginBottom: '1rem', background: 'rgba(248,113,113,0.08)' }}>
            <strong style={{ color: '#fca5a5' }}>Field errors</strong>
            <ul style={{ color: '#fca5a5', margin: '0.5rem 0 0', paddingLeft: '1.2rem' }}>
              {Object.entries(fieldErrors).map(([k, v]) => (
                <li key={k}><strong>{k}:</strong> {v}</li>
              ))}
            </ul>
          </div>
        )}
        {success && <p style={{ color: '#10b981', marginBottom: '1rem' }}>{success}</p>}

        {showForm && (
          <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>{editId ? 'Edit Employee' : replaceId ? 'Replace Employee' : 'Register / Add Employee'}</h3>
            {!editId && (
              <div className="grid-2">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Company Email (login) *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="name@dstechnologies.com" />
                </div>
                <div className="form-group">
                  <label>Login Password</label>
                  <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Ds@2026" />
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
            )}
            <div className="grid-2">
              <div className="form-group">
                <label>Employee ID *</label>
                <input value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required={!editId} placeholder="DST-EMP-001" disabled={!!editId} />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} style={{ background: '#0f172a', color: '#e2e8f0' }} disabled={!!editId}>
                  <option value="employee">Employee</option>
                  <option value="hr">HR</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Department *</label>
                <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} style={{ background: '#0f172a', color: '#e2e8f0' }}>
                  {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Designation / Position *</label>
                <select value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} style={{ background: '#0f172a', color: '#e2e8f0' }}>
                  {DESIGNATIONS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Employment Type</label>
                <select value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })} style={{ background: '#0f172a', color: '#e2e8f0' }}>
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Intern</option>
                  <option>Contract</option>
                </select>
              </div>
              <div className="form-group">
                <label>Joining Date</label>
                <input type="date" value={form.joiningDate} onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Work Location</label>
                <input value={form.workLocation} onChange={(e) => setForm({ ...form, workLocation: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Salary (₹ / month)</label>
                <input type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Personal Email</label>
                <input type="email" value={form.personalEmail} onChange={(e) => setForm({ ...form, personalEmail: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} style={{ background: '#0f172a', color: '#e2e8f0' }}>
                  <option value="">—</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>City</label>
                <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="form-group">
                <label>State</label>
                <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              </div>
              <div className="form-group">
                <label>PIN</label>
                <input value={form.pin} onChange={(e) => setForm({ ...form, pin: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Emergency Contact</label>
                <input value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Qualification</label>
                <input value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} placeholder="BCA / MCA / B.Tech" />
              </div>
              <div className="form-group">
                <label>Experience</label>
                <input value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: e.target.value })} placeholder="0-2 years" />
              </div>
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Skills (comma separated)</label>
              <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
            </div>
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Bank / Government ID — restricted; store offline for now. Profile photo upload next phase.</p>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving…' : editId ? 'Update' : 'Save Employee'}</button>
          </form>
        )}

        <AdminListToolbar
          title="Employees"
          selectedCount={Object.values(selectedIds).filter(Boolean).length}
          totalCount={filtered.length}
          allSelected={filtered.length > 0 && filtered.every((e) => selectedIds[e._id])}
          onSelectAll={(checked) => {
            const next = {};
            if (checked) filtered.forEach((e) => { next[e._id] = true; });
            setSelectedIds(next);
          }}
          onBulkDelete={() => {
            const ids = Object.keys(selectedIds).filter((k) => selectedIds[k]);
            if (!ids.length) return;
            if (!window.confirm(`Remove ${ids.length} selected employee(s)?`)) return;
            ids.forEach((id) => handleRemove(id, 'selected'));
            setSelectedIds({});
          }}
          onExport={() => exportRowsToCsv('employees.csv', filtered.map((e) => ({
            employeeId: e.employeeId, name: e.user?.name, email: e.user?.email, designation: e.designation, department: e.department, type: e.employmentType
          })))}
          search={searchQ}
          onSearchChange={setSearchQ}
        />
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1rem', alignItems: 'center' }}>
          <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} style={{ padding: '0.5rem 1rem', background: '#0f172a', color: '#e2e8f0', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)' }}>
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{filtered.length} shown</span>
          </div>
        </div>

        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                <th style={{ padding: '0.6rem' }}></th>
                <th style={{ padding: '0.6rem' }}>ID</th>
                <th style={{ padding: '0.6rem' }}>Name</th>
                <th style={{ padding: '0.6rem' }}>Designation</th>
                <th style={{ padding: '0.6rem' }}>Department</th>
                <th style={{ padding: '0.6rem' }}>Type</th>
                <th style={{ padding: '0.6rem' }}>Login</th>
                <th style={{ padding: '0.6rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr key={emp._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '0.6rem' }}><input type="checkbox" checked={!!selectedIds[emp._id]} onChange={(e) => setSelectedIds((s) => ({ ...s, [emp._id]: e.target.checked }))} /></td>
                  <td style={{ padding: '0.6rem' }}>{emp.employeeId}</td>
                  <td style={{ padding: '0.6rem' }}>{emp.user?.name}</td>
                  <td style={{ padding: '0.6rem' }}>{emp.designation}</td>
                  <td style={{ padding: '0.6rem' }}>{emp.department}</td>
                  <td style={{ padding: '0.6rem' }}>{emp.employmentType || 'Full Time'}</td>
                  <td style={{ padding: '0.6rem', fontSize: '0.75rem', color: '#94a3b8' }}>{emp.user?.email}</td>
                  <td style={{ padding: '0.6rem', whiteSpace: 'nowrap' }}>
                    <button type="button" onClick={() => startEdit(emp)} style={{ marginRight: 4, padding: '0.2rem 0.4rem', fontSize: '0.7rem', borderRadius: 4, border: '1px solid #00d4ff', background: 'transparent', color: '#00d4ff' }}>Edit</button>
                    {isFounder && (
                      <>
                        <button type="button" onClick={() => { setReplaceId(emp._id); setEditId(null); setForm({ ...emptyForm, employeeId: emp.employeeId, department: emp.department, designation: emp.designation }); setShowForm(true); }} style={{ marginRight: 4, padding: '0.2rem 0.4rem', fontSize: '0.7rem', borderRadius: 4, border: '1px solid #fbbf24', background: 'transparent', color: '#fbbf24' }}>Replace</button>
                        <button type="button" onClick={() => handleRemove(emp._id, emp.user?.name)} style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem', borderRadius: 4, border: '1px solid #ef4444', background: 'transparent', color: '#fca5a5' }}>Remove</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: '1rem' }}><Link to="/admin" style={{ color: '#00d4ff' }}>← Dashboard</Link></p>
      </div>
    </div>
  );
}
