import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

const migrationFiles = readdirSync(new URL('../drizzle/', import.meta.url))
  .filter((name) => /^\d+.*\.sql$/.test(name)).sort();
assert.ok(migrationFiles.length > 0, 'No migration files found');

function applyFresh() {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys = ON');
  for (const name of migrationFiles) {
    const contents = readFileSync(new URL(`../drizzle/${name}`, import.meta.url), 'utf8');
    assert.doesNotMatch(contents, /\bINSERT\s+INTO\b/i, `${name} must contain no seed rows`);
    const statements = contents.split(/^--> statement-breakpoint\s*$/gm).map((s) => s.trim()).filter(Boolean);
    for (const [index, statement] of statements.entries()) {
      const definitions = statement.match(/\bCREATE\s+(?:UNIQUE\s+)?(?:TABLE|INDEX|TRIGGER|VIEW)\b/gi) ?? [];
      assert.equal(definitions.length, 1, `${name} segment ${index + 1} must contain exactly one statement; check breakpoints`);
      assert.doesNotMatch(statement, /--> statement-breakpoint/, 'Breakpoint inside a statement');
      try { db.exec(statement); }
      catch (error) { throw new Error(`${name} segment ${index + 1}: ${error.message}`); }
    }
  }
  assert.equal(db.prepare("SELECT COUNT(*) AS count FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'").get().count, 28);
  assert.equal(db.prepare("SELECT COUNT(*) AS count FROM sqlite_master WHERE type = 'trigger'").get().count, 30);
  assert.equal(db.prepare("SELECT COUNT(*) AS count FROM sqlite_master WHERE type = 'view'").get().count, 10);
  assert.equal(db.prepare('SELECT COUNT(*) AS count FROM countries').get().count, 0);
  assert.equal(db.prepare('SELECT COUNT(*) AS count FROM current_metrics').get().count, 0);
  db.exec("INSERT INTO units (code, description) VALUES ('MW', 'megawatts')");
  db.exec("INSERT INTO teams (name) VALUES ('test')");
  db.exec("INSERT INTO designs (team_id, name, created_at, updated_at) VALUES (1, 'test', '2026-10-06T00:00:00Z', '2026-10-06T00:00:00Z')");
  assert.throws(() => db.exec("INSERT INTO design_claims (design_id,claim_text,claim_type,status,topic,created_at) VALUES (1,'invalid','bad','draft','test','2026-10-06T00:00:00Z')"));
  assert.throws(() => db.exec("INSERT INTO design_claims (design_id,claim_text,claim_type,status,topic,created_at,value,calc_key) VALUES (1,'invalid','calculation','draft','test','2026-10-06T00:00:00Z',1,'x')"));
  db.exec("INSERT INTO sources (publisher,title,url,source_type,is_primary,accessed_at) VALUES ('test','test','https://example.org','academic',1,'2026-10-06T00:00:00Z')");
  assert.throws(() => db.exec("UPDATE sources SET title = 'changed' WHERE id = 1"));
  assert.throws(() => db.exec('DELETE FROM sources WHERE id = 1'));
  db.close();
}

applyFresh();
applyFresh();
console.log(`PASS: ${migrationFiles.length} migration(s) replayed on two empty databases; schema, checks and append-only enforcement verified.`);
