import FloatingWhatsApp from './components/FloatingWhatsApp';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home/Home';
import Services from './pages/Services/Services';
import Industries from './pages/Industries/Industries';
import Insights from './pages/Insights/Insights';
import About from './pages/About/About';
import News from './pages/News/News';
import Internship from './pages/Careers/Internship';
import ResumeBuilder from './pages/Careers/ResumeBuilder';
import PortfolioBuilder from './pages/PortfolioBuilder/PortfolioBuilder';
import PublicPortfolio from './pages/PortfolioBuilder/PublicPortfolio';
import WebsiteBuilder from './pages/WebsiteBuilder/WebsiteBuilder';
import PublicSite from './pages/WebsiteBuilder/PublicSite';
import Careers from './pages/Careers/Careers';
import Jobs from './pages/Careers/Jobs';
import JobDetails from './pages/Careers/JobDetails';
import ApplyForm from './pages/Careers/ApplyForm';
import Contact from './pages/Contact/Contact';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Register from './pages/Auth/Register';
import EmployeeDashboard from './pages/Employee/EmployeeDashboard';
import Attendance from './pages/Employee/Attendance';
import LeaveApply from './pages/Employee/LeaveApply';
import EmployeeProfile from './pages/Employee/Profile';
import EmployeeSalary from './pages/Employee/Salary';
import EmployeeResign from './pages/Employee/Resign';
import EmployeeDocuments from './pages/Employee/Documents';
import EmployeeTasks from './pages/Employee/Tasks';
import EmployeeNotices from './pages/Employee/Notices';
import EmployeeSupport from './pages/Employee/Support';
import EmployeeDirectory from './pages/Employee/Directory';
import ChangePassword from './pages/Employee/ChangePassword';
import Courses from './pages/Courses/Courses';
import Solutions from './pages/Solutions/Solutions';
import Products from './pages/Products/Products';
import SupportPage from './pages/Support/Support';
import ClientPortal from './pages/Client/ClientPortal';
import Technologies from './pages/Technologies/Technologies';
import Portfolio from './pages/Portfolio/Portfolio';
import CRM from './pages/CRM/CRM';
import Finance from './pages/Finance/Finance';
import Legal from './pages/Legal/Legal';
import AIFeatures from './pages/AI/AIFeatures';
import Trust from './pages/Trust/Trust';
import ExploreDetail from './pages/ExploreDetail';
import Testimonials from './pages/Testimonials/Testimonials';
import CaseStudies from './pages/CaseStudies/CaseStudies';
import Team from './pages/Team/Team';
import FAQ from './pages/FAQ/FAQ';
import Pricing from './pages/Pricing/Pricing';
import NotFound from './pages/NotFound';
import CookieConsent from './components/CookieConsent/CookieConsent';

import AdminDashboard from './pages/Admin/Dashboard';
import AdminJobs from './pages/Admin/Jobs';
import AdminApplications from './pages/Admin/Applications';
import AdminEmployees from './pages/Admin/Employees';
import AdminAttendance from './pages/Admin/Attendance';
import AdminContacts from './pages/Admin/Contacts';
import AdminSettings from './pages/Admin/Settings';
import ChatbotAdmin from './pages/Admin/ChatbotAdmin';
import AdminAwards from './pages/Admin/Awards';
import AdminTreasury from './pages/Admin/Treasury';
import AdminReports from './pages/Admin/Reports';
import AdminModules from './pages/Admin/Modules';
import AdminPayroll from './pages/Admin/Payroll';
import AdminLeaves from './pages/Admin/Leaves';
import AdminCourses from './pages/Admin/Courses';
import AdminRoles from './pages/Admin/Roles';
import AdminHRModule from './pages/Admin/HRModule';
import AdminPerformance from './pages/Admin/Performance';
import AdminSecurity from './pages/Admin/Security';
import AdminDepartments from './pages/Admin/Departments';
import AdminDesignations from './pages/Admin/Designations';
import AdminTasks from './pages/Admin/TasksAdmin';
import AdminProjects from './pages/Admin/Projects';
import AdminCRM from './pages/Admin/CRM';
import AdminFinance from './pages/Admin/Finance';
import AdminSupportTickets from './pages/Admin/SupportTickets';
import AdminSystemSettings from './pages/Admin/SystemSettings';
import AdminSecurityAudit from './pages/Admin/SecurityAudit';
import AdminCloudServers from './pages/Admin/CloudServers';
import AdminAIAnalytics from './pages/Admin/AIAnalytics';
import AdminAssets from './pages/Admin/Assets';
import AdminLegalCompliance from './pages/Admin/LegalCompliance';
import AdminTrainingLMS from './pages/Admin/TrainingLMS';
import AdminCommunications from './pages/Admin/Communications';
import AdminSessionControl from './pages/Admin/SessionControl';
import AdminDataExport from './pages/Admin/DataExport';
import AdminWebsiteCMS from './pages/Admin/WebsiteCMS';
import AdminDocuments from './pages/Admin/DocumentsAdmin';
import AdminNotices from './pages/Admin/NoticesAdmin';
import AdminOfferLetter from './pages/Admin/OfferLetter';
import AdminJoiningForm from './pages/Admin/JoiningForm';
import AdminDocumentVerification from './pages/Admin/DocumentVerification';
import AdminOnboarding from './pages/Admin/Onboarding';
import AdminPasswords from './pages/Admin/Passwords';
import AdminResignLetters from './pages/Admin/ResignLetters';
import AdminRegistrations from './pages/Admin/Registrations';
import AdminCertificateGenerator from './pages/Admin/CertificateGenerator';
import AdminInterviewManagement from './pages/Admin/InterviewManagement';
import AdminAttendanceHistory from './pages/Admin/AttendanceHistory';
import Loading from './components/Loading';
import Chatbot from './components/Chatbot/Chatbot';
import { useAuth } from './context/AuthContext';

function App() {
  const { loading } = useAuth();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (loading) return <Loading />;

  // Site requires internet — do not run as offline app
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050814', color: '#e2e8f0', padding: 24, textAlign: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: 8 }}>Internet required</h1>
          <p style={{ color: '#94a3b8', maxWidth: 420 }}>DS-TECHNOLOGIES website needs an active internet connection. Offline mode is disabled.</p>
          <button type="button" className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/about" element={<About />} />
          <Route path="/news" element={<News />} />
          <Route path="/careers/resume-builder" element={<ResumeBuilder />} />
          <Route path="/portfolio-builder" element={<PortfolioBuilder />} />
          <Route path="/p/:slug" element={<PublicPortfolio />} />
          <Route path="/website-builder" element={<WebsiteBuilder />} />
          <Route path="/site/:slug" element={<PublicSite />} />
          <Route path="/careers/internship" element={<Internship />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/jobs" element={<Jobs />} />
          <Route path="/careers/jobs/:id" element={<JobDetails />} />
          <Route path="/careers/apply/:jobId" element={<ApplyForm />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/products" element={<Products />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/client" element={<ClientPortal />} />
          <Route path="/technologies" element={<Technologies />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/legal/:slug" element={<Legal />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/ai" element={<AIFeatures />} />
          <Route path="/trust" element={<Trust />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/team" element={<Team />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/explore/:section/:slug" element={<ExploreDetail />} />

          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/employee/leave" element={<LeaveApply />} />
          <Route path="/employee/profile" element={<EmployeeProfile />} />
          <Route path="/employee/salary" element={<EmployeeSalary />} />
          <Route path="/employee/resign" element={<EmployeeResign />} />
          <Route path="/employee/documents" element={<EmployeeDocuments />} />
          <Route path="/employee/tasks" element={<EmployeeTasks />} />
          <Route path="/employee/notices" element={<EmployeeNotices />} />
          <Route path="/employee/support" element={<EmployeeSupport />} />
          <Route path="/employee/directory" element={<EmployeeDirectory />} />
          <Route path="/employee/password" element={<ChangePassword />} />
          <Route path="/employee/attendance" element={<Attendance />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/employees" element={<AdminEmployees />} />
          <Route path="/admin/attendance" element={<AdminAttendance />} />
          <Route path="/admin/attendance-history" element={<AdminAttendanceHistory />} />
          <Route path="/admin/contacts" element={<AdminContacts />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/chatbot" element={<ChatbotAdmin />} />
          <Route path="/admin/awards" element={<AdminAwards />} />
          <Route path="/admin/treasury" element={<AdminTreasury />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/modules" element={<AdminModules />} />
          <Route path="/admin/payroll" element={<AdminPayroll />} />
          <Route path="/admin/leaves" element={<AdminLeaves />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          <Route path="/admin/roles" element={<AdminRoles />} />
          <Route path="/admin/hr" element={<AdminHRModule />} />
          <Route path="/admin/performance" element={<AdminPerformance />} />
          <Route path="/admin/security" element={<AdminSecurity />} />
          <Route path="/admin/departments" element={<AdminDepartments />} />
          <Route path="/admin/designations" element={<AdminDesignations />} />
          <Route path="/admin/tasks" element={<AdminTasks />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/crm" element={<AdminCRM />} />
          <Route path="/admin/finance" element={<AdminFinance />} />
          <Route path="/admin/support" element={<AdminSupportTickets />} />
          <Route path="/admin/system-settings" element={<AdminSystemSettings />} />
          <Route path="/admin/security-audit" element={<AdminSecurityAudit />} />
          <Route path="/admin/cloud" element={<AdminCloudServers />} />
          <Route path="/admin/ai-analytics" element={<AdminAIAnalytics />} />
          <Route path="/admin/assets" element={<AdminAssets />} />
          <Route path="/admin/legal" element={<AdminLegalCompliance />} />
          <Route path="/admin/training" element={<AdminTrainingLMS />} />
          <Route path="/admin/communications" element={<AdminCommunications />} />
          <Route path="/admin/sessions" element={<AdminSessionControl />} />
          <Route path="/admin/data-export" element={<AdminDataExport />} />
          <Route path="/admin/website-cms" element={<AdminWebsiteCMS />} />
          <Route path="/admin/documents" element={<AdminDocuments />} />
          <Route path="/admin/notices" element={<AdminNotices />} />
          <Route path="/admin/offer" element={<AdminOfferLetter />} />
          <Route path="/admin/joining" element={<AdminJoiningForm />} />
          <Route path="/admin/documents-verify" element={<AdminDocumentVerification />} />
          <Route path="/admin/onboarding" element={<AdminOnboarding />} />
          <Route path="/admin/passwords" element={<AdminPasswords />} />
          <Route path="/admin/resign-letters" element={<AdminResignLetters />} />
          <Route path="/admin/registrations" element={<AdminRegistrations />} />
          <Route path="/admin/certificates" element={<AdminCertificateGenerator />} />
          <Route path="/admin/interviews" element={<AdminInterviewManagement />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      {!isAdmin && <FloatingWhatsApp />}
      </main>
      <Footer />
      {!isAdmin && <Chatbot />}
      <CookieConsent />
    </>
  );
}

export default App;
