import { AccessError, requireRole, routeError } from '../../../lib/access';
import { recordDecision, validateDecision } from '../../../lib/db/decisions';

// FR17: the server, not the page, decides who may record a committee decision.
export async function POST(request: Request) {
  try {
    const member = await requireRole(request, 'viewer');
    if (member.role !== 'committee') throw new AccessError('Only committee members can record a decision.', 403);
    let input;
    try {
      input = validateDecision(await request.json());
    } catch (error) {
      throw new AccessError(error instanceof Error && !(error instanceof SyntaxError) ? error.message : 'Invalid request', 400);
    }
    try {
      return Response.json({ decision: await recordDecision(member, input) });
    } catch {
      throw new AccessError('The decision could not be recorded. Reload and try again.', 409);
    }
  } catch (error) {
    return routeError(error);
  }
}
