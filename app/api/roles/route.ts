import { AccessError, requireRole, routeError } from '../../../lib/access';
import { assignRole, getTeamMembers } from '../../../lib/db/membership';
export async function POST(request: Request) {
  try {
    const member = await requireRole(request, 'admin');
    const input = (await request.json()) as { memberId: number; role: string };
    if (
      !input ||
      !Number.isInteger(input.memberId) ||
      !['viewer', 'editor', 'committee', 'admin'].includes(input.role) ||
      input.memberId === member.id
    )
      throw new AccessError(
        'Choose another team member and a valid role.',
        400,
      );
    try {
      await assignRole(member, input.memberId, input.role);
    } catch {
      throw new AccessError('Member not found in your team.', 404);
    }
    return Response.json({ members: await getTeamMembers(member.teamId) });
  } catch (error) {
    return error instanceof SyntaxError
      ? Response.json({ error: 'Invalid request' }, { status: 400 })
      : routeError(error);
  }
}
