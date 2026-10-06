import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Presentation, PresentationFile } from '/Users/stephxu/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs';

const root = path.resolve(import.meta.dirname, '..');
const skill = '/Users/stephxu/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations';
const python = '/Users/stephxu/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3';
const build = path.join(root, '.presentation-build');
const output = path.join(root, 'deliverables/University_AI_Data_Center_Customer_Presentation.pptx');
const model = JSON.parse(await fs.readFile(path.join(root, 'deliverables/model-results.json'), 'utf8'));
const i = model.inputs;
const required = model.scenarios.filter(s => ['base', 'year-delay', 'half-utilization', 'low-utilization'].includes(s.id));
if (required.length !== 3) throw new Error('Export must contain the three required scenarios');
const base = required.find(s => s.id === 'base');
const b = base.options.find(o => o.id === 'build');
const {finalizePresentation,applyPresentationChartFont} = await import(pathToFileURL(path.join(skill, 'container_tools/artifact_tool_utils.mjs')).href);
await fs.mkdir(build,{recursive:true});
const deck = Presentation.create({slideSize:{width:1280,height:720}});
const slides=[];
const F='Helvetica Neue', navy='#071C29',teal='#078E83',ink='#14212B',muted='#63717A',white='#FFFFFF',mint='#D9F4ED';
const money=v=>`$${v.toFixed(1)}m`,dollars=v=>v==null?'Not defined':`$${v.toFixed(2)}`;
function txt(s,t,x,y,w,h,size,color=ink,bold=false){const v=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});v.text=t;v.text.style={typeface:F,fontSize:size,bold,color,autoFit:'none'};return v;}
function slide(title,n,dark=false){const s=deck.slides.add();slides.push(s);s.background.fill=dark?navy:white;txt(s,title,72,64,1130,108,46,dark?white:ink,true);txt(s,String(n).padStart(2,'0'),1160,663,50,24,14,dark?mint:muted);return s;}
function note(s,seconds,text){s.speakerNotes.textFrame.setText(`Timing: ${seconds} seconds. ${text}\nSources: challenge brief pp. 2–3; docs/phase-01-define-website.md; shared deterministic model export ${model.generatedAt}. Published sources: https://global-datacenter-design-explorer-test.stephxu700296.chatgpt.site/evidence`);}
function table(s,values,y,height,widths,size=21){const t=s.tables.add({rows:values.length,columns:values[0].length,left:72,top:y,width:1136,height,values,columnWidths:widths});t.borders.assign({style:'solid',fill:'#D9E3E5',width:1});for(let r=0;r<values.length;r++){t.rows[r].height=height/values.length;for(let c=0;c<values[r].length;c++){const cell=t.getCell(r,c);cell.fill=r===0?navy:r%2?'#FFFFFF':'#EDF5F4';cell.text.style={typeface:F,fontSize:size,color:r===0?white:ink,bold:r===0,autoFit:'none'};}}return t;}
{
const s=slide('Shared university AI infrastructure',1,true);
txt(s,'Lease first. Stage ownership.',72,224,1100,102,62,white,true);
txt(s,'Approve bounded diligence and leased access.\nSend the full 25 MW build back for evidence.',76,376,1080,132,34,mint);
txt(s,'Investment committee discussion   October 2026',76,608,1060,35,22,'#C4D6DC');
note(s,25,'The decision is whether a shared facility meets a demonstrated need at an acceptable cost and risk. Members have expressed interest but signed no long-term commitments. The grid price, upgrade cost and date are unknown. We recommend a phased hybrid option after evidence closes, not approval of the full build today.');
}
{
const s=slide('Demand determines the scale and location',2);
const hours=i.gpuCount*i.operatingHours*i.utilizationPct/100*i.availabilityPct/100/1e6;
txt(s,`${hours.toFixed(2)} million`,72,219,550,82,54,teal,true);
txt(s,'productive GPU-hours per full year',76,306,550,55,27);
txt(s,`${i.gpuCount.toLocaleString()} GPUs at ${i.utilizationPct}% utilization\n${i.availabilityPct}% planning availability`,76,381,548,88,25);
table(s,[['Reference site','Score / 5','<50 ms'],['Texas','3.60','62.3%'],['Québec','3.05','50.7%'],['Helsinki','3.05','19.5%']],210,272,[252,138,156],22);
// Place the comparison on the right without changing native table editability.
s.tables.items[0].left=652;s.tables.items[0].width=550;
txt(s,'These figures describe modeled capacity and proximity, not signed member demand.',76,547,1120,78,27,ink,true);
note(s,35,'Survey member training, teaching and inference needs, required reservation windows, security and existing campus/cloud alternatives. The base model does not demonstrate that 25 MW is needed. Texas leads because demand proximity is 25 percent of the site rubric. City proxies require campus measurements. Geographic alternatives stay open, especially if demand is predominantly batch training.');
}
{
const s=slide('The 25 MW concept needs tested failure paths',3);
[[`${i.itLoadMw} MW`,'IT demand',72],[`${(i.itLoadMw*i.pue).toFixed(0)} MW`,'Whole facility',465],[`${(i.itLoadMw*i.pue*i.operatingHours/1000).toFixed(0)} GWh`,'Annual electricity',860]].forEach(([v,l,x])=>{txt(s,v,x,195,340,82,57,teal,true);txt(s,l,x+3,280,340,42,25);});
txt(s,'Grid and protected distribution supply UPS, GPUs, cooling, network and storage. Closed-loop cooling avoids routine evaporative demand.',76,369,1125,101,28);
txt(s,'Largest component loss',76,497,520,46,28,teal,true);txt(s,'Isolate the fault, bridge transfer, preserve critical load and checkpoint or shed flexible training.',76,544,520,96,23);
txt(s,'48-hour grid outage',673,497,520,46,28,teal,true);txt(s,`${(i.itLoadMw*i.pue*48).toLocaleString()} MWh delivered backup energy at full load. Verify fuel, refuelling and cooling continuity.`,673,544,520,96,23);
note(s,45,'Refer to the separate one-page system diagram for power, cooling, networking, storage and failure paths. PUE is a planning assumption. Grid reliability is not workload availability. The largest transformer failure requires demonstrated remaining-path capacity. Confirm UPS autonomy, transfer performance, generator derating, failure/repair rates, common-mode faults and workload recovery. Do not credit renewable contracts as firm backup without hourly evidence.');
}
{
const s=slide('Ten-year costs separate facility and GPU fleet',4);
table(s,[['Build capital','USD millions'],['Facility',b.facilityCapital.toFixed(1)],['Grid upgrades',b.gridCapital.toFixed(1)],['Land',b.landCapital.toFixed(1)],['GPU fleet',b.gpuCapital.toFixed(1)],['Total',i.buildCapexMillions.toFixed(1)]],199,354,[720,416],24);
txt(s,`Power, staffing, maintenance, financing and GPU replacement every ${i.replacementYears} years appear separately.`,76,577,1090,72,25);
note(s,45,`All values are planning assumptions, not quotes. The app shows ten annual rows for each option. Baseline electricity is $${i.powerPriceUsdMwh}/MWh. Owned capacity uses the full power envelope conservatively even at lower productive utilization. The lease price includes power and fleet replacement. Discount rate is ${i.discountRatePct} percent, member charge $${i.memberChargeUsdHour}/productive hour. Build annual cost allocated to unused capacity is ${money(b.annualUnusedCapacityCost)}, already inside total cost and not added again. Debt draws and repayments are separate from project cash flow. Explain the risk that the demand does not materialize.');
}
{
const s=slide('Required base and stress comparisons',5);
const values=[['Case / path','Before opening','Annual ops','$/GPU-hour','Capital at risk']];
for(const sc of required){const label=sc.id==='base'?'Base':sc.id.includes('util')?'Half use':'+12 months';for(const o of sc.options)values.push([`${label} / ${o.id}`,money(o.beforeOpeningWithDelay),money(o.annual),dollars(o.costPerProductiveHour),money(o.capitalAtRiskWithDelay)]);}
table(s,values,186,390,[312,206,184,200,234],21);
txt(s,`Base: ${i.gridDelayMonths} month delay. Half utilization: ${i.utilizationPct/2}%. The app also retains +3 months.`,76,598,1110,55,22);
note(s,55,'Amounts other than per-hour costs are USD millions. Annual operations are the full-service run rate rather than a delayed first-year amount. Before-opening funding includes construction, the commissioning fleet, delay carry, interest and any lease bridge in the hybrid. Capital at risk measures year-three spent-capital loss after assumed salvage plus delay and interest. Cost per productive hour uses all ten years and reflects lost productive time. Lower use reduces productive hours without automatically reducing the contracted facility or lease envelope. This is why signed demand and staging are central to the recommendation.');
}
{
const s=slide('Ownership and access rules protect members',6);
txt(s,'20%',76,212,260,80,62,teal,true);txt(s,'reserved for smaller institutions and teaching',76,299,485,96,28);
txt(s,'35%',678,212,300,80,62,teal,true);txt(s,'cap on one member’s discretionary allocation',678,299,485,96,28);
txt(s,'Proposed policy: fixed costs by reservation, variable costs by use, release unused capacity, publish allocations and allow appeals.',76,453,1110,102,29);
txt(s,'The consortium owns approved assets. Contract construction, power, specialist operations and overflow compute.',76,579,1110,62,23,muted);
note(s,30,'These percentages are proposed design decisions, not current agreements. A representative board approves pricing and admits members. An independent scientific panel resolves conflicts. Development equity funds site control and studies; construction debt follows permits, grid terms, priced scope and signed demand; equipment finance follows GPU terms and service commitments. Sponsors bear grid-delay risk unless transferred by contract. A departing member must supply replacement demand or cover unrecovered commitments.');
}
{
const s=slide('Three findings could reverse the recommendation',7);
const items=[['Signed productive demand','Contracted workloads and acceptable member prices could justify earlier ownership. Low use favors leasing or a smaller facility.'],['Binding grid terms','Energization date, delivered power cost, upgrades and curtailment could change both the delivery path and country.'],['Tested and priced design','Cooling, failure recovery, vendor offers and replacement terms could change the uptime, PUE and ownership economics.']];
items.forEach(([head,body],k)=>{txt(s,String(k+1),76,202+k*143,64,52,34,teal,true);txt(s,head,157,203+k*143,1030,43,29,ink,true);txt(s,body,157,251+k*143,1025,83,24);});
note(s,35,'The most decision-changing evidence is not another headline about national data centers. It is signed member demand, a property-specific utility offer and a tested/priced delivery design. Québec and Helsinki remain live alternatives. Include energy/water use, permits and grid impacts on other customers. Obtain evidence for the workload availability and recovery targets rather than implying professional engineering certification.');
}
{
const s=slide('Committee decision',8,true);
txt(s,'Approve diligence and leased access.\nReturn with a priced hybrid option.',72,225,1120,151,47,white,true);
txt(s,'Full construction and equipment capital remain conditional on demand, grid terms and resilience evidence.',76,438,1080,95,29,mint);
txt(s,'Questions: scale, member commitments, failure tolerance and risk allocation',76,601,1095,48,22,'#C4D6DC');
note(s,30,'Total planned speaking time across all eight slides is five minutes, followed by questions. Open the Investment Case for detailed ten-year rows and sensitivities, Evidence for claims/sources, and Initial Design for the failure walkthroughs. The decision requested is limited and reversible. This presentation does not certify a construction-ready engineering design.');
}
for(let n=0;n<slides.length;n++){const preview=await deck.export({slide:slides[n],format:'png',scale:1});await fs.writeFile(path.join(build,`slide-${n+1}.png`),new Uint8Array(await preview.arrayBuffer()));}
const staging=path.join(build,`revision-${Date.now()}`);await fs.mkdir(staging,{recursive:true});
const candidate=path.join(staging,'candidate.pptx');await(await PresentationFile.exportPptx(deck)).save(candidate);
const checked=path.join(staging,'checked.pptx');
const result=await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath:checked,pythonExecutable:python,integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit'],explicitTotalSlideCount:8,requiredNativeChartOwnerSlides:[],requiredNativeTableOwnerSlides:[2,4,5],fontPolicy:{basis:'design',families:[F]},verifyArtifactToolImport:true,receiptPath:path.join(staging,'presentation.validation.json')});
await fs.copyFile(checked,output);console.log(JSON.stringify({output,result}));
