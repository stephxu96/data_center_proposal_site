import { proposalData } from '../../lib/db/proposal';

const questions=[
  ['Why Texas?','Texas leads the weighted site assessment. Demand proximity has the largest weight, and the Texas reference site serves the greatest share of modeled addressable demand inside the threshold. The choice depends on written grid terms.','/countries'],
  ['What happens in a grid outage?','UPS bridges the transfer to backup generation. The design walkthrough shows the energy required for the reference event and identifies the operating details that must be established.','/design'],
  ['What would change the recommendation?','A better Québec connection and rate, a shift in member workloads, stronger East Coast demand, or changed Texas large-load terms could reverse the choice.','/countries'],
  ['What does the investment model prove?','It shows the directional effect of editable assumptions across build, lease and hybrid choices. It does not replace vendor offers or a financing model.','/investment'],
];
export default function Adviser(){
  return <>
    <section className="page-head"><div className="shell"><span className="eyebrow">Ask the adviser</span><h1>Questions worth asking.</h1><p>Start with the key decision questions, then follow each answer into the design, comparison or investment model.</p><p className="adviser-notice">The adviser discusses an initial design concept. It does not provide professional engineering certification.</p></div></section>
    <section className="section"><div className="shell"><div className="section-head"><div><span className="eyebrow">Guided questions</span><h2>Explore the reasoning.</h2></div><a className="text-link" href="/workspace">Registration and team access ↗</a></div><div className="grid-2">{questions.map(([q,a,href])=><article className="card" key={q}><span className="eyebrow">Decision question</span><h3>{q}</h3><p>{a}</p><p style={{marginTop:18}}><a className="text-link" href={href}>Explore the basis ↗</a></p></article>)}</div></div></section>
    <section className="section band"><div className="shell"><div className="card accent"><h3>Follow the working</h3><p>Formal engineering, utility and financing decisions require the responsible specialists. The proposal’s assumptions and calculations are available to inspect.</p><p style={{marginTop:16}}><a className="text-link" href="/evidence">See assumptions and calculations ↗</a></p></div></div></section>
  </>;
}
