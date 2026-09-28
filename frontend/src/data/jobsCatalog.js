/** ~1000 open roles / internships for DS-TECHNOLOGIES */
const DEPTS = [
  'Engineering', 'Software Development', 'Web Development', 'Mobile Development',
  'Data & AI', 'Cloud & DevOps', 'Cyber Security', 'QA / Testing',
  'HR', 'Finance', 'Sales', 'Marketing', 'Operations', 'Customer Support',
  'Administration', 'Product', 'Design', 'Business Analysis',
];
const LOCS = [
  'Bareilly', 'Bareilly / Hybrid', 'Hybrid / Remote', 'Remote',
  'Lucknow', 'Noida', 'Delhi NCR', 'Kanpur', 'Faridpur (Bareilly)',
];
const TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Fresher'];
const EXP = ['Fresher / 0 years', '0-1 years', '0-2 years', '1-3 years', '2-5 years', '3-6 years', 'Executives / 5+ years'];
const COURSES = [
  'BCA', 'MCA', 'B.Tech', 'M.Tech', 'BSc', 'MSc', 'B.Com', 'M.Com', 'BBA', 'MBA',
  'Diploma CS', 'Diploma Mechanical', 'Diploma Electrical', 'B.Pharm', 'Nursing', 'Any Graduate',
];
const TITLES = [
  'Software Developer', 'Junior Software Developer', 'Full Stack Developer', 'Frontend Developer',
  'Backend Developer', 'React Developer', 'Node.js Developer', 'Python Developer',
  'Java Developer', 'Mobile App Developer', 'Android Developer', 'iOS Developer',
  'DevOps Engineer', 'Cloud Engineer', 'AWS Associate', 'Azure Engineer',
  'Data Analyst', 'Data Engineer', 'ML Engineer', 'AI Intern',
  'Cyber Security Analyst', 'Network Administrator', 'System Administrator',
  'QA Engineer', 'Manual Tester', 'Automation Tester',
  'UI/UX Designer', 'Graphic Designer', 'Product Manager', 'Business Analyst',
  'HR Executive', 'HR Intern', 'Recruiter', 'Talent Acquisition',
  'Accounts Executive', 'Finance Intern', 'Sales Executive', 'Business Development',
  'Digital Marketing Executive', 'Content Writer', 'SEO Executive',
  'Customer Support Executive', 'Technical Support', 'Operations Executive',
  'Project Coordinator', 'Team Lead – Software', 'Senior Software Engineer',
  'Intern – Software Development', 'Intern – Web Development', 'Intern – Data Science',
  'Intern – HR', 'Intern – Marketing', 'Trainee Engineer', 'Graduate Trainee',
  'SAP Consultant', 'Database Administrator', 'Network Security Administrator',
  'ITOM Developer', 'AI Solution Associate', 'Digital Engineering Associate',
];

function hash(i) {
  return (i * 2654435761) >>> 0;
}

export function buildJobsCatalog(count = 1000) {
  const jobs = [];
  for (let i = 1; i <= count; i++) {
    const h = hash(i);
    const titleBase = TITLES[h % TITLES.length];
    const dept = DEPTS[h % DEPTS.length];
    const loc = LOCS[(h >> 3) % LOCS.length];
    let type = TYPES[(h >> 5) % TYPES.length];
    if (i % 5 === 0) type = 'Internship';
    const exp = type === 'Internship' ? 'Fresher / Students' : EXP[(h >> 7) % EXP.length];
    const course = COURSES[(h >> 9) % COURSES.length];
    const isIntern = type === 'Internship' || titleBase.includes('Intern') || titleBase.includes('Trainee');
    const title = isIntern && !/intern|trainee/i.test(titleBase) ? `${titleBase} (Intern track)` : titleBase;
    jobs.push({
      _id: `dst-job-${i}`,
      title,
      department: dept,
      location: loc,
      type: isIntern ? 'Internship' : type,
      experience: exp,
      course,
      status: 'Open',
      vacancies: 1 + (h % 5),
      salary: isIntern
        ? 'Stipend based on performance'
        : `₹${(8 + (h % 40)) * 1000} – ₹${(15 + (h % 60)) * 1000} / month (approx)`,
      skills: ['Communication', course, dept.split(' ')[0], 'Teamwork'].slice(0, 4),
      description: `DS-TECHNOLOGIES is hiring for ${title} in ${dept}. Preferred education: ${course}. Location: ${loc}. Type: ${isIntern ? 'Internship' : type}. Real client and product work with mentorship from leadership in Bareilly / hybrid.`,
    });
  }
  return jobs;
}

export const JOBS_CATALOG = buildJobsCatalog(1000);
export default JOBS_CATALOG;
