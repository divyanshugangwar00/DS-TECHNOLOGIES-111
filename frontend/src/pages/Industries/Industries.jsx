import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export const INDUSTRIES = [
  ['banking','Banking & Financial Services','Secure portals, reporting, customer journeys and internal tools with strong authentication.'],
  ['communications','Communications','Customer portals, service workflows, digital forms and communication dashboards.'],
  ['education','Education','Course portals, certificates, internships, admissions and campus career systems.'],
  ['energy','Energy & Utilities','Asset workflows, service requests, field operations and reporting.'],
  ['healthcare','Healthcare & Life Sciences','Clinic workflows, staff operations, patient-facing forms and reporting foundations.'],
  ['technology','Hi Tech / Technology','Product engineering, APIs, SaaS platforms and internship pipelines for tech teams.'],
  ['insurance','Insurance','Customer onboarding, document workflows, enquiry tracking and internal dashboards.'],
  ['aerospace','Aerospace & Defense','Secure document workflows, internal operations and controlled-access systems.'],
  ['agriculture','Agriculture','Digital field records, inventory, customer enquiries and operational reporting.'],
  ['automotive','Automotive','Dealer/service workflows, workforce modules and customer enquiry systems.'],
  ['manufacturing','Manufacturing','Attendance, leaves, notices, production records and shop-floor digital tools.'],
  ['media','Media & Entertainment','Content sites, event pages, portfolios and audience-facing digital experiences.'],
  ['oilgas','Oil & Gas','Operations reporting, document workflows, workforce tools and dashboards.'],
  ['privateequity','Private Equity','Portfolio reporting, document management and management dashboards.'],
  ['professionalservices','Professional Services','Lead management, project tracking, client portals and reporting.'],
  ['retail','Retail & Consumer Goods','Store operations, catalogues, enquiries, customer journeys and analytics.'],
  ['logistics','Travel, Transportation, Logistics & Hospitality','Dispatch, workforce tracking, booking-style forms and operational notices.'],
  ['chemical','Chemical Manufacturing','Inventory, compliance-oriented workflows, reporting and operations support.'],
  ['publicsector','Public Sector / Government','Transparent portals, documentation-focused services and citizen workflows.'],
  ['mining','Mining','Operations records, workforce modules, reporting and asset workflows.'],
  ['semiconductor','Semiconductor','Engineering workflows, production data, quality records and dashboards.'],
  ['utilities','Utilities','Service requests, asset records, field operations and reporting.'],
  ['waste','Waste Management','Collection operations, workforce tracking and service reporting.'],
  ['lifesciences','Life Sciences','Research workflows, document management and compliant information systems.'],
  ['infoservices','Information Services & Publishing','Content platforms, search, publishing workflows and analytics.'],
  ['epc','Engineering Procurement & Construction','Project workflows, documentation, approvals and progress reporting.'],
  ['cpg','Consumer Packaged Goods','Product operations, customer journeys, inventory-ready workflows and analytics.'],
  ['realestate','Real Estate','Lead capture, project showcases, client follow-ups and property workflows.'],
  ['hospitality','Hospitality & Travel','Booking-style forms, staff rostering, guest communication and dashboards.'],
];

export default function Industries() {
  return <div className="section page-bg-industries"><div className="container" style={{ maxWidth: 1200 }}>
    <p style={{ color: '#38bdf8', fontSize: '.8rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>Industry playbooks</p>
    <h1 className="section-title">Industries</h1>
    <p className="section-subtitle">Choose any sector to open a dedicated page with workflows, use cases, delivery scope and practical digital transformation ideas.</p>
    <div className="grid-3" style={{ marginTop: '1.25rem' }}>{INDUSTRIES.map(([id,title,text],idx)=><Link to={`/explore/industries/${id}`} key={id} className="card catalog-card" style={{ color:'inherit', textDecoration:'none' }}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={{fontSize:'1.8rem'}}>◈</span><span className="catalog-open">OPEN →</span></div>
      <div style={{ color:'#64748b',fontSize:'.72rem',marginTop:'.45rem' }}>{String(idx+1).padStart(2,'0')} · INDUSTRY</div>
      <h2 style={{ color:'#38bdf8',fontSize:'1.05rem',margin:'.55rem 0' }}>{title}</h2><p style={{color:'#cbd5e1',lineHeight:1.65,margin:0}}>{text}</p>
      <div style={{marginTop:'1rem',color:'#67e8f9',fontWeight:800,fontSize:'.82rem'}}>Explore industry fit →</div>
    </Link>)}</div>
    <p style={{marginTop:'1.5rem'}}><Link to="/services" className="btn btn-outline">Services</Link> <Link to="/solutions" className="btn btn-outline">Solutions</Link> <Link to="/contact" className="btn btn-primary">Talk to us</Link></p>
  </div></div>;
}
