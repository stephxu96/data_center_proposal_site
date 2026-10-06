import { env } from 'cloudflare:workers';
import { AdviserChat } from '../../components/adviser-chat';
import { authEnabled } from '../../lib/access';
import { getMember } from '../../lib/db/membership';
import { chatGPTSignInPath, getChatGPTUser } from '../chatgpt-auth';

export const dynamic = 'force-dynamic';
const suggestions = ['What is the current PUE, and where does it come from?', 'What evidence supports selecting Texas?', 'What happens if grid power is unavailable for 48 hours?', 'Can you certify this design as construction-ready?'];
const guided = [
  ['Why Texas?', 'Texas leads the weighted site assessment. Demand proximity has the largest weight, and the Texas reference site serves the greatest share of modeled addressable demand inside the threshold. The choice depends on written grid terms.', '/countries'],
  ['What happens in a grid outage?', 'UPS bridges the transfer to backup generation. The design walkthrough shows the energy required for the reference event and identifies the operating details that must be established.', '/design'],
  ['What would change the recommendation?', 'A better Québec connection and rate, a shift in member workloads, stronger East Coast demand, or changed Texas large-load terms could reverse the choice.', '/countries'],
  ['What does the investment model prove?', 'It shows the directional effect of editable assumptions across build, lease and hybrid choices. It does not replace vendor offers or a financing model.', '/investment'],
];

// The status shown here is informational; /api/ask repeats every check on the server.
async function accessStatus() {
  if (!authEnabled()) return { tone: 'amber', text: 'Sign-in is not active yet. Questions sent now are refused by the server until registration opens.' };
  const identity = await getChatGPTUser();
  if (!identity) return { tone: 'amber', text: 'You are not signed in. Sign in and register to ask the adviser.', href: chatGPTSignInPath('/adviser'), link: 'Sign in ↗' };
  const member = await getMember(identity.userId);
  if (!member) return { tone: 'amber', text: `Signed in as ${identity.displayName}. Registration is required before you can ask.`, href: '/workspace#registration', link: 'Register ↗' };
  return { tone: '', text: `Signed in as ${identity.displayName} · registered ${member.role}.` };
}

export default async function Adviser() {
  const status = await accessStatus();
  const live = Boolean(env.OPENAI_API_KEY?.trim());
  return <>
    <section className="page-head"><div className="shell"><span className="eyebrow">Ask the adviser</span><h1>Questions worth asking.</h1><p>The adviser answers from the stored design, claims, metrics and sources, and cites the source records it used.</p><p className="adviser-notice">The adviser discusses an initial design concept. It does not provide professional engineering certification.</p></div></section>
    <section className="section"><div className="shell">
      <p className="workspace-status" role="status"><span className={`tag ${status.tone}`}>Access</span> {status.text} {status.href && <a className="text-link" href={status.href}>{status.link}</a>}</p>
      {!live && <p className="workspace-status" role="status"><span className="tag amber">Model</span> The live model is not configured on this Site. The instructor-provided server key is still required, so the adviser cannot answer yet.</p>}
      <div style={{ marginTop: 24 }}><AdviserChat suggestions={suggestions} /></div>
    </div></section>
    <section className="section band"><div className="shell"><div className="section-head"><div><span className="eyebrow">Pre-written summaries · not AI answers</span><h2>Explore the reasoning.</h2></div><a className="text-link" href="/workspace">Registration and team access ↗</a></div><div className="grid-2">{guided.map(([q, a, href]) => <article className="card" key={q}><span className="eyebrow">Decision question</span><h3>{q}</h3><p>{a}</p><p style={{ marginTop: 18 }}><a className="text-link" href={href}>Explore the basis ↗</a></p></article>)}</div></div></section>
  </>;
}
