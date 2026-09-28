export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div style={{
      background: 'rgba(239,68,68,0.15)',
      border: '1px solid #ef4444',
      color: '#fca5a5',
      padding: '0.75rem 1rem',
      borderRadius: 8,
      marginBottom: '1rem'
    }}>
      {message}
    </div>
  );
}
