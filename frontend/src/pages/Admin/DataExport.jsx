import { useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const KEYS = [
  ['ds_crm_clients', 'Clients'],
  ['ds_crm_leads', 'Leads'],
  ['ds_fin_invoices', 'Invoices'],
  ['ds_fin_expenses', 'Expenses'],
  ['ds_projects', 'Projects'],
  ['ds_project_tasks', 'Tasks'],
  ['ds_support_tickets', 'Support tickets'],
  ['ds_assets_hw', 'Hardware assets'],
  ['ds_assets_sw', 'Software licenses'],
  ['ds_legal_docs', 'Legal docs'],
  ['ds_legal_tax', 'Tax records'],
  ['ds_lms_courses', 'LMS courses'],
  ['ds_announcements', 'Announcements'],
  ['ds_holidays', 'Holidays'],
  ['ds_performance', 'Performance'],
  ['ds_settings_company', 'Company profile'],
];

function collect() {
  const data = { exportedAt: new Date().toISOString(), modules: {} };
  KEYS.forEach(([k, label]) => {
    try {
      data.modules[label] = JSON.parse(localStorage.getItem(k) || 'null');
    } catch {
      data.modules[label] = localStorage.getItem(k);
    }
  });
  return data;
}

function toCsv(data) {
  const lines = ['Module,Record JSON'];
  Object.entries(data.modules).forEach(([label, val]) => {
    if (Array.isArray(val)) {
      val.forEach((row) => {
        lines.push(`"${label}","${JSON.stringify(row).replace(/"/g, '""')}"`);
      });
    } else if (val) {
      lines.push(`"${label}","${JSON.stringify(val).replace(/"/g, '""')}"`);
    }
  });
  return lines.join('\n');
}

export default function AdminDataExport() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ds_backup_schedule') || '{"enabled":true,"time":"00:00","target":"AWS S3 / Google Drive"}');
    } catch {
      return { enabled: true, time: '00:00', target: 'AWS S3 / Google Drive' };
    }
  });
  const [msg, setMsg] = useState('');

  if (!user || user.role !== 'admin') {
    return (
      <div className="section container">
        <p>Data export — Super Admin only.</p>
        <Link to="/admin">← Back</Link>
      </div>
    );
  }

  const downloadJson = () => {
    const data = collect();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ds-full-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setMsg('JSON export downloaded.');
  };

  const downloadCsv = () => {
    const data = collect();
    const blob = new Blob([toCsv(data)], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ds-full-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setMsg('CSV / Excel-compatible export downloaded.');
  };

  const downloadPdfSummary = () => {
    const data = collect();
    const counts = Object.entries(data.modules)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.length + ' records' : v ? '1 object' : 'empty'}`)
      .join('<br/>');
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>DS Backup Summary</title>
      <style>body{font-family:system-ui;padding:32px}h1{color:#0369a1}</style></head><body>
      <h1>DS-TECHNOLOGIES — Data export summary</h1>
      <p>Exported: ${data.exportedAt}</p>
      <p>By: ${user.email}</p>
      <hr/>
      <p>${counts}</p>
      <p style="color:#64748b">Full data is in JSON/CSV download. This PDF is a summary index.</p>
      <script>window.print()</script></body></html>`);
    w.document.close();
    setMsg('PDF summary opened for print.');
  };

  const saveSchedule = () => {
    localStorage.setItem('ds_backup_schedule', JSON.stringify(schedule));
    setMsg('Backup schedule preference saved. Run nightly job on server (cron → mongodump / S3).');
  };

  return (
    <div className="section page-bg-export">
      <div className="container" style={{ maxWidth: 800 }}>
        <p>
          <Link to="/admin" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
          {' · '}
          <Link to="/admin/security-audit" style={{ color: '#94a3b8' }}>
            Security backup snapshot
          </Link>
        </p>
        <h1 className="section-title">🔄 Data Export & Backup Center</h1>
        <AdminHero variant="export" />
        <p className="section-subtitle">One-click export of company modules; schedule notes for automated cloud backup.</p>
        {msg && <p style={{ color: '#34d399' }}>{msg}</p>}

        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ marginTop: 0, color: '#00d4ff' }}>One-click export</h3>
          <p style={{ color: '#94a3b8' }}>Includes CRM, finance, projects, tickets, assets, legal, LMS, holidays, performance, company profile.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <button type="button" className="btn btn-primary" onClick={downloadJson}>
              Download JSON
            </button>
            <button type="button" className="btn btn-outline" onClick={downloadCsv}>
              Download CSV (Excel)
            </button>
            <button type="button" className="btn btn-outline" onClick={downloadPdfSummary}>
              PDF summary
            </button>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Automated cloud backup</h3>
          <p style={{ color: '#cbd5e1', lineHeight: 1.65 }}>
            Prefer nightly job at <strong>12:00 AM</strong> to push MongoDB dump + file storage to Google Drive or AWS S3.
            This panel stores your preferred schedule; implement cron on the backend host.
          </p>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', marginBottom: '0.75rem' }}>
            <input
              type="checkbox"
              checked={!!schedule.enabled}
              onChange={(e) => setSchedule({ ...schedule, enabled: e.target.checked })}
            />
            Enable automated backup preference
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Time (24h)
              <input
                value={schedule.time}
                onChange={(e) => setSchedule({ ...schedule, time: e.target.value })}
                style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.5rem', borderRadius: 8 }}
              />
            </label>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Target
              <select
                value={schedule.target}
                onChange={(e) => setSchedule({ ...schedule, target: e.target.value })}
                style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.5rem', borderRadius: 8, background: '#0f172a', color: '#e2e8f0' }}
              >
                <option>AWS S3 / Google Drive</option>
                <option>AWS S3</option>
                <option>Google Drive</option>
                <option>Local disk</option>
              </select>
            </label>
          </div>
          <button type="button" className="btn btn-primary" style={{ marginTop: '0.75rem' }} onClick={saveSchedule}>
            Save schedule preference
          </button>
        </div>
      </div>
    </div>
  );
}
