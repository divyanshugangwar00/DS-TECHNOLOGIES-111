import { Link } from 'react-router-dom';

const SAMPLE = [
  { title: 'Complete onboarding checklist', priority: 'High', deadline: 'This week', status: 'In progress' },
  { title: 'Update daily attendance', priority: 'Medium', deadline: 'Daily', status: 'Ongoing' },
  { title: 'Read company notices', priority: 'Low', deadline: '—', status: 'Open' },
];

export default function EmployeeTasks() {
  return (
    <div className="section page-bg-admin">
      <div className="container" style={{ maxWidth: 640 }}>
        <h1 className="section-title">✅ My Tasks</h1>
        {SAMPLE.map((t) => (
          <div key={t.title} className="card" style={{ marginBottom: '0.75rem' }}>
            <h3 style={{ margin: '0 0 0.35rem' }}>{t.title}</h3>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>
              Priority: <span style={{ color: t.priority === 'High' ? '#fca5a5' : '#fbbf24' }}>{t.priority}</span>
              {' · '}Deadline: {t.deadline}
              {' · '}Status: {t.status}
            </p>
          </div>
        ))}
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Manager-assigned live tasks will appear here when task module is connected.</p>
        <p style={{ marginTop: '1rem' }}><Link to="/employee" style={{ color: '#00d4ff' }}>← Dashboard</Link></p>
      </div>
    </div>
  );
}
