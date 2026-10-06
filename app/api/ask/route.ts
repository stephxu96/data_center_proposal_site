import { env } from 'cloudflare:workers';
import { AccessError, requireRole } from '../../../lib/access';
import { AdviserError, runAdviser, validateAdviserInput } from '../../../lib/adviser';
import { openAIAdviser } from '../../../lib/adviser-openai';
import { adviserRepository, finishAdviserRequest, reserveAdviserRequest } from '../../../lib/db/adviser';

export async function POST(request: Request) {
  let member: Awaited<ReturnType<typeof requireRole>> | undefined;
  let slotId: number | undefined, inputTokens = 0, outputTokens = 0, providerStarted = false;
  const model = env.OPENAI_MODEL?.trim() || 'gpt-4.1-mini';
  try {
    // Identity and registration must be checked before parsing data, retrieving evidence or spending tokens.
    member = await requireRole(request, 'viewer');
    if (!request.headers.get('content-type')?.includes('application/json')) throw new AdviserError('Send a JSON question.', 415);
    if (Number(request.headers.get('content-length') ?? 0) > 12_000) throw new AdviserError('The question is too large.', 413);
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 12_000) throw new AdviserError('The question is too large.', 413);
    let payload: unknown;
    try { payload = JSON.parse(raw); } catch { throw new AdviserError('The request is not valid JSON.'); }
    const input = validateAdviserInput(payload);
    if (!env.OPENAI_API_KEY?.trim()) throw new AdviserError('Live AI is not configured. The instructor must add the server-side OpenAI key. You can still explore the guided questions and evidence.', 503, 'adviser_not_configured');
    const slot = await reserveAdviserRequest(member.id, member.teamId);
    if (!slot.allowed) {
      try { await finishAdviserRequest({ userId: member.id, model, status: 'rate_limited', inputTokens: 0, outputTokens: 0 }); } catch { /* The 429 matters more than its audit row. */ }
      return Response.json({ error: 'The adviser usage limit has been reached. Please try again after the reset time.', code: 'rate_limited', resetAt: slot.resetAt }, { status: 429, headers: { 'Retry-After': String(Math.max(1, Math.ceil((Date.parse(slot.resetAt) - Date.now()) / 1000))), 'Cache-Control': 'no-store' } });
    }
    slotId = slot.id;
    const call = openAIAdviser(env.OPENAI_API_KEY);
    const answer = await runAdviser(input, adviserRepository(member.teamId), async (body, signal) => { providerStarted = true; return call(body, signal); }, model, (usedIn, usedOut) => { inputTokens = usedIn; outputTokens = usedOut; });
    await finishAdviserRequest({ slotId, userId: member.id, model, status: answer.refused ? 'refused' : 'answered', inputTokens, outputTokens, citedIds: answer.citations.map(c => c.id), removed: answer.removedCitationCount, releaseReservation: true });
    return Response.json(answer, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (member && slotId) {
      // Usage is known unless a provider call failed in flight (timeout or network), so release
      // the reservation down to actual use in every other case.
      const usageUnknown = providerStarted && error instanceof AdviserError && error.code === 'provider_unavailable';
      try { await finishAdviserRequest({ slotId, userId: member.id, model, status: 'error', inputTokens, outputTokens, releaseReservation: !usageUnknown }); } catch { /* Preserve the original error; the reserved slot still bounds spend. */ }
    }
    const known = error instanceof AccessError || error instanceof AdviserError;
    return Response.json({ error: known ? error.message : 'The adviser could not complete this request. Please try again.', code: error instanceof AdviserError ? error.code : 'access_or_service_error' }, { status: known ? error.status : 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
