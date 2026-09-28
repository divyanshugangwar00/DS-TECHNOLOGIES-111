import { useRef } from 'react';

/**
 * Reusable toolbar for Admin list pages.
 * Props:
 *  - selectedCount, totalCount
 *  - onSelectAll(checked)
 *  - onBulkDelete()
 *  - onDeleteAll()
 *  - onExport()
 *  - onImportFile(file)  // CSV/Excel file
 *  - search, onSearchChange
 *  - statusFilter, statusOptions, onStatusFilter
 *  - extraActions (React node)
 */
export default function AdminListToolbar({
  selectedCount = 0,
  totalCount = 0,
  allSelected = false,
  onSelectAll,
  onBulkDelete,
  onDeleteAll,
  onExport,
  onImportFile,
  search = '',
  onSearchChange,
  statusFilter = '',
  statusOptions = [],
  onStatusFilter,
  extraActions,
  title,
}) {
  const fileRef = useRef(null);

  const btn = {
    padding: '0.45rem 0.85rem',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(15,23,42,0.9)',
    color: '#e2e8f0',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
  };
  const danger = { ...btn, borderColor: 'rgba(248,113,113,0.4)', color: '#fca5a5' };
  const primary = { ...btn, background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', border: 'none', color: '#fff' };

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center',
      marginBottom: '1rem', padding: '0.85rem 1rem',
      background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12,
    }}>
      {title && <strong style={{ marginRight: 8 }}>{title}</strong>}

      {onSelectAll && (
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: '#cbd5e1', cursor: 'pointer' }}>
          <input type="checkbox" checked={allSelected} onChange={(e) => onSelectAll(e.target.checked)} />
          Select All ({totalCount})
        </label>
      )}

      {selectedCount > 0 && (
        <span style={{ fontSize: '0.82rem', color: '#67e8f9' }}>{selectedCount} selected</span>
      )}

      {onSearchChange && (
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          style={{
            flex: '1 1 160px', minWidth: 140, maxWidth: 260, padding: '0.45rem 0.75rem',
            borderRadius: 8, border: '1px solid #334155', background: '#0b1220', color: '#e2e8f0',
          }}
        />
      )}

      {statusOptions?.length > 0 && onStatusFilter && (
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilter(e.target.value)}
          style={{ padding: '0.45rem 0.6rem', borderRadius: 8, border: '1px solid #334155', background: '#0b1220', color: '#e2e8f0' }}
        >
          <option value="">All status</option>
          {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      )}

      {onBulkDelete && (
        <button type="button" style={danger} disabled={!selectedCount} onClick={onBulkDelete}>
          Bulk Delete
        </button>
      )}
      {onDeleteAll && (
        <button type="button" style={danger} onClick={onDeleteAll}>
          Delete All
        </button>
      )}
      {onExport && (
        <button type="button" style={btn} onClick={onExport}>Export CSV</button>
      )}
      {onImportFile && (
        <>
          <button type="button" style={btn} onClick={() => fileRef.current?.click()}>Import CSV</button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.xlsx,.xls,text/csv"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImportFile(f);
              e.target.value = '';
            }}
          />
        </>
      )}
      {extraActions}
      <button type="button" style={primary} onClick={() => window.location.reload()}>Refresh</button>
    </div>
  );
}

/** Simple CSV export helper */
export function exportRowsToCsv(filename, rows, columns) {
  if (!rows?.length) {
    alert('No data to export');
    return;
  }
  const cols = columns || Object.keys(rows[0] || {});
  const escape = (v) => {
    const s = v == null ? '' : String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [cols.join(',')].concat(rows.map((r) => cols.map((c) => escape(r[c])).join(',')));
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'export.csv';
  a.click();
  URL.revokeObjectURL(url);
}

/** Parse simple CSV (first sheet style) */
export function parseCsvText(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map((line) => {
    const cells = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
    const obj = {};
    headers.forEach((h, i) => { obj[h] = cells[i] || ''; });
    return obj;
  });
}
