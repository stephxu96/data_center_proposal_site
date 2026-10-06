import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
const root=new URL('../',import.meta.url),db=new DatabaseSync(':memory:');db.exec('PRAGMA foreign_keys=ON');
for(const file of readdirSync(new URL('drizzle/',root)).filter(f=>f.endsWith('.sql')).sort())db.exec(readFileSync(new URL(`drizzle/${file}`,root),'utf8'));
for(const name of ['statements','content-statements']){const seed=JSON.parse(readFileSync(new URL(`seed/${name}.json`,root),'utf8'));db.exec('BEGIN');for(const s of seed.statements)db.prepare(s.sql).run(...s.params);db.exec('COMMIT');}
assert.deepEqual(db.prepare('PRAGMA foreign_key_check').all(),[]);
assert.equal(db.prepare('SELECT COUNT(*) n FROM current_narratives').get().n,5);
assert.equal(db.prepare('SELECT COUNT(*) n FROM requirement_status WHERE status=?').get('missing').n,3);
assert.equal(db.prepare("SELECT value FROM current_parameters WHERE name='gridDelayMonths'").get().value,.5);
assert.equal(db.prepare("SELECT value FROM current_parameters WHERE name='gpuPriceUsd'").get().value,20000);
for(const s of db.prepare('SELECT step_text FROM narrative_steps').all())assert.doesNotMatch(s.step_text.replace(/\{claim:[^}]+\}/g,''),/\d/);
const counts=db.prepare('SELECT COUNT(*) n FROM design_parameters').get().n;
const seed=JSON.parse(readFileSync(new URL('seed/content-statements.json',root),'utf8'));for(const s of seed.statements)db.prepare(s.sql).run(...s.params);
assert.equal(db.prepare('SELECT COUNT(*) n FROM design_parameters').get().n,counts);
db.close();console.log('PASS: content seed, current parameters, funding gates, narrative input references and repeat application.');
