import assert from 'node:assert/strict';
import { readFileSync,readdirSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { validateSeed } from '../seed/validate.mjs';
const root=new URL('../',import.meta.url);
const data=Object.assign({},...['vocabulary','places','sources','metrics','design','criteria','assessments','claims'].map(n=>JSON.parse(readFileSync(new URL(`seed/data/${n}.json`,root),'utf8'))));
validateSeed(data);
const invalid=[
 ['V1',d=>d.sources.push(d.sources[0])],['V2',d=>d.metrics[0].unit='invalid'],['V3',d=>d.metrics[0].metric_name='invalid'],['V4',d=>d.metrics[0].source_id.key='missing'],['V5',d=>d.metrics[0].source_id=null],['V6',d=>{d.metrics[0].value=null;d.metrics[0].notes='';}],['V7',d=>d.sources[0].publisher=''],['V8',d=>d.metrics.find(m=>m.seed_key==='price-qc').notes='Converted from CAD without recorded conversion rate'],['V9',d=>d.design_claims.find(c=>c.claim_type==='calculation').value=25],['V10',d=>d.claim_links=d.claim_links.filter(l=>l.claim_id.key!=='china-excluded')],['V11',d=>d.criterion_weights[0].weight++],['V12',d=>d.site_assessments[0].claim_id={ref:'design_claims',key:'missing'}],['V13',d=>d.claim_links=d.claim_links.filter(l=>!(l.claim_id.key==='selection'&&l.input_claim_id?.key==='A-tx-K10'))],['V14',d=>d.site_assessments[0].score=1],['V15',d=>d.metrics[0].reporting_period='tomorrow'],['V16',d=>d.sources[0].notes='sk-'+ 'x'.repeat(30)],
];
for(const [rule,mutate] of invalid){const copy=structuredClone(data);mutate(copy);assert.throws(()=>validateSeed(copy),undefined,`${rule} must reject its invalid fixture`);}
const db=new DatabaseSync(':memory:');db.exec('PRAGMA foreign_keys=ON');
for(const f of readdirSync(new URL('drizzle/',root)).filter(f=>f.endsWith('.sql')).sort()) db.exec(readFileSync(new URL(`drizzle/${f}`,root),'utf8'));
const seed=JSON.parse(readFileSync(new URL('seed/statements.json',root),'utf8'));
function apply(){if(db.prepare('SELECT 1 FROM seed_runs WHERE seed_version=?').get(seed.version))return false;db.exec('BEGIN');try{for(const s of seed.statements)db.prepare(s.sql).run(...s.params);db.exec('COMMIT');}catch(e){db.exec('ROLLBACK');throw e;}return true;}
assert.equal(apply(),true);const before=db.prepare('SELECT COUNT(*) AS n FROM metrics').get().n;assert.equal(apply(),false);assert.equal(db.prepare('SELECT COUNT(*) AS n FROM metrics').get().n,before);
assert.equal(db.prepare('PRAGMA foreign_key_check').all().length,0);
assert.equal(db.prepare('SELECT COUNT(*) AS n FROM sources').get().n,63);
assert.equal(db.prepare('SELECT COUNT(*) AS n FROM site_assessments').get().n,42);
const scores=db.prepare('SELECT s.seed_key AS site,SUM(a.score*w.weight)/100 AS score FROM current_assessments a JOIN sites s ON s.id=a.site_id JOIN current_weights w ON w.criterion_code=a.criterion_code GROUP BY s.id').all();
for(const r of scores)assert.equal(r.score.toFixed(2),({tx:'3.60',qc:'3.05',hel:'3.05'})[r.site]);
const shares=db.prepare("SELECT s.seed_key AS site,SUM(d.value) AS share FROM current_metrics l JOIN sites s ON s.id=l.site_id JOIN current_metrics d ON d.demand_region_id=l.demand_region_id AND d.metric_name='demand_share' WHERE l.metric_name='round_trip_latency' AND l.value<=50 GROUP BY s.id").all();
for(const r of shares)assert.equal(r.share.toFixed(1),({tx:'62.3',qc:'50.7',hel:'19.5'})[r.site]);
assert.equal(db.prepare("SELECT COUNT(*) n FROM design_claims c WHERE c.claim_type IN ('estimate','design_decision') AND NOT EXISTS (SELECT 1 FROM claim_links l WHERE l.claim_id=c.id)").get().n,0);
assert.equal(db.prepare("SELECT s.name FROM designs d JOIN sites s ON s.id=d.selected_site_id").get().name,'Texas');
db.close();console.log(`PASS: sixteen seed mutation checks, transactional seed, repeat no-op, foreign keys, 63 sources, 42 assessments, scores and latency coverage (${before} metric rows).`);
