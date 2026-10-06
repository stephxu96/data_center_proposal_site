# Phase 3: Create the Sites project and apply the schema

Brief reference: Steps 6–8 (pages 11–13)
Depends on: Phase 1 (FR1, C1–C4), Phase 2 (the `0001` schema)
Feeds: Phase 4 (seed), Phase 5 (pages), Phase 6 (refresh endpoint), Phase 7 (sign-in), Phase 8 (adviser), Phase 9 (tests), Phase 10 (publish)
Status: complete for review, October 6, 2026. Platform research done the same day; the open items are listed in §2.4.
Revised October 6, 2026 after the first build attempt: §4.1 and §4.2, for the scaffolder's refusal to run in a non-empty directory.

This phase turns the Phase 2 schema into a running, server-backed shell: six page routes with placeholder content, a database binding, and migration `0001` applied to an empty database. No evidence, no pages worth reading, and no AI. The point is that everything after this phase has somewhere to go.

This document covers:

- the decisions made here (§1)
- what the platform actually requires, and how that was established (§2)
- creating the project, binding the database, and applying the migration (§4–§6)
- the routes, the data-access boundary, and the three environments (§7–§9)
- visibility, which is what lets the committee open the site at all (§10)
- risks, fallbacks and acceptance criteria (§12–§13)

---

## 1. Decisions made in this phase

| # | Topic | Decision | Reason |
|---|---|---|---|
| P3-1 | Where the project is built | **Local repository, deployed through the ChatGPT app.** `git init` in this directory; the application at the root, `docs/` alongside it. | Sites supports a local source project and ties each deployed version to its Git commit. One repository means the design docs and the code are submitted and versioned together. |
| P3-2 | Stack | **The official scaffolder with the `d1` and `auth` add-ons**: Vinext and React on Vite 8, Drizzle over D1, Node 22.13 or later. | The only stack OpenAI itself generates for Sites (§2.3). The `auth` add-on is the same sign-in machinery Phase 7 needs, so it is not carried twice. |
| P3-3 | How migration `0001` is written | **`db/schema.ts` generates the tables; the CHECK rules, triggers and views from Phase 2 are added to the generated file by hand**, and the whole file is applied as one migration. | Satisfies the brief's Step 8 literally while keeping Phase 2 intact. Drizzle cannot generate triggers or views, and Phase 2's append-only rule (P2-5) depends on them. |
| P3-4 | Database binding file | **`.openai/hosting.json` in the documented flat form.** | The brief gives its nested form as an illustration, not a specification: its words are "Conceptually: `{ \"d1\": { \"binding\": \"DB\" } }`". The documented flat form is what the tooling reads, and using it follows the brief's intent rather than departing from it (§5.2). |
| P3-5 | Routes scaffolded | **Six**: the brief's five pages plus `/investment`. This settles overview decision 5 in favour of a dedicated Investment Case page. | PS3's economics, stress cases and recommendation need one home. An empty route now costs nothing; splitting that content across two pages later costs a rewrite. |
| P3-6 | Visibility | **Audience set so that anyone with the link can open the site, at creation**, verified signed out before anything else is built. | FR1 says a visitor sees the design without signing in. Changing a deployed site from owner-only is reported not to work (§2.2, F14), so this is done first, not last. |
| P3-7 | What stands in for "preview" | **Local development plus a second test Site**, created in this phase, with its own database. | Sites documents no preview environment: every deployment is production. Phase 9 needs somewhere to run destructive tests that is not the site the committee is reading. |

Engineering choices made in this phase without a separate decision:

- The scaffolder's Worker entry point is kept as generated. All database access goes through one module (§8), so the framework is replaceable without touching page code.
- Migration files live in `drizzle/` and are packaged into `dist/.openai/drizzle/` by the official Vite plugin.
- Every statement in every migration is separated by a `--> statement-breakpoint` marker, and no marker is ever placed inside a trigger body (§6.2).
- The full migration set is applied to a throwaway local database by `npm test` before any deploy.
- `.openai/hosting.json` is committed. The `project_id` field is written by Sites and is never hand-edited.
- No credential of any kind enters the repository. Keys arrive as hosted secrets in Phases 6 and 8.

---

## 2. Research: what the platform requires

The brief assumes a platform the team has not used. Phase 2 also left a question open: does D1 support the triggers, views and window functions the schema relies on? This section establishes what is documented, what is only observed, and what has to be tested on the first deploy.

### 2.1 Research questions

| # | Question | Why it matters |
|---|---|---|
| RQ1 | What build and runtime environment does Sites require? | Decides the stack, and rules out whole classes of library |
| RQ2 | Which frameworks are supported, and which merely work? | The brief names none, and the design must not depend on a guess |
| RQ3 | What is the exact binding file format? | The brief and the documentation disagree |
| RQ4 | How do migrations reach the deployed database? | Phase 2's schema is worthless if it is not applied |
| RQ5 | Does a deployed database accept triggers and views? | Phase 2's append-only rule depends on it |
| RQ6 | Is there a preview environment? | The brief asks for tests on preview and on deployed |
| RQ7 | What controls who can open the site? | FR1 fails if the committee has to sign in |

### 2.2 Findings

Evidence classes: **D** documented by the platform owner, **O** observed in public projects or trackers but not documented, **I** inferred from a property the platform states.

| # | Finding | Class | Consequence |
|---|---|---|---|
| F1 | Sites runs on Cloudflare Workers. D1 is the relational store (10 GB per site) and R2 the object store (no fixed limit). | D | The schema fits with room to spare. R2 is not needed; `r2` stays null. |
| F2 | HTTP, HTTPS and WebSockets are supported. Raw inbound and outbound TCP are not. Private networks and background services are not supported. | D | Every external source (Phase 6) must be an HTTPS API. No scheduled background refresh; refresh is an endpoint someone or something calls. |
| F3 | Node 22.13 or later, and Vite 8, are the build environment. | D | Pins the toolchain. Anything needing native Node modules is out. |
| F4 | Two official packages exist: a project scaffolder and a Vite plugin that packages deployment metadata and Drizzle migrations. | D | The supported path is Vite plus Drizzle, which is what the brief's Step 8 implies. |
| F5 | The Vite plugin copies `drizzle/**` into `dist/.openai/drizzle/**` during a production build, alongside the binding file. | D | Migrations are shipped as build output. Hand-written SQL in `drizzle/` is carried along with generated SQL. |
| F6 | The scaffolder offers add-ons: a database binding with Drizzle, an object-storage binding, sign-in helpers, and a component library. | D | Phase 3 takes the first and third. |
| F7 | The documented binding file is flat: `project_id`, `d1`, `r2`. | D | P3-4. The brief's nested form is wrong against current documentation. |
| F8 | Deployment has two stages: save a version, which builds a candidate, then deploy a version. For a local project the version is associated with the Git commit used for the build. | D | Gives a reproducible link from a deployed site back to a commit, which Phase 10 needs for the submission package. |
| F9 | The signed-in user's email and full name arrive as request headers, and the documentation says to keep authorization decisions in server-side code. | D | Phase 7 identifies users by email. No stable user identifier is documented. |
| F10 | No framework is named as supported. The documentation says only that "some frameworks" are unsupported, and tells the author to confirm that a project produces compatible deployment artifacts. | D | There is no list to comply with. Compatibility has to be derived from F1–F5. |
| F11 | The generated template uses Vinext, a Vite plugin that reimplements the Next.js interface on Web APIs, and its fetch handler is the Worker entry point. The template's dependency on Next.js itself was removed. | O | Stock Next.js is the thing to avoid, not the thing to copy. |
| F12 | A public Sites project's migration failed on deploy with `incomplete input: SQLITE_ERROR`. The fix was to add `--> statement-breakpoint` markers between table, index and trigger definitions, and to leave the semicolons inside trigger bodies alone. | O | This is the trigger hazard Phase 2 was warned about, and it has a known, cheap fix. §6.2 adopts it. |
| F13 | A published starter project puts the Worker entry in `worker/index.ts`, the schema in `db/schema.ts`, migrations in `drizzle/`, and treats committed migrations as immutable history. | O | Matches Phase 2's rule that an applied migration is never edited. §4.3 follows this layout. |
| F14 | An open issue reports a deployed site that could not be changed from owner-only to public. | O | P3-6: set the audience at creation and verify it immediately. |
| F15 | Whether a deployed site applies the shipped migration files automatically, and whether a deployed worker may run schema statements at runtime, is not documented. A public investigation into exactly this is open and has no findings yet. | O | The largest open risk in this phase. §12 R1 gives the detection and the fallback. |
| F16 | D1 is SQLite, and triggers, views and window functions are standard SQLite. Cloudflare does not state this for D1 specifically. | I | Low risk, but it is an inference, so SP-6 tests it on the real database rather than assuming it. |

### 2.3 Framework compatibility

Derived from F1–F5 and F10–F11, not from any list.

| Stack | Standing | Notes |
|---|---|---|
| Vinext and React on Vite 8 | **Officially generated.** OpenAI's own scaffolder produces it. | The safest choice, and the one adopted (P3-2) |
| React, Vue, Svelte or Solid on Vite 8, with a hand-written Worker entry | Technically compatible. No statement from OpenAI. | Workable, but the team would wire the Worker entry and migration packaging itself |
| Anything on an older Vite, or needing a build step other than Vite | Expect failure | F3 |
| Stock Next.js | Expect trouble | It brings its own build pipeline; the official template deliberately dropped it (F11) |
| Anything needing native Node modules, a database driver over raw TCP, or a long-running background process | Unsupported | F2, F3 |

Nothing here is called "supported by OpenAI", because OpenAI does not say so of any framework.

### 2.4 Still unverified, and where each is settled

| Open item | Settled by |
|---|---|
| Whether shipped migrations are applied automatically on deploy (F15) | SP-5, on the test Site, before the production Site exists |
| Whether triggers, views and window functions survive on D1 (F16, carried from Phase 2) | SP-6 |
| Whether the audience can be set as intended (F14) | SP-11, first thing after creation |
| ~~Which binding-file form the instructor expects~~ | **Closed.** The brief's form is explicitly conceptual (§5.2) |
| Which API keys exist as hosted secrets | Phase 6 |

### 2.5 Sources

| # | Source | Used for |
|---|---|---|
| S-P3-1 | ChatGPT Sites documentation, `learn.chatgpt.com/docs/sites` | F1, F2, F7, F8, F9, F10 |
| S-P3-2 | `github.com/openai/sites` | F3, F4 |
| S-P3-3 | `github.com/openai/sites`, scaffolder package | F6 |
| S-P3-4 | `github.com/openai/sites`, Vite plugin package | F5 |
| S-P3-5 | `github.com/cloudflare/vinext` | F11 |
| S-P3-6 | `github.com/openai/codex`, issue 36126 | F14 |
| S-P3-7 | `github.com/fukamu/notes`, pull request 253 | F12 |
| S-P3-8 | `github.com/j-256/d1-r2-starter-openai` | F11, F13 |
| S-P3-9 | `github.com/aotter/mantle`, issue 1192 | F15 |
| S-P3-10 | Help centre article, creating and using ChatGPT Sites | F14, §10 |

All retrieved October 6, 2026. Every one of these is a starting point, not a citable fact in the product: nothing from this section is shown to a user or given to the adviser.

---

## 3. Why a static site is not enough

The brief requires all five of these, and each needs code running on a server.

| Capability | Why it cannot run in the browser |
|---|---|
| Server-side execution | The AI call and the access checks must run where a user cannot alter them |
| Database persistence | Database access must not be exposed to the browser |
| Authentication | Identity has to be verified by the server |
| External APIs | Keys must stay secret |
| AI model calls | The same |

---

## 4. Creating the project (Step 6)

### 4.1 Prepare the repository

The working directory already holds `docs/`, the course brief as a PDF, and one HTML research page. All three are part of the submission and all three survive this phase.

1. `git init` in this directory.
2. Add a `.gitignore` covering `node_modules`, build output, local database files and any `.env`.
3. Commit the current contents as the starting point, so everything the build adds is visible as a diff. Sites ties a deployed version to the Git commit used for the build (F8), so this is also what makes SP-12 possible.

### 4.2 Scaffold

The application lands at the repository root:

```
npm create @openai/sites@latest . -- --yes --add-ons d1,auth
```

**The scaffolder refuses a directory that already has files in it**, reporting `Target contains existing files`. This was found on the first build attempt, October 6, 2026, not during the design pass. The approved route:

1. Scaffold into an empty temporary directory outside the repository.
2. Move the generated files into the repository root, alongside `docs/` and the source material.
3. Commit the generated files as their own commit, so the scaffolder's output is distinguishable from everything written afterwards.

**Never** empty, clear, delete or relocate `docs/`, the brief, or the research page to satisfy a tool. If the route above does not work, stop and report it rather than improvising; `docs/` is the specification and part of what is handed in.

The `d1` add-on creates the binding and the Drizzle setup; `auth` adds the sign-in helpers Phase 7 uses. The component-library add-on is not taken: Phase 5 needs tables and labels, not a component set to review.

### 4.3 The initial prompt

The brief's Step 6 prompt, with the Investment Case page appended per P3-5:

> Create an OpenAI Sites application called "Global Datacenter Design Explorer." Use a server-backed architecture with Cloudflare D1 persistent storage. The website should present an initial 20 MW datacenter design, compare three countries, display sourced energy and datacenter metrics, and provide a login-protected AI design adviser. Create pages for Overview, Country Comparison, Initial Design, Evidence, and Ask the Adviser, and an Investment Case page. Do not put API keys or database access in browser code.

The 20 MW in the brief's wording is the IT load. The facility load is 25 MW at a PUE of 1.25 (Phase 1 §8). Both numbers appear on the site; neither is typed into a page by hand (Phase 4).

### 4.4 Expected layout

```
data_center_proposal_site/
  .openai/hosting.json      binding declarations; project_id added by Sites
  db/schema.ts              Phase 2 tables, in TypeScript
  drizzle/
    0001_schema.sql         generated tables + hand-added rules, triggers, views
  drizzle.config.ts
  lib/db/                   the only module that touches the database (§8)
  app/ or pages/            the six routes (§7)
  worker/index.ts           Worker entry; left as generated
  vite.config.ts
  docs/                     these design documents
```

If the scaffolder produces a different arrangement, the layout follows the scaffolder and this section is corrected. Only two things are non-negotiable: migrations stay append-only files, and nothing outside `lib/db/` opens the database.

---

## 5. The database binding (Step 7)

### 5.1 The file

```json
{
  "project_id": "<written by Sites on first deploy>",
  "d1": "DB",
  "r2": null
}
```

Sites creates and manages the database itself. Application code refers only to the binding name `DB`. No password, host name or connection string exists anywhere in the project, which is constraint C2 satisfied by construction rather than by discipline.

### 5.2 The brief's form, and why it differs

| Source | Form |
|---|---|
| Brief, Step 7 | `{ "d1": { "binding": "DB" } }`, introduced with the word **"Conceptually"** |
| Platform documentation, October 6, 2026 | `{ "project_id": "…", "d1": "DB", "r2": null }` |

These do not conflict. The brief is showing what the file does — it names a binding, and the application refers only to `DB`, never to a password or a connection string — not dictating the file's shape. The documented form is used (P3-4), and it satisfies the brief's actual requirement. This section is kept so that a grader reading for the brief's illustration can see it was understood rather than overlooked.

---

## 6. Migration 0001 (Step 8)

### 6.1 How the file is produced

1. Write the Phase 2 tables in `db/schema.ts`: tables, columns, types, nullability, foreign keys, and the unique constraints.
2. Generate the SQL (`npm run db:generate`), producing `drizzle/0001_schema.sql`.
3. **Read the generated SQL against the Phase 2 listing.** Check table order, so that `sources` precedes `metrics`; check every foreign key, every default, and every nullable column.
4. Add by hand, into the same file, everything the generator cannot express:
   - the CHECK constraints, including the six claim types, the four roles, the confidence list, and the rules that a missing or zero value carries a note
   - the two triggers for each of the fifteen append-only tables in Phase 2 §4.1
   - the current-value views in Phase 2 §5, and the calculation registry's supporting views
   - any index from Phase 2 §6 the generator did not emit
5. Apply the whole file to a throwaway local database and run the Phase 2 rejection tests (DM-3 to DM-8, DM-15).
6. Deploy, and confirm on the real database (SP-5, SP-6).

Step 4 is the fragile step: regenerating from `db/schema.ts` overwrites the file and loses the hand-written parts. The rule is that `0001_schema.sql` is regenerated **only** before it has first been applied anywhere. After that it is history, and every change is a new file.

### 6.2 Statement boundaries

A public Sites project's deploy failed with `incomplete input: SQLITE_ERROR` because the migration was split into statements in the wrong places (F12). Trigger bodies contain semicolons, so a runner that splits on semicolons tears them in half. Two rules prevent it:

- A `--> statement-breakpoint` marker goes **between** statements, including between each table, each index, each view and each trigger.
- No marker ever goes **inside** a `BEGIN … END` body, and the semicolons in there are left exactly as written.

```sql
CREATE TABLE sources ( … );
--> statement-breakpoint
CREATE TRIGGER metrics_no_update BEFORE UPDATE ON metrics
BEGIN SELECT RAISE(ABORT, 'metrics is append-only: insert a new row'); END;
--> statement-breakpoint
CREATE TRIGGER metrics_no_delete BEFORE DELETE ON metrics
BEGIN SELECT RAISE(ABORT, 'metrics is append-only'); END;
```

A test applies every migration file, in order, to a fresh local database, and fails the build if any statement is rejected (SP-4). That test is what stops this reaching a deploy.

### 6.3 What is not in the migration

Seed data. Phase 4 loads the evidence separately. A migration that carries data cannot be re-run on an empty database without carrying assumptions with it, and the brief asks for the two to be separate.

### 6.4 Migration rules

- Once `0001` has been applied anywhere, including the test Site, it is never edited. Changes are `0002`, `0003`, and so on.
- Migrations are committed. The deployed version is tied to a commit (F8), so the database history and the code history can be read together.
- A migration is applied before the code that depends on it goes out. New code against an old database fails on its first insert; old code against a new database does not.

---

## 7. Routes

| Route | Page or endpoint | Access | Built in |
|---|---|---|---|
| `/` | Overview | Open to anyone | 5 |
| `/countries` | Country Comparison | Open to anyone | 5 |
| `/design` | Initial Design | Open to anyone | 5 |
| `/evidence` | Evidence | Open to anyone | 5 |
| `/investment` | Investment Case | Open to anyone | 5 |
| `/adviser` | Ask the Adviser | Page open to anyone; the conversation works only for a registered user | 5, 8 |
| `POST /api/register` | Create the user record | Signed in | 7 |
| `POST /api/ask` | Adviser | Registered | 8 |
| `POST /api/refresh` | External-data refresh | Editor or above | 6 |
| `POST /api/design` | Change a design assumption | Team admin | 5, 7 |
| `POST /api/roles` | Assign a role | Team admin | 7 |

In this phase every page renders a placeholder naming the phase that fills it, and every endpoint returns `501` with the same note. A route that exists and says "not built yet" is honest; a route that 404s looks like a defect in Phase 9.

---

## 8. The data-access boundary

One module, `lib/db/`, is the only code that touches the binding. Page and route files call named functions from it and never build SQL.

| Layer | May do | Must not do |
|---|---|---|
| Page files | Call query functions, render typed values | Import the database client, build SQL, read a secret |
| Route handlers | Check the role, call query or command functions | Build SQL inline |
| `lib/db/` | Open the binding, run the Phase 2 queries, enforce anything the database cannot | Format values for display |

This serves three purposes. It keeps the framework decision cheap to reverse, since a framework change rewrites page files only (the hedge F10 makes necessary). It satisfies constraints C2 and C4 structurally. And it gives the append-only rule somewhere to live if triggers turn out not to survive on D1 (§12, R2).

---

## 9. Environments

The brief asks for tests on "preview" and on "deployed". Sites documents neither a preview environment nor a staging one: saving a version builds a candidate, and deploying publishes it. Three environments stand in:

| Environment | What it is | Database | Used for |
|---|---|---|---|
| Local | `npm run dev` on a developer machine | Local file, reset freely | All development, the migration test, every destructive test |
| Test Site | A second Site, created in this phase | Its own, seeded with the Phase 4 seed | "Preview" in the brief's sense: deploy checks, Phase 6 refresh runs, the Phase 9 prompt-injection test |
| Production Site | The site whose link the committee opens | Its own, seeded once | The submission. Nothing is tested here that has not passed on the test Site |

The prompt-injection test (Phase 9) inserts hostile text into a source record. It runs on the test Site, never on the site the committee is reading.

Deploy flow for either Site: commit, save a version, check the build, deploy the version, then run the checks in §13 against the live URL.

---

## 10. Visibility and access

Two separate controls, easy to confuse, and FR1 depends on telling them apart.

| Control | Setting | Effect |
|---|---|---|
| Site audience | Anyone with the link | A committee member opens the site signed out and reads every page |
| In-app sign-in | On, used by `/adviser` and the write endpoints | A user signs in to ask the adviser or change anything |

A new Site is visible only to its owner by default, and there is an open report of a deployed site that could not be changed from owner-only afterwards (F14). So the audience is set at creation, and SP-11 checks it in a signed-out browser before any content work starts. If it cannot be changed, the Site is recreated immediately, while recreating costs nothing.

The consequence for Phase 7: pages stay open, and sign-in gates only the adviser and the write endpoints. The committee is never asked for an account.

---

## 11. Repository

```
data_center_proposal_site/        git initialized here
  docs/                           design documents, phases 1–10
  ai-datacenter-requirements.html earlier research page, content source for Phase 5
  <application, scaffolded at the root>
```

`.gitignore` must cover `node_modules`, build output, local database files and any `.env` file. Before the first push, the working tree is searched for anything resembling a key (SP-13). Nothing in this project needs a secret in a file: keys arrive as hosted secrets.

---

## 12. Risks and fallbacks

| # | Risk | How it shows up | Fallback |
|---|---|---|---|
| R1 | Shipped migrations are not applied to the deployed database automatically (F15) | SP-5 fails: the count route errors with "no such table" | Apply the migration as an explicit deploy step. If a deployed worker may not run schema statements either, the schema is applied from a local tool against the Site's database before the first deploy, and that step is written into Phase 10's release checklist |
| R2 | Triggers are rejected or silently dropped | SP-6 fails, or a later update succeeds that should have been refused | Move append-only enforcement into `lib/db/` (§8). Phase 2's DM-5 and DM-15 become tests of that layer, exactly as Phase 2 §10 anticipated |
| R3 | Views or window functions are rejected | SP-6 fails | Replace the views with query functions in `lib/db/`. The calculation registry is unaffected: it already computes in code |
| R4 | A regeneration from `db/schema.ts` wipes the hand-added SQL (§6.1) | The migration test fails, because the trigger tests stop passing | The test is the guard. Nothing deploys while it is red |
| R5 | The audience cannot be set to open (F14) | SP-11 fails | Recreate the Site before any content exists |
| R6 | The scaffolder produces a layout or framework this document did not anticipate | The first build fails, or the layout differs | Follow the scaffolder, correct §4.3, keep §8's boundary. Only page files are affected |
| R7 | Usage limits are reached mid-build, as the brief warns | Work stops | Keep scaffolding prompts short, and do schema and query work locally rather than through the model |

---

## 13. Acceptance criteria

Each is pass or fail. SP-1 to SP-4 run locally; SP-5 to SP-12 run against the test Site; SP-13 and SP-14 run before any push or deploy. Phase 9 references these IDs.

| ID | Criterion | Traces to |
|---|---|---|
| SP-1 | The project builds locally with Node 22.13 or later and Vite 8, with no network access to anything but the package registry | F3 |
| SP-2 | All six page routes render a placeholder, and all five endpoints return `501` with a note naming the phase that fills them | P3-5, §7 |
| SP-3 | `.openai/hosting.json` declares `d1` as `DB` in the documented flat form, and `r2` as null | P3-4, C2 |
| SP-4 | A test applies every file in `drizzle/`, in order, to a fresh empty database, and every statement succeeds. Removing a `--> statement-breakpoint` marker makes this test fail | F12, §6.2 |
| SP-5 | After a deploy, a server route running `SELECT COUNT(*) FROM countries` returns 0 rather than an error | F15, R1 |
| SP-6 | On the deployed database: an `UPDATE` on each of the fifteen append-only tables is rejected; each current-value view returns one row per key; the window function in the current-value views runs | Phase 2 DM-5, DM-15, F16 |
| SP-7 | Phase 2's DM-3, DM-4, DM-7 and DM-8 rejection tests pass against the deployed database | Phase 2 |
| SP-8 | Migration `0001` applies cleanly to a second, empty database, proving it is reproducible rather than patched into place | §6.4 |
| SP-9 | `drizzle/0001_schema.sql` contains every table, CHECK constraint, trigger, view and index listed in Phase 2, verified item by item against that document | Phase 2 §4–§6 |
| SP-10 | No seed row exists in any migration file | §6.3 |
| SP-11 | A signed-out browser, in a private window, opens every page route of the test Site and reads it | FR1, P3-6 |
| SP-12 | The deployed version is traceable to a Git commit, and that commit is in the repository | F8, Phase 10 |
| SP-13 | A search of the built browser bundle finds no key, token, connection string or SQL statement | C2, C4, Phase 2 DM-18 |
| SP-14 | No page file imports the database client; every database call goes through `lib/db/` | §8 |
| SP-15 | A second test Site exists, with its own database, and its URL is recorded in this document | P3-7, §9 |

---

## 14. Carried forward

| Item | Phase |
|---|---|
| Load the Phase 2 §7 seed into both Sites, re-verifying every Phase 1 value; write the query functions behind `lib/db/` | 4 |
| Fill the six pages, including the Investment Case page this phase created | 5 |
| Confirm which external API keys exist as hosted secrets; the refresh endpoint must be a call, not a background job (F2) | 6 |
| Identify users by email, since no stable identifier is documented (F9); keep pages open and gate only the adviser and the write endpoints | 7 |
| The adviser runs server-side on the Worker, within the limits in F2 | 8 |
| Run the destructive tests, including prompt injection, on the test Site only | 9 |
| Record the production URL, the deployed commit, and the answer to the binding-format question in the submission package | 10 |

Human review required: no part of this document is settled until the team has read it, and nothing in §2 should be quoted to a grader without re-checking the source, since the platform is four months old and changing.
