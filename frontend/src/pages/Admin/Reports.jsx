import { useEffect, useState } from 'react';
import AdminHero from '../../components/AdminHero';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function toCSV(rows, headers) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [headers.join(',')];
  rows.forEach((r) => lines.push(headers.map((h) => esc(r[h])).join(',')));
  return lines.join('\n');
}

function downloadCSV(filename, text) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function printPDF(title, htmlTable) {
  const w = window.open('', '_blank');
  if (!w) {
    alert('Popup blocked — allow popups for PDF');
    return;
  }
  w.document.write(`<!DOCTYPE html><html><head><title>${title}</title>
    <style>
      body{font-family:system-ui,sans-serif;padding:24px;color:#0f172a}
      h1{font-size:18px;margin:0 0 8px}
      p{color:#64748b;font-size:12px}
      table{width:100%;border-collapse:collapse;font-size:12px;margin-top:16px}
      th,td{border:1px solid #e2e8f0;padding:6px 8px;text-align:left}
      th{background:#f1f5f9}
    </style></head><body>
    <h1>DS-TECHNOLOGIES — ${title}</h1>
    <p>Generated ${new Date().toLocaleString('en-IN')}</p>
    ${htmlTable}
    <script>window.onload=function(){window.print()}<\/script>
    </body></html>`);
  w.document.close();
}

function tableHTML(headers, rows) {
  const th = headers.map((h) => `<th>${h}</th>`).join('');
  const tr = rows
    .map((r) => `<tr>${headers.map((h) => `<td>${r[h] ?? ''}</td>`).join('')}</tr>`)
    .join('');
  return `<table><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table>`;
}

export default function AdminReports() {
  const { user } = useAuth();
  const [data, setData] = useState({ jobs: [], apps: [], emps: [], att: [], contacts: [] });
  const [dept, setDept] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'hr')) return;
    Promise.all([
      api.get('/jobs').catch(() => ({ data: [] })),
      api.get('/applications').catch(() => ({ data: [] })),
      api.get('/employees').catch(() => ({ data: [] })),
      api.get('/attendance').catch(() => ({ data: [] })),
      api.get('/contact').catch(() => ({ data: [] })),
    ]).then(([j, a, e, at, c]) => {
      setData({
        jobs: j.data || [],
        apps: a.data || [],
        emps: e.data || [],
        att: at.data || [],
        contacts: c.data || [],
      });
      setLoading(false);
    });
  }, [user]);

  if (!user || (user.role !== 'admin' && user.role !== 'hr')) {
    return (
      <div className="section container">
        <p>Access denied</p>
      </div>
    );
  }

  const departments = ['All', ...new Set(data.emps.map((e) => e.department).filter(Boolean))].sort();

  const attRows = data.att
    .filter((x) => dept === 'All' || x.employee?.department === dept)
    .map((x) => ({
      name: x.employee?.user?.name || '',
      employeeId: x.employee?.employeeId || '',
      department: x.employee?.department || '',
      date: x.date ? new Date(x.date).toLocaleDateString('en-IN') : '',
      status: x.status || '',
      checkIn: x.checkIn ? new Date(x.checkIn).toLocaleTimeString('en-IN') : '',
      checkOut: x.checkOut ? new Date(x.checkOut).toLocaleTimeString('en-IN') : '',
    }));

  const presentRows = attRows.filter((r) => r.status === 'Present');
  const absentRows = attRows.filter((r) => r.status === 'Absent');
  const halfRows = attRows.filter((r) => r.status === 'Half-day');
  const attHeaders = ['name', 'employeeId', 'department', 'date', 'status', 'checkIn', 'checkOut'];

  const exportAtt = (rows, name) => {
    downloadCSV(`${name}.csv`, toCSV(rows, attHeaders));
  };
  const pdfAtt = (rows, title) => {
    printPDF(title, tableHTML(attHeaders, rows));
  };

  const cards = [
    {
      name: 'Job Report',
      count: data.jobs.length,
      csv: () =>
        downloadCSV(
          'jobs-report.csv',
          toCSV(
            data.jobs.map((x) => ({
              title: x.title,
              department: x.department,
              location: x.location,
              status: x.status,
              openings: x.openings,
            })),
            ['title', 'department', 'location', 'status', 'openings']
          )
        ),
      pdf: () =>
        printPDF(
          'Job Report',
          tableHTML(
            ['title', 'department', 'location', 'status', 'openings'],
            data.jobs.map((x) => ({
              title: x.title,
              department: x.department,
              location: x.location,
              status: x.status,
              openings: x.openings,
            }))
          )
        ),
    },
    {
      name: 'Application / Hiring Report',
      count: data.apps.length,
      csv: () =>
        downloadCSV(
          'applications-report.csv',
          toCSV(
            data.apps.map((x) => ({
              name: x.name,
              email: x.email,
              status: x.status,
              job: x.job?.title || x.positionSelected || '',
              department: x.departmentSelected || x.job?.department || '',
            })),
            ['name', 'email', 'status', 'job', 'department']
          )
        ),
      pdf: () =>
        printPDF(
          'Applications',
          tableHTML(
            ['name', 'email', 'status', 'job', 'department'],
            data.apps.map((x) => ({
              name: x.name,
              email: x.email,
              status: x.status,
              job: x.job?.title || '',
              department: x.departmentSelected || '',
            }))
          )
        ),
    },
    {
      name: 'Employee Report',
      count: data.emps.length,
      csv: () =>
        downloadCSV(
          'employees-report.csv',
          toCSV(
            data.emps
              .filter((x) => dept === 'All' || x.department === dept)
              .map((x) => ({
                name: x.user?.name,
                employeeId: x.employeeId,
                department: x.department,
                designation: x.designation,
                salary: x.salary,
              })),
            ['name', 'employeeId', 'department', 'designation', 'salary']
          )
        ),
      pdf: () =>
        printPDF(
          'Employees',
          tableHTML(
            ['name', 'employeeId', 'department', 'designation', 'salary'],
            data.emps
              .filter((x) => dept === 'All' || x.department === dept)
              .map((x) => ({
                name: x.user?.name,
                employeeId: x.employeeId,
                department: x.department,
                designation: x.designation,
                salary: x.salary,
              }))
          )
        ),
    },
    {
      name: 'Attendance — All',
      count: attRows.length,
      csv: () => exportAtt(attRows, 'attendance-all'),
      pdf: () => pdfAtt(attRows, 'Attendance All'),
    },
    {
      name: 'Attendance — Present only',
      count: presentRows.length,
      csv: () => exportAtt(presentRows, 'attendance-present'),
      pdf: () => pdfAtt(presentRows, 'Present Report'),
    },
    {
 
      name: 'Attendance — Absent only',
      count: absentRows.length,
      csv: () => exportAtt(absentRows, 'attendance-absent'),
      pdf: () => pdfAtt(absentRows, 'Absent Report'),
    },
    {
      name: 'Attendance — Half-day only',
      count: halfRows.length,
      csv: () => exportAtt(halfRows, 'attendance-halfday'),
      pdf: () => pdfAtt(halfRows, 'Half-day Report'),
    },
    {
      name: 'Contact Report',
      count: data.contacts.length,
      csv: () =>
        downloadCSV(
          'contacts-report.csv',
          toCSV(
            data.contacts.map((x) => ({
              name: x.name,
              email: x.email,
              phone: x.phone,
              subject: x.subject,
              message: x.message,
            })),
            ['name', 'email', 'phone', 'subject', 'message']
          )
        ),
      pdf: () =>
        printPDF(
          'Contacts',
          tableHTML(
            ['name', 'email', 'phone', 'subject'],
            data.contacts.map((x) => ({
              name: x.name,
              email: x.email,
              phone: x.phone,
              subject: x.subject,
            }))
          )
        ),
    },
  ];

  return (
    <div className="section page-bg-reports">
      <div className="container">
        <h1 className="section-title">Reports & Analytics</h1>
        <AdminHero variant="default" />
        <p className="section-subtitle">CSV + PDF export · Department filter for attendance / employees</p>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ color: '#94a3b8', marginRight: 8 }}>Department:</label>
          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            style={{ padding: '0.5rem 1rem', background: '#0f172a', color: '#e2e8f0', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)' }}
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="grid-2">
            {cards.map((r) => (
              <div className="card" key={r.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem' }}>{r.name}</h3>
                  <p style={{ margin: '0.35rem 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>{r.count} records</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="button" className="btn btn-primary" style={{ padding: '0.4rem 0.85rem' }} onClick={r.csv}>
                    Export CSV
                  </button>
                  <button type="button" className="btn btn-outline" style={{ padding: '0.4rem 0.85rem' }} onClick={r.pdf}>
                    PDF / Print
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p style={{ marginTop: '1.5rem' }}>
          <Link to="/admin" style={{ color: '#00d4ff' }}>
            ← Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
