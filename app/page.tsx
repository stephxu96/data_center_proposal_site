import { annualEnergyGwh, facilityPowerMw, proposalData, weightedScore } from '../lib/db/proposal';

export default function Overview() {
  const d = proposalData.design;
  const tx = proposalData.candidates[0];
  return <>
    <section className="hero"><div className="shell hero-content">
      <span className="eyebrow">University AI infrastructure / decision explorer</span>
      <h1>A shared home for serious AI research.</h1>
      <p>A proposed Texas facility gives member institutions one scalable compute platform, with the design and investment questions visible from the outset.</p>
      <div className="button-row"><a className="button" href="/design">Explore the initial design <span>↗</span></a><a className="button secondary" href="/countries">Why Texas? <span>↗</span></a></div>
    </div></section>
    <div className="shell"><div className="stats">
      <a className="stat" href="/evidence#design-inputs"><strong>{d.itLoadMw} MW</strong><span>IT load · assumption ↗</span></a>
      <a className="stat" href="/evidence#design-inputs"><strong>{d.pue.toFixed(2)}</strong><span>Power usage effectiveness · assumption ↗</span></a>
      <a className="stat" href="/evidence#facility-load"><strong>{facilityPowerMw()} MW</strong><span>Facility demand · calculation ↗</span></a>
      <a className="stat" href="/evidence#annual-energy"><strong>{annualEnergyGwh()} GWh</strong><span>Annual facility energy · calculation ↗</span></a>
    </div></div>
    <section className="section"><div className="shell"><div className="section-head"><div><span className="eyebrow">The decision</span><h2>Texas leads the comparison,<br/>with conditions.</h2></div><a className="text-link" href="/countries">See the full comparison ↗</a></div>
      <div className="grid-3">
        <article className="card accent"><span className="eyebrow">Recommended location</span><h3>{d.location}</h3><p>{d.referenceCity} is the reference geography. The precise site depends on a utility connection and property study.</p></article>
        <article className="card"><span className="eyebrow">Decision score</span><h3 className="number"><a href="/evidence#score-tx">{weightedScore(tx.scores).toFixed(2)}</a></h3><p>Weighted assessment across demand, power, grid, climate and operating criteria. <a className="text-link" href="/evidence#score-tx">See the method ↗</a></p></article>
        <article className="card dark"><span className="eyebrow" style={{color:'#90e5d1'}}>Principal design choice</span><h3>{d.cooling}</h3><p>Avoids routine evaporative demand while keeping the thermal design compatible with a high-density AI workload.</p></article>
      </div></div></section>
    <section className="section band"><div className="shell"><div className="section-head"><div><span className="eyebrow">Before a commitment</span><h2>Five conditions define the next gate.</h2></div><a className="text-link" href="/investment">View investment path ↗</a></div><div className="grid-2"><div className="card"><ul className="list">{proposalData.conditions.slice(0,3).map(x=><li key={x}>{x}</li>)}</ul></div><div className="card"><ul className="list">{proposalData.conditions.slice(3).map(x=><li key={x}>{x}</li>)}<li>Agree member demand and capacity allocation before financing.</li></ul></div></div></div></section>
    <section className="section"><div className="shell"><div className="section-head"><div><span className="eyebrow">The experience</span><h2>Follow the proposal from location to decision.</h2></div></div><div className="grid-3">
      <a className="card" href="/countries"><div className="icon">01</div><h3>Compare locations</h3><p>See how Texas, Québec and Helsinki perform against the same criteria.</p></a>
      <a className="card" href="/design"><div className="icon">02</div><h3>Walk the system</h3><p>Trace power, cooling and resilience through the initial design.</p></a>
      <a className="card" href="/investment"><div className="icon">03</div><h3>Test the case</h3><p>Change assumptions and see what the power requirement means for operating cost.</p></a>
    </div></div></section>
  </>;
}
