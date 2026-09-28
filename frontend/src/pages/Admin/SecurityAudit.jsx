import { useEffect, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function loadLogs() {
  try {
    return JSON.parse(localStorage.getItem('ds_audit_logs') || '[]');
  } catch {
    return [];
  }
}

function loadSec() {
  try {
    return JSON.parse(
      localStorage.getItem('ds_security_settings') ||
        JSON.stringify({
          mfaEnabled: false,
          passwordMinLength: 8,
          lockAfterFails: 5,
          ipBlockList: '',
          sessionTimeoutMin: 60,
        })
    );
  } catch {
    return { mfaEnabled: false, passwordMinLength: 8, lockAfterFails: 5, ipBlockList: '', sessionTimeoutMin: 60 };
  }
}

export function pushAuditLog(action, detail, email) {
  try {
    const logs = loadLogs();
    logs.unshift({
      id: `aud-${Date.now()}`,
      action,
      detail,
      email: email || 'system',
      at: new Date().toISOString(),
    });
    localStorage.setItem('ds_audit_logs', JSON.stringify(logs.slice(0, 500)));
  } catch {}
}

export default function AdminSecurityAudit() {
  const { user } = useAuth();
  const [logs, setLogs] = useState(loadLogs);
  const [sec, setSec] = useState(loadSec);
  const [backupNote, setBackupNote] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    localStorage.setItem('ds_security_settings', JSON.stringify(sec));
  }, [sec]);

  useEffect(() => {
    if (user?.role === 'admin') {
      pushAuditLog('Opened Security & Audit', 'Viewed super-admin security module', user.email);
      setLogs(loadLogs());
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="section container">
        <p>Security & System Audit — Super Admin only.</p>
        <Link to="/admin">← Back</Link>
      </div>
    );
  }

  const manualBackup = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      by: user.email,
      keys: {},
    };
    const keys = [
      'ds_projects',
      'ds_project_tasks',
      'ds_crm_clients',
      'ds_crm_leads',
      'ds_crm_logs',
      'ds_crm_proposals',
      'ds_fin_invoices',
      'ds_fin_expenses',
      'ds_support_tickets',
      'ds_settings_company',
      'ds_performance',
      'ds_notices',
      'ds_rbac_matrix',
    ];
    keys.forEach((k) => {
      try {
        payload.keys[k] = localStorage.getItem(k);
      } catch {}
    });
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ds-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    pushAuditLog('Manual backup', 'Downloaded local data snapshot JSON', user.email);
    setLogs(loadLogs());
    setBackupNote(`Backup downloaded at ${new Date().toLocaleString()}. For MongoDB use mongodump on server.`);
    setMsg('Backup file downloaded.');
  };

  const clearLogs = () => {
    if (!window.confirm('Clear audit log history?')) return;
    localStorage.setItem('ds_audit_logs', '[]');
    setLogs([]);
    setMsg('Audit logs cleared.');
  };

  const logAction = (action, detail) => {
    pushAuditLog(action, detail, user.email);
    setLogs(loadLogs());
  };

  return (
    <div className="section page-bg-security">
      <div className="container" style={{ maxWidth: 900 }}>
        <p>
          <Link to="/admin" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
        </p>
        <h1 className="section-title">🔒 Security & System Audit</h1>
        <AdminHero variant="security" />
        <p className="section-subtitle">Activity logs, data backup export, MFA flags and IP controls (super-admin).</p>
        {msg && <p style={{ color: '#34d399' }}>{msg}</p>}

        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Security settings</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', marginBottom: '0.75rem' }}>
            <input
              type="checkbox"
              checked={!!sec.mfaEnabled}
              onChange={(e) => {
                setSec({ ...sec, mfaEnabled: e.target.checked });
                logAction('MFA setting', e.target.checked ? 'Enabled MFA flag' : 'Disabled MFA flag');
              }}
            />
            Multi-factor authentication (MFA) required for admin logins
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Min password length
              <input
                type="number"
                value={sec.passwordMinLength}
                onChange={(e) => setSec({ ...sec, passwordMinLength: Number(e.target.value) || 8 })}
                style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.5rem', borderRadius: 8 }}
              />
            </label>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Lock after failed attempts
              <input
                type="number"
                value={sec.lockAfterFails}
                onChange={(e) => setSec({ ...sec, lockAfterFails: Number(e.target.value) || 5 })}
                style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.5rem', borderRadius: 8 }}
              />
            </label>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Session timeout (minutes)
              <input
                type="number"
                value={sec.sessionTimeoutMin}
                onChange={(e) => setSec({ ...sec, sessionTimeoutMin: Number(e.target.value) || 60 })}
                style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.5rem', borderRadius: 8 }}
              />
            </label>
          </div>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.75rem' }}>
            IP block list (comma-separated)
            <textarea
              value={sec.ipBlockList}
              onChange={(e) => setSec({ ...sec, ipBlockList: e.target.value })}
              rows={2}
              placeholder="e.g. 1.2.3.4, 5.6.7.0/24"
              style={{ display: 'block', width: '100%', marginTop: 4, padding: '0.5rem', borderRadius: 8 }}
            />
          </label>
          <button
            type="button"
            className="btn btn-primary"
            style={{ marginTop: '0.75rem' }}
            onClick={() => {
              logAction('Security settings saved', JSON.stringify(sec));
              setMsg('Security settings saved.');
            }}
          >
            Save security settings
          </button>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.75rem' }}>
            Password resets: employees use Forgot Password on login. Admin password history:{' '}
            <Link to="/admin/passwords" style={{ color: '#00d4ff' }}>
              Passwords module
            </Link>
            .
          </p>
        </div>

        <div className="card" style={{ marginBottom: '1rem' }}>
          <h3 style={{ marginTop: 0, color: '#00d4ff' }}>Database / data backups</h3>
          <p style={{ color: '#cbd5e1', lineHeight: 1.65 }}>
            One-click export downloads a JSON snapshot of CRM, finance, projects, tickets and settings stored in this
            browser. For production MongoDB, schedule <code>mongodump</code> on the server or Atlas backups.
          </p>
          <button type="button" className="btn btn-primary" onClick={manualBackup}>
            Download backup snapshot
          </button>
          {backupNote && <p style={{ color: '#94a3b8', marginTop: '0.5rem', fontSize: '0.9rem' }}>{backupNote}</p>}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <h3 style={{ margin: 0, color: '#00d4ff' }}>Activity logs (audit trail)</h3>
            <button type="button" className="btn btn-outline" style={{ fontSize: '0.8rem' }} onClick={clearLogs}>
              Clear logs
            </button>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Tracks key admin actions in this browser session store (max 500).</p>
          <div style={{ maxHeight: 420, overflowY: 'auto' }}>
            {logs.length === 0 && <p style={{ color: '#94a3b8' }}>No audit entries yet.</p>}
            {logs.map((l) => (
              <div key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0.55rem 0' }}>
                <strong style={{ color: '#e2e8f0' }}>{l.action}</strong>
                <p style={{ margin: '0.2rem 0', color: '#94a3b8', fontSize: '0.85rem' }}>{l.detail}</p>
                <p style={{ margin: 0, color: '#475569', fontSize: '0.75rem' }}>
                  {l.email} · {new Date(l.at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
