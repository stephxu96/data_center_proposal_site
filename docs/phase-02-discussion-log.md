# Phase 2 discussion log

Companion to `phase-02-data-model.md`. It records how the data-model decisions were made and what was found, for use in the investment memo, the presentation, and the individual architecture explanation. Written October 6, 2026.

"Team lead" means the project lead's own direction. "Analysis" means proposals and checks made during the session.

---

## 1. Why this phase matters for the committee

The committee's question is "can we trust these numbers?". This phase decides the answer structurally:

- **Every value carries its type and its source.** A reader can always tell a reported fact from a chosen assumption or a computed result.
- **Nothing is overwritten.** Every change leaves a record, so the committee can see what a number was before and why it changed.
- **The AI cannot make up a number.** Calculated values are not stored at all; code computes them every time they are shown.

## 2. Decisions and who made them

| # | Question | Options considered | Decision | Who |
|---|---|---|---|---|
| 2.1 | How to extend the brief's six-table schema | Keep the brief's schema as migration 0001 and add a second migration; **one designed schema**; brief tables only | One designed schema, with every departure from the brief listed | Team lead (the analysis had recommended the two-migration option) |
| 2.2 | How to model places | **Countries + sites + demand regions**; countries only; one generic "places" table | Three tables; latency stored per site × demand region | Team lead |
| 2.3 | How to store the site comparison | **Dedicated scoring tables**; as generic metrics and claims; final results only | Dedicated tables; the weighted score is computed in code | Team lead |
| 2.4 | FR8 says "estimates", but the brief's type list has no estimate | **Add a sixth type**; treat as assumption; treat as low-confidence fact | Six types | Team lead |
| 2.5 | What happens to old values | **Append-only**; overwrite plus a history table; overwrite only | Append-only; the newest valid row is current | Team lead |
| 2.6 | Are a visitor's what-ifs saved? | **Not saved; named scenarios stored**; users can save scenarios; only the three required scenarios | Not saved; base and stress cases stored as overrides | Team lead |
| 2.7 | How claims link to evidence | **Many-to-many**; one source, with other inputs in text | Many-to-many | Team lead |
| 2.8 | Are calculated results stored? | **Store formula, compute live**; store snapshots too | Formula only; computed every time | Team lead |
| 2.9 | How committee decisions are stored | One vote per member plus outcome; **single committee outcome**; votes only | Single outcome per decision round | Team lead (the analysis had recommended per-member votes) |
| 2.10 | How lender evidence status is set | **Computed from linked claims**; set by an editor; computed with an override | Computed | Team lead |
| 2.11 | Multiple teams on one site? | **Single team, keep team_id**; multiple teams | Single team | Team lead |
| 2.12 | Where walkthrough and policy text lives | **Structured steps in the database**; page text in code; markdown documents | Structured steps; numbers appear only through claim placeholders | Team lead |

The analysis made these engineering choices to fit the decisions above:

- allowed values enforced by the database
- append-only enforced by triggers
- ISO 8601 UTC timestamps
- logs for refreshes and AI requests
- a source `excerpt` field for the adviser

## 3. Discoveries

| # | Discovery | Consequence |
|---|---|---|
| 3.1 | The brief's schema stores IT load and PUE as columns on `designs`. Editing them would overwrite history, which breaks the brief's own test "change the PUE, and both the calculation and the answer change" if we also want to show what changed. | Moved to an append-only `design_parameters` table. Listed as a departure from the brief, with the reason. |
| 3.2 | The brief's `metrics.country_id` is required, but latency (site → demand region) and demand shares (per region) have no country | Made it optional, with a rule that every metric has at least one subject |
| 3.3 | The brief's FR8 and its `claim_type` list disagree: FR8 says "estimates", the list has no estimate | Added `estimate`, matching FR8. Several Phase 1 values, such as the latency figures and the site scores, are honestly estimates, not facts. |
| 3.4 | The brief's `idx_users_authenticated_id` duplicates the index that the UNIQUE constraint already creates | Dropped; noted for graders |
| 3.5 | "Store formula, compute live" can be enforced by the database itself: a calculation claim **cannot** hold a value | Makes constraint C7 (the AI never produces numbers) structurally true, not just a coding rule |
| 3.6 | Append-only needs a way to correct mistakes | Corrections are new rows that supersede old ones. "Current" views hide superseded rows. A `stale_claims` view flags claims whose evidence has been refreshed. |
| 3.7 | The brief's prompt-injection test needs malicious text inside a source record | Sources now have an `excerpt` field: the text the adviser reads, and the target of that test. Because sources are append-only, the test row is superseded afterwards rather than deleted. |

## 4. Verification done in this phase

The schema SQL was loaded into a scratch SQLite database. Nothing was written to the project. All 27 tables were created.

These attempts were **rejected**, as designed:

- a missing value without a note
- a zero without a note
- an update to an append-only table
- an unknown claim type
- a calculation stored with a value, or without a function name
- a fact without a source
- a link pointing at two targets at once
- an invalid role

After a second carbon-intensity row was inserted, the current-value view returned the newer value, and the older one stayed in the table.

**Still to confirm:** that Cloudflare D1 supports the triggers, views and window functions used here. This is carried to Phase 3. If any are missing, the same rules move into the data-access layer as tests.

## 5. For the memo and presentation

### 5.1 Points to use

1. **Every number is labelled.** Fact, estimate, assumption, calculation, decision, or unknown, and a reader can click through to the source.
2. **The record cannot be quietly rewritten.** Every change is a new entry with a time and an author. The committee can audit how the recommendation evolved, including the Phase 1 reversal from Helsinki to Texas.
3. **The site comparison is live, not a screenshot.** Weights and scores are data. Changing a weight re-runs the ranking in code.
4. **Lender readiness is computed, not asserted.** Whether each funding stage's evidence exists is derived from the evidence itself.

### 5.2 Likely questions

| Question | Answer in brief |
|---|---|
| Why depart from the brief's schema? | Each departure serves a stated requirement, and all are listed in one table (§8 of the design doc). The brief calls its schema "a manageable initial schema", not a fixed one. |
| Why not store calculated results? | A stored result can go stale when an input changes. Computing every time guarantees the page and the adviser always agree with the inputs. |
| What stops someone editing a number to improve the result? | Values can't be edited, only superseded. Every change records who made it and when, and only admins can change design assumptions (Phase 7). |
| Why "estimate" as its own type? | Many inputs, such as latency from city pings and the site scores, are inferred, not reported. Calling them facts would overstate certainty. |

## 6. Open items carried forward

| Item | Phase |
|---|---|
| Confirm D1 support for triggers, views and window functions | 3 |
| Load the seed and re-verify every Phase 1 value; write the data-access functions | 4 |
| Implement the calculation registry; define the economics parameters and stress-case overrides | 5 |
| Permissions per role, including `committee` | 7 |
