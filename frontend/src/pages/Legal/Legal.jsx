import { useParams, Link } from 'react-router-dom';

const PAGES = {
  privacy: {
    title: 'Privacy Policy',
    id: 420,
    body: [
      'DS-TECHNOLOGIES (“we”, “our”) collects information you submit via contact forms, job applications, registration and support tickets — such as name, email, phone and resume details.',
      'We use this data to respond to enquiries, process applications, operate employee/client portals and improve our services. We do not sell personal data.',
      'Data is stored on our configured database (local MongoDB or MongoDB Atlas) and hosting providers. Access is limited to authorised admin/HR roles.',
      'You may request correction or deletion of your account data by contacting divyanshugangwar950@gmail.com or 7895733906.',
      'This policy applies to the DS-TECHNOLOGIES website and portals operated from Bareilly, Uttar Pradesh, India.',
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    id: 421,
    body: [
      'By using this website and portals you agree to use them lawfully and not attempt unauthorised access to systems or other users’ data.',
      'Job offers, internships and certificates are subject to verification by DS-TECHNOLOGIES. Content is provided for information and educational/demo purposes where applicable.',
      'We may update services, features and these terms. Continued use after updates constitutes acceptance.',
      'Limitation: to the extent permitted by law, DS-TECHNOLOGIES is not liable for indirect losses arising from use of the site.',
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    id: 422,
    body: [
      'We may use essential cookies or local storage for login sessions (JWT token), preferences and support tickets.',
      'These are required for authentication and basic site function. You can clear browser storage to remove local data.',
    ],
  },
  refund: {
    title: 'Refund Policy',
    id: 423,
    body: [
      'Training fees, project retainers or product charges (if any) are governed by the specific agreement shared in writing / invoice.',
      'College demo deployments on free tiers do not constitute paid SaaS subscriptions unless a separate contract is signed.',
      'For refund requests contact finance via divyanshugangwar950@gmail.com within the window stated on your invoice.',
    ],
  },
  disclaimer: {
    title: 'Disclaimer',
    id: 424,
    body: [
      'Information on this site is general in nature. Software outcomes depend on requirements, timelines and client cooperation.',
      'Third-party logos, tools or course names are trademarks of their owners and used for descriptive purposes only.',
      'Statistics and capacity figures may represent targets or catalogue size, not guaranteed metrics.',
    ],
  },
  'data-protection': {
    title: 'Data Protection Policy',
    id: 425,
    body: [
      'We apply role-based access, password hashing (bcrypt), JWT authentication and environment-based secrets for production.',
      'Employees and admins must not share credentials. Uploads should avoid sensitive data beyond what is required for HR/hiring.',
      'Report suspected breaches to the Founder/CEO contact listed on the Contact page immediately.',
    ],
  },
};

export default function Legal() {
  const { slug } = useParams();
  const page = PAGES[slug] || PAGES.privacy;
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 800 }}>
        <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Legal · #{page.id}</p>
        <h1 className="section-title">{page.title}</h1>
        {page.body.map((p) => (
          <p key={p.slice(0, 24)} style={{ color: '#cbd5e1', lineHeight: 1.75 }}>{p}</p>
        ))}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: '1.5rem' }}>
          {Object.keys(PAGES).map((k) => (
            <Link key={k} to={`/legal/${k}`} className="btn btn-outline" style={{ fontSize: '0.8rem' }}>
              {PAGES[k].title}
            </Link>
          ))}
        </div>
        <p style={{ marginTop: '1rem' }}><Link to="/contact">Contact us</Link></p>
      </div>
    </div>
  );
}
