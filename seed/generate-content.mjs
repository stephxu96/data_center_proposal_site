import {readFileSync,writeFileSync} from 'node:fs';
import {seedStatement,printableStatement,markerStatement} from '../lib/db/seed-sql.mjs';
const read=name=>JSON.parse(readFileSync(new URL(`./data/${name}.json`,import.meta.url),'utf8'));
const content=read('content'),proposal=read('proposal'),economics=read('economics');
const rows=[];const ref=(table,key)=>({ref:table,key});const now='2026-10-06T21:00:00Z';
const insert=(table,row)=>rows.push(seedStatement(table,row));
const unitByKey=key=>key.endsWith('Millions')?'USD million':key.endsWith('Pct')?'%':key.includes('Months')?'months':key.includes('Years')||key.includes('Year')?'years':key==='gpuCount'?'count':key==='powerPriceUsdMwh'?'USD/MWh':key==='gpuPriceUsd'?'USD/GPU':key==='memberChargeUsdHour'?'USD/GPU-hour':'ratio';
for(const unit of ['USD million','years','USD/GPU','USD/GPU-hour','MWh'])insert('units',{code:unit,description:unit});
const claims=new Set();
function claim(key,text,type,extra={}){claims.add(key);insert('design_claims',{seed_key:`content-${key}`,design_id:ref('designs','university-design'),claim_text:text,claim_type:type,value:null,unit:null,calc_key:null,source_id:null,status:'draft',confidence:'medium',topic:'design',created_at:now,...extra});}
function link(key,target,value){insert('claim_links',{seed_key:`content-link-${key}-${value}`,claim_id:ref('design_claims',`content-${key}`),link_role:'input',[target]:value});}
const inputs={...proposal.illustrativeModel,...economics,...content.governance,gridOutageHours:proposal.design.gridOutageHours};
for(const [key,value] of Object.entries(inputs)){
 if(typeof value!=='number'||!Number.isFinite(value)||value<0)throw Error(`Invalid content input ${key}`);
 const unit=key==='gridOutageHours'?'hours':unitByKey(key);
 insert('parameter_definitions',{name:key,description:key.replace(/([A-Z])/g,' $1'),unit,min_value:0,max_value:null,user_adjustable:1});
 insert('design_parameters',{seed_key:`content-P-${key}`,design_id:ref('designs','university-design'),name:key,value,claim_type:'assumption',rationale:key==='memberChargeUsdHour'?'Zero recovery is an explicit cost-only scenario, not a missing-value placeholder; no signed member revenue is assumed.':'Illustrative committee planning assumption, editable independently of a vendor quote; not prescribed by the course.',source_id:ref('sources','S63'),created_at:now});
 claim(key,`${key.replace(/([A-Z])/g,' $1')} is an illustrative planning assumption.`,'assumption',{value,unit,topic:'economics'});link(key,'parameter_name',key);
}
claim('grid_outage_hours','Grid outage duration.','calculation',{unit:'hours',calc_key:'grid_outage_hours'});link('grid_outage_hours','parameter_name','gridOutageHours');
claim('backup_energy_mwh','Required delivered electrical energy during the reference grid outage.','calculation',{unit:'MWh',calc_key:'backup_energy_mwh'});link('backup_energy_mwh','parameter_name','gridOutageHours');link('backup_energy_mwh','parameter_name','it_load_mw');link('backup_energy_mwh','parameter_name','pue');
for(const [key,param] of [['small_institution_reserve','smallInstitutionReservePct'],['single_member_cap','singleMemberCapPct']]){claim(key,'Proposed consortium capacity-allocation rule.','design_decision',{unit:'%'});link(key,'parameter_name',param);}
for(const item of content.funding){claim(item.claim,`${item.text} These documents have not yet been supplied.`,'unknown',{topic:'financing'});insert('evidence_requirements',{seed_key:`content-${item.key}`,design_id:ref('designs','university-design'),stage:item.stage,requirement_text:item.text,sort_order:content.funding.indexOf(item),created_at:now});insert('requirement_claims',{requirement_id:ref('evidence_requirements',`content-${item.key}`),claim_id:ref('design_claims',`content-${item.claim}`)});}
for(const narrative of content.narratives){
 const key=`content-${narrative.key}`;insert('narratives',{seed_key:key,design_id:ref('designs','university-design'),kind:narrative.kind,key:narrative.key,version:1,title:narrative.title,created_at:now});
 narrative.steps.forEach((text,i)=>{if(/\d/.test(text.replace(/\{claim:[^}]+\}/g,'')))throw Error(`Numeric literal in ${narrative.key}`);for(const match of text.matchAll(/\{claim:([^}]+)\}/g))if(!claims.has(match[1])&&!['facility_power_mw','annual_energy_gwh'].includes(match[1]))throw Error(`Unknown narrative input ${match[1]}`);const step=`${key}-${i}`;insert('narrative_steps',{seed_key:step,narrative_id:ref('narratives',key),step_no:i+1,step_text:text});for(const match of text.matchAll(/\{claim:([^}]+)\}/g))insert('step_claims',{step_id:ref('narrative_steps',step),claim_id:ref('design_claims',claims.has(match[1])?`content-${match[1]}`:match[1])});});
}
rows.push(markerStatement(content.seed_version));
writeFileSync(new URL('./content-statements.json',import.meta.url),JSON.stringify({version:content.seed_version,statements:rows},null,2)+'\n');
writeFileSync(new URL('./sql/0009_content.sql',import.meta.url),rows.map(printableStatement).join('\n--> statement-breakpoint\n')+'\n');
console.log(`Content: ${rows.length} prepared statements; ${content.narratives.length} narratives; ${Object.keys(inputs).length} assumptions.`);
