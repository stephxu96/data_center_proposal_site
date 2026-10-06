import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const root = path.resolve(import.meta.dirname, "..");
const skill = "/Users/stephxu/.codex/plugins/cache/openai-primary-runtime/presentations/26.909.12148/skills/presentations";
const python = "/Users/stephxu/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3";
const build = path.join(root, ".presentation-build");
const output = path.join(root, "deliverables/University_AI_Data_Center_Customer_Presentation.pptx");
const { finalizePresentation, applyPresentationChartFont } = await import(pathToFileURL(path.join(skill, "container_tools/artifact_tool_utils.mjs")).href);
await fs.mkdir(build,{recursive:true});
await fs.mkdir(path.dirname(output),{recursive:true});

const deck=Presentation.create({slideSize:{width:1280,height:720}});
const slides=[];
const F="Helvetica Neue", navy="#071C29", teal="#078E83", ink="#14212B", muted="#63717A", white="#FFFFFF", mint="#D9F4ED";
function txt(s,t,x,y,w,h,size,color=ink,bold=false){
  const v=s.shapes.add({geometry:"textbox",position:{left:x,top:y,width:w,height:h},fill:"none",line:{fill:"none",width:0}});
  v.text=t; v.text.style={typeface:F,fontSize:size,bold,color,autoFit:"none"}; return v;
}
function slide(title,number,dark=false){
  const s=deck.slides.add(); slides.push(s); s.background.fill=dark?navy:white;
  if(number>1){txt(s,"NORTHSTAR COMPUTE",72,42,460,25,13,dark?mint:teal,true);txt(s,String(number).padStart(2,"0"),1160,655,70,24,13,dark?mint:muted,true);}
  if(title) txt(s,title,72,107,1120,89,48,dark?white:ink,true);
  return s;
}
function note(s,t){s.speakerNotes.textFrame.setText(t);}
{
  const s=slide(null,1,true);
  txt(s,"NORTHSTAR COMPUTE",76,82,500,34,18,mint,true);
  txt(s,"Shared compute for\nuniversity AI",72,208,1100,190,68,white,true);
  txt(s,"Texas reference proposal  |  Customer discussion  |  October 2026",76,535,1100,46,24,"#C4D6DC");
  note(s,"Based on the project Phase 1 design and the customer decision explorer. This is a reference proposal, not an approved construction project.");
}
{
  const s=slide("Decision requested",2);
  txt(s,"Advance Texas diligence.\nHold full capital approval.",72,223,1120,151,48,teal,true);
  txt(s,"The next gate is a written utility schedule and cost, member demand commitments, a site-specific resilience design, and priced vendor offers.",76,443,1050,125,27);
  note(s,"Source: internal Phase 1 design specification, sections 7.6 and 7.7; decision memo. The recommendation is conditional.");
}
{
  const s=slide("Texas leads the location assessment",3);
  const chart=s.charts.add("bar",{position:{left:80,top:215,width:780,height:330},categories:["Texas","Québec","Helsinki"],series:[{name:"Weighted score",values:[3.60,3.05,3.05],fill:teal}],barOptions:{direction:"column",grouping:"clustered"},hasLegend:false,dataLabels:{showValue:true,position:"outEnd"}});
  applyPresentationChartFont(chart,{fontFamily:F});
  txt(s,"3.60",914,244,250,60,48,teal,true);
  txt(s,"Texas weighted score",915,308,270,40,22);
  txt(s,"Demand proximity carries the largest weight in the rubric.",915,387,275,124,21,muted);
  txt(s,"Scores are planning judgments on a five-point scale.",80,582,1000,32,18,muted);
  note(s,"Source: internal Phase 1 site selection, section 7.4. Texas 3.60, Québec 3.05, Helsinki 3.05. Demand proximity is 25 percent of the weighted rubric.");
}
{
  const s=slide("Reference design",4);
  [["20 MW","IT demand",72],["25 MW","Total facility demand",467],["219 GWh","Annual energy",860]].forEach(([value,label,x])=>{txt(s,value,x,226,350,90,65,teal,true);txt(s,label,x+4,322,340,44,24);});
  txt(s,"PUE 1.25 is the planning assumption. Cooling uses a closed-loop, non-evaporative design.",76,487,1100,100,27);
  note(s,"Calculation: 20 MW IT x 1.25 PUE = 25 MW facility. 25 MW x 8,760 hours / 1,000 = 219 GWh per year. Source: internal Phase 1 design specification.");
}
{
  const s=slide("Power continuity",5);
  [["Fault isolation","Protection separates the failed component.",72],["UPS transition","Critical load stays powered while alternate supply starts.",462],["Backup operation","Generation sustains load, with shedding if capacity tightens.",852]].forEach(([head,body,x])=>{txt(s,head,x,231,320,54,31,teal,true);txt(s,body,x,297,315,147,23);});
  txt(s,"A 48-hour grid outage at full facility load represents 1,200 MWh of delivered energy.",72,521,1110,85,27,ink,true);
  note(s,"Calculation: 25 MW facility x 48 hours = 1,200 MWh. Backup fuel quantity, refuelling, permits and actual topology require site-specific engineering.");
}
{
  const s=slide("Investment structures",6);
  [["Build and own","More control over the facility and capacity. Highest initial capital exposure.",72],["Lease capacity","Lower initial capital commitment. Vendor terms and long-run service cost matter most.",472],["Phased hybrid","Stages ownership while leasing capacity. Limits early commitment but adds coordination.",872]].forEach(([head,body,x])=>{txt(s,head,x,228,330,54,31,teal,true);txt(s,body,x,300,315,169,24);});
  txt(s,"The live explorer applies the same power price, utilization, PUE and grid-delay inputs to all three paths.",72,527,1110,77,25,ink,true);
  note(s,"The site includes editable example inputs to demonstrate sensitivity. No vendor quote or financing commitment is represented in this slide.");
}
{
  const s=slide("Conditions for the next gate",7);
  ["Written utility energization schedule and connection cost","Applicable large-load and curtailment terms","Site-specific resilience and backup-power study","Closed-loop cooling through design and permitting","Member demand commitments and priced vendor offers"].forEach((item,i)=>{txt(s,String(i+1).padStart(2,"0"),74,209+i*75,72,44,26,teal,true);txt(s,item,152,206+i*75,1010,54,25);});
  note(s,"Source: internal Phase 1 section 7.6 and the decision memo. The fifth line combines member demand and vendor pricing, both needed before a capital decision.");
}
{
  const s=slide("Live decision explorer",8,true);
  txt(s,"Compare sites. Walk the design.\nChange the assumptions.",72,220,1100,155,42,white,true);
  txt(s,"global-datacenter-design-explorer-test.stephxu700296.chatgpt.site",72,461,1110,59,24,mint);
  txt(s,"Next decision: fund diligence and return with site-specific evidence.",72,551,1100,65,26,"#C4D6DC");
  note(s,"Public test Site URL at the time of this presentation. Login is temporarily disabled for demo viewing; existing auth work is retained for the final access phase.");
}

for(let i=0;i<slides.length;i++){
  const preview=await deck.export({slide:slides[i],format:"png",scale:1});
  await fs.writeFile(path.join(build,`slide-${i+1}.png`),new Uint8Array(await preview.arrayBuffer()));
}
const staging=path.join(build,"finalizer");await fs.mkdir(staging,{recursive:true});
const candidate=path.join(staging,"candidate.pptx");
await (await PresentationFile.exportPptx(deck)).save(candidate);
const result=await finalizePresentation({
  workspaceDir:root,candidatePath:candidate,finalPath:output,pythonExecutable:python,
  integrityValidatorPath:path.join(skill,"container_tools/inspect_presentation_package_integrity.py"),
  layoutValidatorPath:path.join(skill,"container_tools/inspect_presentation_layout_geometry.py"),
  layoutArgs:["--expected-slide-size-emu","12192000,6858000","--validate-heading-fit"],
  requiredNativeChartOwnerSlides:[3],requiredNativeTableOwnerSlides:[],
  materializeLiteralChartWorkbooks:true,
  fontPolicy:{basis:"design",families:[F]},verifyArtifactToolImport:true,
  receiptPath:path.join(staging,"presentation.validation.json")
});
console.log(JSON.stringify({output,result}));
