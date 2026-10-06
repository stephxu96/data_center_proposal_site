import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
import {
  AccessError,
  authEnabled,
  checkOrigin,
  routeError,
} from '../../../lib/access';
import {
  getMember,
  getTeams,
  registerMember,
} from '../../../lib/db/membership';

export async function POST(request: Request) {
  try {
    checkOrigin(request);
    if (!authEnabled())
      throw new AccessError(
        'Registration will open at the final sign-in step.',
        503,
      );
    const identity = await getChatGPTUser();
    if (!identity) throw new AccessError('Sign in required', 401);
    if (await getMember(identity.userId))
      throw new AccessError('Already registered', 409);
    const input = (await request.json()) as Record<string, unknown>;
    if (
      !input ||
      Object.keys(input).sort().join(',') !==
        'acceptRules,courseSection,teamId' ||
      input.acceptRules !== true ||
      typeof input.courseSection !== 'string' ||
      !input.courseSection.trim() ||
      input.courseSection.length > 100 ||
      !Number.isInteger(input.teamId)
    )
      throw new AccessError(
        'Complete your course section, team and rules agreement.',
        400,
      );
    if (!(await getTeams()).some((team) => team.id === input.teamId))
      throw new AccessError('Choose an available team.', 400);
    const member = await registerMember(
      identity.userId,
      identity.email,
      Number(input.teamId),
      input.courseSection.trim(),
      Boolean(
        env.INITIAL_ADMIN_USER_ID &&
        identity.userId === env.INITIAL_ADMIN_USER_ID,
      ),
    );
    return Response.json({ member });
  } catch (error) {
    return error instanceof SyntaxError
      ? Response.json({ error: 'Invalid request' }, { status: 400 })
      : routeError(error);
  }
}
