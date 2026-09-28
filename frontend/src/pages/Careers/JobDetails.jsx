import { useEffect, useState } from 'react';
import { JOBS_CATALOG } from '../../data/jobsCatalog';
// catalog fallback for dst-job-* ids
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../../components/Loading';

const SAMPLE_JOBS = {
  'sample-1': {
    _id: 'sample-1',
    title: 'Junior Software Developer (BCA / B.Tech)',
    department: 'Engineering',
    location: 'Bareilly / Hybrid / Remote',
    type: 'Full-time',
    experience: '0-1 years / Fresher',
    description: 'We are looking for fresh BCA / B.Tech graduates who are passionate about coding and want to build real products. You will work on web applications using modern JavaScript technologies under mentorship of senior developers.\n\nThis is an excellent opportunity to start your career in software development with hands-on projects, code reviews, and continuous learning.',
    requirements: ['BCA / B.Tech / BSc (CS/IT) or equivalent', 'Basic knowledge of HTML, CSS, JavaScript', 'Willingness to learn React and Node.js', 'Good problem-solving attitude', 'Basic understanding of Git preferred'],
    responsibilities: ['Write clean and maintainable code', 'Participate in daily standups and code reviews', 'Learn and apply best practices', 'Collaborate with the team on features', 'Fix bugs and improve existing modules'],
    skills: ['JavaScript', 'HTML', 'CSS', 'React (preferred)', 'Git'],
    status: 'Open',
  },
  'sample-2': {
    _id: 'sample-2',
    title: 'Frontend Developer Intern',
    department: 'Engineering',
    location: 'Hybrid / Remote',
    type: 'Internship',
    experience: 'Fresher / Final year students',
    description: 'Internship opportunity for students pursuing BCA, B.Tech, BSc or MCA who want hands-on experience building modern user interfaces.\n\nYou will work with React, learn component design, responsive layouts and collaborate with the team on real client projects.',
    requirements: ['Pursuing or completed BCA / B.Tech / BSc / MCA', 'Knowledge of HTML, CSS, JavaScript', 'Interest in React and modern frontend', 'Ability to learn quickly'],
    responsibilities: ['Build UI components from designs', 'Convert mockups into responsive pages', 'Fix UI bugs and improve accessibility', 'Document your work'],
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    status: 'Open',
  },
  'sample-3': {
    _id: 'sample-3',
    title: 'Backend Developer (Node.js)',
    department: 'Engineering',
    location: 'Bareilly / Hybrid',
    type: 'Full-time',
    experience: '0-2 years',
    description: 'Join us to build robust APIs and backend services. Ideal for MCA / M.Tech / B.Tech / BCA graduates with interest in Node.js and databases.\n\nYou will design REST APIs, work with MongoDB, handle authentication and help deploy services.',
    requirements: ['B.Tech / MCA / M.Tech / BCA', 'Understanding of REST APIs', 'Basic knowledge of databases (MongoDB or SQL)', 'Familiarity with JavaScript / Node.js preferred'],
    responsibilities: ['Develop and maintain REST APIs', 'Work with MongoDB and related tools', 'Write tests and basic documentation', 'Support deployment and debugging'],
    skills: ['Node.js', 'Express', 'MongoDB', 'JavaScript', 'JWT'],
    status: 'Open',
  },
  'sample-4': {
    _id: 'sample-4',
    title: 'Full Stack Developer',
    department: 'Engineering',
    location: 'Hybrid / Remote',
    type: 'Full-time',
    experience: '1-3 years',
    description: 'Looking for developers who can work across the stack. Suitable for candidates with B.Tech, MCA, M.Tech or strong self-taught background.\n\nYou will own features end-to-end — from UI to API to database.',
    requirements: ['B.Tech / MCA / M.Tech / equivalent experience', 'Experience with React and Node.js preferred', 'Understanding of Git and basic deployment', 'Good communication skills'],
    responsibilities: ['End-to-end feature development', 'Code reviews and mentoring juniors', 'Deployment support', 'Client communication when needed'],
    skills: ['React', 'Node.js', 'MongoDB', 'Git', 'REST APIs'],
    status: 'Open',
  },
  'sample-5': {
    _id: 'sample-5',
    title: 'Data Analyst / AI Enthusiast',
    department: 'Data & AI',
    location: 'Remote / Hybrid',
    type: 'Full-time',
    experience: '0-2 years',
    description: 'For BSc / MSc / B.Tech / MCA graduates interested in data analysis, Python and basic machine learning concepts.\n\nYou will clean data, build dashboards and explore simple ML use-cases for business problems.',
    requirements: ['BSc / MSc / B.Tech / MCA', 'Python basics', 'Interest in data and AI', 'Familiarity with Excel / SQL preferred'],
    responsibilities: ['Data cleaning and analysis', 'Build simple dashboards and reports', 'Explore ML use-cases', 'Present findings to the team'],
    skills: ['Python', 'Pandas', 'SQL', 'Excel', 'Power BI'],
    status: 'Open',
  },
  'sample-6': {
    _id: 'sample-6',
    title: 'Business Development Executive',
    department: 'Sales',
    location: 'Bareilly / Field',
    type: 'Full-time',
    experience: '0-2 years',
    description: 'Help us grow by connecting with local businesses and explaining how technology can help them. Great for graduates who enjoy communication.\n\nYou will identify prospects, present our services and maintain relationships.',
    requirements: ['Any graduate (BCA / B.Tech / BSc / MCA preferred)', 'Good communication in Hindi & English', 'Willingness to travel locally', 'Interest in technology and sales'],
    responsibilities: ['Identify potential clients in the region', 'Present DS-TECHNOLOGIES services', 'Maintain client relationships', 'Coordinate with the technical team'],
    skills: ['Communication', 'MS Office', 'Presentation', 'Networking'],
    status: 'Open',
  },
  'sample-7': {
    _id: 'sample-7',
    title: 'MCA Intern – Software Development',
    department: 'Engineering',
    location: 'Hybrid / Remote',
    type: 'Internship',
    experience: 'MCA students / Final year',
    description: 'Dedicated internship track for MCA students. Work on live projects, learn industry practices, and get mentorship from the founding team.\n\nPerformance-based stipend may be offered.',
    requirements: ['Pursuing MCA (any year / final year)', 'Basic programming knowledge', 'Strong willingness to learn', 'Laptop and internet for remote work'],
    responsibilities: ['Contribute to live projects', 'Learn and apply coding standards', 'Document work and report progress', 'Participate in team discussions'],
    skills: ['Java / JavaScript', 'Database basics', 'Problem Solving'],
    status: 'Open',
  },
  'sample-8': {
    _id: 'sample-8',
    title: 'UI/UX Design Intern',
    department: 'Design',
    location: 'Remote',
    type: 'Internship',
    experience: 'Fresher / Students',
    description: 'For students interested in interface design, Figma, user research and creating beautiful digital experiences for web and mobile applications.',
    requirements: ['Interest in UI/UX design', 'Basic knowledge of Figma or similar tools', 'Portfolio or sample designs preferred', 'Good visual sense'],
    responsibilities: ['Create wireframes and mockups', 'Design UI components', 'Collaborate with developers', 'Improve existing designs'],
    skills: ['Figma', 'UI Design', 'Prototyping', 'Visual Design'],
    status: 'Open',
  },
  'sample-9': {
    _id: 'sample-9',
    title: 'Software Engineer Trainee (All Branches)',
    department: 'Engineering',
    location: 'Bareilly / Hybrid / Remote',
    type: 'Full-time',
    experience: '0-1 years / Fresher',
    description: 'Open for B.Tech / BE / Diploma (CSE, IT, ECE, Electrical, Mechanical, Civil) and BCA/MCA graduates.\n\nTraining will be provided in web development and real projects. Branch is not a barrier — attitude and learning ability matter most.',
    requirements: ['B.Tech / BE / Diploma / BCA / MCA (any branch)', 'Basic computer knowledge', 'Strong willingness to learn coding', 'Good communication'],
    responsibilities: ['Learn software development fundamentals', 'Work on assigned modules', 'Attend training sessions', 'Contribute to team projects'],
    skills: ['Programming Basics', 'Logical Thinking', 'Willingness to Learn'],
    status: 'Open',
  },
  'sample-10': {
    _id: 'sample-10',
    title: 'IT Support / Desktop Support Executive',
    department: 'Operations',
    location: 'Bareilly',
    type: 'Full-time',
    experience: '0-2 years / Diploma / BCA',
    description: 'For Diploma Computer, BCA, B.Tech or any graduate with interest in hardware, networking basics and user support.',
    requirements: ['Diploma Computer / BCA / B.Tech / Any graduate with IT interest', 'Basic hardware & networking knowledge', 'Patient communication skills'],
    responsibilities: ['Resolve desktop and network issues', 'Support internal team and clients', 'Maintain inventory of devices', 'Document common solutions'],
    skills: ['Windows', 'Networking Basics', 'Hardware', 'Communication'],
    status: 'Open',
  },
  'sample-11': {
    _id: 'sample-11',
    title: 'Graduate Engineer Trainee – Electrical / Mechanical / ECE',
    department: 'Engineering',
    location: 'Hybrid / Project based',
    type: 'Full-time',
    experience: 'Fresher – B.Tech / Diploma EE, ME, ECE',
    description: 'Projects sometimes need domain understanding of electrical, mechanical or electronics systems along with software (IoT, dashboards, automation). Freshers from EE, ME, ECE, Diploma can apply.',
    requirements: ['B.Tech / Diploma in Electrical / Mechanical / ECE / related', 'Interest in combining core engineering with software', 'Basic computer skills'],
    responsibilities: ['Support domain requirements in software projects', 'Learn IoT / dashboard tools', 'Coordinate with software team', 'Document technical requirements'],
    skills: ['Core Branch Knowledge', 'Basic Programming', 'Problem Solving'],
    status: 'Open',
  },
  'sample-12': {
    _id: 'sample-12',
    title: 'Web Developer (Diploma / BCA / B.Tech)',
    department: 'Engineering',
    location: 'Remote / Hybrid',
    type: 'Full-time',
    experience: '0-2 years',
    description: 'Build websites and web applications. Open for Diploma Computer, BCA, B.Tech CSE/IT, MCA and self-taught developers.',
    requirements: ['Diploma Computer / BCA / B.Tech / MCA / Self-taught', 'HTML, CSS, JavaScript knowledge', 'Portfolio or sample work preferred'],
    responsibilities: ['Develop responsive websites', 'Implement UI from designs', 'Fix bugs and optimize pages', 'Coordinate with backend team'],
    skills: ['HTML', 'CSS', 'JavaScript', 'React preferred'],
    status: 'Open',
  },

};

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && id.startsWith('sample')) {
      setJob(SAMPLE_JOBS[id] || null);
      setLoading(false);
      return;
    }
    if (id && id.startsWith('dst-job-')) {
      const fromCatalog = JOBS_CATALOG.find((j) => j._id === id);
      if (fromCatalog) {
        setJob({
          ...fromCatalog,
          requirements: [
            `Education: ${fromCatalog.course || 'Relevant degree / diploma'}`,
            `Experience: ${fromCatalog.experience}`,
            'Good communication in Hindi / English',
            'Willingness to learn and own tasks',
          ],
          responsibilities: [
            'Deliver assigned work with quality',
            'Collaborate with team and report progress',
            'Follow company processes (attendance, documentation)',
            'Contribute to client or internal product goals',
          ],
        });
        setLoading(false);
        return;
      }
    }
    api.get(`/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch(() => {
        const fromCatalog = JOBS_CATALOG.find((j) => j._id === id);
        setJob(fromCatalog || SAMPLE_JOBS[id] || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!job) {
    return (
      <div className="section container">
        <p>Job not found.</p>
        <Link to="/careers/jobs" className="btn btn-primary">Back to Jobs</Link>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 900 }}>
        <Link to="/careers/jobs" style={{ color: '#00d4ff', marginBottom: '1.5rem', display: 'inline-block' }}>
          ← Back to Jobs
        </Link>

        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>{job.title}</h1>
        <p style={{ color: '#00d4ff', marginBottom: '1.5rem' }}>
          {job.department} · {job.location}{job.salaryRange ? ` · ${job.salaryRange}` : ''} · {job.type} · {job.experience}
        </p>

        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>About the Role</h3>
          <p style={{ color: '#cbd5e1', whiteSpace: 'pre-line', lineHeight: 1.7 }}>{job.description}</p>
        </div>

        {job.responsibilities?.length > 0 && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Responsibilities</h3>
            <ul style={{ paddingLeft: '1.25rem', color: '#cbd5e1', lineHeight: 1.8 }}>
              {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}

        {job.requirements?.length > 0 && (
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Requirements</h3>
            <ul style={{ paddingLeft: '1.25rem', color: '#cbd5e1', lineHeight: 1.8 }}>
              {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}

        {job.skills?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
            {job.skills.map((s) => (
              <span key={s} style={{
                background: 'rgba(0,102,255,0.15)',
                color: '#00d4ff',
                padding: '0.35rem 0.8rem',
                borderRadius: 20,
                fontSize: '0.85rem',
              }}>{s}</span>
            ))}
          </div>
        )}

        <Link
          to={`/careers/apply/${job._id}`}
          className="btn btn-primary"
          style={{ fontSize: '1.05rem', padding: '1rem 2.5rem' }}
        >
          Apply for this Position
        </Link>
      </div>
    </div>
  );
}
