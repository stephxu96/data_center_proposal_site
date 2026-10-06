import { readFileSync, readdirSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

// Minimal D1 binding over node:sqlite: prepare/bind/first/all/run and transactional batch.
export function createD1({ seed = true } = {}) {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys=ON');
  const root = new URL('../../', import.meta.url);
  for (const file of readdirSync(new URL('drizzle/', root)).filter(f => f.endsWith('.sql')).sort()) db.exec(readFileSync(new URL(`drizzle/${file}`, root), 'utf8'));
  if (seed) for (const name of ['statements', 'content-statements']) {
    const s = JSON.parse(readFileSync(new URL(`seed/${name}.json`, root), 'utf8'));
    db.exec('BEGIN'); for (const x of s.statements) db.prepare(x.sql).run(...x.params); db.exec('COMMIT');
  }
  const statement = (sql, params = []) => ({
    bind: (...next) => statement(sql, next),
    first: async column => { const row = db.prepare(sql).get(...params); return row === undefined ? null : column ? row[column] : { ...row }; },
    all: async () => ({ results: db.prepare(sql).all(...params).map(r => ({ ...r })), success: true }),
    run: async () => { const r = db.prepare(sql).run(...params); return { success: true, meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; },
    raw: async () => db.prepare(sql).all(...params).map(r => Object.values(r)),
    _exec: () => db.prepare(sql).all(...params),
  });
  const binding = {
    prepare: sql => statement(sql),
    batch: async list => { db.exec('BEGIN'); try { const out = list.map(s => ({ results: s._exec(), success: true })); db.exec('COMMIT'); return out; } catch (e) { db.exec('ROLLBACK'); throw e; } },
    exec: async sql => db.exec(sql),
  };
  return { binding, sqlite: db };
}
