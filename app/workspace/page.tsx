import { Workspace } from '../../components/workspace';
import { authEnabled } from '../../lib/access';
import {
  getMember,
  getTeamDesign,
  getTeamMembers,
  getTeams,
} from '../../lib/db/membership';
import { proposalData } from '../../lib/db/proposal';
import { roles, type WorkspaceRole } from '../../lib/workspace-model';
import {
  chatGPTSignInPath,
  chatGPTSignOutPath,
  getChatGPTUser,
} from '../chatgpt-auth';
export const dynamic = 'force-dynamic';
export default async function TeamWorkspace({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const requestedRole = (await searchParams).role;
  const previewRole = roles.includes(requestedRole as WorkspaceRole)
    ? (requestedRole as WorkspaceRole)
    : 'visitor';
  const enabled = authEnabled();
  const identity = enabled ? await getChatGPTUser() : null;
  const member = identity ? await getMember(identity.userId) : null;
  const teams =
    enabled && identity
      ? await getTeams()
      : [{ id: 0, name: 'University AI infrastructure team' }];
  const members =
    member?.role === 'admin' ? await getTeamMembers(member.teamId) : [];
  const design = member
    ? await getTeamDesign(member.teamId)
    : {
        itLoadMw: proposalData.design.itLoadMw,
        pue: proposalData.design.pue,
        operatingHours: proposalData.design.operatingHours,
        rationale: 'Initial proposal assumptions.',
      };
  return (
    <>
      <section className="page-head">
        <div className="shell">
          <span className="eyebrow">Team workspace</span>
          <h1>A shared design. Clear responsibilities.</h1>
          <p>
            Join your team, contribute evidence and manage the assumptions
            behind the proposal.
          </p>
        </div>
      </section>
      <Workspace
        enabled={enabled}
        initialPreviewRole={previewRole}
        signedIn={Boolean(identity)}
        member={member}
        teams={teams}
        members={members}
        design={design}
        signInHref={chatGPTSignInPath('/workspace')}
        signOutHref={chatGPTSignOutPath('/')}
      />
    </>
  );
}
