# Requirements traceability: challenge brief to evidence

Authority: `Lesson 06 — Build a DataCenter Challenge.pdf` (23 pages). Every requirement below is quoted or closely paraphrased from the brief, with the page it comes from. Status records implementation evidence only. It is not a grade.

Draft for human review, prepared October 6, 2026. Re-check every row after the next deployment.

## How to read the status column

| Status | Meaning |
|---|---|
| **Met — deployed** | Seen on the public test Site on October 6, 2026 (read-only check), and unchanged since. |
| **Met — local** | Built and checked locally: by a named automated test or by rendering the page from a local copy of the database. Still needs checking on the Site after the next deployment. |
| **Partly met** | Some of the requirement is in place; the remaining part is named. |
| **Gap** | Not met. The action and its owner are named. |
| **Blocked** | Needs something from outside this repository: the instructor's API key, the final sign-in switch, a person's verification, or a recording. |

Test names refer to `npm test` (see `test-results.md`). "Site" means the test Site, `https://global-datacenter-design-explorer-test.stephxu700296.chatgpt.site`.

## 1. What a user must be able to do (brief p. 4)

| # | Requirement | Where | Status | Evidence |
|---|---|---|---|---|
| U1 | View the design concept and country comparison | `/`, `/design`, `/countries` | Met — deployed | Pages open signed out |
| U2 | Inspect sources and assumptions behind the design | `/evidence` | Met — deployed | 64 claims with type filter, source catalog, input ledger |
| U3 | Sign in and register | `/workspace`, `/api/register` | Blocked | Code and tests done (`test-adviser`: registration requires rules agreement; registration succeeds). Sign-in switches on only at the final step |
| U4 | Ask the AI agent questions | `/adviser`, `/api/ask` | Blocked | Conversation page and server route built (Phase 8). Needs the instructor's key and sign-in |
| U5 | Answers grounded in D1 data and approved external sources | `lib/adviser.ts`, `lib/db/adviser.ts` | Blocked (live) · Met — local (regression) | `test-adviser` shows the PUE comes from D1 with a scripted model. A real model answer has not been observed |
| U6 | Citations, and whether a statement is a fact, assumption, calculation or unresolved question | `/adviser`, `/evidence` | Met — deployed (evidence) · Blocked (adviser) | Evidence ledger types every claim. Adviser citations are checked against D1 in `test-adviser`; live answers are blocked |
| U7 | An authorised member refreshes or adds data without rebuilding | `/api/refresh`, `/api/metrics` | Partly met | Refresh works on the Site, but is temporarily open to everyone there. Editor-only enforcement is tested locally (`test-adviser`: anonymous 401, viewer 403) and takes effect at the final step |

## 2. Phase 1 — functional requirements and design assumptions (pp. 7–8)

| # | Requirement | Status | Evidence |
|---|---|---|---|
| FR1 | Present the proposed location and initial design | Met — deployed | `/` and `/design`: Texas, Dallas–Fort Worth reference geography |
| FR2 | Compare at least three countries | Met — deployed | `/countries`: United States (Texas), Canada (Québec), Finland (Helsinki) |
| FR3 | Store evidence, sources and assumptions persistently | Met — local | D1 schema `drizzle/0001–0003`; `test-migrations`, `test-seed`, `test-content` |
| FR4 | Retrieve at least one dataset from an external API | Met — deployed | Our World in Data carbon intensity and generation mix, with retrieval times on `/countries` |
| FR5 | Registered users can ask the AI agent | Blocked | Needs the key and the sign-in switch |
| FR6 | Unregistered users cannot call the AI endpoint | Met — local | `test-adviser`: no sign-in gives 401; signed in but unregistered gives 403. Check on the Site after the final step |
| FR7 | Cite the evidence in each substantive AI answer | Blocked (live) · Met — local | Citation check removes every invented or unseen source ID (`test-adviser`) |
| FR8 | Distinguish facts, estimates, calculations, unknowns | Met — deployed | Type label on every claim; filter on `/evidence` |
| FR9 | Keep the last valid data if a source fails | Met — deployed · Met — local | "Simulate source outage" on the Site; `test-refresh` checks it in code |
| FR10 | Show when each data item was last updated | Partly met | Recorded or retrieved dates on `/evidence` and `/countries`. Figures on `/`, `/design` and `/investment` link to their evidence rows but show no date beside the figure |
| NG | Explicit non-goals | Met | `docs/phase-01-define-website.md` §9 |
| A1 | Baseline 20 MW IT, PUE 1.25, 25 MW, 8,760 h, 219 GWh; any change explained | Met — local | `/`, `/design`; values read from D1 design parameters with a recorded rationale |
| A2 | Record country and region, grid concept, backup concept, cooling, water, network, electricity sources, engineering uncertainties | Met — local | `/design#design-record` (added in Phase 5) |

## 3. Phase 2–4 — data model, Sites project, seed (pp. 8–13)

| # | Requirement | Status | Evidence |
|---|---|---|---|
| D1 | Evidence, assumptions, calculations and design decisions kept separate and visible to the agent | Met — local | `design_claims.claim_type` constraint; the adviser receives claim types (`lib/db/adviser.ts`) |
| D2 | The brief's six tables, or a superset | Met — local | 29 tables, including `users`, `countries`, `metrics`, `sources`, `designs`, `design_claims` |
| D3 | Indexes that match real queries | Met — local | `test-migrations` checks the named indexes |
| S1 | Server-backed Sites app with D1; five named pages | Met — deployed | Overview, Country Comparison, Initial Design, Evidence, Ask the Adviser, plus Investment |
| S2 | D1 binding declared in `.openai/hosting.json`; no password or connection string in code | Met — local | `"d1": "DB"`; `lib/db/client.ts` uses the binding only |
| S3 | Schema in `db/schema.ts`, generated SQL inspected, migrations never rewritten, seed separate | Met — local | Three migrations; seed in `seed/`. Migration 0003 is new and must be applied at the next deployment |
| V1 | Every seed record has value, unit, period, publisher, URL, retrieval date, definition notes and confidence | Met — local | `seed/validate.mjs`; 16 negative checks in `test-seed` |
| V2 | Unavailable values are NULL with an explanation, never zero | Met — local | `test-economics`: zero productive hours gives "not defined"; `/countries` shows "Not established" with a reason |
| V3 | Data access through named server functions; prepared parameters only | Met — local | `lib/db/*`; no SQL in pages or routes |

## 4. Phase 5 — interface (pp. 14–15)

| # | Requirement | Status | Evidence |
|---|---|---|---|
| P1 | Overview: country and location, 20 MW, PUE, total load, annual energy, major decision | Met — deployed | `/` |
| P2 | Overview: three largest uncertainties | Met — local | `/` section "Three largest uncertainties" (added in Phase 5) |
| P3 | Comparison: number of reported data centers | **Gap** | Row exists; every country reads "Not established". **Owner: the team must source and verify the figures.** They must not be invented |
| P4 | Comparison: reported capacity or electricity consumption | **Gap** | As P3 |
| P5 | Comparison: generation mix | Met — deployed | Live, from Our World in Data |
| P6 | Comparison: carbon intensity | Met — deployed | Live and seeded regional values |
| P7 | Comparison: water or cooling constraints | **Gap** | Water and cooling rows read "Not established". Qualitative scores exist (criterion K5). **Owner: team, as P3** |
| P8 | Comparison: data vintage and source links | Met — deployed | Period and retrieval date per value |
| P9 | Design: block diagram with grid, distribution, backup, IT, cooling, network | Met — deployed | `components/SystemDiagram.tsx`; storage block added in Phase 5 |
| P10 | Evidence: filterable table of claims and sources | Met — deployed | `/evidence#claim-ledger` |
| P11 | Adviser page: suggested questions, conversation, citations, sign-in status, certification statement | Met — local | `/adviser` rendered locally. Answers appear only once the key is set |
| P12 | Derived values calculated in code, not by the model | Met — local | `lib/db/proposal.ts`; the adviser's `calculate_energy` tool (`test-adviser`: PUE 1.4 gives 28 MW) |

## 5. Phase 6 — external sources (pp. 15–17)

| # | Requirement | Status | Evidence |
|---|---|---|---|
| E1 | At least one genuine external API | Met — deployed | Our World in Data (fixed chart exports; no key needed) |
| E2 | At least three human-verified source records | **Blocked** | None of the 63 seeded sources has `verified_by` set. **Owner: a team member** checks three sources against their publications and records their name and date. Only a person can truthfully do this |
| E3 | No arbitrary live web search | Met — local | The adviser has five fixed tools; refresh accepts no URL |
| E4 | Refresh path: editor → backend → API → validate → save → return → redraw | Met — deployed (open demo) · Met — local (editor-only) | `/api/refresh`, `components/refresh-data.tsx` |
| E5 | Validate HTTP success, fields, numeric values, units, reporting period, source and retrieval date, ranges | Met — local | `test-refresh` covers each rule. The unit check was added in Phase 6 |
| E6 | Keep the last valid record on failure | Met — deployed · Met — local | `test-refresh` |
| E7 | Keys stay on the server, never returned or committed | Met — local | The key is read only in `app/api/ask/route.ts`; `test-adviser` asserts it never appears in a response. Search the built browser files once more after deployment |

## 6. Phase 7 — registration and authorisation (pp. 17–18)

| # | Requirement | Status | Evidence |
|---|---|---|---|
| R1 | Sign in with ChatGPT through Sites | Blocked (final step) | `app/chatgpt-auth.ts`; switched on by `AUTH_ENABLED=1` |
| R2 | First visit asks for course section, team and rules agreement, then creates the user row | Met — local | `/api/register`; `test-adviser` |
| R3 | Four roles: visitor, registered user, editor, team administrator | Met — local | `lib/workspace-model.ts`; `test-workspace` role matrix. A fifth role, committee member, records decisions (FR17) |
| R4 | Server checks on the AI, refresh and editing endpoints | Met — local | `test-adviser`: ask 401/403; refresh 401/403; design edit 403 for a viewer and 200 for an administrator |
| FR17 | (Team requirement, Phase 1 spec) A committee member records approve, reject or send back, with a reason; any other role is refused | Met — local | `/investment#committee-decision`, `/api/decisions`. `test-adviser`: administrator and viewer get 403, signed out 401; reason under 20 characters rejected; each decision is a new round; history cannot be edited. Administrators assign the committee role |

## 7. Phase 8 — AI agent (pp. 18–20)

| # | Requirement | Status | Evidence |
|---|---|---|---|
| G1 | Agent goal and instructions as in the brief | Met — local | `ADVISER_INSTRUCTIONS` in `lib/adviser.ts` |
| G2 | Tools `get_design`, `get_country_metrics`, `get_design_claims`, `calculate_energy`, `query_approved_external_source` (no arbitrary URL) | Met — local | `ADVISER_TOOLS`; `test-adviser` checks five tools in every request |
| G3 | Server order: authenticated, registered, rate limit, design, relevant evidence, policies, OpenAI call with server key, answer and citations, audit | Met — local | `app/api/ask/route.ts`; `test-adviser` checks the audit row and token use |
| G4 | The model gets relevant records, not the whole database | Met — local | Claims capped at 8 and metrics at 16; a 12 KB evidence budget |
| G5 | Answer / Evidence used / Assumptions / Uncertainty format | Met — local | Structured response schema; the page renders all four sections |
| G6 | Citation IDs are real D1 sources, never invented | Met — local (regression) · Blocked (live) | `test-adviser` removes invented IDs in every form: `[S99999]`, `[S1, S88888]`, `[s77777]`, `S66666` |

## 8. Phase 9 — testing (pp. 20–21)

The twelve functional tests and the prompt-injection test are in `test-results.md`. Summary: the server-side behaviour behind all thirteen is checked locally. On the deployed Site, 3 pass and **10 remain Blocked**: four need real sign-in (tests 2, 3, 4, 10) and six need a real model answer (tests 5, 6, 7, 11, 12, 13). A scripted model is not counted as a pass for any of them.

| # | Requirement | Status | Evidence |
|---|---|---|---|
| T-arch | Trace user → access check → D1 → agent → tool → cited answer → user | Met — local | `architecture.md` §2 names each file and function |

## 9. Phase 10 — publish and submit (p. 22)

| # | Requirement | Status | Evidence |
|---|---|---|---|
| X1 | D1 binding configured | Met — deployed | The Site reads D1 |
| X2 | Migrations apply successfully | Partly met | Replay passes locally. **0003 not yet applied on the Site** |
| X3 | Hosted secrets configured | Blocked | `OPENAI_API_KEY` from the instructor |
| X4 | No credentials in browser code | Met — local | No key exists in source. Search the deployed browser files after deployment |
| X5 | Protected routes check on the server | Met — local | See R4 |
| X6 | Source URLs and timestamps visible | Met — deployed | `/evidence`, `/countries` |
| X7 | Build completes without errors | Met — local | `npm run build` passes |
| X8 | The deployed Site passes the same tests as the preview | Blocked | Needs a redeploy from the ChatGPT/Codex app, then the checklist in `test-results.md` §3 |
| Sub1 | Published URL | Met | README |
| Sub2 | Architecture diagram | Met — local | `architecture.md` §1 |
| Sub3 | D1 schema | Met | `db/schema.ts`, `drizzle/` |
| Sub4 | External sources and APIs | Met — local | `architecture.md` §3 |
| Sub5 | Initial design | Met — local | `/design`, including the design record |
| Sub6 | Functional-requirements table | Met | This document, §2 |
| Sub7 | Test results | Met — local · Blocked (deployed and live) | `test-results.md` |
| Sub8 | Two-minute demonstration video | **Blocked** | A team member records it after the final step |
| Sub9 | Individual request-path explanation | **Blocked** | Each student writes their own. `architecture.md` §2 is the reference trace |

## 10. PS3 investment task (pp. 1–3), across the three deliverables

App = deployed or local Site. Memo and deck = the files regenerated on October 6 at 18:13 from `deliverables/model-results.json`. That file is written by `scripts/export-model.mjs`, which runs the app's own model code, so document figures match the Site's Investment page.

| # | Requirement | App | Memo | Deck |
|---|---|---|---|---|
| I1 | Recommend build, lease or hybrid; say what to own and what to contract | Met — local (`/investment`) | Met: lease first, stage a hybrid, send the full build back; ownership and contracting stated | Met: slides 1, 6 and 8 |
| I2 | Label assumptions; separate estimates from facts; name unknowns that could reverse the recommendation | Met — deployed | Met | Met (slide 7) |
| D-1 | Requirements: users, productive GPU-hours, availability; whether they justify 25 MW | Met — local | Met: 67.99 million productive GPU-hours; scale not yet justified | Met (slide 2) |
| D-2 | Architecture, largest-component failure, 48-hour outage | Met — deployed | Met | Met (slide 3) |
| D-3 | Ten-year cash flow separating facility and GPU fleet; three options | Met — local (`test-economics`) | Met: capital split and cost lines | Met (slide 4) |
| D-4 | Financing evidence and who bears each risk | Met — deployed | Met | Met (slide 6 notes) |
| D-5 | Governance and protection against capacity capture | Met — deployed | Met: 20% reserve, 35% cap | Met (slide 6) |
| D-6 | Alternatives and external effects | Met — deployed | Met: comparators, drought, noise, emissions, other grid customers | Partly met: alternatives in slide 7 notes |
| SA1 | Base, one-year grid delay, half GPU utilisation | Met — local | Met (table) | Met (slide 5) |
| SA2 | Cash before opening, annual operations, cost per productive GPU-hour, capital at risk, per case | Met — local | Met | Met |
| SA3 | On-site generation contribution | Met — local (none counted) | Met: "no firm outage credit without hourly delivery evidence" | Met (slide 3 notes) |
| SA4 | Data needed to verify the uptime target | Met — local; target itself not set | Met ("Evidence needed to verify uptime") | Met (slide 3 notes) |
| DL1 | Website model with visible assumptions and sensitivity analysis | Met — local | — | — |
| DL2 | One-page system diagram | Met — deployed (storage added locally) | — | — |
| DL3 | Five-minute presentation, followed by questions | — | — | Met as written: speaker-note timings total 300 seconds; closing slide invites questions. **Rehearsal is a team task.** Slide layout not visually checked here |
| DL4 | Two-page memo, clear recommendation, three findings | — | Met: three numbered findings; designed as two pages (page break before the economics section). **Confirm the page count in Word** | — |

**Model result to discuss before presenting.** In the one-year-delay case, build's cost per productive GPU-hour falls ($2.67 to $2.51) instead of rising. The ten-year window is the reason: a later opening pushes the second GPU-fleet replacement (about $240m) past year ten. The Site, memo and deck all show the same figures. Whether to change the model or explain this is a team decision.

## 11. Open items, by owner

| Item | Owner | Blocks |
|---|---|---|
| Instructor's OpenAI key as a hosted secret | Instructor | FR5, FR7 live, U4–U6, six Step 22 tests, X3 |
| Redeploy the latest commit from the ChatGPT/Codex app and apply migration 0003 | Team (Sites app) | X2, X8, every "Met — local" row |
| Source and verify data-center count, electricity use and water/cooling figures for the three countries | Team | P3, P4, P7 |
| Verify three source records and record the verifier | Team member | E2 |
| Set an uptime or availability target | Team decision | SA4 (target) |
| Confirm the memo prints as two pages; flip through the deck in PowerPoint; rehearse to five minutes | Team | DL3, DL4 |
| Final step: `AUTH_ENABLED=1`, `INITIAL_ADMIN_USER_ID`, remove `DEMO_PUBLIC_REFRESH` and `SEED_DEPLOY_TOKEN`, redeploy, run the signed-in tests | Team, last | U3, R1, U7, Step 22 sign-in tests |
| Record the two-minute video; write individual request-path explanations | Each student | Sub8, Sub9 |
