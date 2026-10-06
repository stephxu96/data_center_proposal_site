import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../app/chatgpt-auth';
import { getMember } from './db/membership';
import { hasRole } from './workspace-model';

export class AccessError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
export const authEnabled = () => env.AUTH_ENABLED === '1';
export function checkOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin)
    throw new AccessError('Invalid origin', 403);
}
export async function requireRole(
  request: Request,
  minimum: 'viewer' | 'editor' | 'admin',
) {
  checkOrigin(request);
  if (!authEnabled())
    throw new AccessError(
      'Account services will be connected at the final sign-in step.',
      503,
    );
  const identity = await getChatGPTUser();
  if (!identity) throw new AccessError('Sign in required', 401);
  const member = await getMember(identity.userId);
  if (!member) throw new AccessError('Registration required', 403);
  if (!hasRole(member.role, minimum))
    throw new AccessError('Your role does not permit this action.', 403);
  return member;
}
export function routeError(error: unknown) {
  return Response.json(
    {
      error:
        error instanceof AccessError
          ? error.message
          : 'The request could not be completed.',
    },
    { status: error instanceof AccessError ? error.status : 500 },
  );
}
