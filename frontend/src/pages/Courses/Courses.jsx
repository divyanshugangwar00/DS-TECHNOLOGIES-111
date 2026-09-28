import { Link } from 'react-router-dom';

export const MODULES = [
  { id: 95, title: 'Courses', text: 'Catalogue of training programmes — Frontend, MERN, Python, Power BI.' },
  { id: 96, title: 'Course Categories', text: 'Development, Data, Design, Cloud, Soft skills.' },
  { id: 97, title: 'Course Details', text: 'Syllabus, duration, outcomes and certificate policy.' },
  { id: 98, title: 'Course Enrollment', text: 'Apply / enrol flow linked to your account.' },
  { id: 99, title: 'Student Login', text: 'Use site Login; learners access materials after auth.' },
  { id: 100, title: 'Learning Dashboard', text: 'Progress overview for enrolled courses.' },
  { id: 101, title: 'Study Material', text: 'Notes, PDFs and reference links shared by instructors.' },
  { id: 102, title: 'Videos', text: 'Recorded sessions and walkthroughs.' },
  { id: 103, title: 'Assignments', text: 'Practice tasks with submission status.' },
  { id: 104, title: 'Quizzes', text: 'Short assessments to check understanding.' },
  { id: 105, title: 'Certificates', text: 'Course completion certificates — see Careers → Internship/Course certificate studio.' },
  { id: 106, title: 'Course Progress', text: 'Percentage complete and remaining modules.' },
  { id: 107, title: 'Instructor', text: 'Mentor profiles from DS-TECHNOLOGIES training team.' },
  { id: 108, title: 'Course Reviews', text: 'Feedback from students and interns.' },
];

const SAMPLE = [
  { id: 95, name: 'Frontend Development', cat: 'Web', weeks: '8 weeks' },
  { id: 95, name: 'MERN Full Stack', cat: 'Web', weeks: '12 weeks' },
  { id: 95, name: 'Python for Data Science', cat: 'Data', weeks: '6 weeks' },
  { id: 95, name: 'Power BI Dashboards', cat: 'BI', weeks: '4 weeks' },
];

export default function Courses() {
  return (
    <div className="section page-bg-courses">
      <div className="container" style={{ maxWidth: 1100 }}>
        <h1 className="section-title">Courses / Training</h1>
        <p className="section-subtitle">Structured learning paths with enrollment, materials, quizzes, progress and certificates. Every module below is clickable.</p>
        <h2 style={{ color: '#e2e8f0' }}>Featured courses</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.85rem', marginBottom: '1.5rem' }}>
          {SAMPLE.map((s) => <Link to={`/explore/courses/${s.id}`} key={s.name} className="card catalog-card" style={{ color:'inherit', textDecoration:'none' }}>
            <h3 style={{ color: '#38bdf8', marginTop: 0 }}>{s.name}</h3><p style={{ color: '#94a3b8', margin: 0 }}>{s.cat} · {s.weeks}</p><div className="catalog-open" style={{ marginTop: 10 }}>View course →</div>
          </Link>)}
        </div>
        <h2 style={{ color: '#e2e8f0' }}>Training modules (95–108)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
          {MODULES.map((m) => <Link to={`/explore/courses/${m.id}`} key={m.id} className="card catalog-card" style={{ color:'inherit', textDecoration:'none' }}>
            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{m.id}</div><h3 style={{ color: '#7dd3fc', fontSize: '1rem', margin: '0.3rem 0' }}>{m.title}</h3><p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.88rem', lineHeight: 1.55 }}>{m.text}</p><div className="catalog-open" style={{ marginTop: '.8rem' }}>Open module →</div>
          </Link>)}
        </div>
        <p style={{ marginTop: '1.5rem' }}><Link to="/careers/internship" className="btn btn-primary">Certificate studio</Link>{' '}<Link to="/contact" className="btn btn-outline">Ask about training</Link></p>
      </div>
    </div>
  );
}
