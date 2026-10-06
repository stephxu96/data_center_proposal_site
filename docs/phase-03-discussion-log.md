# Phase 3 discussion log

Companion to `phase-03-sites-project.md`. It records how the platform decisions were made, what the research changed, and what is worth saying to the committee. Written October 6, 2026.

"Team lead" means the project lead's own direction. "Analysis" means proposals and checks made during the session.

This phase was unusual: the brief describes a platform that is four months old, and three of the brief's instructions turned out not to match it.

---

## 1. Why this phase matters for the committee

The committee never sees this phase. What it sees is the consequence:

- **The site opens without an account.** That is a setting chosen deliberately in this phase, not a default. The default would have shown the site to nobody but its author.
- **The numbers the committee reads cannot be edited in place.** The rules that enforce that live in the database, and this phase is where they either survive the real platform or move into code.
- **What was deployed can be traced to what was written.** Each deployed version is tied to a commit, so a reviewer can ask "which version produced this page?" and get an answer.

## 2. Decisions and who made them

| # | Question | Options considered | Decision | Who |
|---|---|---|---|---|
| 3.1 | Where the project is built | **Local repository with deployment through the app**; built entirely in the app | Local repository, one repository with the documents | Team lead |
| 3.2 | What identifies a user, given that no stable identifier is documented | Design around the email header; **follow the brief and treat sign-in as a course requirement** | Follow the brief; the authentication layer is not where this project's value is | Team lead |
| 3.3 | How append-only is enforced, given the known trigger problems | Move enforcement into code; **keep the triggers the brief's tooling implies** | Keep triggers; handle the problems rather than redesign around them | Team lead |
| 3.4 | What stands in for a preview environment | **Local development plus a second test Site**; test on production; local only | Local plus a test Site | Team lead |
| 3.5 | How migration 0001 is authored | **Generated tables plus hand-added SQL**; raw SQL only; generated only, dropping triggers | Generated plus hand-added, so Step 8 is satisfied literally and Phase 2 survives intact | Team lead |
| 3.6 | Which stack to commit to | **The official scaffolder with database and sign-in add-ons**; the same plus a component library; a hand-built project | The scaffolder, with database and sign-in | Team lead, after the research in 3.7 |
| 3.7 | How to settle the framework question at all | Accept "no published list" and stay neutral; **derive compatibility from the runtime's stated requirements** | Research the requirements, then recommend | Team lead (this overturned the analysis's proposal to stay framework-neutral) |
| 3.8 | Where PS3's economics content lives | **A sixth page, scaffolded now**; spread across two existing pages | A dedicated Investment Case page. This also settles the open decision carried since Phase 1 | Team lead |
| 3.9 | Which binding-file format to use | Follow the brief literally; **use the documented form** | Documented form. Reading the brief directly then closed the question: it introduces its version with the word "Conceptually", so there was never a conflict | Team lead (this reversed the analysis's earlier recommendation) |

## 3. Discoveries

| # | Discovery | Consequence |
|---|---|---|
| 3.1 | "No published list of supported frameworks" was the wrong question. The platform publishes something more useful: its build environment. Node 22.13 or later, Vite 8, two official packages, and a scaffolder whose generated template uses Vinext on Vite. | The stack was decided from requirements rather than guessed. Nothing in the design claims official support for a framework, because the platform grants none. |
| 3.2 | The brief's binding-file format does not match the platform's documentation. Going back to the brief's own wording settled it: it says "Conceptually: `{ "d1": { "binding": "DB" } }`", which illustrates what the file does rather than specifying its shape. | The documented form is used, and it meets the brief's actual requirement — the application refers only to a binding name and never to a password or connection string. No instructor question needed. |
| 3.3 | The trigger problem is real, has been hit in public, and has a cheap fix. A deployed project failed with `incomplete input: SQLITE_ERROR` because the migration was split into statements inside a trigger body. The fix is marker comments between statements and never inside one. | The decision to keep triggers survives, with a rule and a test instead of a redesign. The test applies every migration to a throwaway database before anything deploys. |
| 3.4 | Nobody has publicly established whether a deployed site applies its shipped migrations automatically. An investigation into exactly this question is open and has no findings. | This is now the largest risk in the phase. It has a detection (a count query that must return zero, not an error) and a fallback (apply the schema explicitly before the first deploy). |
| 3.5 | A deployed site has been reported stuck as owner-only. | The audience is set at creation and checked signed-out immediately, while recreating the site still costs nothing. This is what FR1 depends on. |
| 3.6 | Raw TCP, private networks and background services are unsupported. | Phase 6's refresh cannot be a scheduled background job. It is an endpoint that something calls, which the design already assumed but had not justified. |
| 3.7 | Every deployment is production. There is no preview. | "Preview" in the brief maps to local development plus a second Site. The prompt-injection test in Phase 9 now has somewhere to run that is not the committee's copy. |
| 3.8 | The platform documents the signed-in user's email and full name as request headers, and no stable identifier. | Phase 7 identifies users by email. Recorded as a platform limit rather than a design choice, so a reviewer can see why. |
| 3.9 | The sign-in helpers are an add-on to the scaffolder. | Taking them in Phase 3 means Phase 7 configures sign-in rather than building it. |
| 3.10 | A classmate's repository for this same problem set is public. | Noted and left to the team lead. Nothing from it is used. |
| 3.11 | **Found during the first build attempt, not the design pass.** The scaffolder refuses to run in a directory that already contains files, reporting `Target contains existing files`. The design had assumed it would scaffold alongside `docs/`. | The specification was revised rather than worked around: scaffold into a temporary directory and move the files in, and never clear the directory to satisfy a tool. This is the first case of the build correcting the design, which is what the standing rule about stopping rather than improvising is for. |

## 4. Verification done in this phase

Nothing was built. The verification here was documentary: ten sources were read, and every finding in the design document is marked as documented by the platform, observed in a public project, or inferred.

Three findings are inferences and are flagged as such, including the one Phase 2 left open: that D1, being SQLite, supports the triggers, views and window functions the schema uses. Standard SQLite supports all three, and Cloudflare does not say otherwise, but it does not say so either. The design document turns it into a test on the real database (SP-6) instead of an assumption.

**Still to confirm:** whether migrations are applied on deploy, whether triggers survive, whether the audience setting holds, and which binding format the instructor expects.

## 5. For the memo and presentation

### 5.1 Points to use

1. **The platform was researched, not assumed.** Three of the brief's own instructions did not match the platform as it currently works. Each was checked against documentation, a decision recorded, and the discrepancy written down rather than quietly patched.
2. **Known failures were designed against, not discovered later.** The migration failure that a public project hit is prevented by a rule and a test that runs before every deploy.
3. **The rules the committee is relying on get tested on the real database.** The claim "these numbers cannot be quietly edited" is only worth making if the enforcement survives deployment, so it is an acceptance criterion, with a fallback if it does not.
4. **Nothing is tested on the committee's copy.** A second Site carries the destructive tests, including feeding the adviser hostile text.

### 5.2 Likely questions

| Question | Answer in brief |
|---|---|
| Why not follow the brief exactly on the configuration file? | We do follow it. The brief describes the file conceptually; the platform's current documentation gives its literal shape. Both say the same thing: a binding name, and no credential in the code. |
| What if the platform changes again? | It is four months old, so it will. The database layer is isolated behind one module, so a framework change touches page code only, and every platform assumption is labelled with how it was established. |
| How do you know the framework is supported? | We do not, and the design does not claim it. The platform names no supported framework. We use the stack its own scaffolder generates, which is the closest thing to a supported path that exists. |
| What happens if the database rules cannot be enforced on the platform? | The same rules move into the data-access layer, and the Phase 2 tests move with them. The guarantee to the committee does not change; where it is enforced does. |
| Why a sixth page? | The brief lists five. The investment case, the stress cases and the recommendation are what the committee actually decides on, and they needed one place to live. |

## 6. Open items carried forward

| Item | Phase |
|---|---|
| Confirm migrations are applied on deploy; confirm triggers, views and window functions on the real database | 3, at first deploy |
| ~~Binding-file format question~~ | **Closed** by re-reading the brief |
| Load the seed into both Sites and write the query functions | 4 |
| Confirm which API keys exist as hosted secrets; the refresh must be a call, not a scheduled job | 6 |
| Identify users by email; keep pages open and gate only the adviser and the write endpoints | 7 |
| Record the production URL, the deployed commit and the binding-format answer | 10 |
