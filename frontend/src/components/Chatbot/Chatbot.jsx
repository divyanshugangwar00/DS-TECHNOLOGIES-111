import { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const JOBS_LIST = `Open positions at DS-TECHNOLOGIES:
1. Junior Software Developer (BCA / B.Tech)
2. Frontend Developer Intern
3. Backend Developer (Node.js)
4. Full Stack Developer
5. Data Analyst / AI Enthusiast
6. Business Development Executive
7. MCA Intern – Software Development
8. UI/UX Design Intern
9. Software Engineer Trainee (All Branches – EE, ME, ECE, Civil, CSE...)
10. IT Support / Desktop Support
11. Graduate Engineer Trainee – Electrical / Mechanical / ECE
12. Web Developer (Diploma / BCA / B.Tech)

Apply: Careers → Jobs → View & Apply. Courses accepted: B.Tech (all branches), BCA, MCA, BSc, MSc, M.Tech, Diploma (Computer/Electrical/Mechanical/Electronics), Polytechnic, BE, MBA, Other.`;

const REPLIES = [
  {
    keys: ['hello', 'hi', 'hey', 'namaste', 'hii', 'good morning', 'good evening'],
    answer: 'Hello! Welcome to DS-TECHNOLOGIES. Main DS Assistant hoon. Jobs, courses, services, contact, founder — kuch bhi poochho.',
  },
  {
    keys: ['job', 'jobs', 'career', 'careers', 'opening', 'vacancy', 'hiring', 'recruit', 'position', 'fresher', 'internship', 'open position'],
    answer: JOBS_LIST,
  },
  {
    keys: ['course', 'courses', 'qualification', 'b.tech', 'bca', 'mca', 'diploma', 'electrical', 'mechanical', 'branch', 'eligible'],
    answer: 'Eligible for ALL – boys and girls:\n\nEngineering: B.Tech/BE/Diploma (CSE, ECE, EE, ME, Civil, Any)\nIT: BCA, MCA, BSc CS, MSc CS\nScience: BSc, MSc, Biotech\nCommerce: B.Com, M.Com, BBA, MBA, CA\nArts: BA, MA, B.Ed\nMedical: MBBS, BDS, B.Pharm, Nursing, GNM, BPT, Paramedical\nOther: 12th, Self-taught\n\nJobs mostly software/tech related; domain roles (EE/ME/Medical support) bhi hain. Apply form me course select karo.',
  },
  {
    keys: ['electrical', 'mechanical', 'ece', 'civil', 'diploma'],
    answer: 'Electrical, Mechanical, ECE, Civil, Diploma holders bhi apply kar sakte hain:\n• Software Engineer Trainee (All Branches)\n• Graduate Engineer Trainee – EE / ME / ECE\n• IT Support\n• Web Developer (agar coding interest hai)\nTraining di jayegi. Careers page pe Apply karo.',
  },
  {
    keys: ['apply', 'application', 'form', 'resume'],
    answer: 'Apply steps:\n1. Careers → Open Positions\n2. Job choose karke "View & Apply"\n3. Form me Name, Email, Course, Experience, Resume\n4. Submit\nRegister karke apply karna better hai taaki status track ho sake.',
  },
  {
    keys: ['contact', 'phone', 'mobile', 'email', 'address', 'location', 'office', 'where'],
    answer: 'Address: Village Kuiya Rampur, Post Kakra Kalan, Faridpur (Bareilly), UP – 243503\nPhone: +91 78957 33906 / +91 74549 10637\nEmail: divyanshugangwar950@gmail.com',
  },
  {
    keys: ['founder', 'owner', 'ceo', 'divyanshu', 'who founded'],
    answer: 'Founder & CEO: Divyanshu Gangwar\nBCA – Invertis University (Completed)\nCurrently pursuing MCA\nAbout / Who We Are page pe photo aur details hain.',
  },
  {
    keys: ['service', 'services', 'what do you do', 'kaam', 'offer', 'software'],
    answer: 'Services: Custom Software Development, Cloud (AWS/Azure/GCP), AI & Data, Cybersecurity, Digital Engineering, IT Consulting & Transformation. Services page pe detail hai.',
  },
  {
    keys: ['industry', 'industries', 'sector', 'banking', 'healthcare', 'retail', 'manufacturing', 'education'],
    answer: 'Industries: Banking & Financial Services, Healthcare, Retail & Consumer, Manufacturing, Education, Technology. Industries page pe har sector ke solutions listed hain.',
  },
  {
    keys: ['about', 'company', 'who we are', 'story', 'mission', 'vision'],
    answer: 'DS-TECHNOLOGIES – young IT company from Bareilly, UP. Mission: quality affordable tech solutions. Vision: trusted technology partner. Founded by Divyanshu Gangwar.',
  },
  {
    keys: ['admin', 'login admin', 'hr'],
    answer: 'Admin: Register → MongoDB me role "admin" set karo → Login → Admin dashboard → Applications Accept/Reject, Jobs manage.',
  },
  {
    keys: ['salary', 'package', 'stipend', 'pay'],
    answer: 'Salary role + experience + interview pe depend karti hai. Freshers competitive start; interns performance-based stipend. Exact figure interview me.',
  },
  {
    keys: ['react', 'node', 'javascript', 'python', 'mongo', 'tech stack', 'technology'],
    answer: 'Tech stack: React, Node.js, Express, MongoDB, JavaScript, Python, Cloud (AWS/Azure), Git. Project ke hisaab se tools choose hote hain.',
  },
  {
    keys: ['website', 'site', 'pages', 'navigation'],
    answer: 'Pages: Home, Services, Industries, Insights, About, Careers (Jobs + Apply), Contact, Login/Register. Login ke baad Employee / Admin portals.',
  },
  {
    keys: ['register', 'sign up', 'account', 'create account'],
    answer: 'Navbar me Register → Name, Email, Password, Phone. Phir jobs pe easily apply kar sakte ho.',
  },
  {
    keys: ['thank', 'thanks', 'dhanyavad', 'ok', 'okay'],
    answer: 'Welcome! Aur kuch chahiye to poochho. Call: +91 78957 33906 | Email: divyanshugangwar950@gmail.com',
  },

  {
    keys: ['doctor', 'mbbs', 'medical', 'nurse', 'hospital', 'pharmacist', 'bpt'],
    answer: 'Medical vacancies: Medical Officer/Doctor (MBBS), Resident Doctor, Staff Nurse, Pharmacist, Lab Technician, Physiotherapist, Healthcare IT Coordinator. Careers → Jobs me apply karo. Boys and girls both welcome.',
  },
  {
    keys: ['department', 'departments', 'hierarchy', 'organization'],
    answer: 'Departments: Leadership, Technology, Engineering, Medical, HR, Sales, Marketing, Finance, Operations, Data & AI, Design. Hierarchy: Founder → CXO → VP → Manager → Team Lead → Engineer → Intern. Admin → Employees me list hai.',
  },
  {
    keys: ['replace', 'remove', 'fire', 'hatana'],
    answer: 'Sirf Founder/full Admin Employees page se Replace ya Remove kar sakte hain. Login admin → Employees → Actions.',
  },
  {
    keys: ['help', 'support', 'assist'],
    answer: 'Main help kar sakta hoon: Jobs list, Courses, Apply process, Services, Contact, Founder, Admin. Kya chahiye?',
  },
];

function getReply(text) {
  const lower = (text || '').toLowerCase().trim();
  if (!lower) return 'Type karein — jaise "jobs", "courses", "contact", "electrical".';

  for (const item of REPLIES) {
    if (item.keys.some((k) => lower.includes(k))) return item.answer;
  }

  if (lower.length < 3) {
    return 'Thoda clear likhein. Example: jobs, diploma, electrical, contact.';
  }

  return `Aapka message: "${text}"\n\nCompany se related best answer ke liye try: jobs | courses | contact | services | founder\n\nDirect: +91 78957 33906 | divyanshugangwar950@gmail.com`;
}

export default function Chatbot() {
  try {
    const raw = localStorage.getItem('ds_chatbot');
    if (raw) {
      const cfg = JSON.parse(raw);
      if (cfg.enabled === false) return null;
    }
  } catch (_) {}
  return <ChatbotInner />;
}

function ChatbotInner() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: 'Hi! DS Assistant here. "jobs" type karke saari openings dekho. Courses, contact, services bhi pooch sakte ho.',
    },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input.trim() };
    const botMsg = { from: 'bot', text: getReply(input) };
    setMessages((m) => [...m, userMsg, botMsg]);
    setInput('');
  };

  return (
    <>
      <button className="chatbot-toggle" onClick={() => setOpen(!open)} aria-label="Chat">
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>DS Assistant</span>
            <small>Jobs · Courses · Contact</small>
          </div>
          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.from}`}>
                {m.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="chatbot-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="jobs, courses, electrical..."
            />
            <button onClick={send}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
