import { getDb } from './client';
import type { Member } from './membership';

export const decisionOutcomes = ['approve', 'reject', 'send_back'] as const;
export type DecisionOutcome = (typeof decisionOutcomes)[number];
export type DecisionRecord = { id: number; round: number; outcome: DecisionOutcome; reason: string; recordedAt: string; recordedBy: number; recorderEmail: string | null };

export function validateDecision(input: unknown): { outcome: DecisionOutcome; reason: string } {
  const value = input as Record<string, unknown> | null;
  if (!value || typeof value !== 'object' || Object.keys(value).sort().join(',') !== 'outcome,reason') throw new Error('Send an outcome and a reason.');
  if (!decisionOutcomes.includes(value.outcome as DecisionOutcome)) throw new Error('Choose approve, reject or send back.');
  if (typeof value.reason !== 'string' || value.reason.trim().length < 20 || value.reason.length > 2000) throw new Error('Give a reason of at least 20 characters.');
  return { outcome: value.outcome as DecisionOutcome, reason: value.reason.trim() };
}

// FR17: only a committee member records a decision on their team's design. Rows are
// append-only; each decision is a new round, so earlier rounds stay visible.
export async function recordDecision(actor: Member, input: { outcome: DecisionOutcome; reason: string }) {
  if (actor.role !== 'committee') throw new Error('Committee member required.');
  const row = await getDb().$client.prepare(`INSERT INTO committee_decisions (design_id,round,outcome,reason,recorded_by,recorded_at)
    SELECT d.id, COALESCE((SELECT MAX(round) FROM committee_decisions WHERE design_id=d.id),0)+1, ?, ?, ?, ? FROM designs d WHERE d.team_id=?
    RETURNING id, round`).bind(input.outcome, input.reason, actor.id, new Date().toISOString(), actor.teamId).first<{ id: number; round: number }>();
  if (!row) throw new Error('Your team has no design to decide on.');
  return row;
}

export async function getDecisions(designId: number): Promise<DecisionRecord[]> {
  return (await getDb().$client.prepare(`SELECT c.id, c.round, c.outcome, c.reason, c.recorded_at AS recordedAt, c.recorded_by AS recordedBy, u.email AS recorderEmail
    FROM committee_decisions c JOIN users u ON u.id=c.recorded_by WHERE c.design_id=? ORDER BY c.round DESC`).bind(designId).all<DecisionRecord>()).results;
}
