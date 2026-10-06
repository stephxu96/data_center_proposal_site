# Phase 4: Load and verify the initial data

Brief reference: Steps 9–10 (pages 13–14)
Depends on: Phase 1 §7 (the evidence and the scores), Phase 2 (the schema and §7 seed mapping), Phase 3 (the data-access boundary and the migration rules)
Feeds: Phase 5 (every page), Phase 6 (refresh writes into the same tables), Phase 8 (the adviser reads only what is loaded here), Phase 9 (the tests run against this data)
Status: complete for review, October 6, 2026

This phase loads a dataset a person has checked, **before** any live API is connected, so that live data in Phase 6 lands on a baseline that is already trusted.

This document is written to be executed. It specifies the file layout, the shape of every data file, what the generator does, the exact order the rows are inserted in, the identifier scheme, the verification procedure, the data-access functions with their signatures, and the pass/fail tests. Nothing here is built by the design pass; it is the instruction set for whoever builds it.

---

## 1. Decisions made in this phase

| # | Topic | Decision | Reason |
|---|---|---|---|
| P4-1 | How the seed reaches the database | **Reviewable data files in `seed/data/*.json`; a generator emits numbered SQL into `seed/sql/`; the SQL is applied as a step separate from the migration.** | The evidence stays diff-able and checkable by a person. The apply step works whether or not the platform applies shipped files itself (Phase 3 F15). The brief requires seed data to be separate from migrations. |
| P4-2 | What happens if the seed runs twice | **Deterministic identifiers on every row, plus a guard row in `seed_runs`.** A second run finds the marker and exits without inserting. | The evidence tables are append-only (P2-5), so a second run would otherwise create a duplicate that looks like a newer value. Stable identifiers also let tests and citations reference exact rows. |
| P4-3 | Scope | **Places, sources, metrics, design parameters, design claims, and the full site selection** (criteria, weights, assessments and their rationale claims). Narratives, scenario overrides, lender evidence gates and the economics are authored in Phase 5. | This is exactly the data Phase 2's tests DM-9 to DM-11 need to reproduce the Phase 1 result. Narrative content is writing, not evidence, and belongs with the pages. |
| P4-4 | Currency | **Converted to USD on load.** The published figure, its original currency, the rate and the rate's date are recorded in `metrics.notes`, and each rate is also stored as a metric and cited by an assumption claim. | One unit across the comparison page. The conversion stays auditable, which FR14 requires: a committee member can see the published number and the rate used. |
| P4-5 | Who verified a value | **A role and a date, not a personal name**: `verified_by` records `team-lead`, `analyst-1`, and so on, with the mapping kept outside the repository. | The repository is submitted and may be public. The brief's requirement is that a person checked the source, which a role and date satisfy. |
| P4-6 | What "latest" means | **The newest `retrieved_at` for a given subject and metric**, with ties broken by the higher row identifier. Older rows stay as history. | Phase 2's current-value views already work this way; this phase states the tie-break so a reseed cannot produce an ambiguous current value. |

Settled without a separate decision:

- Every query uses prepared parameters. No value is ever pasted into a SQL string.
- The unit list from §5.2 is closed: the generator rejects a unit that is not on it.
- Any value that is not established is `NULL` with a note giving the reason. Zero is never used for a missing value.
- Seed SQL is committed. It is build output, but reviewers need to read it, and Phase 10 needs it reproducible.

---

## 2. Scope

| Loaded in this phase | Table | Approx. rows |
|---|---|---|
| United States, Canada, Finland | `countries` | 3 |
| Texas (Dallas), Québec (Montréal), Helsinki | `sites` | 3 |
| The seven demand regions | `demand_regions` | 7 |
| Sources S1–S62 and the course brief | `sources` | 63 |
| The metric vocabulary | `metric_definitions`, `units`, `parameter_definitions` | 18 + 11 + 4 |
| Demand by region, latency, prices, carbon, climate, water, reliability, research base, lease capacity, exchange rates, and the not-established values | `metrics` | ~81 |
| One team, one design, and the selected site pointer | `teams`, `designs` | 1 + 1 |
| IT load, PUE, operating hours, latency threshold | `design_parameters` | 4 |
| Gates G1–G3 and criteria K1–K11 with their rubrics | `criteria` | 14 |
| The weights, with their rationale | `criterion_weights` | 11 |
| 33 scores and 9 gate results | `site_assessments` | 42 |
| Calculations, estimates, assumptions, design decisions, unknowns, compliance notes, reversal triggers | `design_claims` | ~67 |
| Every claim's evidence | `claim_links` | ~120 |
| Base case and the two stress cases, headers only | `scenarios` | 3 |

**Not loaded in this phase**, and why: scenario overrides, the failure walkthroughs, the grid-impact view, the access rules and the lender evidence gates are content written in Phase 5; `refresh_runs` rows appear in Phase 6; `users` and `ai_requests` fill at runtime in Phases 7 and 8. The three scenario headers are seeded because the pages in Phase 5 need something to attach overrides to.

Total: roughly 420 rows.

---

## 3. The seed pipeline

### 3.1 File layout

```
seed/
  data/
    places.json              countries, sites, demand regions
    sources.json             S1–S62 and the brief
    vocabulary.json          units, metric definitions, parameter definitions
    metrics.json             every measured value
    design.json              team, design, parameters, scenarios
    criteria.json            gates, criteria, rubrics, weights
    assessments.json         scores, gate results, rationale text
    claims.json              claims that are not generated from assessments
  schema/                    JSON Schema for each data file, used by the validator
  generate.ts                reads data/, validates, writes sql/
  sql/
    0001_vocabulary.sql
    0002_places.sql
    0003_sources.sql
    0004_metrics.sql
    0005_design.sql
    0006_selection.sql
    0007_claims_and_links.sql
    0008_seed_marker.sql
  README.md                  how to run it, and what to do when a value changes
```

### 3.2 Data file format

Every file is an object with a `seed_version` and an array of records. Every record carries its own identifier.

```json
{
  "seed_version": "seed-2026-10-06",
  "sources": [
    {
      "id": "S51",
      "publisher": "International Energy Agency",
      "title": "Energy and AI",
      "url": "https://example.org/report#table-3",
      "published_on": "2026-04",
      "accessed_at": "2026-10-06T00:00:00Z",
      "excerpt": "Data centres consumed an estimated 415 TWh in 2024...",
      "verified_by": "team-lead",
      "verified_at": "2026-10-06"
    }
  ]
}
```

A metric record:

```json
{
  "id": "M-US-price-2025",
  "metric": "industrial_electricity_price",
  "subject": { "kind": "country", "id": "US" },
  "value": 78.4,
  "unit": "USD/MWh",
  "reporting_period": "2025",
  "claim_type": "fact",
  "confidence": "medium",
  "source_id": "S30",
  "retrieved_at": "2026-10-06T00:00:00Z",
  "notes": "Published as 69.4 EUR/MWh; converted at 1 EUR = 1.13 USD (M-FX-EUR-USD, Eurostat 2025 average). Industrial band ID; excludes recoverable VAT.",
  "verified_by": "team-lead",
  "verified_at": "2026-10-06"
}
```

A record whose value is not established:

```json
{
  "id": "M-TX-connect-months",
  "metric": "grid_connection_months",
  "subject": { "kind": "site", "id": "SITE-TX" },
  "value": null,
  "unit": "months",
  "reporting_period": "2026",
  "claim_type": "unknown",
  "confidence": "low",
  "source_id": null,
  "retrieved_at": "2026-10-06T00:00:00Z",
  "notes": "Not established. The utility publishes no standard timeline for a 25 MW connection; a written estimate is condition 1 of the Phase 1 decision.",
  "verified_by": "team-lead",
  "verified_at": "2026-10-06"
}
```

`subject.kind` is one of `country`, `site`, `demand_region`, or `site_to_region`. For `site_to_region`, `subject` carries both `site_id` and `region_id`.

### 3.3 The generator

`seed/generate.ts` is a build-time script. It does not run on the platform and never touches a live database. It:

1. Reads every file in `seed/data/`.
2. Validates each against its schema in `seed/schema/` and against the rules in §9. **Any failure stops the run; nothing is written.**
3. Resolves names to identifiers: metric names to `metric_definitions`, units to `units`, country and site codes to their rows.
4. Emits the eight SQL files in §3.1, each statement separated by `--> statement-breakpoint` per Phase 3 §6.2.
5. Writes `seed/sql/0008_seed_marker.sql` last, containing the guard row.
6. Prints a row count per table, which a reviewer compares with §2.

Run with `npm run seed:generate`. The generated SQL is committed in the same commit as the data change, so a reviewer sees both halves of a change together.

### 3.4 Generated SQL

Insert order is fixed, because foreign keys are enforced:

`units` → `metric_definitions` → `parameter_definitions` → `countries` → `sites` → `demand_regions` → `sources` → `metrics` → `teams` → `designs` → `design_parameters` → `scenarios` → `criteria` → `criterion_weights` → `design_claims` → `site_assessments` → `claim_links` → `seed_runs`

`designs.selected_site_id` is **not** set by `0005_design.sql`. It is set at the end of `0007_claims_and_links.sql`, in the same statement group as the insert of the `design_decision` claim that records the selection, per Phase 2 §4.1.

Every statement is a plain `INSERT` with explicit column names and literal values. No statement updates or deletes anything, so nothing in the seed can trip the append-only triggers.

### 3.5 The guard

```sql
CREATE TABLE IF NOT EXISTS seed_runs (
  seed_version TEXT PRIMARY KEY,
  applied_at   TEXT NOT NULL
);
--> statement-breakpoint
INSERT INTO seed_runs (seed_version, applied_at)
VALUES ('seed-2026-10-06', '2026-10-06T00:00:00Z');
```

`seed_runs` is created by migration `0001`, not by the seed; the `CREATE TABLE IF NOT EXISTS` above is defensive only. The apply step in §3.6 checks the marker before running anything.

A later correction is a **new** seed version with its own files and its own marker, inserting superseding rows as Phase 2 §4.2 describes. A seed is never edited after it has been applied anywhere, for the same reason a migration is not.

### 3.6 Applying the seed

```
npm run seed:apply -- --target local        # the developer's database
npm run seed:apply -- --target test-site    # the Phase 3 test Site
npm run seed:apply -- --target production   # once, before the committee is given the link
```

The apply step, in order:

1. Reads `seed_runs`. If the version is already present, prints the applied date and **exits 0 without inserting**.
2. Checks that migration `0001` has been applied, by querying for a known table. If it is missing, exits non-zero with an instruction, never by creating tables itself.
3. Applies `0001_vocabulary.sql` to `0008_seed_marker.sql` in order, in one transaction where the target supports it.
4. Runs the read-back checks in §11 (SD-7 to SD-10) and prints a pass or fail line for each.

---

## 4. Identifier scheme

Deterministic, human-readable, and stable across reseeds. This is what makes P4-2 work, and what lets a test or a citation name an exact row.

| Kind | Form | Example |
|---|---|---|
| Country | ISO code | `US`, `CA`, `FI` |
| Site | `SITE-<code>` | `SITE-TX`, `SITE-QC`, `SITE-HEL` |
| Demand region | `DR-<code>` | `DR-US-EAST`, `DR-EUROPE`, `DR-CN` |
| Source | The Phase 1 identifier | `S51` |
| Metric | `M-<subject>-<metric>-<period>` | `M-US-price-2025` |
| Latency metric | `M-<site>-<region>-rtt` | `M-TX-DR-EUROPE-rtt` |
| Criterion | The Phase 1 identifier | `K10`, `G1` |
| Assessment | `A-<site>-<criterion>` | `A-TX-K10` |
| Claim | `C-<topic>-<n>` | `C-selection-01`, `C-calc-facility-load` |
| Parameter | `P-<name>` | `P-it-load-mw` |

Identifiers are text primary keys where Phase 2 allows it, and are otherwise written into a `seed_key` column so a row can be found again. Nothing in the application displays an identifier except the source citations, which use the `[S<id>]` form Phase 2 fixed for the adviser.

---

## 5. What every record must carry (brief Step 9)

### 5.1 Required fields

| Field | Column | Rule |
|---|---|---|
| Value | `metrics.value` | A number, or `NULL` when not established. **Never 0 for a missing value.** |
| Unit | `metrics.unit` | From §5.2, enforced by the `units` table |
| Reporting period | `metrics.reporting_period` | `2025`, `2025-Q2`, `2026-04`. Required even when the value is NULL |
| Publisher | `sources.publisher` | The organization, not the website's name |
| Source URL | `sources.url` | A deep link to the table or page, not a homepage |
| Retrieval date | `metrics.retrieved_at`, `sources.accessed_at` | ISO 8601, UTC |
| Definition note | `metrics.notes` | What the number counts and excludes, in a sentence |
| Confidence | `metrics.confidence` | `high`, `medium` or `low`, with the reason in `notes` |
| Verifier | `metrics.verified_by`, `verified_at` | A role and a date (P4-5) |

### 5.2 Units

Closed list: `MW`, `GW`, `GWh`, `TWh`, `%`, `gCO2/kWh`, `count`, `USD/MWh`, `USD/TB`, `ms`, `score`, `months`, `hours`, `ratio`, `CDD`, `minutes`, `USD/CAD`, `EUR/USD`.

Any other unit is a generator error. Adding a unit is a data change to `vocabulary.json`, reviewed like any other.

### 5.3 Currency (P4-4)

Prices are stored in USD. Each converted record must satisfy all of:

- `value` is the converted figure, rounded to one decimal place
- `unit` is `USD/MWh`
- `notes` states the published figure, its currency, the rate, the rate's metric identifier and the rate's date
- the rate itself exists as a metric (`M-FX-CAD-USD`, `M-FX-EUR-USD`) sourced to the publisher of the rate
- an assumption claim cites those rate metrics, so the comparison page can show the conversion as an assumption

Rates fixed in Phase 1 §7.3: 1 USD = 1.4254 CAD (Bank of Canada, October 5, 2026); 1 EUR = 1.13 USD (Eurostat 2025 average).

### 5.4 Values that are not established

Roughly eight values are genuinely unknown, including the months to connect 25 MW at each site. Each becomes a metric row with `value` NULL, a note saying what is missing and what would establish it, and an `unknown` claim. Several of these are the conditions in Phase 1 §7.6, which Phase 5 turns into lender evidence gates.

---

## 6. What is loaded

### 6.1 Places

Three countries, three sites, seven demand regions, as listed in Phase 2 §7. Each site records its country, its reference city (Dallas, Montréal, Helsinki) and the note that the metro is chosen in Phase 5.

### 6.2 Sources

All 62 Phase 1 sources plus the course brief. `excerpt` holds the short passage the adviser may read, and nothing longer: an excerpt is evidence, not instructions, and Phase 9's prompt-injection test targets this field on the test Site only.

### 6.3 Metrics

Seven demand-by-region figures, three US sub-region shares, 21 latency estimates (three sites × seven regions, each an estimate from city pings, never a fact), roughly forty country and site measurements, two exchange rates, and the eight not-established values.

The 33 figures the research page `ai-datacenter-requirements.html` supplies are **re-verified before loading**, not copied. Phase 1 §7.9 flags that several of those sources disagree with one another.

### 6.4 Design, parameters and claims

One team, one design, four parameters (IT load 20 MW, PUE 1.25, 8,760 operating hours, the 50 ms latency threshold), all typed as assumptions.

Claims to load, at least one of every type:

| Claim | Type |
|---|---|
| Facility load is 25 MW (20 × 1.25) | calculation, stored with its formula and inputs and **no value** |
| Annual facility energy is 219 GWh | calculation |
| Demand share within 50 ms, per site | calculation |
| Weighted score, per site | calculation |
| Industry-average PUE was 1.54 in 2025 | fact |
| The July 2024 Virginia grid fault disconnected about 1,500 MW of data centers | fact |
| A 16,384-GPU training run had 419 unexpected interruptions in 54 days | fact |
| Latency from each site to each demand region | estimate |
| China is not addressable demand | design decision |
| The 50 ms threshold | assumption |
| **Selected site: Texas** | design decision |
| The four reversal triggers from Phase 1 §7.7 | unknown or estimate |
| The compliance notes | fact or unknown |
| Grid energization date; members' committed GPU-hours | unknown |

Per Phase 2, a calculation claim stores its formula key and inputs and never a value, so the number on the page and the number the adviser cites are computed from the same inputs every time.

### 6.5 The site selection

Fourteen criteria rows (G1–G3, K1–K11), each with the rubric text from Phase 1 §7.2. Eleven weights, including K11 at zero, each with the rationale from the same table. Forty-two assessments: 33 scores and 9 gate results, each pointing at the claim that justifies it.

The scores are the Phase 1 §7.4 matrix, loaded exactly. The weighted score is **not** stored: it is computed, and Phase 2's DM-9 requires the computation to return 3.60 for Texas and 3.05 for Québec and Helsinki.

### 6.6 Links

Roughly 120 links, each joining a claim to the source, metric, parameter or other claim it rests on. The test that matters is DM-11: starting at "Selected site: Texas", a walk through the links reaches every score rationale and from each of those at least one source.

---

## 7. Verification procedure

The brief requires at least three human-verified sources. This phase verifies every one. For each record, before it enters a data file:

1. Open the URL and find the number in the page or table it points at. A link to a homepage or a search result is rejected.
2. Record what the number counts and what it excludes, in `notes`.
3. Record the reporting period, which is often not the year the page was published.
4. Set the confidence, with the reason: `low` where only a commercial directory publishes the figure, `medium` where definitions differ between countries, `high` for a national statistics office or a regulator.
5. Where two sources disagree, load the one used, note the disagreement and the other figure, and set confidence no higher than `medium`.
6. Set `verified_by` and `verified_at`.

A second reviewer re-opens a 10% sample, and their initials and date go in `notes`. A sampled value that fails sends the whole batch from that source back.

---

## 8. The data-access layer (brief Step 10)

### 8.1 Module layout

Per Phase 3 §8, `lib/db/` is the only code that opens the database.

```
lib/db/
  client.ts      binding access; nothing else imports the binding
  queries.ts     read functions (§8.2)
  commands.ts    write functions; used only by Phases 6 and 7 endpoints
  calc.ts        the calculation registry from Phase 2 §5.2
  types.ts       the row and result types
```

### 8.2 Function contracts

Read functions, all returning typed rows with their source and retrieval date attached:

| Function | Signature | Used by |
|---|---|---|
| `getCountries` | `() => Promise<Country[]>` | Comparison page; adviser tool |
| `getSites` | `() => Promise<Site[]>` | Comparison, Design pages |
| `getCountryMetrics` | `(countryId: string, metricNames?: string[]) => Promise<MetricWithSource[]>` | Comparison page; `get_country_metrics` tool |
| `getSiteMetrics` | `(siteId: string, metricNames?: string[]) => Promise<MetricWithSource[]>` | Comparison, Design pages |
| `getLatency` | `(siteId: string) => Promise<LatencyRow[]>` | Comparison page; the proximity calculation |
| `getDesign` | `(teamId: string) => Promise<DesignWithParameters>` | Overview, Design pages; `get_design` tool |
| `getDesignClaims` | `(designId: string, types?: ClaimType[]) => Promise<Claim[]>` | Evidence page; `get_design_claims` tool |
| `getClaimEvidence` | `(claimId: string) => Promise<EvidenceTree>` | Evidence page; the FR14 trace |
| `getSourcesForClaims` | `(claimIds: string[]) => Promise<Source[]>` | Citation rendering; the citation check |
| `getSelection` | `() => Promise<{ criteria, weights, assessments }>` | Comparison page; the score computation |
| `getStaleClaims` | `() => Promise<Claim[]>` | Evidence page freshness banner |

Write functions, each validating before it writes:

| Function | Signature | Used by |
|---|---|---|
| `saveMetric` | `(m: NewMetric, runId: string) => Promise<string>` | The Phase 6 refresh endpoint only |
| `registerUser` | `(u: NewUser) => Promise<User>` | The Phase 7 registration endpoint |
| `logRefreshRun` | `(r: NewRefreshRun) => Promise<string>` | Phase 6 |
| `logAiRequest` | `(r: NewAiRequest) => Promise<string>` | Phase 8 |
| `countRecentRequests` | `(userId: string, since: string) => Promise<number>` | Phase 8 rate limiting |

Every result type carries the fields FR8 and FR10 need: the claim type, the confidence, the source, the reporting period and the retrieval date. A page cannot render a number without having its label and its provenance in hand.

### 8.3 Rules

- Prepared parameters only: `DB.prepare("… WHERE id = ?").bind(id)`. No interpolation into SQL, ever.
- `saveMetric` rejects: an unknown unit, a value that is neither a number nor NULL, a NULL or zero value without a note, a missing reporting period, a missing source, and an unknown metric name.
- `getCountryMetrics` and `getSiteMetrics` return the current row per metric, by the P4-6 rule, and never a superseded one.
- No function formats a value for display. Units, rounding and labels belong to the page.
- No function returns a raw SQL string, and no SQL exists outside `lib/db/`, which SD-13 checks.

---

## 9. What the generator validates

Every rule below fails the build, naming the file, the record identifier and the rule.

| # | Rule |
|---|---|
| V1 | Every record has an identifier, and identifiers are unique within their kind |
| V2 | Every unit is in §5.2 |
| V3 | Every metric names a metric definition that exists in `vocabulary.json` |
| V4 | Every subject reference resolves to a place that exists |
| V5 | A `fact` metric has a source; an `estimate` has a source or a stated method |
| V6 | A NULL or zero value has a note of at least 20 characters |
| V7 | Every source has a publisher, a deep URL, an access date and a verifier |
| V8 | Every `USD/MWh` record converted from another currency satisfies all five rules in §5.3 |
| V9 | Every claim has a type from the six, and a calculation claim has a formula key and no value |
| V10 | Every `estimate` and `design_decision` claim has at least one link |
| V11 | Every site has an assessment for every criterion, and every weight is present; the weights sum to 100 |
| V12 | Every assessment points at a rationale claim that exists |
| V13 | Walking the links from the selection claim reaches every score rationale and at least one source from each |
| V14 | The weighted scores computed from the data equal the Phase 1 §7.4 figures to two decimal places |
| V15 | Reporting periods parse as a year, a year-quarter or a year-month |
| V16 | No record contains anything shaped like a key or a token |

V13 and V14 are the ones that catch a quietly broken seed: the row counts can be right while the evidence no longer supports the decision.

---

## 10. Risks and fallbacks

| # | Risk | How it shows | Fallback |
|---|---|---|---|
| R1 | A Phase 1 figure cannot be re-verified at its URL | The verifier cannot find the number | Load it as `NULL` with a note, and re-score the affected criterion. If a score changes, Phase 1 §7.4 and this seed are both corrected, in a new seed version |
| R2 | The scores no longer reproduce after a correction | V14 fails | The build stops. Either the correction is wrong, or Phase 1's result changed and must be restated. The seed is never forced through |
| R3 | A source disappears between verification and submission | A link check fails in Phase 10 | Keep the publisher, title, period and excerpt, mark the URL as unreachable with the date, and keep the value with its confidence lowered |
| R4 | Applying ~420 inserts exceeds a platform limit | The apply step fails partway | Apply the eight files individually; each is independently ordered and safe to retry because of the guard. If a file is too large, the generator splits `0004_metrics.sql` by subject |
| R5 | A reseed on the production Site creates duplicate "current" values | The current-value view returns a newer, identical row | The guard prevents it. SD-6 tests it directly by running the apply step twice |

---

## 11. Acceptance criteria

SD-1 to SD-5 run on the data files; SD-6 to SD-12 run against a database loaded by the apply step; SD-13 and SD-14 are code checks. Phase 9 references these identifiers.

| ID | Criterion | Traces to |
|---|---|---|
| SD-1 | `npm run seed:generate` validates every data file and emits the eight SQL files; every rule in §9 has a test that fails when the rule is broken | §3.3, §9 |
| SD-2 | Every seeded value has a unit, a reporting period, a publisher, a deep URL, a retrieval date, a definition note, a confidence and a verifier | Brief Step 9 |
| SD-3 | Every "not established" value is NULL with a note; a search of the data files finds no zero used for a missing value | C6, Phase 2 DM-4 |
| SD-4 | At least three sources, and in practice all 63, record a named verifier role and date; a 10% second-reviewer sample is recorded in notes | Brief Step 9, §7 |
| SD-5 | No seed SQL statement is an `UPDATE` or a `DELETE` | P2-5 |
| SD-6 | Running the apply step twice inserts nothing the second time, exits 0, and leaves the row counts unchanged | P4-2, R5 |
| SD-7 | The row counts per table match §2 | §2 |
| SD-8 | The weighted score computed from the loaded data returns Texas 3.60, Québec 3.05, Helsinki 3.05 | Phase 2 DM-9, Phase 1 §7.4 |
| SD-9 | The demand share within 50 ms returns 62.3%, 50.7% and 19.5% | Phase 2 DM-10, Phase 1 §7.3 |
| SD-10 | From the "Selected site: Texas" claim, a walk through the links reaches every score rationale, and from each at least one source | Phase 2 DM-11, FR14 |
| SD-11 | Every converted price shows its published figure, currency, rate and rate date in its note, and the rate exists as a metric cited by an assumption claim | P4-4, FR14 |
| SD-12 | `designs.selected_site_id` points at Texas, and the design-decision claim recording that selection exists | Phase 2 §4.1 |
| SD-13 | A search finds no `DB.prepare` and no SQL outside `lib/db/` | Phase 3 §8, SP-14 |
| SD-14 | `saveMetric` rejects each of the six invalid inputs in §8.3, with a test per case | C6, C8 |

---

## 12. Carried forward

| Item | Phase |
|---|---|
| Scenario overrides for the base case and the two stress cases; the economics parameters | 5 |
| The failure walkthroughs, the grid-impact view and the access rules, as narrative steps citing these claims | 5 |
| The five Texas conditions from Phase 1 §7.6, as lender evidence gates | 5 |
| The member demand survey, which sets how much proximity should weigh and is a Phase 1 reversal trigger | 5 |
| The refresh endpoint writes through `saveMetric` into these same tables, with a `refresh_run_id` | 6 |
| The adviser reads only `sources.excerpt` and the loaded claims, and cites as `[S<id>]` | 8 |
| The prompt-injection test runs against the test Site's copy of this seed, never production | 9 |
| The open research items in Phase 1 §7.10 are either closed with a verified value or restated as unknowns with notes | 5, 10 |

Human review required: every value in this seed is an assertion to a committee, and the brief's point is that a person checked each one. Nothing here is verified by the design pass; §7 is the procedure a person carries out.
