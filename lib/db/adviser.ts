import { getDb } from './client';
import { getDesign, getClaimEvidence, type ClaimRecord } from './evidence';
import { fetchOwid, type CountryCode } from '../sources/owid';
import { ADVISER_LIMITS, AdviserError, type AdviserRepository, type AdviserSource } from '../adviser';

const db = () => getDb().$client;
const iso = (ms: number) => new Date(ms).toISOString();
export async function getAdviserSources(ids: number[]): Promise<AdviserSource[]> {
  const safe = [...new Set(ids)].filter(Number.isSafeInteger).slice(0, 100);
  if (!safe.length) return [];
  return (await db().prepare(`SELECT id,publisher,title,url,publication_date,accessed_at,excerpt,notes FROM sources WHERE id IN (${safe.map(() => '?').join(',')})`).bind(...safe).all<AdviserSource>()).results;
}
export async function getAdviserUsage(userId: number, teamId: number) {
  const now = Date.now();
  const [user, team, actual] = await Promise.all([
    db().prepare('SELECT COUNT(*) AS day, SUM(CASE WHEN created_at>=? THEN 1 ELSE 0 END) AS hour, MIN(created_at) AS oldest FROM adviser_request_slots WHERE user_id=? AND created_at>=?').bind(iso(now - 3600_000), userId, iso(now - 86400_000)).first<{ day: number; hour: number; oldest: string | null }>(),
    db().prepare('SELECT COALESCE(SUM(reserved_tokens),0) AS tokens FROM adviser_request_slots WHERE team_id=? AND created_at>=?').bind(teamId, iso(now - 86400_000)).first<{ tokens: number }>(),
    db().prepare('SELECT COUNT(*) AS requests,COALESCE(SUM(a.input_tokens+a.output_tokens),0) AS tokens FROM ai_requests a JOIN users u ON u.id=a.user_id WHERE u.team_id=? AND a.created_at>=?').bind(teamId, iso(now - 86400_000)).first<{ requests: number; tokens: number }>(),
  ]);
  return { hour: user?.hour ?? 0, day: user?.day ?? 0, teamReservedTokens: team?.tokens ?? 0, teamActualTokens: actual?.tokens ?? 0, teamRequests: actual?.requests ?? 0, limits: ADVISER_LIMITS };
}
export async function reserveAdviserRequest(userId: number, teamId: number) {
  const now = Date.now(), created = iso(now), hour = iso(now - 3600_000), day = iso(now - 86400_000);
  // One SQLite statement evaluates limits and reserves budget atomically, including concurrent Workers.
  const result = await db().prepare(`INSERT INTO adviser_request_slots(user_id,team_id,created_at,reserved_tokens)
    SELECT ?,?,?,? WHERE
    (SELECT COUNT(*) FROM adviser_request_slots WHERE user_id=? AND created_at>=?)<? AND
    (SELECT COUNT(*) FROM adviser_request_slots WHERE user_id=? AND created_at>=?)<? AND
    (SELECT COALESCE(SUM(reserved_tokens),0) FROM adviser_request_slots WHERE team_id=? AND created_at>=?)+?<=?
    RETURNING id`).bind(userId, teamId, created, ADVISER_LIMITS.reservedTokens, userId, hour, ADVISER_LIMITS.hourly, userId, day, ADVISER_LIMITS.daily, teamId, day, ADVISER_LIMITS.reservedTokens, ADVISER_LIMITS.teamTokens).first<{ id: number }>();
  if (!result) {
    const usage = await getAdviserUsage(userId, teamId);
    const reset = await db().prepare(`SELECT MIN(created_at) AS oldest FROM adviser_request_slots WHERE ${usage.hour >= ADVISER_LIMITS.hourly ? 'user_id=? AND created_at>=?' : usage.day >= ADVISER_LIMITS.daily ? 'user_id=? AND created_at>=?' : 'team_id=? AND created_at>=?'}`).bind(usage.hour >= ADVISER_LIMITS.hourly || usage.day >= ADVISER_LIMITS.daily ? userId : teamId, usage.hour >= ADVISER_LIMITS.hourly ? hour : day).first<{ oldest: string | null }>();
    const resetAt = iso(Math.max(now + 1000, Date.parse(reset?.oldest ?? created) + (usage.hour >= ADVISER_LIMITS.hourly ? 3600_000 : 86400_000)));
    return { allowed: false as const, resetAt };
  }
  return { allowed: true as const, id: result.id };
}
export async function finishAdviserRequest(input: { slotId?: number; userId: number; model: string; status: 'answered' | 'refused' | 'rate_limited' | 'error'; inputTokens: number; outputTokens: number; citedIds?: number[]; removed?: number; releaseReservation?: boolean }) {
  const statements = [db().prepare('INSERT INTO ai_requests(user_id,created_at,status,model,input_tokens,output_tokens,cited_source_ids,removed_citation_count) VALUES(?,?,?,?,?,?,?,?)').bind(input.userId, new Date().toISOString(), input.status, input.model, input.inputTokens, input.outputTokens, JSON.stringify(input.citedIds ?? []), input.removed ?? 0)];
  // Keep a conservative reservation when a provider timeout makes consumed tokens unknown.
  if (input.slotId && input.releaseReservation) statements.push(db().prepare('UPDATE adviser_request_slots SET reserved_tokens=? WHERE id=? AND user_id=?').bind(input.inputTokens + input.outputTokens, input.slotId, input.userId));
  await db().batch(statements);
}
export function adviserRepository(teamId: number): AdviserRepository {
  let current: Awaited<ReturnType<typeof getDesign>> | undefined;
  const design = async () => current ??= await getDesign(teamId);
  return {
    async design() {
      const row = await design();
      if (!row) return { data: { missing: 'No current design is stored for this team.' }, sources: [] };
      const rows = (await db().prepare('SELECT p.name,p.value,p.claim_type,p.rationale,p.created_at,d.unit FROM current_parameters p JOIN parameter_definitions d ON d.name=p.name WHERE p.design_id=? ORDER BY p.name LIMIT 32').bind(row.id).all<{ name: string; value: number | null; claim_type: string; rationale: string; created_at: string; unit: string }>()).results;
      // Many parameters share one rationale; list each once so the evidence budget is spent on sources.
      const rationales = [...new Set(rows.map(p => p.rationale))];
      const parameters = rows.map(p => ({ name: p.name, value: p.value, unit: p.unit, claim_type: p.claim_type, rationale: rationales.indexOf(p.rationale), updated: p.created_at.slice(0, 10) }));
      return { data: { id: row.id, name: row.name, summary: row.design_summary, site: row.site, country: row.country, parameters, rationales }, sources: [] };
    },
    async claims(topic, types) {
      const row = await design();
      if (!row) return { data: { missing: 'No design claims exist for this team.' }, sources: [] };
      const words = [...new Set(topic.toLowerCase().match(/[a-z]{3,}/g) ?? [])].filter(word => !['what', 'the', 'why', 'how', 'does', 'this', 'that', 'current', 'please', 'about', 'which', 'with', 'from', 'have', 'design'].includes(word)).slice(0, 6);
      const clauses = words.map(() => '(LOWER(claim_text) LIKE ? OR LOWER(topic) LIKE ?)');
      const rows = (await db().prepare(`SELECT * FROM current_claims WHERE design_id=? ${types.length ? `AND claim_type IN (${types.map(() => '?').join(',')})` : ''} ${clauses.length ? `AND (${clauses.join(' OR ')})` : ''} ORDER BY CASE claim_type WHEN 'unknown' THEN 0 WHEN 'design_decision' THEN 1 ELSE 2 END,id LIMIT 8`).bind(row.id, ...types, ...words.flatMap(word => [`%${word}%`, `%${word}%`])).all<ClaimRecord>()).results;
      const found = new Map<number, AdviserSource>();
      const claims = [];
      for (const claim of rows) {
        const evidence = await getClaimEvidence(claim.id);
        const ids = evidence.sources.slice(0, 3).map(s => s.id);
        for (const source of evidence.sources.slice(0, 3)) found.set(source.id, source);
        claims.push({ id: claim.id, claim_text: claim.claim_text, claim_type: claim.claim_type, value: claim.value, unit: claim.unit, confidence: claim.confidence, created_at: claim.created_at, source_ids: ids });
      }
      return { data: claims.length ? claims : { missing: 'No matching stored claim supports this question. Do not infer a factual answer.' }, sources: [...found.values()].slice(0, 24) };
    },
    async country(country, names) {
      const match = await db().prepare('SELECT id,name FROM countries WHERE LOWER(name)=LOWER(?) OR UPPER(seed_key)=UPPER(?)').bind(country, country).first<{ id: number; name: string }>();
      if (!match) throw new AdviserError('Country not found in the evidence database.');
      const rows = (await db().prepare(`SELECT id,metric_name,value,unit,reporting_period,retrieved_at,claim_type,confidence,notes,source_id FROM current_metrics WHERE country_id=? ${names.length ? `AND metric_name IN (${names.map(() => '?').join(',')})` : ''} ORDER BY metric_name LIMIT 16`).bind(match.id, ...names).all<{ source_id: number } & Record<string, unknown>>()).results;
      return { data: { country: match.name, metrics: rows, missing: rows.length ? null : 'No metric matches the requested definition.' }, sources: await getAdviserSources(rows.map(r => r.source_id)) };
    },
    async external(country, series) {
      const match = await db().prepare('SELECT seed_key AS code,name FROM countries WHERE LOWER(name)=LOWER(?) OR UPPER(seed_key)=UPPER(?)').bind(country, country).first<{ code: string; name: string }>();
      if (!match || !['US', 'CA', 'FI'].includes(match.code)) throw new AdviserError('The approved live adapter supports United States, Canada and Finland.');
      const source = await db().prepare('SELECT id,publisher,title,url,publication_date,accessed_at FROM sources WHERE seed_key=? ORDER BY id DESC LIMIT 1').bind(series === 'carbon_intensity' ? 'API-OWID-CARBON' : 'API-OWID-MIX').first<AdviserSource>();
      if (!source) throw new AdviserError('The approved external source is not registered in D1. An editor must refresh evidence first.');
      const fetched = await fetchOwid([match.code as CountryCode], AbortSignal.timeout(12_000));
      const value = fetched.data[0];
      if (!value) throw new AdviserError('The live source is unavailable. Use stored metrics and disclose their retrieval time.');
      return { data: { country: match.name, claim_type: 'fact', reporting_period: value.year, retrieved_at: new Date().toISOString(), source_id: source.id, value: series === 'carbon_intensity' ? value.carbonIntensity : value.mix, unit: series === 'carbon_intensity' ? 'gCO2/kWh' : '%', limitation: 'National annual data, not site-specific hourly electricity. Other generation is the residual.' }, sources: [source] };
    },
    sources: getAdviserSources,
  };
}
