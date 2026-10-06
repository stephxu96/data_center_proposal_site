import { getDb } from './client';
import seed from '../../seed/statements.json';
import contentSeed from '../../seed/content-statements.json';

// Explicit deployment operation, never invoked by a public read or anonymous route.
export async function applyProposalSeed() {
  const db=getDb().$client;
  const results=[];
  for(const version of [seed,contentSeed]){
   const previous=await db.prepare('SELECT applied_at FROM seed_runs WHERE seed_version=?').bind(version.version).first();
   if(previous){results.push({version:version.version,alreadyApplied:true});continue;}
   await db.batch(version.statements.map(({sql,params})=>db.prepare(sql).bind(...params)));
   results.push({version:version.version,alreadyApplied:false});
  }
  return {seeds:results};
}
