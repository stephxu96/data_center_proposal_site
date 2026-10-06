export function validateSeed(data) {
  const fail=(rule,key)=>{throw Error(`${rule}: ${key}`);};
  const tables=Object.fromEntries(Object.entries(data).filter(([key])=>key!=='seed_version'));
  const keys={};
  for(const [table,rows] of Object.entries(tables)){keys[table]=new Set();for(const row of rows){const key=row.seed_key??row.code??row.name;if(!key||keys[table].has(key))fail('V1',table);keys[table].add(key);}}
  for(const [table,rows] of Object.entries(tables))for(const row of rows)for(const value of Object.values(row)){if(value&&typeof value==='object'&&(!keys[value.ref]?.has(value.key)))fail('V4',`${table}: ${value.key}`);}
  for(const row of [...data.metrics,...data.parameter_definitions])if(!keys.units.has(row.unit))fail('V2',row.seed_key??row.name);
  for(const m of data.metrics){if(!keys.metric_definitions.has(m.metric_name))fail('V3',m.seed_key);if(!m.source_id||(m.claim_type!=='fact'&&m.claim_type!=='estimate'))fail('V5',m.seed_key);if((m.value===null||m.value===0)&&m.notes?.length<20)fail('V6',m.seed_key);if(m.value!==null&&(typeof m.value!=='number'||!Number.isFinite(m.value)))fail('V6',m.seed_key);if(!/^\d{4}(-Q[1-4]|-(0[1-9]|1[0-2]))?$/.test(m.reporting_period))fail('V15',m.seed_key);if(!['high','medium','low'].includes(m.confidence)||!m.notes||!Number.isFinite(Date.parse(m.retrieved_at)))fail('V5',m.seed_key);if(m.unit==='USD/MWh'&&/CAD|EUR/.test(m.notes)&&!data.metrics.some(x=>m.notes.includes(x.seed_key)&&x.metric_name==='fx_rate'))fail('V8',m.seed_key);}
  for(const s of data.sources){if(!s.publisher||!s.title||!s.url||!Number.isFinite(Date.parse(s.accessed_at)))fail('V7',s.seed_key);if(!s.url.startsWith('/')&&!/^https?:\/\//.test(s.url))fail('V7',s.seed_key);}
  const types=['fact','estimate','assumption','calculation','design_decision','unknown'];
  for(const c of data.design_claims){if(!types.includes(c.claim_type)||(c.claim_type==='calculation'&&(!c.calc_key||c.value!==null)))fail('V9',c.seed_key);if(['estimate','design_decision'].includes(c.claim_type)&&!data.claim_links.some(l=>l.claim_id.key===c.seed_key))fail('V10',c.seed_key);}
  if(data.criterion_weights.reduce((sum,w)=>sum+w.weight,0)!==100)fail('V11','weights');
  for(const site of data.sites)for(const c of data.criteria)if(!data.site_assessments.some(a=>a.site_id.key===site.seed_key&&a.criterion_code===c.code))fail('V11',`${site.seed_key}/${c.code}`);
  for(const a of data.site_assessments)if(!keys.design_claims.has(a.claim_id.key))fail('V12',a.seed_key);
  const walk=(key,seen=new Set())=>{if(seen.has(key))return seen;seen.add(key);for(const l of data.claim_links.filter(l=>l.claim_id.key===key))if(l.input_claim_id)walk(l.input_claim_id.key,seen);return seen;};
  const reachable=walk('selection');
  for(const a of data.site_assessments){if(!reachable.has(a.claim_id.key)||!data.claim_links.some(l=>l.claim_id.key===a.claim_id.key&&l.source_id))fail('V13',a.seed_key);}
  const expected={tx:3.6,qc:3.05,hel:3.05};for(const site of data.sites){const total=data.site_assessments.filter(a=>a.site_id.key===site.seed_key&&a.score!==null).reduce((sum,a)=>sum+a.score*(data.criterion_weights.find(w=>w.criterion_code===a.criterion_code)?.weight??0)/100,0);if(total.toFixed(2)!==expected[site.seed_key].toFixed(2))fail('V14',site.seed_key);}
  if(/sk-[A-Za-z0-9_-]{16,}|Bearer\s+[A-Za-z0-9._-]{20,}|-----BEGIN.*PRIVATE KEY/.test(JSON.stringify(data)))fail('V16','credential-shaped content');
  return Object.fromEntries(Object.entries(tables).map(([k,v])=>[k,v.length]));
}
