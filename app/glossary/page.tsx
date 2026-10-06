const terms=[
  ['pue','PUE','Total facility power divided by IT equipment power. A lower value means less overhead for cooling and electrical systems.'],
  ['it-load','IT load','The electricity used by servers, storage and networking equipment.'],
  ['facility-load','Facility load','The total electricity demand of the site, including IT equipment and support systems.'],
  ['gpu-hour','GPU-hour','One GPU available for one hour. Productive GPU-hours count only the share used for work.'],
  ['utilization','Utilization','The share of available compute time used for productive workloads.'],
  ['ups','UPS','Battery-backed equipment that carries critical power while another supply starts or transfers.'],
  ['n-plus-one','N+1','One extra component beyond the quantity needed to carry the planned load.'],
  ['energization','Energization','The point when a utility connection can deliver power to the site.'],
  ['curtailment','Curtailment','A requirement to reduce electricity demand at certain times.'],
  ['capital-at-risk','Capital at risk','Committed capital that may not be recovered if the project stops.'],
  ['productive-hour','Cost per productive GPU-hour','Annual operating cost divided by GPU-hours actually used.'],
];
export default function Glossary(){return <>
  <section className="page-head"><div className="shell"><span className="eyebrow">Plain language</span><h1>Glossary.</h1><p>The terms behind the data center design and investment case.</p></div></section>
  <section className="section"><div className="shell"><div className="grid-2">{terms.map(([id,name,definition])=><article className="card" id={id} key={id}><h3>{name}</h3><p>{definition}</p></article>)}</div><p className="lead"><a className="text-link" href="/">Return to overview ↗</a></p></div></section>
  </>}
