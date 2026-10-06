# Handover prompts for Codex

The design pass produced specifications, not code. These are the prompts that hand each one to Codex. Written October 6, 2026.

Rules of use:

- **One phase followed by validation against the brief .** The brief builds in layers for a reason, we need to go phase by phase and build in HITL validation steps.
- **Paste the standing rules every time.** They are repeated in each prompt below rather than assumed.
- **Phases 7–10 are not specified yet.** Their prompts are outlines, not ready to paste.

**Which Codex you are in matters.** Codex in ChatGPT web or the desktop app creates the Site, provisions the binding, saves versions and deploys: the documentation's own example is *"Deploy this project with Sites. Check whether it is compatible, make any required changes, and give me the deployment URL."* Codex CLI in a terminal cannot — *"Sites doesn't have a standalone Codex CLI management view"* — it edits and tests the local project, and the publishing happens in the app. Prompt 1 is written for the app. In the CLI, drop the deploy step and everything after SP-4, and finish the session in the app.

**The audience is yours to set and check.** The documentation describes it as something you set in the Sites view, not an agent action, and advises keeping a new Site owner-only until the content has been reviewed. For this project the committee must open the site signed out (FR1), so set it before sharing the link and confirm it in a signed-out browser window. A deployed Site has been reported stuck as owner-only, so confirm it early, while recreating costs nothing (Phase 3 §10).

---

## Prompt 1 — Phase 3: project, binding, schema

```text
You are building a website for a university engineering assignment. A complete
engineering specification already exists in this repository. Your job is to
execute it, not to redesign it.

READ FIRST, in this order:
  docs/00-overview.md             what the project is and how the phases fit
  docs/phase-03-sites-project.md  your task this session, in full
  docs/phase-02-data-model.md     the schema you will implement (sections 4-6)
  docs/phase-01-define-website.md sections 4 and 5 only: requirements and constraints

THIS SESSION: Phase 3 only. Create the Sites project, bind the database, and
author and apply migration 0001. Do not start Phase 4. Do not load any data.
Stop when the Phase 3 acceptance criteria SP-1 to SP-15 are met or blocked.

STEP 0, BEFORE ANYTHING ELSE. The working directory is NOT yet a git
repository, and it is NOT empty. It currently holds docs/, the course brief as
a PDF, and one HTML research page. All three must survive.
  a. Run git init, add a .gitignore covering node_modules, build output, local
     database files and any .env, and commit the current contents as the
     starting point. Everything you do afterwards must be visible as a diff.
     Sites ties a deployed version to the git commit used for the build, so
     without this there is no traceability from the live site back to the code.
  b. Then scaffold. If the scaffolder refuses to run in a non-empty directory,
     scaffold into a temporary directory and move the generated files in
     alongside what is already here.
  c. DO NOT delete, move, rename or empty docs/, the PDF, or the HTML file, and
     do not clear the directory to make a tool happy. docs/ is the
     specification and part of the submission. If a tool demands an empty
     directory and (b) does not work, STOP and report it.

PLATFORM FACTS, verified 2026-10-06. If any turns out to be wrong, stop and
report rather than working around it:
  - Sites runs on Cloudflare Workers. Node 22.13+, Vite 8.
  - Scaffold with: npm create @openai/sites@latest . -- --yes --add-ons d1,auth
    Run it in the repository root. docs/ stays where it is.
  - .openai/hosting.json uses the flat form: {"project_id": ..., "d1": "DB",
    "r2": null}. project_id is written by Sites; never hand-edit it.
  - Migrations live in drizzle/ and are packaged into dist/.openai/drizzle/ by
    the official Vite plugin.
  - There is no preview environment. Every deployment is production.
  - Raw TCP, private networks and background services are unsupported.

STANDING RULES. These apply to every session on this project, not just this one:
  1.  No credential ever enters the repository, a log, an error message or the
      browser bundle. Keys are hosted secrets, referred to by name only.
  2.  No SQL outside lib/db/. Pages and route handlers call named functions.
  3.  Prepared parameters only. Never build a query by string concatenation.
  4.  An applied migration is never edited. A change is a new numbered file.
  5.  Put "--> statement-breakpoint" between statements, and never inside a
      trigger's BEGIN ... END body. Getting this wrong fails the deploy with
      "incomplete input: SQLITE_ERROR".
  6.  The append-only tables listed in docs/phase-02-data-model.md section 4.1
      reject UPDATE and DELETE. Do not relax this to make something easier.
  7.  No number is ever typed into a page or a template.
  8.  A value that is not established is NULL with a note. Never 0, never blank.
  9.  Seed data never goes inside a migration.
  10. If the specification and the platform disagree, STOP and report it. Do not
      improvise a workaround and do not quietly change the spec.
  11. Add no dependency beyond what the scaffolder installs without saying why.

WHAT TO PRODUCE:
  - The scaffolded project at the repository root.
  - .openai/hosting.json as above.
  - db/schema.ts holding the Phase 2 tables, columns, types, nullability,
    foreign keys and unique constraints.
  - drizzle/0001_schema.sql: the generated tables, then added by hand, in the
    same file: the CHECK constraints, the two append-only triggers for each of
    the fifteen tables, the current-value views, and any index the generator
    did not emit. Follow docs/phase-03-sites-project.md section 6.1 step by step.
  - A test that applies every file in drizzle/ in order to a fresh empty
    database and fails if any statement is rejected.
  - Six page routes rendering a placeholder that names the phase which fills
    them, and five endpoints returning 501 with the same note. Routes are listed
    in docs/phase-03-sites-project.md section 7.
  - lib/db/ with the module boundary described in section 8, even though it is
    nearly empty at this stage.
  - The Site itself: create it, provision the D1 binding, save a version and
    deploy it. Report the deployment URL. Then create the second test Site
    described in section 9, with its own database, and report that URL too.
    Tell me what, if anything, you could not do yourself and I will do it in
    the Sites view.

BEFORE YOU CALL IT DONE, work through SP-1 to SP-15 in section 13 of the Phase 3
document and report each as pass, fail or blocked, with evidence. SP-9 in
particular means checking the generated SQL item by item against Phase 2, not
assuming the generator got it right.

REPORT AT THE END:
  1. What you did, briefly.
  2. SP-1 to SP-15, each pass, fail or blocked, with the evidence for each.
  3. Anything in the specification that was wrong, impossible or ambiguous.
     This matters more than finishing. The specification is four days old and
     the platform is four months old.
  4. Anything you changed that the specification did not ask for, and why.
```

---

## Prompt 2 — Phase 4: the seed

Same preamble and standing rules. Reads `docs/phase-04-seed-data.md` in full, plus Phase 1 section 7 for the evidence it loads.

Produces `seed/data/*.json`, the schemas, `seed/generate.ts`, the generated SQL, and the apply step. Definition of done is SD-1 to SD-14.

Two things to stress in that prompt: the generator's sixteen validations are the deliverable as much as the data is, and **Codex must not invent an evidence value**. Where a data file needs a figure nobody has verified, it stops and lists what it needs. Every value in this seed is an assertion to an investment committee, and a plausible invented number is the worst possible output.

---

## Prompt 3 — Phase 5: the interface

Same preamble. Reads `docs/phase-05-interface.md` in full.

Largest session by far; consider splitting it: the calculation registry and the economics model first, the seven pages second, the content and the diagram third. Definition of done is UI-1 to UI-22.

---

## Prompt 4 — Phase 6: external sources

Same preamble. Reads `docs/phase-06-external-sources.md` in full. Definition of done is EX-1 to EX-14.

Stress that the endpoint takes no URL from the caller, and that an upstream failure is a 200 with a failed run, not a 500.

---

## Prompts 5 to 8 — Phases 7 to 10

Not written. Those phases have not been specified yet.

---

## When Codex reports a problem with the specification

Expect it, and treat it as the useful output. The specification was written from documentation and public sources, not from a running Site. Phase 3's section 2.4 lists what is unverified, and Phase 6 R1 names the most likely surprise.

The answer is to update the design document and then re-run, not to let the code and the document drift. The documents are the submission, alongside the site itself.
