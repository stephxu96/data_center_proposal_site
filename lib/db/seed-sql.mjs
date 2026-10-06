// Identifiers come only from this server-owned table contract, never request input.
export const tableOrder=['units','metric_definitions','parameter_definitions','countries','sites','demand_regions','sources','metrics','teams','designs','design_parameters','scenarios','criteria','criterion_weights','design_claims','site_assessments','claim_links','evidence_requirements','requirement_claims','narratives','narrative_steps','step_claims'];
const allowedColumns=new Set('code description name unit subject min_value max_value user_adjustable seed_key region country_id proxy_city notes proxy_cities addressable publisher title url source_type is_primary publication_date accessed_at excerpt verified_by verified_at site_id demand_region_id metric_name value reporting_period claim_type source_id retrieved_at confidence course_section team_id selected_country_id selected_site_id design_summary created_at updated_at design_id rationale kind criterion_code weight claim_text calc_key status topic score gate_result claim_id link_role input_claim_id metric_id parameter_name measure rubric'.split(' '));
const literal=value=>value===null?'NULL':typeof value==='number'?String(value):`'${String(value).replaceAll("'","''")}'`;
for(const column of ['stage','requirement_text','sort_order','requirement_id','key','version','narrative_id','step_no','step_text','step_id'])allowedColumns.add(column);
export function seedStatement(table,row) {
  if(!tableOrder.includes(table)||Object.keys(row).some(c=>!allowedColumns.has(c))) throw Error('Invalid seed table or column');
  const params=[];
  const values=Object.values(row).map(value=>{
    if(value&&typeof value==='object') {
      if(!tableOrder.includes(value.ref)||typeof value.key!=='string') throw Error('Invalid seed reference');
      params.push(value.key); return `(SELECT id FROM ${value.ref} WHERE seed_key=?)`;
    }
    params.push(value); return '?';
  });
  return {sql:`INSERT INTO ${table} (${Object.keys(row).join(',')}) VALUES (${values.join(',')}) ON CONFLICT DO NOTHING`,params};
}
export function printableStatement(statement) {let i=0;return statement.sql.replaceAll('?',()=>literal(statement.params[i++]))+';';}
export const markerStatement=version=>({sql:'INSERT OR IGNORE INTO seed_runs (seed_version,applied_at) VALUES (?,?)',params:[version,'2026-10-06T00:00:00Z']});
