import { AccessError, requireRole, routeError } from '../../../lib/access';
import { addEvidence } from '../../../lib/db/membership';
import {
  validateEvidence,
  type EvidenceInput,
} from '../../../lib/workspace-model';
export async function POST(request: Request) {
  try {
    const member = await requireRole(request, 'editor');
    const input = (await request.json()) as EvidenceInput;
    try {
      validateEvidence(input);
    } catch (error) {
      throw new AccessError(
        error instanceof Error ? error.message : 'Invalid evidence',
        400,
      );
    }
    return Response.json(await addEvidence(member, input));
  } catch (error) {
    return error instanceof SyntaxError
      ? Response.json({ error: 'Invalid request' }, { status: 400 })
      : routeError(error);
  }
}
