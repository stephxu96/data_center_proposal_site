import { getDb } from './client';
import seed from '../../seed/statements.json';

// Explicit deployment operation, never invoked by a public read or anonymous route.
export async function applyProposalSeed() {
  const db=getDb().$client;
  const previous=await db.prepare('SELECT applied_at FROM seed_runs WHERE seed_version=?').bind(seed.version).first();
  if(previous) return {version:seed.version,alreadyApplied:true};
  // D1 batch is transactional; the marker and all records commit together.
  await db.batch(seed.statements.map(({sql,params})=>db.prepare(sql).bind(...params)));
  return {version:seed.version,alreadyApplied:false};
}
