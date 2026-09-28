import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SECTIONS = [
  {
    title: '15. HR Management (230–254)',
    items: [
      { id: 230, name: 'HR Dashboard', to: '/admin/hr' },
      { id: 231, name: 'Employees', to: '/admin/employees' },
      { id: 232, name: 'Departments', to: '/admin/departments' },
      { id: 233, name: 'Designations', to: '/admin/designations' },
      { id: 234, name: 'Recruitment', to: '/admin/jobs' },
      { id: 235, name: 'Candidates', to: '/admin/applications' },
      { id: 236, name: 'Job Openings', to: '/admin/jobs' },
      { id: 237, name: 'Applications', to: '/admin/applications' },
      { id: 238, name: 'Interviews', to: '/admin/applications' },
      { id: 239, name: 'Interview Feedback', to: '/admin/applications' },
      { id: 240, name: 'Offer Letters', to: '/careers/internship' },
      { id: 241, name: 'Joining', to: '/admin/onboarding' },
      { id: 242, name: 'Onboarding', to: '/admin/onboarding' },
      { id: 243, name: 'Attendance', to: '/admin/attendance' },
      { id: 244, name: 'Leave Management', to: '/admin/leaves' },
      { id: 245, name: 'Payroll', to: '/admin/payroll' },
      { id: 246, name: 'Salary', to: '/admin/payroll' },
      { id: 247, name: 'Documents', to: '/admin/documents' },
      { id: 248, name: 'Employee Performance', to: '/admin/performance' },
      { id: 249, name: 'Training', to: '/admin/courses' },
      { id: 250, name: 'Promotions', to: '/admin/hr' },
      { id: 251, name: 'Transfers', to: '/admin/hr' },
      { id: 252, name: 'Resignation', to: '/employee/resign' },
      { id: 253, name: 'Exit Interview', to: '/admin/hr' },
      { id: 254, name: 'Full & Final Settlement', to: '/admin/payroll' },
    ],
  },
  {
    title: '16. Attendance (255–265)',
    items: [
      { id: 255, name: 'Daily Attendance', to: '/admin/attendance' },
      { id: 256, name: 'Monthly Attendance', to: '/admin/attendance' },
      { id: 257, name: 'Employee Check-in', to: '/employee/attendance' },
      { id: 258, name: 'Check-out', to: '/employee/attendance' },
      { id: 259, name: 'Late Attendance', to: '/admin/attendance' },
      { id: 260, name: 'Early Checkout', to: '/admin/attendance' },
      { id: 261, name: 'Half Day', to: '/admin/attendance' },
      { id: 262, name: 'Work From Home', to: '/admin/attendance' },
      { id: 263, name: 'Overtime', to: '/admin/attendance' },
      { id: 264, name: 'Attendance Reports', to: '/admin/reports' },
      { id: 265, name: 'Export Excel/PDF', to: '/admin/data-export' },
    ],
  },
  {
    title: '17. Payroll (266–276)',
    items: [
      { id: 266, name: 'Salary Structure', to: '/admin/payroll' },
      { id: 267, name: 'Basic Salary', to: '/admin/payroll' },
      { id: 268, name: 'Allowances', to: '/admin/payroll' },
      { id: 269, name: 'Deductions', to: '/admin/payroll' },
      { id: 270, name: 'Bonus', to: '/admin/payroll' },
      { id: 271, name: 'Overtime', to: '/admin/payroll' },
      { id: 272, name: 'Tax', to: '/admin/finance' },
      { id: 273, name: 'Net Salary', to: '/admin/payroll' },
      { id: 274, name: 'Payslip', to: '/employee/salary' },
      { id: 275, name: 'Payroll History', to: '/admin/payroll' },
      { id: 276, name: 'Payroll Reports', to: '/admin/reports' },
    ],
  },
  {
    title: '18. Performance Management (277–285)',
    items: [
      { id: 277, name: 'Goals', to: '/admin/performance' },
      { id: 278, name: 'KPIs', to: '/admin/performance' },
      { id: 279, name: 'Task Performance', to: '/admin/tasks' },
      { id: 280, name: 'Manager Review', to: '/admin/performance' },
      { id: 281, name: 'Self Assessment', to: '/admin/performance' },
      { id: 282, name: 'Performance Review', to: '/admin/performance' },
      { id: 283, name: 'Rating', to: '/admin/performance' },
      { id: 284, name: 'Appraisal', to: '/admin/performance' },
      { id: 285, name: 'Promotion Recommendation', to: '/admin/hr' },
    ],
  },
  {
    title: '19. Document Management (286–298)',
    items: [
      { id: 286, name: 'Employee Documents', to: '/admin/documents' },
      { id: 287, name: 'Client Documents', to: '/client' },
      { id: 288, name: 'Project Documents', to: '/admin/projects' },
      { id: 289, name: 'Company Documents', to: '/admin/documents' },
      { id: 290, name: 'Contracts', to: '/admin/legal' },
      { id: 291, name: 'Agreements', to: '/admin/legal' },
      { id: 292, name: 'Offer Letters', to: '/careers/internship' },
      { id: 293, name: 'Joining Letters', to: '/admin/onboarding' },
      { id: 294, name: 'Payslips', to: '/employee/salary' },
      { id: 295, name: 'Certificates', to: '/careers/internship' },
      { id: 296, name: 'Resume', to: '/admin/applications' },
      { id: 297, name: 'Upload / Download', to: '/admin/documents' },
      { id: 298, name: 'Document Expiry', to: '/admin/documents' },
    ],
  },
  {
    title: '20. Knowledge / Learning (299–305)',
    items: [
      { id: 299, name: 'Knowledge Base', to: '/insights' },
      { id: 300, name: 'Documentation', to: '/insights' },
      { id: 301, name: 'Tutorials', to: '/insights' },
      { id: 302, name: 'Training', to: '/courses' },
      { id: 303, name: 'Internal Guides', to: '/admin/courses' },
      { id: 304, name: 'FAQs', to: '/support' },
      { id: 305, name: 'Technical Documentation', to: '/technologies' },
    ],
  },
  {
    title: '21. Notifications (306–315)',
    items: [
      { id: 306, name: 'In-App Notifications', to: '/admin/communications' },
      { id: 307, name: 'Email Notifications', to: '/admin/communications' },
      { id: 308, name: 'Job Application Notification', to: '/admin/applications' },
      { id: 309, name: 'Interview Notification', to: '/admin/applications' },
      { id: 310, name: 'Leave Notification', to: '/admin/leaves' },
      { id: 311, name: 'Attendance Notification', to: '/admin/attendance' },
      { id: 312, name: 'Salary Notification', to: '/admin/payroll' },
      { id: 313, name: 'Support Notification', to: '/support' },
      { id: 314, name: 'Project Notification', to: '/admin/projects' },
      { id: 315, name: 'Payment Notification', to: '/admin/finance' },
    ],
  },
  {
    title: '22. Communication (316–324)',
    items: [
      { id: 316, name: 'Contact Form', to: '/contact' },
      { id: 317, name: 'Internal Messages', to: '/admin/communications' },
      { id: 318, name: 'Client Messages', to: '/client' },
      { id: 319, name: 'Employee Messages', to: '/employee/support' },
      { id: 320, name: 'Email System', to: '/admin/communications' },
      { id: 321, name: 'Newsletter', to: '/admin/communications' },
      { id: 322, name: 'Announcements', to: '/admin/notices' },
      { id: 323, name: 'Notices', to: '/admin/notices' },
      { id: 324, name: 'Chat', to: '/admin/chatbot' },
    ],
  },
  {
    title: '23. Admin Panel (325–338)',
    items: [
      { id: 325, name: 'Admin Dashboard', to: '/admin' },
      { id: 326, name: 'Statistics', to: '/admin' },
      { id: 327, name: 'Users', to: '/admin/roles' },
      { id: 328, name: 'Employees', to: '/admin/employees' },
      { id: 329, name: 'Clients', to: '/client' },
      { id: 330, name: 'Projects', to: '/admin/projects' },
      { id: 331, name: 'Jobs', to: '/admin/jobs' },
      { id: 332, name: 'Applications', to: '/admin/applications' },
      { id: 333, name: 'Leads', to: '/admin/contacts' },
      { id: 334, name: 'Tickets', to: '/admin/support-tickets' },
      { id: 335, name: 'Courses', to: '/admin/courses' },
      { id: 336, name: 'Contacts', to: '/admin/contacts' },
      { id: 337, name: 'Payments', to: '/admin/finance' },
      { id: 338, name: 'Reports', to: '/admin/reports' },
    ],
  },
  {
    title: '24. Website CMS (339–355)',
    items: [
      { id: 339, name: 'Home Content', to: '/' },
      { id: 340, name: 'About Content', to: '/about' },
      { id: 341, name: 'Services', to: '/services' },
      { id: 342, name: 'Industries', to: '/industries' },
      { id: 343, name: 'Technologies', to: '/technologies' },
      { id: 344, name: 'Projects', to: '/portfolio' },
      { id: 345, name: 'Case Studies', to: '/portfolio' },
      { id: 346, name: 'Insights', to: '/insights' },
      { id: 347, name: 'News', to: '/news' },
      { id: 348, name: 'Courses', to: '/courses' },
      { id: 349, name: 'Careers', to: '/careers' },
      { id: 350, name: 'Testimonials', to: '/about' },
      { id: 351, name: 'FAQs', to: '/support' },
      { id: 352, name: 'Banners', to: '/admin/settings' },
      { id: 353, name: 'Menus', to: '/admin/settings' },
      { id: 354, name: 'Footer', to: '/admin/settings' },
      { id: 355, name: 'Social Links', to: '/admin/settings' },
    ],
  },
  {
    title: '25. Reports (356–370)',
    items: [
      { id: 356, name: 'Employee Report', to: '/admin/reports' },
      { id: 357, name: 'Attendance Report', to: '/admin/reports' },
      { id: 358, name: 'Leave Report', to: '/admin/reports' },
      { id: 359, name: 'Payroll Report', to: '/admin/reports' },
      { id: 360, name: 'Job Report', to: '/admin/reports' },
      { id: 361, name: 'Application Report', to: '/admin/reports' },
      { id: 362, name: 'Recruitment Report', to: '/admin/reports' },
      { id: 363, name: 'Project Report', to: '/admin/reports' },
      { id: 364, name: 'Client Report', to: '/admin/reports' },
      { id: 365, name: 'Sales Report', to: '/admin/reports' },
      { id: 366, name: 'Lead Report', to: '/admin/reports' },
      { id: 367, name: 'Support Report', to: '/admin/reports' },
      { id: 368, name: 'Revenue Report', to: '/admin/finance' },
      { id: 369, name: 'Expense Report', to: '/admin/finance' },
      { id: 370, name: 'Course Report', to: '/admin/courses' },
    ],
  },
  {
    title: '26. Security (371–387)',
    items: [
      { id: 371, name: 'Role-Based Access', to: '/admin/roles' },
      { id: 372, name: 'Admin Authentication', to: '/login' },
      { id: 373, name: 'JWT', to: '/admin/security' },
      { id: 374, name: 'Password Hashing', to: '/admin/security' },
      { id: 375, name: 'Forgot Password', to: '/forgot-password' },
      { id: 376, name: 'Email Verification', to: '/admin/security' },
      { id: 377, name: 'Login History', to: '/admin/security' },
      { id: 378, name: 'Activity Logs', to: '/admin/security' },
      { id: 379, name: 'Audit Logs', to: '/admin/security' },
      { id: 380, name: 'IP Logs', to: '/admin/security' },
      { id: 381, name: 'Session Management', to: '/admin/security' },
      { id: 382, name: 'Rate Limiting', to: '/admin/security' },
      { id: 383, name: 'File Validation', to: '/admin/security' },
      { id: 384, name: 'API Security', to: '/admin/security' },
      { id: 385, name: 'CORS', to: '/admin/security' },
      { id: 386, name: 'Security Headers', to: '/admin/security' },
      { id: 387, name: 'Admin 2FA', to: '/admin/security' },
    ],
  },
  {
    title: '27. Settings (388–401)',
    items: [
      { id: 388, name: 'General Settings', to: '/admin/settings' },
      { id: 389, name: 'Company Information', to: '/admin/settings' },
      { id: 390, name: 'Logo', to: '/admin/settings' },
      { id: 391, name: 'Contact Information', to: '/admin/settings' },
      { id: 392, name: 'Email Settings', to: '/admin/settings' },
      { id: 393, name: 'Notification Settings', to: '/admin/settings' },
      { id: 394, name: 'Security Settings', to: '/admin/security' },
      { id: 395, name: 'Role & Permissions', to: '/admin/roles' },
      { id: 396, name: 'Payment Settings', to: '/admin/finance' },
      { id: 397, name: 'Tax Settings', to: '/admin/finance' },
      { id: 398, name: 'Storage Settings', to: '/admin/settings' },
      { id: 399, name: 'API Settings', to: '/admin/settings' },
      { id: 400, name: 'Backup', to: '/admin/data-export' },
      { id: 401, name: 'System Logs', to: '/admin/security' },
    ],
  },
  {
    title: '28. Mobile / PWA (402–407)',
    items: [
      { id: 402, name: 'Responsive Design', to: '/' },
      { id: 403, name: 'Mobile Navigation', to: '/' },
      { id: 404, name: 'PWA', to: '/' },
      { id: 405, name: 'Install App', to: '/' },
      { id: 406, name: 'Offline Page', to: '/' },
      { id: 407, name: 'Push Notifications', to: '/admin/communications' },
    ],
  },
  {
    title: '29. SEO (408–419)',
    items: [
      { id: 408, name: 'SEO Settings', to: '/admin/settings' },
      { id: 409, name: 'Meta Title', to: '/' },
      { id: 410, name: 'Meta Description', to: '/' },
      { id: 411, name: 'Keywords', to: '/' },
      { id: 412, name: 'Open Graph', to: '/' },
      { id: 413, name: 'Sitemap', to: '/sitemap.xml' },
      { id: 414, name: 'Robots.txt', to: '/robots.txt' },
      { id: 415, name: 'Canonical URLs', to: '/' },
      { id: 416, name: 'Schema Markup', to: '/' },
      { id: 417, name: 'Organization Schema', to: '/about' },
      { id: 418, name: 'Article Schema', to: '/insights' },
      { id: 419, name: 'FAQ Schema', to: '/support' },
    ],
  },
  {
    title: '30. Legal Pages (420–425)',
    items: [
      { id: 420, name: 'Privacy Policy', to: '/legal/privacy' },
      { id: 421, name: 'Terms & Conditions', to: '/legal/terms' },
      { id: 422, name: 'Cookie Policy', to: '/legal/cookies' },
      { id: 423, name: 'Refund Policy', to: '/legal/refund' },
      { id: 424, name: 'Disclaimer', to: '/legal/disclaimer' },
      { id: 425, name: 'Data Protection Policy', to: '/legal/data-protection' },
    ],
  },
  {
    title: '31. Contact (426–434)',
    items: [
      { id: 426, name: 'Contact Us', to: '/contact' },
      { id: 427, name: 'Office Address', to: '/contact' },
      { id: 428, name: 'Phone', to: '/contact' },
      { id: 429, name: 'Email', to: '/contact' },
      { id: 430, name: 'WhatsApp', to: '/contact' },
      { id: 431, name: 'Google Maps', to: '/contact' },
      { id: 432, name: 'Contact Form', to: '/contact' },
      { id: 433, name: 'Business Hours', to: '/contact' },
      { id: 434, name: 'Social Media', to: '/contact' },
    ],
  },
  {
    title: '32. Trust / Company (435–445)',
    items: [
      { id: 435, name: 'Testimonials', to: '/trust' },
      { id: 436, name: 'Client Logos', to: '/trust' },
      { id: 437, name: 'Partners', to: '/about' },
      { id: 438, name: 'Certifications', to: '/about' },
      { id: 439, name: 'Awards', to: '/about' },
      { id: 440, name: 'Achievements', to: '/trust' },
      { id: 441, name: 'Statistics', to: '/' },
      { id: 442, name: 'Years of Experience', to: '/about' },
      { id: 443, name: 'Projects Completed', to: '/portfolio' },
      { id: 444, name: 'Team Members', to: '/about' },
      { id: 445, name: 'Global Presence', to: '/about' },
    ],
  },
  {
    title: '33. AI Features (446–452)',
    items: [
      { id: 446, name: 'AI Chatbot', to: '/ai' },
      { id: 447, name: 'AI FAQ Assistant', to: '/ai' },
      { id: 448, name: 'AI Job Search', to: '/careers/jobs' },
      { id: 449, name: 'AI Resume Assistance', to: '/ai' },
      { id: 450, name: 'AI Support Assistant', to: '/support' },
      { id: 451, name: 'AI Lead Assistant', to: '/crm' },
      { id: 452, name: 'AI Knowledge Assistant', to: '/insights' },
    ],
  },
  {
    title: '34. API / Backend Structure',
    items: [
      { id: 453, name: 'See backend/BACKEND_STRUCTURE.md', to: '/admin/modules' },
      { id: 454, name: 'Security & JWT', to: '/admin/security' },
    ],
  },
];

export default function AdminModules() {
  const { user } = useAuth();
  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container">
        <p>Access denied — admin / HR login required.</p>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  return (
    <div className="section page-bg-admin">
      <div className="container" style={{ maxWidth: 1200 }}>
        <h1 className="section-title">Complete module map (230–454)</h1>
        <AdminHero variant="default" />
        <p style={{ color: '#94a3b8', marginBottom: '1.25rem' }}>
          Har item linked hai existing admin / portal page se. Working modules open directly; baaki catalogue + route ready for viva demo.
        </p>
        {SECTIONS.map((sec) => (
          <div key={sec.title} className="card" style={{ marginBottom: '1rem' }}>
            <h2 style={{ color: '#38bdf8', marginTop: 0, fontSize: '1.1rem' }}>{sec.title}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {sec.items.map((it) => (
                <Link
                  key={it.id}
                  to={it.to}
                  style={{
                    fontSize: '0.8rem',
                    padding: '6px 10px',
                    borderRadius: 8,
                    background: 'rgba(56,189,248,0.1)',
                    color: '#7dd3fc',
                    textDecoration: 'none',
                    border: '1px solid rgba(56,189,248,0.2)',
                  }}
                >
                  {it.id}. {it.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
        <p>
          <Link to="/admin" className="btn btn-outline">← Admin dashboard</Link>
        </p>
      </div>
    </div>
  );
}
