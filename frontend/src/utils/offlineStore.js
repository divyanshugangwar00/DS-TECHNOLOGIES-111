const KEY = 'ds_offline_applications';

const DEMO_APPS = [
  {
    _id: 'offline-app-001',
    name: 'Rahul Sharma',
    email: 'rahul.demo@gmail.com',
    phone: '9876543210',
    resume: '',
    course: 'BCA',
    status: 'Interview',
    pipelineStep: 'Interview',
    job: { title: 'Junior Developer', department: 'Engineering' },
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'offline-app-002',
    name: 'Priya Verma',
    email: 'priya.demo@gmail.com',
    phone: '9876501234',
    resume: '',
    course: 'MCA',
    status: 'Shortlisted',
    pipelineStep: '',
    job: { title: 'HR Executive', department: 'HR' },
    createdAt: new Date().toISOString(),
  },
];

export function getOfflineApps() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  localStorage.setItem(KEY, JSON.stringify(DEMO_APPS));
  return [...DEMO_APPS];
}

export function saveOfflineApps(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
  return list;
}

export function updateOfflineApp(id, patch) {
  const list = getOfflineApps();
  const next = list.map((a) => (a._id === id ? { ...a, ...patch, job: patch.job || a.job } : a));
  saveOfflineApps(next);
  return next.find((a) => a._id === id);
}

export function isOfflineMode() {
  return !!localStorage.getItem('offlineUser') || (localStorage.getItem('token') || '').startsWith('offline-');
}
