import { applyScenario, investmentModel, numericInput, proposalData, tenYearCostPath } from '../../lib/db/proposal';

type Params = Record<string,string|string[]|undefined>;
const definitions = [
  ['powerPriceUsdMwh','Power price','USD / MWh',0,500],
  ['utilizationPct','GPU utilization','%',1,100],
  ['gpuCount','GPU count','units',1,100000],
  ['pue','Facility PUE','ratio',1,3],
  ['buildCapexMillions','Build capital','USD millions',0,10000],
  ['hybridCapexMillions','Hybrid capital','USD millions',0,10000],
  ['annualLeaseMillions','Annual lease','USD millions',0,10000],
  ['hybridLeaseMillions','Hybrid annual lease','USD millions',0,10000],
  ['annualNonPowerOpsMillions','Non-power operations','USD millions / year',0,10000],
  ['delayCarryingMillionsPerMonth','Delay carrying cost','USD millions / month',0,10000],
  ['gridDelayMonths','Grid delay','months',0,60],
] as const;

export default async function Investment({searchParams}:{searchParams:Promise<Params>}) {
  const params=await searchParams;
  const example=params.example==='1';
  const scenario=typeof params.scenario==='string' && ['base','grid-delay','half-utilization'].includes(params.scenario)?params.scenario:'base';
  const selectedOption=typeof params.option==='string' && ['build','lease','hybrid'].includes(params.option)?params.option:'build';
  const defaults={...proposalData.illustrativeModel,pue:proposalData.design.pue};
  const values=Object.fromEntries(definitions.map(([key,, ,min,max])=>[key,numericInput(params[key],min,max) ?? (example ? defaults[key] : null)])) as unknown as Record<keyof typeof defaults,number|null>;
  const complete=definitions.every(([key])=>values[key]!==null);
  const scenarioInput=complete?applyScenario(values as typeof defaults,scenario):null;
  const options=scenarioInput?investmentModel(scenarioInput):null;
  const pathOption=options?.find(x=>x.id===selectedOption);
  const rows=pathOption&&scenarioInput?tenYearCostPath(pathOption,scenarioInput):null;
  const money=(n:number)=>'$'+n.toFixed(1)+'m';
  return <>
    <section className="page-head"><div className="shell"><span className="eyebrow">Investment case</span><h1>Make the economics visible.</h1><p>Compare ownership structures under one set of editable scenario assumptions. The same power and utilization inputs flow through every option.</p></div></section>
    <section className="section"><div className="shell"><div className="section-head"><div><span className="eyebrow">Scenario model</span><h2>Change one input. See the effect.</h2></div><a className="text-link" href="/investment?example=1">Load example scenario ↗</a></div>
      <form action="/investment" method="get" className="card"><div className="field-grid"><div className="field"><label htmlFor="scenario">Scenario</label><select id="scenario" name="scenario" defaultValue={scenario}><option value="base">Base case</option><option value="grid-delay">Grid power delay stress (+3 months)</option><option value="half-utilization">GPU use at half forecast</option></select></div><div className="field"><label htmlFor="option">Cost path</label><select id="option" name="option" defaultValue={selectedOption}><option value="build">Build and own</option><option value="lease">Lease capacity</option><option value="hybrid">Phased hybrid</option></select></div>{definitions.map(([key,label,unit,min,max])=><div className="field" key={key}><label htmlFor={key}>{label} <span className="subtle">({unit})</span></label><input id={key} name={key} type="number" min={min} max={max} step="any" defaultValue={values[key]??''} placeholder="Enter assumption"/></div>)}</div><div style={{marginTop:24}}><button className="button" type="submit">Recalculate scenario ↗</button></div></form>
      <p className="subtle">The example assumes 0.5 months (about two weeks) to grid energization. The grid-delay stress adds three months, for 3.5 months total. Inputs are editable scenario assumptions, not vendor quotes or financing commitments.</p>
    </div></section>
    <section className="section band"><div className="shell"><div className="section-head"><div><span className="eyebrow">Option comparison</span><h2>Three delivery paths.</h2></div></div>
      <p className="lead">{scenario==='base'?'Base case':scenario==='grid-delay'?'Grid power delay stress (+3 months)':'GPU utilization at half forecast'} · {scenarioInput?'calculated from the inputs above':'enter inputs to calculate outputs'}</p>
      <div className="grid-3">{(options??[
          {id:'build',name:'Build and own'}, {id:'lease',name:'Lease capacity'}, {id:'hybrid',name:'Phased hybrid'}
      ]).map((option,i)=><article className={i===2?'card accent':'card'} key={option.id}><span className="eyebrow">{i===2?'Staged option':'Delivery option'}</span><h3>{option.name}</h3>{'annual' in option?<><ul className="list"><li><span className="subtle">Cash before opening · calculation</span><br/><strong><a href="/evidence#investment-model">{money(option.beforeOpeningWithDelay)} ↗</a></strong></li><li><span className="subtle">Annual operating cost · calculation</span><br/><strong><a href="/evidence#investment-model">{money(option.annual)} ↗</a></strong></li><li><span className="subtle">Cost / productive GPU-hour · calculation</span><br/><strong><a href="/evidence#investment-model">{option.costPerProductiveHour===null?'Not established':'$'+option.costPerProductiveHour.toFixed(2)} ↗</a></strong></li><li><span className="subtle">Capital at risk · calculation</span><br/><strong><a href="/evidence#investment-model">{money(option.capitalAtRiskWithDelay)} ↗</a></strong></li></ul></>:<p>Enter inputs or load the example scenario to compare outputs.</p>}</article>)}</div>
      <p className="subtle">Annual operating cost is the full-year run rate after opening. The ten-year path below prorates operations during any partial opening year. Financing costs, depreciation, tax, replacement cycles and terminal value are excluded.</p>
    </div></section>
    <section className="section"><div className="shell"><div className="section-head"><div><span className="eyebrow">Ten-year view</span><h2>{pathOption?.name??'Select a cost path'}</h2></div></div>{rows?<div className="table-scroll"><table className="data-table"><thead><tr><th>Year</th><th>Capital</th><th>Delay cost</th><th>Operations</th><th>Net cash</th><th>Cumulative</th></tr></thead><tbody>{rows.map(row=><tr key={row.year}><td>{row.year}</td><td>{money(row.capital)}</td><td>{money(row.delay)}</td><td>{money(row.operating)}</td><td>{money(row.net)}</td><td>{money(row.cumulative)}</td></tr>)}</tbody></table></div>:<p className="lead">Enter inputs to see the ten-year cost path.</p>}<p className="subtle">Nominal cost-only path. Financing, GPU replacement, recovery, taxes and terminal value are not modeled here.</p></div></section>
    <section className="section"><div className="shell"><div className="section-head"><div><span className="eyebrow">Funding path</span><h2>Evidence before capital.</h2></div></div><div className="grid-3"><div className="card"><div className="icon">01</div><h3>Development equity</h3><p>Member demand, capacity policy, site control and a utility study shape the development decision.</p></div><div className="card"><div className="icon">02</div><h3>Construction debt</h3><p>Priced construction, a connection agreement, permits and contracted demand support construction financing.</p></div><div className="card"><div className="icon">03</div><h3>Equipment finance</h3><p>GPU procurement, operating service levels and committed workloads support equipment investment.</p></div></div></div></section>
    <section className="section band dark"><div className="shell"><span className="eyebrow" style={{color:'#8ce1cd'}}>Decision posture</span><h2>Advance the next gate, not the full build.</h2><p className="lead">The location and architecture are ready for a structured diligence package. A capital commitment follows only after the utility, member demand and vendor pricing questions are resolved.</p></div></section>
  </>;
}
