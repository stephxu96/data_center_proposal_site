'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshData } from './refresh-data';
import {
  evidenceMetrics,
  hasRole,
  roleDescriptions,
  roleNames,
  roles,
  sourceTypes,
  validateDesign,
  validateEvidence,
  type DesignInputs,
  type EvidenceInput,
  type WorkspaceRole,
} from '../lib/workspace-model';
import type { Member } from '../lib/db/membership';

type TeamMember = {
  id: number;
  email: string | null;
  role: Member['role'];
  courseSection: string | null;
};
type Props = {
  enabled: boolean;
  initialPreviewRole: WorkspaceRole;
  signedIn: boolean;
  member: Member | null;
  teams: { id: number; name: string }[];
  members: TeamMember[];
  design: DesignInputs;
  signInHref: string;
  signOutHref: string;
};
const demoMembers: TeamMember[] = [
  { id: -1, email: 'Demo researcher', role: 'viewer', courseSection: 'Demo' },
  {
    id: -2,
    email: 'Demo evidence lead',
    role: 'editor',
    courseSection: 'Demo',
  },
];
const initialEvidence: EvidenceInput = {
  country: 'US',
  metric: 'datacenter_count',
  value: 1,
  period: '2025',
  publisher: '',
  title: '',
  url: '',
  notes: '',
  sourceType: 'academic',
};
async function post(path: string, body: unknown) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const result = (await response.json()) as {
    error?: string;
    members?: TeamMember[];
  };
  if (!response.ok)
    throw new Error(result.error ?? 'The request could not be completed.');
  return result;
}

export function Workspace(props: Props) {
  const router = useRouter();
  const [previewRole, setPreviewRole] = useState<WorkspaceRole>(
    props.initialPreviewRole,
  );
  const role: WorkspaceRole = props.enabled
    ? props.member?.role === 'committee'
      ? 'viewer'
      : (props.member?.role ?? 'visitor')
    : previewRole;
  const [section, setSection] = useState('');
  const [teamId, setTeamId] = useState(props.teams[0]?.id ?? 0);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [design, setDesign] = useState(props.design);
  const [savedDesign, setSavedDesign] = useState(props.design);
  const [evidence, setEvidence] = useState(initialEvidence);
  const [added, setAdded] = useState<EvidenceInput[]>([]);
  const [members, setMembers] = useState(
    props.enabled ? props.members : demoMembers,
  );
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  async function action(work: () => Promise<void>) {
    setBusy(true);
    setStatus('');
    try {
      await work();
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : 'Please check your entries.',
      );
    } finally {
      setBusy(false);
    }
  }
  function register(event: FormEvent) {
    event.preventDefault();
    void action(async () => {
      if (props.enabled) {
        await post('/api/register', {
          courseSection: section,
          teamId,
          acceptRules: rulesAccepted,
        });
        router.refresh();
      } else setPreviewRole('viewer');
      setStatus(
        props.enabled
          ? 'Registration saved. Welcome to your team.'
          : 'Registration preview complete. Your registered-user workspace is ready.',
      );
    });
  }
  function saveDesign(event: FormEvent) {
    event.preventDefault();
    void action(async () => {
      validateDesign(design);
      if (props.enabled) await post('/api/design', design);
      setSavedDesign(design);
      setStatus(
        props.enabled
          ? 'Design assumptions saved to your team.'
          : 'Design preview updated. The calculated outputs below now use your assumptions.',
      );
    });
  }
  function saveEvidence(event: FormEvent) {
    event.preventDefault();
    void action(async () => {
      validateEvidence(evidence);
      if (props.enabled) await post('/api/metrics', evidence);
      setAdded([...added, evidence]);
      setEvidence(initialEvidence);
      setStatus(
        props.enabled
          ? 'Evidence saved with its source record.'
          : 'Evidence added to this preview.',
      );
    });
  }
  function assign(memberId: number, nextRole: Member['role']) {
    void action(async () => {
      if (props.enabled) {
        const result = await post('/api/roles', { memberId, role: nextRole });
        setMembers(result.members ?? members);
      } else
        setMembers(
          members.map((member) =>
            member.id === memberId ? { ...member, role: nextRole } : member,
          ),
        );
      setStatus(
        props.enabled
          ? 'Team role saved.'
          : 'Team role updated in this preview.',
      );
    });
  }
  return (
    <section className="section">
      <div className="shell workspace-shell">
        {!props.enabled && (
          <div className="workspace-demo">
            <div>
              <strong>Explore the team experience</strong>
              <p>
                Choose a role to try its workspace. Registration,
                evidence-entry, design and role edits here are previews; live
                data refresh connects to the published source.
              </p>
            </div>
            <span className="tag">Demo access</span>
          </div>
        )}
        <div className="workspace-layout">
          <aside className="workspace-rail">
            <span className="eyebrow">
              {props.enabled ? 'Your access' : 'Preview a role'}
            </span>
            {roles.map((item) =>
              props.enabled ? (
                <div
                  key={item}
                  className={`role-choice ${role === item ? 'selected' : ''}`}
                >
                  <strong>{roleNames[item]}</strong>
                  <span>{roleDescriptions[item]}</span>
                </div>
              ) : (
                <button
                  key={item}
                  className={`role-choice ${role === item ? 'selected' : ''}`}
                  aria-pressed={role === item}
                  onClick={() => {
                    setPreviewRole(item);
                    setStatus('');
                  }}
                >
                  <strong>{roleNames[item]}</strong>
                  <span>{roleDescriptions[item]}</span>
                </button>
              ),
            )}
            {props.enabled && (
              <a
                className="text-link"
                href={props.signedIn ? props.signOutHref : props.signInHref}
                target="_top"
              >
                {props.signedIn ? 'Sign out' : 'Sign in with ChatGPT'} ↗
              </a>
            )}
          </aside>
          <div className="workspace-content">
            <div className="workspace-title">
              <div>
                <span className="eyebrow">{roleNames[role]}</span>
                <h2>
                  {role === 'visitor'
                    ? 'Start with the proposal.'
                    : role === 'viewer'
                      ? 'Understand the decision.'
                      : role === 'editor'
                        ? 'Build the evidence.'
                        : 'Guide your team’s design.'}
                </h2>
              </div>
              <span className="tag">
                {props.enabled
                  ? props.signedIn
                    ? 'Signed in'
                    : 'Public access'
                  : 'Role preview'}
              </span>
            </div>
            {role === 'admin' && <nav className="workspace-shortcuts" aria-label="Administrator tools"><a className="text-link" href="#design-settings">Design assumptions ↓</a><a className="text-link" href="#team-roles">Team roles ↓</a><a className="text-link" href="#add-evidence">Add evidence ↓</a></nav>}
            {status && (
              <p className="workspace-status" role="status">
                {status}
              </p>
            )}
            {role === 'visitor' ? (
              <>
                <div className="grid-2">
                  <a className="card workspace-link" href="/design">
                    <span className="eyebrow">Public design</span>
                    <h3>Explore the initial design ↗</h3>
                    <p>Power, cooling, networking and failure paths.</p>
                  </a>
                  <a className="card workspace-link" href="/evidence">
                    <span className="eyebrow">Public evidence</span>
                    <h3>Inspect the decision basis ↗</h3>
                    <p>Published figures, sources and calculation methods.</p>
                  </a>
                </div>
                <div className="card" id="registration">
                  <span className="eyebrow">First visit</span>
                  <h3>Join your team</h3>
                  {props.enabled && !props.signedIn ? (
                    <p>
                      <a
                        className="button"
                        href={props.signInHref}
                        target="_top"
                      >
                        Sign in with ChatGPT
                      </a>
                    </p>
                  ) : (
                    <form onSubmit={register}>
                      <div className="field-grid workspace-fields">
                        <div className="field">
                          <label htmlFor="course-section">Course section</label>
                          <input
                            id="course-section"
                            required
                            maxLength={100}
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            placeholder="e.g. Section A"
                          />
                        </div>
                        <div className="field">
                          <label htmlFor="registration-team">Team</label>
                          <select
                            id="registration-team"
                            value={teamId}
                            onChange={(e) => setTeamId(Number(e.target.value))}
                          >
                            {props.teams.map((team) => (
                              <option key={team.id} value={team.id}>
                                {team.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="project-rules">
                        <strong>Project rules</strong>
                        <p>
                          Use sources for factual claims, distinguish
                          assumptions from facts, and treat this proposal as an
                          initial design requiring specialist review.
                        </p>
                      </div>
                      <label className="check-label">
                        <input
                          type="checkbox"
                          required
                          checked={rulesAccepted}
                          onChange={(e) => setRulesAccepted(e.target.checked)}
                        />{' '}
                        I agree to the project rules.
                      </label>
                      <button className="button" disabled={busy}>
                        {props.enabled
                          ? 'Complete registration'
                          : 'Preview registration'}{' '}
                        →
                      </button>
                    </form>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="card accent">
                  <span className="eyebrow">Registered-user access</span>
                  <h3>Ask the design adviser</h3>
                  <p>
                    Explore the reasoning, assumptions and supporting evidence
                    through the guided questions. The live AI connection will be
                    available after its server key and final sign-in setup are
                    complete.
                  </p>
                  <p style={{ marginTop: 16 }}>
                    <a className="button" href="/adviser">
                      Open adviser ↗
                    </a>
                  </p>
                </div>
                {hasRole(role, 'editor') && (
                  <>
                    <div className="card">
                      <div className="section-head">
                        <div>
                          <span className="eyebrow">Connected sources</span>
                          <h3>Refresh electricity evidence</h3>
                          <p>
                            Check the source and retain the last valid data if
                            it is unavailable.
                          </p>
                        </div>
                        <RefreshData />
                      </div>
                      <a className="text-link" href="/evidence#live-evidence">
                        Open the saved source ledger ↗
                      </a>
                    </div>
                    <div className="card" id="add-evidence">
                      <span className="eyebrow">Editor tools</span>
                      <h3>Add a sourced figure</h3>
                      <form onSubmit={saveEvidence}>
                        <div className="field-grid workspace-fields">
                          <div className="field">
                            <label htmlFor="evidence-country">Country</label>
                            <select
                              id="evidence-country"
                              value={evidence.country}
                              onChange={(e) =>
                                setEvidence({
                                  ...evidence,
                                  country: e.target
                                    .value as EvidenceInput['country'],
                                })
                              }
                            >
                              <option value="US">United States</option>
                              <option value="CA">Canada</option>
                              <option value="FI">Finland</option>
                            </select>
                          </div>
                          <div className="field">
                            <label htmlFor="evidence-metric">Metric</label>
                            <select
                              id="evidence-metric"
                              value={evidence.metric}
                              onChange={(e) =>
                                setEvidence({
                                  ...evidence,
                                  metric: e.target.value,
                                })
                              }
                            >
                              {Object.entries(evidenceMetrics).map(
                                ([key, item]) => (
                                  <option key={key} value={key}>
                                    {item.name} ({item.unit})
                                  </option>
                                ),
                              )}
                            </select>
                          </div>
                          <div className="field">
                            <label htmlFor="evidence-value">
                              Value (
                              {
                                evidenceMetrics[
                                  evidence.metric as keyof typeof evidenceMetrics
                                ].unit
                              }
                              )
                            </label>
                            <input
                              id="evidence-value"
                              type="number"
                              required
                              min="0"
                              step="any"
                              value={evidence.value}
                              onChange={(e) =>
                                setEvidence({
                                  ...evidence,
                                  value: Number(e.target.value),
                                })
                              }
                            />
                          </div>
                          <div className="field">
                            <label htmlFor="evidence-period">
                              Reporting period
                            </label>
                            <input
                              id="evidence-period"
                              required
                              placeholder="YYYY or YYYY-MM"
                              value={evidence.period}
                              onChange={(e) =>
                                setEvidence({
                                  ...evidence,
                                  period: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="field">
                            <label htmlFor="evidence-source-type">
                              Publisher type
                            </label>
                            <select
                              id="evidence-source-type"
                              value={evidence.sourceType}
                              onChange={(event) =>
                                setEvidence({
                                  ...evidence,
                                  sourceType: event.target
                                    .value as EvidenceInput['sourceType'],
                                })
                              }
                            >
                              {sourceTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type.replaceAll('_', ' ')}
                                </option>
                              ))}
                            </select>
                          </div>
                          {(
                            ['publisher', 'title', 'url', 'notes'] as const
                          ).map((key) => (
                            <div className="field" key={key}>
                              <label htmlFor={`evidence-${key}`}>
                                {
                                  {
                                    publisher: 'Publisher',
                                    title: 'Source title',
                                    url: 'Source URL',
                                    notes: 'Definition and limitations',
                                  }[key]
                                }
                              </label>
                              <input
                                id={`evidence-${key}`}
                                type={key === 'url' ? 'url' : 'text'}
                                required
                                minLength={3}
                                maxLength={2000}
                                value={evidence[key]}
                                onChange={(e) =>
                                  setEvidence({
                                    ...evidence,
                                    [key]: e.target.value,
                                  })
                                }
                              />
                            </div>
                          ))}
                        </div>
                        <button className="button" disabled={busy}>
                          {props.enabled ? 'Save evidence' : 'Add to preview'} →
                        </button>
                      </form>
                      {added.length > 0 && (
                        <div className="table-scroll" style={{ marginTop: 24 }}>
                          <table className="data-table">
                            <thead>
                              <tr>
                                <th>Country</th>
                                <th>Metric</th>
                                <th>Value</th>
                                <th>Source</th>
                              </tr>
                            </thead>
                            <tbody>
                              {added.map((row, index) => (
                                <tr key={index}>
                                  <td>{row.country}</td>
                                  <td>
                                    {
                                      evidenceMetrics[
                                        row.metric as keyof typeof evidenceMetrics
                                      ].name
                                    }
                                  </td>
                                  <td>
                                    {row.value}{' '}
                                    {
                                      evidenceMetrics[
                                        row.metric as keyof typeof evidenceMetrics
                                      ].unit
                                    }
                                  </td>
                                  <td>
                                    <a
                                      className="text-link"
                                      href={row.url}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {row.publisher} ↗
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </>
                )}
                {role === 'admin' && (
                  <>
                    <div className="card" id="design-settings">
                      <span className="eyebrow">Team administrator</span>
                      <h3>Edit design assumptions</h3>
                      <form onSubmit={saveDesign}>
                        <div className="field-grid">
                          <div className="field">
                            <label htmlFor="admin-it-load">IT load (MW)</label>
                            <input
                              id="admin-it-load"
                              type="number"
                              required
                              min="0.1"
                              max="2000"
                              step="0.1"
                              value={design.itLoadMw}
                              onChange={(e) =>
                                setDesign({
                                  ...design,
                                  itLoadMw: Number(e.target.value),
                                })
                              }
                            />
                          </div>
                          <div className="field">
                            <label htmlFor="admin-pue">Facility PUE</label>
                            <input
                              id="admin-pue"
                              type="number"
                              required
                              min="1"
                              max="3"
                              step="0.01"
                              value={design.pue}
                              onChange={(e) =>
                                setDesign({
                                  ...design,
                                  pue: Number(e.target.value),
                                })
                              }
                            />
                          </div>
                          <div className="field">
                            <label htmlFor="admin-hours">
                              Annual operating hours
                            </label>
                            <input
                              id="admin-hours"
                              type="number"
                              required
                              min="1"
                              max="8760"
                              value={design.operatingHours}
                              onChange={(e) =>
                                setDesign({
                                  ...design,
                                  operatingHours: Number(e.target.value),
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="field" style={{ margin: '18px 0' }}>
                          <label htmlFor="admin-rationale">
                            Reason for the assumptions
                          </label>
                          <input
                            id="admin-rationale"
                            required
                            minLength={10}
                            maxLength={2000}
                            value={design.rationale}
                            onChange={(e) =>
                              setDesign({
                                ...design,
                                rationale: e.target.value,
                              })
                            }
                          />
                        </div>
                        <button className="button" disabled={busy}>
                          {props.enabled
                            ? 'Save team design'
                            : 'Update design preview'}{' '}
                          →
                        </button>
                      </form>
                      <div className="workspace-calculations">
                        <div>
                          <strong>
                            {(savedDesign.itLoadMw * savedDesign.pue).toFixed(
                              2,
                            )}{' '}
                            MW
                          </strong>
                          <span>Facility load · IT load × PUE</span>
                        </div>
                        <div>
                          <strong>
                            {(
                              (savedDesign.itLoadMw *
                                savedDesign.pue *
                                savedDesign.operatingHours) /
                              1000
                            ).toFixed(2)}{' '}
                            GWh
                          </strong>
                          <span>
                            Annual energy · facility load × hours ÷ 1,000
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="card" id="team-roles">
                      <span className="eyebrow">Team administrator</span>
                      <h3>Manage team roles</h3>
                      <p>
                        Assign responsibilities to registered members of your
                        team.
                      </p>
                      <div className="table-scroll" style={{ marginTop: 20 }}>
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Team member</th>
                              <th>Role</th>
                            </tr>
                          </thead>
                          <tbody>
                            {members.map((member) => (
                              <tr key={member.id}>
                                <td>
                                  {member.email ?? `Member ${member.id}`}
                                  {member.id === props.member?.id
                                    ? ' (you)'
                                    : ''}
                                </td>
                                <td>
                                  <select
                                    aria-label={`Role for ${member.email ?? member.id}`}
                                    disabled={
                                      busy || member.id === props.member?.id
                                    }
                                    value={member.role}
                                    onChange={(e) =>
                                      assign(
                                        member.id,
                                        e.target.value as Member['role'],
                                      )
                                    }
                                  >
                                    <option value="viewer">
                                      Registered user
                                    </option>
                                    <option value="editor">Editor</option>
                                    <option value="committee">
                                      Committee member
                                    </option>
                                    <option value="admin">
                                      Team administrator
                                    </option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {members.length === 0 && (
                        <p style={{ marginTop: 16 }}>
                          Team members appear after registration.
                        </p>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
