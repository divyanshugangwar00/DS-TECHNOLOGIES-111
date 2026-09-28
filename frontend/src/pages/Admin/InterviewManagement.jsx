import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminHero from '../../components/AdminHero';
import AdminListToolbar, { exportRowsToCsv } from '../../components/Admin/AdminListToolbar';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const STATUSES = ['Scheduled', 'Done', 'Selected', 'Rejected', 'No-show', 'On-hold'];
const STORAGE_KEY = 'ds_interviews_v1';

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function saveLocal(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default function AdminInterviewManagement() {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [interviews, setInterviews] = useState(loadLocal);
  const [selected, setSelected] = useState({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [form, setForm] = useState({
    applicationId: '',
    candidateName: '',
    candidateEmail: '',
    position: '',
    date: '',
    time: '',
    interviewer: '',
    mode: 'Online',
    status: 'Scheduled',
    feedback: '',
    score: '',
  });

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'hr')) return;
    api.get('/applications').then((r) => setApps(r.data || [])).catch(() => setApps([]));
  }, [user]);

  useEffect(() => { saveLocal(interviews); }, [interviews]);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return <div className="section container"><p>Admin / HR only.</p><Link to="/admin">Back</Link></div>;
  }

  const filtered = useMemo(() => {
    return interviews.filter((i) => {
      if (statusFilter && i.status !== statusFilter) return false;
      if (!search) return true;
      const s = search.toLowerCase();
      return [i.candidateName, i.candidateEmail, i.position, i.interviewer].join(' ').toLowerCase().includes(s);
    });
  }, [interviews, search, statusFilter]);

  const ids = filtered.map((i) => i.id);
  const selectedCount = ids.filter((id) => selected[id]).length;
  const allSelected = ids.length > 0 && ids.every((id) => selected[id]);

  const onAppPick = (id) => {
    const a = apps.find((x) => x._id === id);
    setForm((f) => ({
      ...f,
      applicationId: id,
      candidateName: a?.name || a?.candidateName || f.candidateName,
      candidateEmail: a?.email || f.candidateEmail,
      position: a?.jobTitle || a?.position || f.position,
    }));
  };

  const addInterview = (e) => {
    e.preventDefault();
    if (!form.candidateName || !form.date) {
      alert('Candidate name and date required');
      return;
    }
    const row = { ...form, id: `iv-${Date.now()}`, createdAt: new Date().toISOString() };
    setInterviews((list) => [row, ...list]);
    setForm({
      applicationId: '', candidateName: '', candidateEmail: '', position: '',
      date: '', time: '', interviewer: '', mode: 'Online', status: 'Scheduled', feedback: '', score: '',
    });
  };

  const updateStatus = (id, status) => {
    setInterviews((list) => list.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const updateFeedback = (id, feedback) => {
    setInterviews((list) => list.map((i) => (i.id === id ? { ...i, feedback } : i)));
  };

  const bulkDelete = () => {
    if (!selectedCount) return;
    if (!window.confirm(`Delete ${selectedCount} interview(s)?`)) return;
    setInterviews((list) => list.filter((i) => !selected[i.id]));
    setSelected({});
  };

  const deleteAll = () => {
    if (!window.confirm('Delete ALL interviews?')) return;
    setInterviews([]);
    setSelected({});
  };

  return (
    <div>
      <AdminHero title="Interview Management" subtitle="Schedule interviews, assign interviewers, capture feedback & status" />
      <div className="container section" style={{ paddingTop: '1rem' }}>
        <form className="card" onSubmit={addInterview} style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ marginTop: 0 }}>Schedule interview</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 10 }}>
            <label>From application
              <select value={form.applicationId} onChange={(e) => onAppPick(e.target.value)} style={inp}>
                <option value="">— Optional —</option>
                {apps.map((a) => (
                  <option key={a._id} value={a._id}>{(a.name || a.email || a._id).toString().slice(0, 40)}</option>
                ))}
              </select>
            </label>
            <label>Candidate name *<input style={inp} value={form.candidateName} onChange={(e) => setForm({ ...form, candidateName: e.target.value })} required /></label>
            <label>Email<input style={inp} value={form.candidateEmail} onChange={(e) => setForm({ ...form, candidateEmail: e.target.value })} /></label>
            <label>Position<input style={inp} value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} /></label>
            <label>Date *<input type="date" style={inp} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required /></label>
            <label>Time<input type="time" style={inp} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></label>
            <label>Interviewer<input style={inp} value={form.interviewer} onChange={(e) => setForm({ ...form, interviewer: e.target.value })} /></label>
            <label>Mode
              <select style={inp} value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })}>
                <option>Online</option><option>In-office</option><option>Phone</option>
              </select>
            </label>
            <label>Status
              <select style={inp} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: 12 }}>Add Interview</button>
        </form>

        <AdminListToolbar
          title="Interviews"
          selectedCount={selectedCount}
          totalCount={filtered.length}
          allSelected={allSelected}
          onSelectAll={(checked) => {
            const next = {};
            if (checked) ids.forEach((id) => { next[id] = true; });
            setSelected(next);
          }}
          onBulkDelete={bulkDelete}
          onDeleteAll={deleteAll}
          onExport={() => exportRowsToCsv('interviews.csv', filtered, ['candidateName', 'candidateEmail', 'position', 'date', 'time', 'interviewer', 'mode', 'status', 'score', 'feedback'])}
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          statusOptions={STATUSES}
          onStatusFilter={setStatusFilter}
        />

        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                <th style={th}></th>
                <th style={th}>Candidate</th>
                <th style={th}>Position</th>
                <th style={th}>When</th>
                <th style={th}>Interviewer</th>
                <th style={th}>Status</th>
                <th style={th}>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 16, color: '#64748b' }}>No interviews yet. Schedule one above.</td></tr>
              )}
              {filtered.map((i) => (
                <tr key={i.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={td}>
                    <input type="checkbox" checked={!!selected[i.id]} onChange={(e) => setSelected((s) => ({ ...s, [i.id]: e.target.checked }))} />
                  </td>
                  <td style={td}>
                    <div style={{ fontWeight: 600 }}>{i.candidateName}</div>
                    <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{i.candidateEmail}</div>
                  </td>
                  <td style={td}>{i.position || '—'}</td>
                  <td style={td}>{i.date} {i.time}</td>
                  <td style={td}>{i.interviewer || '—'} · {i.mode}</td>
                  <td style={td}>
                    <select value={i.status} onChange={(e) => updateStatus(i.id, e.target.value)} style={{ ...inp, marginTop: 0, width: 'auto' }}>
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={td}>
                    <input
                      style={{ ...inp, marginTop: 0, minWidth: 140 }}
                      placeholder="Feedback"
                      value={i.feedback || ''}
                      onChange={(e) => updateFeedback(i.id, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const inp = {
  width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #334155',
  background: '#0b1220', color: '#e2e8f0', marginTop: 4, display: 'block',
};
const th = { padding: '10px 8px', fontWeight: 600 };
const td = { padding: '10px 8px', verticalAlign: 'top' };
