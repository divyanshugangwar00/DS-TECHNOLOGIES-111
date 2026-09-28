
export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/qr/M32HXMK4XY45A1"
      target="_blank"
      rel="noreferrer"
      title="WhatsApp"
      style={{
        position: 'fixed',
        bottom: 90,
        right: 24,
        zIndex: 9998,
        width: 52,
        height: 52,
        borderRadius: '50%',
        background: '#25d366',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 12,
        textDecoration: 'none',
        boxShadow: '0 4px 14px rgba(37,211,102,0.45)',
      }}
    >
      WA
    </a>
  );
}
