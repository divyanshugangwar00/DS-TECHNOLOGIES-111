const BANNERS = {
  default: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=70',
  attendance: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=70',
  notices: 'https://images.unsplash.com/photo-1504711434719-aa0b736ea8b0?w=1200&q=70',
  registrations: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=70',
  employees: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=70',
  crm: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&q=70',
  finance: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=70',
  projects: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=70',
  support: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=70',
  cloud: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=70',
  ai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=70',
  assets: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=70',
  legal: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=70',
  training: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=70',
  comms: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=1200&q=70',
  sessions: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff36?w=1200&q=70',
  export: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=70',
  hr: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=70',
  security: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1200&q=70',
  settings: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=70',
  performance: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=70',
  roles: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&q=70',
  dashboard: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=70',
  certificates: 'https://images.unsplash.com/photo-1589330694653-ded6df8f3b8b?w=1200&q=70',
};

const THUMBS = {
  default: [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=70',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=70',
    'https://images.unsplash.com/photo-1553877522-43277e0baf2c?w=400&q=70',
    'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=400&q=70',
  ],
  attendance: [
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&q=70',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=70',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=70',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=70',
  ],
  projects: [
    'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&q=70',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=70',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=70',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=70',
  ],
  training: [
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=70',
    'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&q=70',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&q=70',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=70',
  ],
  crm: [
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&q=70',
    'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&q=70',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=70',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=70',
  ],
};

export default function AdminHero({ variant = 'default', showThumbs = true }) {
  const src = BANNERS[variant] || BANNERS.default;
  const thumbs = THUMBS[variant] || THUMBS.default;
  return (
    <>
      <img className="admin-hero-banner" src={src} alt="" loading="lazy" decoding="async" />
      {showThumbs && (
        <div className="admin-thumb-grid">
          {thumbs.map((t) => (
            <img key={t} src={t} alt="" loading="lazy" decoding="async" onError={(e) => { e.target.style.opacity = '0.3'; }} />
          ))}
        </div>
      )}
    </>
  );
}
