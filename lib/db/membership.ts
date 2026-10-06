import { getDb } from './client';
import { proposalData } from './proposal';
import {
  validateDesign,
  validateEvidence,
  type DesignInputs,
  type EvidenceInput,
} from '../workspace-model';

export type Member = {
  id: number;
  email: string | null;
  teamId: number;
  role: 'viewer' | 'editor' | 'committee' | 'admin';
  courseSection: string | null;
};
export async function getMember(userId: string) {
  return getDb()
    .$client.prepare(
      'SELECT id,email,team_id AS teamId,role,course_section AS courseSection FROM users WHERE authenticated_user_id=?',
    )
    .bind(userId)
    .first<Member>();
}
export async function getTeams() {
  const db = getDb().$client;
  await db
    .prepare('INSERT OR IGNORE INTO teams (seed_key,name) VALUES (?,?)')
    .bind('university-demo-team', 'University AI infrastructure team')
    .run();
  return (
    await db
      .prepare('SELECT id,name FROM teams ORDER BY name')
      .all<{ id: number; name: string }>()
  ).results;
}
export async function registerMember(
  userId: string,
  email: string,
  teamId: number,
  section: string,
  initialAdmin: boolean,
) {
  const db = getDb().$client;
  const now = new Date().toISOString();
  await db
    .prepare(`INSERT INTO users (authenticated_user_id,email,team_id,role,course_section,rules_accepted_at,registered_at)
    SELECT ?,?,id,?,?,?,? FROM teams WHERE id=? ON CONFLICT(authenticated_user_id) DO NOTHING`)
    .bind(
      userId,
      email,
      initialAdmin ? 'admin' : 'viewer',
      section,
      now,
      now,
      teamId,
    )
    .run();
  return getMember(userId);
}
export async function getTeamMembers(teamId: number) {
  return (
    await getDb()
      .$client.prepare(
        'SELECT id,email,role,course_section AS courseSection FROM users WHERE team_id=? ORDER BY id',
      )
      .bind(teamId)
      .all<{
        id: number;
        email: string | null;
        role: Member['role'];
        courseSection: string | null;
      }>()
  ).results;
}
export async function assignRole(
  actor: Member,
  memberId: number,
  role: string,
) {
  if (
    actor.role !== 'admin' ||
    actor.id === memberId ||
    !['viewer', 'editor', 'admin'].includes(role)
  )
    throw new Error('Select another member of your team and a valid role.');
  const result = await getDb()
    .$client.prepare('UPDATE users SET role=? WHERE id=? AND team_id=?')
    .bind(role, memberId, actor.teamId)
    .run();
  if (!result.meta.changes) throw new Error('Member not found in your team.');
}
export async function getTeamDesign(teamId: number): Promise<DesignInputs> {
  const rows = await getDb()
    .$client.prepare(
      `SELECT p.name,p.value,p.rationale FROM current_parameters p JOIN designs d ON d.id=p.design_id WHERE d.team_id=?`,
    )
    .bind(teamId)
    .all<{ name: string; value: number; rationale: string }>();
  const values = new Map(rows.results.map((row) => [row.name, row.value]));
  return {
    itLoadMw: values.get('it_load_mw') ?? proposalData.design.itLoadMw,
    pue: values.get('pue') ?? proposalData.design.pue,
    operatingHours:
      values.get('operating_hours') ?? proposalData.design.operatingHours,
    rationale: rows.results[0]?.rationale ?? 'Initial proposal assumptions.',
  };
}
export async function saveTeamDesign(actor: Member, input: DesignInputs) {
  if (actor.role !== 'admin') throw new Error('Team administrator required.');
  validateDesign(input);
  const db = getDb().$client;
  const now = new Date().toISOString();
  await db.batch([
    ...[
      ['MW', 'Megawatts'],
      ['ratio', 'Dimensionless ratio'],
      ['hours', 'Hours'],
    ].map(([unit, name]) =>
      db
        .prepare('INSERT OR IGNORE INTO units (code,description) VALUES (?,?)')
        .bind(unit, name),
    ),
    db
      .prepare(
        'INSERT OR IGNORE INTO designs (team_id,name,created_at,updated_at) VALUES (?,?,?,?)',
      )
      .bind(actor.teamId, proposalData.design.name, now, now),
    ...[
      ['it_load_mw', 'IT load', 'MW', 0.1, 2000],
      ['pue', 'Facility PUE', 'ratio', 1, 3],
      ['operating_hours', 'Annual operating hours', 'hours', 1, 8760],
    ].map(([name, description, unit, min, max]) =>
      db
        .prepare(
          'INSERT OR IGNORE INTO parameter_definitions (name,description,unit,min_value,max_value,user_adjustable) VALUES (?,?,?,?,?,1)',
        )
        .bind(name, description, unit, min, max),
    ),
  ]);
  await db.batch(
    [
      ['it_load_mw', input.itLoadMw],
      ['pue', input.pue],
      ['operating_hours', input.operatingHours],
    ].map(([name, value]) =>
      db
        .prepare(
          `INSERT INTO design_parameters (design_id,name,value,claim_type,rationale,created_at,created_by) SELECT id,?,?,'assumption',?,?,? FROM designs WHERE team_id=?`,
        )
        .bind(name, value, input.rationale.trim(), now, actor.id, actor.teamId),
    ),
  );
  return getTeamDesign(actor.teamId);
}
export async function addEvidence(actor: Member, input: EvidenceInput) {
  const definition = validateEvidence(input);
  const db = getDb().$client;
  const now = new Date().toISOString();
  const names = { US: 'United States', CA: 'Canada', FI: 'Finland' };
  await db.batch([
    db
      .prepare('INSERT OR IGNORE INTO units (code,description) VALUES (?,?)')
      .bind(definition.unit, definition.unit),
    db
      .prepare('INSERT OR IGNORE INTO countries (seed_key,name) VALUES (?,?)')
      .bind(input.country, names[input.country]),
    db
      .prepare(
        "INSERT OR IGNORE INTO metric_definitions (name,description,unit,subject,min_value,max_value) VALUES (?,?,?,'country',0,?)",
      )
      .bind(input.metric, definition.name, definition.unit, definition.max),
  ]);
  const source = await db
    .prepare(
      `INSERT INTO sources (publisher,title,url,source_type,is_primary,accessed_at,notes) VALUES (?,?,?,?,0,?,?) RETURNING id`,
    )
    .bind(
      input.publisher,
      input.title,
      input.url,
      input.sourceType,
      now,
      input.notes,
    )
    .first<{ id: number }>();
  if (!source) throw new Error('Could not save source.');
  await db
    .prepare(`INSERT INTO metrics (country_id,metric_name,value,unit,reporting_period,source_id,retrieved_at,confidence,notes,entered_by)
    SELECT id,?,?,?,?,?,?,'medium',?,? FROM countries WHERE seed_key=?`)
    .bind(
      input.metric,
      input.value,
      definition.unit,
      input.period,
      source.id,
      now,
      input.notes,
      actor.id,
      input.country,
    )
    .run();
  return { sourceId: source.id, retrievedAt: now };
}
