import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

const migrationFiles = readdirSync(new URL('../drizzle/', import.meta.url))
  .filter((name) => /^\d+.*\.sql$/.test(name)).sort();
assert.ok(migrationFiles.length > 0, 'No migration files found');

const tables = ['ai_requests','claim_links','committee_decisions','countries','criteria','criterion_weights','demand_regions','design_claims','design_parameters','designs','evidence_requirements','metric_definitions','metrics','narrative_steps','narratives','parameter_definitions','refresh_runs','requirement_claims','scenario_overrides','scenarios','seed_runs','site_assessments','sites','sources','step_claims','teams','units','users'];
const appendOnly = ['sources','metrics','refresh_runs','design_parameters','scenario_overrides','design_claims','claim_links','criterion_weights','site_assessments','committee_decisions','requirement_claims','narratives','narrative_steps','step_claims','ai_requests'];
const views = ['current_metrics','current_parameters','current_scenario_overrides','current_claims','current_sources','current_weights','current_assessments','current_narratives','stale_claims','requirement_status'];
const indexes = ['idx_metrics_country','idx_metrics_site','idx_metrics_site_region','idx_params','idx_overrides','idx_claims','idx_links_claim','idx_assess','idx_requirements','idx_narratives','idx_ai_user_time','idx_runs'];

function applyFresh() {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys = ON');
  for (const name of migrationFiles) {
    const contents = readFileSync(new URL(`../drizzle/${name}`, import.meta.url), 'utf8');
    assert.doesNotMatch(contents, /\bINSERT\s+INTO\b/i, `${name} must contain no seed rows`);
    const statements = contents.split(/^--> statement-breakpoint\s*$/gm).map((s) => s.trim()).filter(Boolean);
    for (const [index, statement] of statements.entries()) {
      const definitions = statement.match(/\b(?:CREATE\s+(?:UNIQUE\s+)?(?:TABLE|INDEX|TRIGGER|VIEW)|ALTER\s+TABLE)\b/gi) ?? [];
      assert.equal(definitions.length, 1, `${name} segment ${index + 1} must contain exactly one statement; check breakpoints`);
      assert.doesNotMatch(statement, /--> statement-breakpoint/, 'Breakpoint inside a statement');
      try { db.exec(statement); }
      catch (error) { throw new Error(`${name} segment ${index + 1}: ${error.message}`); }
    }
  }
  const names = (type) => new Set(db.prepare('SELECT name FROM sqlite_master WHERE type = ?').all(type).map((row) => row.name));
  const actualTables = names('table');
  assert.deepEqual([...actualTables].filter((name) => !name.startsWith('sqlite_')).sort(), [...tables].sort());
  const actualTriggers = names('trigger');
  for (const table of appendOnly) for (const action of ['update','delete']) assert.ok(actualTriggers.has(`${table}_no_${action}`));
  assert.equal(actualTriggers.size, appendOnly.length * 2);
  assert.deepEqual([...names('view')].sort(), [...views].sort());
  const actualIndexes = names('index');
  for (const name of indexes) assert.ok(actualIndexes.has(name), `Missing ${name}`);
  for (const [table, fragments] of Object.entries({
    users: ["'viewer','editor','committee','admin'"],
    metrics: ["'fact','estimate'", "'high','medium','low'", 'value` IS NOT NULL OR `notes'],
    design_claims: ["'fact','estimate','assumption','calculation','design_decision','unknown'", 'calc_key', 'value` IS NULL'],
    claim_links: ['link_role', 'parameter_name` IS NOT NULL) = 1'],
    committee_decisions: ["'approve','reject','send_back'", 'length(`reason`) >= 20'],
  })) {
    const sql = db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = ?").get(table).sql;
    for (const fragment of fragments) assert.ok(sql.includes(fragment), `Missing ${table} constraint: ${fragment}`);
  }
  assert.equal(db.prepare('SELECT COUNT(*) AS count FROM countries').get().count, 0);
  assert.equal(db.prepare('SELECT COUNT(*) AS count FROM current_metrics').get().count, 0);
  db.exec("INSERT INTO units (code, description) VALUES ('MW', 'megawatts')");
  db.exec("INSERT INTO teams (name) VALUES ('test')");
  db.exec("INSERT INTO designs (team_id, name, created_at, updated_at) VALUES (1, 'test', '2026-10-06T00:00:00Z', '2026-10-06T00:00:00Z')");
  assert.throws(() => db.exec("INSERT INTO design_claims (design_id,claim_text,claim_type,status,topic,created_at) VALUES (1,'invalid','bad','draft','test','2026-10-06T00:00:00Z')"));
  assert.throws(() => db.exec("INSERT INTO design_claims (design_id,claim_text,claim_type,status,topic,created_at,value,calc_key) VALUES (1,'invalid','calculation','draft','test','2026-10-06T00:00:00Z',1,'x')"));
  db.exec("INSERT INTO sources (publisher,title,url,source_type,is_primary,accessed_at) VALUES ('test','test','https://example.org','academic',1,'2026-10-06T00:00:00Z')");
  db.exec("INSERT INTO metric_definitions (name,description,unit,subject) VALUES ('test_metric','test','MW','country')");
  db.exec("INSERT INTO countries (name) VALUES ('test country')");
  assert.throws(() => db.exec("INSERT INTO metrics (country_id,metric_name,value,unit,source_id,retrieved_at,confidence) VALUES (1,'test_metric',NULL,'MW',1,'2026-10-06T00:00:00Z','high')"));
  assert.throws(() => db.exec("INSERT INTO metrics (country_id,metric_name,value,unit,source_id,retrieved_at,confidence) VALUES (1,'test_metric',0,'MW',1,'2026-10-06T00:00:00Z','high')"));
  assert.throws(() => db.exec("INSERT INTO design_claims (design_id,claim_text,claim_type,status,topic,created_at) VALUES (1,'unsupported fact','fact','draft','test','2026-10-06T00:00:00Z')"));
  assert.throws(() => db.exec("INSERT INTO design_claims (design_id,claim_text,claim_type,status,topic,created_at) VALUES (1,'missing formula','calculation','draft','test','2026-10-06T00:00:00Z')"));
  db.exec("INSERT INTO metrics (country_id,metric_name,value,unit,source_id,retrieved_at,confidence,notes) VALUES (1,'test_metric',2,'MW',1,'2026-10-06T00:00:00Z','high','test value')");
  db.exec("INSERT INTO metrics (country_id,metric_name,value,unit,source_id,retrieved_at,confidence,notes) VALUES (1,'test_metric',3,'MW',1,'2026-10-07T00:00:00Z','high','new value')");
  assert.equal(db.prepare('SELECT value FROM current_metrics').get().value, 3);
  assert.equal(db.prepare('SELECT COUNT(*) AS count FROM metrics').get().count, 2);
  assert.throws(() => db.exec("UPDATE sources SET title = 'changed' WHERE id = 1"));
  assert.throws(() => db.exec('DELETE FROM sources WHERE id = 1'));
  db.close();
}

applyFresh();
applyFresh();
console.log(`PASS: ${migrationFiles.length} migration(s) replayed on two empty databases; schema, checks and append-only enforcement verified.`);
