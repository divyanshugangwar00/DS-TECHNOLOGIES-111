import { Link } from 'react-router-dom';

const ITEMS = [
  { id: 187, title: 'Finance Dashboard' },
  { id: 188, title: 'Invoices' },
  { id: 189, title: 'Create Invoice' },
  { id: 190, title: 'Invoice Details' },
  { id: 191, title: 'Payments' },
  { id: 192, title: 'Payment History' },
  { id: 193, title: 'Pending Payments' },
  { id: 194, title: 'Expenses' },
  { id: 195, title: 'Revenue' },
  { id: 196, title: 'Taxes / GST' },
  { id: 197, title: 'Quotations' },
  { id: 198, title: 'Receipts' },
  { id: 199, title: 'Refunds' },
  { id: 200, title: 'Financial Reports' },
];

export default function Finance() {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: 1000 }}>
        <h1 className="section-title">Finance</h1>
        <p className="section-subtitle">Invoicing, payments, expenses and reports for DS-TECHNOLOGIES operations.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.7rem' }}>
          {ITEMS.map((x) => (
            <div key={x.id} className="card" style={{ padding: '0.8rem' }}>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{x.id}</div>
              <div style={{ color: '#e2e8f0', fontWeight: 600 }}>{x.title}</div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: '1rem' }}>
          <Link to="/admin/payroll" className="btn btn-primary">Admin payroll</Link>{' '}
          <Link to="/admin/treasury" className="btn btn-outline">Treasury</Link>
        </p>
      </div>
    </div>
  );
}
