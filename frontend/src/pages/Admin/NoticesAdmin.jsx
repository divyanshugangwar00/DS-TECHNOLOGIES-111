import { useEffect, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const KEY = 'ds_notices';

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

const SAMPLE_BODY = `Date: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
Notice No: DS-TECH/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}

To: All Employees & Interns
From: HR Department / Management

Dear Team,

Write your notice message here. Use Enter for new paragraphs.

Best Regards,
Management Team
DS Technologies`;

export default function AdminNotices() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState(SAMPLE_BODY);
  const [department, setDepartment] = useState('All');
  const [msg, setMsg] = useState('');
  const [fieldErr, setFieldErr] = useState({});
  const [noticeDate, setNoticeDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [sigHr, setSigHr] = useState(() => localStorage.getItem('ds_sig_hr') || '');
  const [sigManager, setSigManager] = useState(() => localStorage.getItem('ds_sig_manager') || '');
  const [sigFounder, setSigFounder] = useState(() => localStorage.getItem('ds_sig_founder') || '');

  useEffect(() => {
    setList(load());
  }, []);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container">
        <p>Access denied</p>
      </div>
    );
  }

  const persist = (next) => {
    setList(next);
    localStorage.setItem(KEY, JSON.stringify(next));
    try {
      window.dispatchEvent(new Event('ds-notices-updated'));
    } catch (_) {}
  };

  const onSig = (key, file, setter) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      setter(r.result);
      localStorage.setItem(key, r.result);
      setMsg('Signature saved');
    };
    r.readAsDataURL(file);
  };

  const saveNotice = (e) => {
    e.preventDefault();
    const fe = {};
    if (!title.trim()) fe.title = 'Title required';
    if (!body.trim()) fe.body = 'Message required';
    if (Object.keys(fe).length) {
      setFieldErr(fe);
      setMsg('');
      return;
    }
    setFieldErr({});
    const item = {
      id: Date.now().toString(),
      title: title.trim(),
      body: body.trim(),
      department,
      createdAt: noticeDate ? new Date(noticeDate + 'T12:00:00').toISOString() : new Date().toISOString(),
      author: user.name || user.email,
      sigHr,
      sigManager,
      sigFounder,
    };
    persist([item, ...list]);
    setTitle('');
    setBody(SAMPLE_BODY);
    setDepartment('All');
    setMsg('Notice published — employees see it on Employee → Notices');
  };

  const escapeHtml = (s) =>
    String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const downloadPdf = (n) => {
    const w = window.open('', '_blank');
    if (!w) {
      setMsg('Popup blocked — allow popups to print PDF');
      return;
    }
    const bodyHtml = escapeHtml(n.body).replace(/\n/g, '<br/>');
    const dateStr = new Date(n.createdAt).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${escapeHtml(n.title)}</title>
      <style>
        * { box-sizing: border-box; }
        body { font-family: Georgia, 'Times New Roman', serif; max-width: 720px; margin: 28px auto; color: #0f172a; padding: 20px; background: #fff; }
        .head { border-bottom: 3px solid #0369a1; padding-bottom: 14px; margin-bottom: 18px; }
        .brand { color: #0369a1; font-size: 18px; font-weight: 800; letter-spacing: 0.02em; font-family: system-ui, sans-serif; }
        .meta { color: #475569; font-size: 12px; margin-top: 4px; font-family: system-ui, sans-serif; }
        h1 { font-size: 24px; margin: 0 0 16px; color: #0f172a; }
        .body { white-space: pre-wrap; line-height: 1.75; font-size: 14.5px; color: #1e293b; }
        .author { margin-top: 20px; color: #64748b; font-size: 13px; font-family: system-ui, sans-serif; }
        .sigs { display: flex; justify-content: space-between; margin-top: 56px; gap: 16px; page-break-inside: avoid; }
        .sig { text-align: center; flex: 1; font-family: system-ui, sans-serif; font-size: 12px; color: #334155; }
        .sig img { max-height: 52px; max-width: 140px; display: block; margin: 0 auto 6px; }
        .sig-line { border-top: 1px solid #94a3b8; padding-top: 6px; margin-top: 4px; }
        @media print { body { margin: 0; } }
      </style></head><body>
      <div class="head" style="display:flex;align-items:center;gap:14px;">
        <img src="${window.location.origin}/logo.jpg" alt="DS-TECHNOLOGIES" style="width:64px;height:64px;object-fit:cover;border-radius:8px;" onerror="this.style.display='none'"/>
        <div>
          <div class="brand">DS-TECHNOLOGIES</div>
          <div class="meta">Village Kuiya Rampur, Faridpur, Bareilly, UP 243503</div>
          <div class="meta">Ph: 7895733906 · 7454910637 · Official Notice</div>
          <div class="meta">Department: ${escapeHtml(n.department || 'All')} · Date: ${dateStr} · Notice No: DS-TECH/${new Date(n.createdAt).getFullYear()}/${String(new Date(n.createdAt).getMonth()+1).padStart(2,'0')}</div>
        </div>
      </div>
      <h1>${escapeHtml(n.title)}</h1>
      <div class="body">${bodyHtml}</div>
      <p class="author">— ${escapeHtml(n.author || 'HR / Admin')}</p>
      <div class="sigs">
        <div class="sig">${n.sigHr ? `<img src="${n.sigHr}" alt="HR"/>` : '<div style="height:52px"></div>'}<div class="sig-line">HR</div></div>
        <div class="sig">${n.sigManager ? `<img src="${n.sigManager}" alt="Manager"/>` : '<div style="height:52px"></div>'}<div class="sig-line">Manager</div></div>
        <div class="sig">${n.sigFounder ? `<img src="${n.sigFounder}" alt="CEO"/>` : '<div style="height:52px"></div>'}<div class="sig-line">Founder / CEO</div></div>
      </div>
      <script>setTimeout(function(){ window.print(); }, 250);</script>
      </body></html>`);
    w.document.close();
  };

  const removeNotice = (id) => {
    if (!window.confirm('Delete this notice?')) return;
    persist(list.filter((x) => x.id !== id));
    setMsg('Notice deleted');
  };

  return (
    <div className="section page-bg-admin">
      <div className="container" style={{ maxWidth: 860 }}>
        <p>
          <Link to="/admin" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
        </p>
        <AdminHero variant="notices"
          title="Company Notices"
          subtitle="Publish notices for employees. They appear on Employee → Notices. Use Enter in message for new lines (PDF keeps formatting)."
        />
        {msg && <p style={{ color: '#10b981' }}>{msg}</p>}

        <form className="card" onSubmit={saveNotice} style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginTop: 0, color: '#38bdf8' }}>Create notice</h3>

          <div className="form-group">
            <label>Notice date</label>
            <input type="date" value={noticeDate} onChange={(e) => setNoticeDate(e.target.value)} />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>HR signature (optional)</label>
              <input type="file" accept="image/*" onChange={(e) => onSig('ds_sig_hr', e.target.files?.[0], setSigHr)} />
              {sigHr && <img src={sigHr} alt="" style={{ height: 40, marginTop: 6, background: '#fff', padding: 4, borderRadius: 4 }} />}
            </div>
            <div className="form-group">
              <label>Manager signature</label>
              <input type="file" accept="image/*" onChange={(e) => onSig('ds_sig_manager', e.target.files?.[0], setSigManager)} />
              {sigManager && <img src={sigManager} alt="" style={{ height: 40, marginTop: 6, background: '#fff', padding: 4, borderRadius: 4 }} />}
            </div>
            <div className="form-group">
              <label>Founder / CEO signature</label>
              <input type="file" accept="image/*" onChange={(e) => onSig('ds_sig_founder', e.target.files?.[0], setSigFounder)} />
              {sigFounder && <img src={sigFounder} alt="" style={{ height: 40, marginTop: 6, background: '#fff', padding: 4, borderRadius: 4 }} />}
            </div>
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setFieldErr((x) => ({ ...x, title: undefined }));
              }}
              placeholder="e.g. Krishna Janmashtami Holiday"
              style={fieldErr.title ? { borderColor: '#f87171' } : undefined}
            />
            {fieldErr.title && <small style={{ color: '#f87171' }}>{fieldErr.title}</small>}
          </div>

          <div className="form-group">
            <label>Department</label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} style={{ background: '#0f172a', color: '#e2e8f0' }}>
              {['All', 'Engineering', 'HR', 'Operations', 'Sales', 'Finance', 'Technology', 'Marketing', 'Leadership'].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Message * (press Enter for new line — required for clean PDF)</label>
            <textarea
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                setFieldErr((x) => ({ ...x, body: undefined }));
              }}
              rows={12}
              placeholder="Write full notice with line breaks..."
              style={{
                ...(fieldErr.body ? { borderColor: '#f87171' } : {}),
                fontFamily: 'system-ui, sans-serif',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
              }}
            />
            {fieldErr.body && <small style={{ color: '#f87171' }}>{fieldErr.body}</small>}
          </div>

          <button type="submit" className="btn btn-primary">
            Save / Publish Notice
          </button>
          <button
            type="button"
            className="btn btn-outline"
            style={{ marginLeft: 8 }}
            onClick={() => setBody(SAMPLE_BODY)}
          >
            Load template
          </button>
        </form>

        <h3 style={{ color: '#e2e8f0' }}>Published notices ({list.length})</h3>
        {list.length === 0 ? (
          <div className="card">
            <p style={{ color: '#94a3b8', margin: 0 }}>No notices yet. Create one above.</p>
          </div>
        ) : (
          list.map((n) => (
            <div
              className="card"
              key={n.id}
              style={{
                marginBottom: '1rem',
                borderLeft: '4px solid #38bdf8',
                background: 'rgba(15,23,42,0.9)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <h4 style={{ margin: '0.35rem 0', color: '#f8fafc' }}>{n.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                    {new Date(n.createdAt).toLocaleDateString('en-IN')} · {n.department} · {n.author}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" className="btn btn-outline" style={{ fontSize: '0.8rem' }} onClick={() => downloadPdf(n)}>
                    Print / PDF
                  </button>
                  <button type="button" className="btn btn-outline" style={{ fontSize: '0.8rem', color: '#fca5a5', borderColor: '#f87171' }} onClick={() => removeNotice(n.id)}>
                    Delete
                  </button>
                </div>
              </div>
              <div style={{ marginTop: 12, padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, borderBottom: '1px solid rgba(56,189,248,0.3)', paddingBottom: 8 }}>
                  <img src="/logo.jpg" alt="DS" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.95rem' }}>DS-TECHNOLOGIES</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Official Notice · {n.noticeDate || new Date(n.createdAt).toLocaleDateString('en-IN')}</div>
                  </div>
                </div>
                <p style={{ whiteSpace: 'pre-wrap', color: '#e2e8f0', margin: 0, lineHeight: 1.7, fontSize: '0.92rem' }}>{n.body}</p>
              </div>
              {(n.sigHr || n.sigManager || n.sigFounder) && (
                <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
                  {n.sigHr && <img src={n.sigHr} alt="HR" style={{ height: 36, background: '#fff', padding: 4, borderRadius: 4 }} />}
                  {n.sigManager && <img src={n.sigManager} alt="Mgr" style={{ height: 36, background: '#fff', padding: 4, borderRadius: 4 }} />}
                  {n.sigFounder && <img src={n.sigFounder} alt="CEO" style={{ height: 36, background: '#fff', padding: 4, borderRadius: 4 }} />}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
