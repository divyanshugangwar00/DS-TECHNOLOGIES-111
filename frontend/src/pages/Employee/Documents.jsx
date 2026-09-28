import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function EmployeeDocuments() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [myFiles, setMyFiles] = useState([]);

  useEffect(() => {
    api
      .get('/employees/me')
      .then((res) => setProfile(res.data))
      .catch(() => {
        setProfile({
          employeeId: user?.employeeId || '—',
          designation: user?.designation || 'Employee',
          department: user?.department || '—',
          name: user?.name,
          email: user?.email,
          phone: user?.phone,
        });
      });
    try {
      const key = 'ds_emp_docs_' + (user?.email || 'guest');
      setMyFiles(JSON.parse(localStorage.getItem(key) || '[]'));
    } catch {
      setMyFiles([]);
    }
  }, [user]);

  const onUpload = (label) => (e) => {
    const f = e.target.files?.[0];
    if (!f || !user?.email) return;
    const reader = new FileReader();
    reader.onload = () => {
      const key = 'ds_emp_docs_' + user.email;
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      const row = {
        id: Date.now().toString(),
        label,
        fileName: f.name,
        dataUrl: reader.result,
        at: new Date().toISOString(),
      };
      const next = [row, ...list.filter((x) => x.label !== label)];
      localStorage.setItem(key, JSON.stringify(next));
      setMyFiles(next);
    };
    reader.readAsDataURL(f);
  };

  const standard = [
    { name: 'Offer Letter', hint: 'HR issues after selection' },
    { name: 'Joining Letter', hint: 'After onboarding' },
    { name: 'ID Card', hint: 'Pending issue from Admin' },
    { name: 'Salary Slip', hint: 'See My Salary page' },
    { name: 'Aadhaar / PAN copy', hint: 'Upload your copy' },
    { name: 'Resume / Certificates', hint: 'Upload below' },
  ];

  return (
    <div className="section page-bg-employee">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 className="section-title">📄 My Documents & Details</h1>
        <p className="section-subtitle">Apni details check karein · Files upload / view</p>

        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3 style={{ color: '#38bdf8', marginTop: 0 }}>My profile summary</h3>
          <table style={{ width: '100%', fontSize: '0.9rem' }}>
            <tbody>
              <tr>
                <td style={{ color: '#94a3b8', padding: '0.35rem 0' }}>Name</td>
                <td>{profile?.user?.name || profile?.name || user?.name || '—'}</td>
              </tr>
              <tr>
                <td style={{ color: '#94a3b8', padding: '0.35rem 0' }}>Email</td>
                <td>{profile?.user?.email || profile?.email || user?.email || '—'}</td>
              </tr>
              <tr>
                <td style={{ color: '#94a3b8', padding: '0.35rem 0' }}>Employee ID</td>
                <td>{profile?.employeeId || '—'}</td>
              </tr>
              <tr>
                <td style={{ color: '#94a3b8', padding: '0.35rem 0' }}>Designation</td>
                <td>{profile?.designation || '—'}</td>
              </tr>
              <tr>
                <td style={{ color: '#94a3b8', padding: '0.35rem 0' }}>Department</td>
                <td>{profile?.department || '—'}</td>
              </tr>
              <tr>
                <td style={{ color: '#94a3b8', padding: '0.35rem 0' }}>Phone</td>
                <td>{profile?.phone || profile?.user?.phone || user?.phone || '—'}</td>
              </tr>
            </tbody>
          </table>
          <Link to="/employee/profile" style={{ color: '#00d4ff', fontSize: '0.9rem' }}>
            Open full profile →
          </Link>
        </div>

        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3 style={{ marginTop: 0 }}>Company documents</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {standard.map((d) => (
              <li
                key={d.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '0.65rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  fontSize: '0.9rem',
                }}
              >
                <span>{d.name}</span>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{d.hint}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Upload / view my files</h3>
          {['Aadhaar', 'PAN', 'Resume', 'Education Certificate', 'Photo'].map((label) => {
            const existing = myFiles.find((f) => f.label === label);
            return (
              <div
                key={label}
                style={{
                  padding: '0.75rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <strong style={{ color: '#e2e8f0' }}>{label}</strong>
                  <input type="file" accept="image/*,.pdf" onChange={onUpload(label)} style={{ fontSize: '0.8rem', color: '#94a3b8' }} />
                </div>
                {existing && (
                  <div style={{ marginTop: 8, fontSize: '0.8rem', color: '#94a3b8' }}>
                    Saved: {existing.fileName} · {new Date(existing.at).toLocaleString('en-IN')}
                    {existing.dataUrl?.startsWith('data:image') && (
                      <div style={{ marginTop: 6 }}>
                        <img src={existing.dataUrl} alt={label} style={{ maxHeight: 80, borderRadius: 6 }} />
                      </div>
                    )}
                    {existing.dataUrl?.startsWith('data:application/pdf') && (
                      <a href={existing.dataUrl} download={existing.fileName} style={{ color: '#00d4ff', marginLeft: 8 }}>
                        Download PDF
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p style={{ marginTop: '1rem' }}>
          <Link to="/employee" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
