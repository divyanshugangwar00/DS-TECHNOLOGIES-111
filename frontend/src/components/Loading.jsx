export default function Loading() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#0a0f1c',
      color: '#00d4ff',
      fontSize: '1.2rem'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 50,
          height: 50,
          border: '3px solid rgba(0,212,255,0.2)',
          borderTopColor: '#00d4ff',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 1rem'
        }} />
        Loading DS-TECHNOLOGIES...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
