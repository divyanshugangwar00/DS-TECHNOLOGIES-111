import { Link } from 'react-router-dom';

const FEATURES = [
  { id: 446, title: 'AI Chatbot', text: 'Site assistant for FAQs and navigation — see Admin → Chatbot.', to: '/admin/chatbot' },
  { id: 447, title: 'AI FAQ Assistant', text: 'Answers common questions about services, careers and support.', to: '/support' },
  { id: 448, title: 'AI Job Search', text: 'Filter and match open roles on the careers jobs board.', to: '/careers/jobs' },
  { id: 449, title: 'AI Resume Assistance', text: 'Guidance aligned with job applications and certificate studio.', to: '/careers' },
  { id: 450, title: 'AI Support Assistant', text: 'Ticket suggestions and WhatsApp escalation paths.', to: '/support' },
  { id: 451, title: 'AI Lead Assistant', text: 'Contact form leads routed to CRM / admin contacts.', to: '/crm' },
  { id: 452, title: 'AI Knowledge Assistant', text: 'Insights, tutorials and knowledge base pointers.', to: '/insights' },
];

export default function AIFeatures() {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 1000 }}>
        <h1 className="section-title">AI Features</h1>
        <p className="section-subtitle">Practical AI hooks inside DS-TECHNOLOGIES — chatbot, hiring help and support assist (Phase 4 roadmap).</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.85rem' }}>
          {FEATURES.map((f) => (
            <div key={f.id} className="card">
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{f.id}</div>
              <h3 style={{ color: '#38bdf8', margin: '0.35rem 0' }}>{f.title}</h3>
              <p style={{ color: '#cbd5e1', lineHeight: 1.6 }}>{f.text}</p>
              <Link to={f.to} style={{ color: '#7dd3fc', fontSize: '0.9rem' }}>Open →</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
