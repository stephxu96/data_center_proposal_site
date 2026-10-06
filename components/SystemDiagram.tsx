import { facilityPowerMw, proposalData } from '../lib/db/proposal';

export default function SystemDiagram() {
  const facilityPower = facilityPowerMw();
  const itPower = proposalData.design.itLoadMw;
  const cooling = proposalData.design.cooling;

  return <div className="system-layout">
    <figure className="system-figure">
      <svg viewBox="0 0 1000 535" role="img" aria-labelledby="system-title system-description">
        <title id="system-title">Reference data center system and failure paths</title>
        <desc id="system-description">Grid power passes through redundant transformers, switchgear and UPS to the compute halls. Backup generation supplies the switchgear during a grid outage. A closed-loop circuit carries heat to heat rejection, and a research network connects the compute halls to members.</desc>
        <defs>
          <marker id="system-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#078e83"/></marker>
          <marker id="failure-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#bd6333"/></marker>
        </defs>
        <path className="system-line" d="M 160 104 H 205 M 365 104 H 405 M 555 104 H 595 M 745 104 H 785"/>
        <path className="system-line" d="M 285 145 V 176 H 405"/>
        <path className="system-line" d="M 660 408 V 352 H 860 V 150"/>
        <path className="system-line" d="M 860 150 V 233 M 860 319 V 362"/>
        <path className="system-failure" d="M 292 283 H 407 V 150"/>
        <path className="system-failure" d="M 85 150 V 190 H 285 V 176"/>

        <g className="system-block"><rect x="20" y="58" width="140" height="92" rx="12"/><text x="90" y="96">Grid supply</text><text className="system-small" x="90" y="122">{facilityPower} MW facility</text></g>
        <g className="system-block"><rect x="205" y="58" width="160" height="92" rx="12"/><text x="285" y="90">Transformer A</text><text className="system-small" x="285" y="117">Primary path</text></g>
        <g className="system-block"><rect x="205" y="176" width="160" height="82" rx="12"/><text x="285" y="210">Transformer B</text><text className="system-small" x="285" y="235">Alternate path</text></g>
        <g className="system-block"><rect x="405" y="58" width="150" height="92" rx="12"/><text x="480" y="93">Switchgear</text><text className="system-small" x="480" y="119">Fault isolation</text></g>
        <g className="system-block"><rect x="595" y="58" width="150" height="92" rx="12"/><text x="670" y="93">UPS</text><text className="system-small" x="670" y="119">Transfer bridge</text></g>
        <g className="system-block emphasis"><rect x="785" y="58" width="190" height="92" rx="12"/><text x="880" y="93">Compute halls</text><text className="system-small" x="880" y="119">{itPower} MW IT demand</text></g>

        <g className="system-block failure-block"><rect x="20" y="235" width="140" height="96" rx="12"/><text x="90" y="273">Fuel store</text><text className="system-small" x="90" y="301">Resupply plan open</text></g>
        <g className="system-block failure-block"><rect x="205" y="235" width="160" height="96" rx="12"/><text x="285" y="273">Generators</text><text className="system-small" x="285" y="301">Grid-outage path</text></g>
        <g className="system-block"><rect x="785" y="233" width="190" height="86" rx="12"/><text x="880" y="268">Cooling circuit</text><text className="system-small" x="880" y="294">Closed loop</text></g>
        <g className="system-block"><rect x="785" y="362" width="190" height="92" rx="12"/><text x="880" y="397">Heat rejection</text><text className="system-small" x="880" y="424">Non-evaporative</text></g>
        <g className="system-block"><rect x="565" y="362" width="190" height="92" rx="12"/><text x="660" y="397">Research network</text><text className="system-small" x="660" y="424">Member connections</text></g>
        <text className="system-caption" x="20" y="492">SOLID TEAL  •  operating path</text>
        <text className="system-caption failure-caption" x="390" y="492">DASHED AMBER  •  failure / backup path</text>
      </svg>
      <figcaption>Reference architecture. The two transformers give an alternate electrical path; final redundancy and fuel sizing require site engineering.</figcaption>
    </figure>
    <div className="system-legend"><h3>Read the system</h3><table><tbody>
      <tr><th scope="row">Power</th><td>Grid → transformer → switchgear → UPS → compute. Facility demand: {facilityPower} MW · calculation.</td></tr>
      <tr><th scope="row">Component failure</th><td>Protection isolates the failed path; the alternate transformer path and UPS bridge the transfer. Capacity after a fault needs engineering confirmation.</td></tr>
      <tr><th scope="row">Grid outage</th><td>Fuel-backed generators feed switchgear while UPS bridges startup. Fuel quantity and refuelling remain to be established.</td></tr>
      <tr><th scope="row">Cooling</th><td>{cooling} carries heat from compute to heat rejection.</td></tr>
      <tr><th scope="row">Network</th><td>Research network links the compute halls to member institutions and demand regions.</td></tr>
    </tbody></table></div>
  </div>;
}
