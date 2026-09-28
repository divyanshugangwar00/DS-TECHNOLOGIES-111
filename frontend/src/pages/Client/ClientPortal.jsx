import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const MODULES = [
  { id: 137, title: 'Client Login', to: '/login' },
  { id: 138, title: 'Client Dashboard', to: '/client' },
  { id: 139, title: 'Profile', to: '/employee/profile' },
  { id: 140, title: 'Company Profile', to: '/about' },
  { id: 141, title: 'My Projects' },
  { id: 142, title: 'Project Details' },
  { id: 143, title: 'Project Progress' },
  { id: 144, title: 'Milestones' },
  { id: 145, title: 'Tasks' },
  { id: 146, title: 'Team' },
  { id: 147, title: 'Documents' },
  { id: 148, title: 'Files' },
  { id: 149, title: 'Meetings' },
  { id: 150, title: 'Messages' },
  { id: 151, title: 'Invoices' },
  { id: 152, title: 'Payments' },
  { id: 153, title: 'Quotations' },
  { id: 154, title: 'Support Tickets', to: '/support' },
  { id: 155, title: 'Notifications' },
  { id: 156, title: 'Feedback' },
  { id: 157, title: 'Change Requests' },
  { id: 158, title: 'Project Reports' },
];

const PROJECT_FIELDS = ['Client', 'Project Manager', 'Team', 'Start Date', 'End Date', 'Budget', 'Status', 'Progress', 'Tasks', 'Milestones', 'Files', 'Meetings', 'Messages', 'Invoice'];

export default function ClientPortal() {
  const { user } = useAuth();
  return (
    <div className="section page-bg-client">
      <div className="container" style={{ maxWidth: 1100 }}>
        <h1 className="section-title">Client Portal</h1>
        <p className="section-subtitle">
          Project collaboration space for DS-TECHNOLOGIES clients — progress, files, invoices and support.
        </p>
        {!user && (
          <div className="card" style={{ marginBottom: '1rem' }}>
            <p style={{ color: '#cbd5e1' }}>Sign in with credentials shared by your account manager.</p>
            <Link to="/login" className="btn btn-primary">Client Login</Link>
          </div>
        )}
        {user && (
          <div className="card" style={{ marginBottom: '1rem' }}>
            <p style={{ color: '#cbd5e1', margin: 0 }}>Welcome, <strong>{user.name || user.email}</strong></p>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {MODULES.map((m) => (
            <Link key={m.id} to={m.to || `/explore/client/${m.id}`} className="card catalog-card" style={{ padding: '0.9rem', color: 'inherit', textDecoration: 'none' }}>
              <div style={{ color: '#64748b', fontSize: '0.7rem' }}>{m.id}</div>
              <div style={{ color: '#e2e8f0', fontWeight: 600, marginTop: 4 }}>{m.title}</div>
              <div className="catalog-open" style={{ marginTop: '.55rem' }}>Open →</div>
            </Link>
          ))}
        </div>
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <h3 style={{ color: '#38bdf8', marginTop: 0 }}>Client project management model</h3>
          <ul style={{ color: '#cbd5e1', columns: 2, lineHeight: 1.8 }}>
            {PROJECT_FIELDS.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
