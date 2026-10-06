# Phase 6: Connect external information sources

Brief reference: Steps 13–15 (pages 15–17); the refresh and failure tests in Step 22
Depends on: Phase 4 (`saveMetric` and its validation), Phase 5 (the pages that display the result), Phase 7 for the role check the endpoint calls
Feeds: Phase 7 (the first endpoint with a role check), Phase 9 (two of the brief's named tests), Phase 10 (the list of external sources is a submission item)
Status: complete for review, October 6, 2026

Pull current electricity data from a real external API without ever showing bad or missing data in place of the last good value.

The brief's wording governs this phase closely, so it is quoted rather than paraphrased where it matters.

---

## 1. Decisions made in this phase

| # | Topic | Decision | Reason |
|---|---|---|---|
| P6-1 | Which external API | **One source-adapter interface with three implementations.** The default is **Our World in Data**, which needs no key; **Ember's own API**, which does, is implemented behind the same interface; the **World Bank Indicators API** is the third. The choice is one configuration value. | The brief requires "at least one genuine external API" and names none. It sets up no data-API key: the only key it discusses is OpenAI's, and it says students need not create their own. A keyless default means nothing in this phase waits on the instructor. Our World in Data carries Ember's electricity data, so the citation matches the brief's own example. |
| P6-2 | What triggers a refresh | **An editor presses refresh. That is the only trigger.** | The platform supports no background services (Phase 3 F2), the brief's flow starts with "Authorized editor", and every refresh stays attributable to a person. |
| P6-3 | How the failure test is run | **An always-fails adapter, registered only in the test Site's build.** Production has no code path that can be asked to fail. Unit tests cover the same logic with a stubbed response. | The brief names this test — "Simulate API failure → Last valid data remains visible" — so it must work on a running site. A query flag would ship that path to production and rest on one check being right. |
| P6-4 | What a refresh does to claims | **It relinks claims to the newest metric row**, records on the run which claims it relinked, and marks each "updated by refresh, not yet re-verified" until a person confirms. | Claims always cite the current value, so nothing on the page is quietly out of date. The verification status does not silently transfer to a number no person has read. |
| P6-5 | A refresh that changes nothing | **No metric row is written.** The run is logged, and the page reads "checked *(run time)*, unchanged since *(retrieval date)*". | Writing an identical row every time would fill the history with noise and make FR10's "last updated" meaningless. |

Settled without a separate decision, because the brief or an earlier phase fixes them:

- The endpoint accepts **no URL from the client**: a fixed source name and a country list, nothing else (C9).
- Every write goes through Phase 4's `saveMetric`, so the refresh cannot bypass the seed's validation.
- The key, when one is used, is read from hosted secrets on the server and never reaches the browser, a log or the repository.
- No open live web search in version 1, which the brief excludes by name.

---

## 2. What the brief requires

| Step | Requirement, quoted |
|---|---|
| 13 | "At least one genuine external API. At least three human-verified source records. Optional documents if time permits." |
| 13 | "Do not require arbitrary live web search in the first version. Live search adds uncertainty, prompt-injection exposure, inconsistent results, and citation problems." |
| 14 | The flow: authorized editor → backend → external API → validate response → save new records → return updated data → redraw page |
| 14 | Validate: "HTTP request succeeded ● Expected fields exist ● Value is numeric where required ● Units are recognized ● Reporting period is present ● Source and retrieval date are recorded ● Values fall within reasonable ranges" |
| 14 | "If validation fails, the application should preserve the last valid record." |
| 15 | "The instructor should configure any required API keys as hosted secrets before the exercise." |
| 15 | "The browser sends a request to the Sites backend ● The backend reads the protected key ● The backend calls the external service ● The key is never returned to the browser ● The key is never committed to source control." |
| 17 | Role "Editor: add or refresh evidence" |
| 22 | Test: "Refresh external data → New record and retrieval time appear" |
| 22 | Test: "Simulate API failure → Last valid data remains visible" |
| 22 | Test: "Attempt unauthorized editing → Server rejects the operation" |

The brief names **Ember** exactly once, in an example of how the adviser should format a citation: `[S18] Ember electricity-generation data, 2025`. It is an illustration, not an instruction, and this phase treats it as one.

---

## 3. Source strategy

The brief's own table, with what each row means here.

| Mechanism | Best for | Our use |
|---|---|---|
| External data API | Current structured electricity and energy data | Generation mix and carbon intensity for the three countries |
| Curated source record in the database | Stable facts and human-verified research | Everything seeded in Phase 4; the brief requires at least three, and we have sixty-three |
| Document in object storage with metadata in the database | Reports and large documents | Not in this version. The object-storage binding stays null (Phase 3 §5) |

---

## 4. The source adapter

### 4.1 Interface

`lib/sources/types.ts`:

```ts
type FetchedMetric = {
  countryCode: string          // ISO code, matched to countries.id
  metricName: string           // must exist in metric_definitions
  value: number | null
  unit: string                 // must exist in units
  reportingPeriod: string      // YYYY or YYYY-MM
}

type SourceAdapter = {
  key: string                  // 'owid' | 'ember' | 'worldbank'
  publisher: string            // the organization credited in the citation
  sourceUrlFor(countryCode: string): string   // fixed, built by the adapter, never supplied by a caller
  requiresSecret: string | null               // the hosted-secret name, or null
  fetch(countries: string[], signal: AbortSignal): Promise<FetchedMetric[]>
}
```

An adapter's only job is to produce `FetchedMetric` rows. It does not write, validate ranges, or decide anything. That keeps the validation in one place for every source.

### 4.2 Implementations

| Adapter | Key | Covers | Notes |
|---|---|---|---|
| `owid.ts` | **None** | All three countries, yearly | **The default.** Our World in Data's Data API serves chart data as CSV with JSON metadata. Its electricity data comes from Ember, so the source record credits Ember and records the delivery path |
| `ember.ts` | `EMBER_API_KEY` | All three countries, monthly and yearly | Ember's own API. Free, but it requires sign-up and email verification, so the key must exist as a hosted secret before this adapter can be selected |
| `worldbank.ts` | None | All three countries | The World Bank Indicators API v2 states that "API keys and other authentication methods are no longer necessary". Its energy series lag several years, so it is a fallback, not a first choice |
| `always-fails.ts` | None | — | **Registered only in the test Site's build** (P6-3). Throws on every call |

Selection is one configuration value, read at startup. An unknown value is a startup error, not a silent default.

### 4.3 The source record

One `sources` row per adapter, seeded in Phase 4 and cited by every metric the refresh writes:

| Field | Value for the default adapter |
|---|---|
| `publisher` | Ember |
| `title` | Electricity generation and carbon intensity, by country |
| `url` | The Our World in Data chart endpoint used |
| `source_type` | api |
| `notes` | Retrieved through the Our World in Data Data API, which republishes Ember's dataset |
| `accessed_at` | Updated by each successful run, as a superseding row |

The citation on the page reads as the brief's example does, crediting the publisher of the data rather than the pipe it came down.

---

## 5. What is refreshed

| Metric | Refreshed | Why |
|---|---|---|
| `electricity_generation_mix` | Yes | Published by the source for all three countries |
| `grid_carbon_intensity` | Yes | Same |
| `industrial_electricity_price` | No | Different publisher per country, and the currency conversion rule in Phase 4 §5.3 needs a person |
| `dc_electricity_use`, research counts, lease capacity, water stress, climate | No | Human-verified in Phase 4; no suitable live API |
| `grid_connection_months` | No | Not established anywhere, and no API publishes it |

Six values move: two metrics for each of three countries. That satisfies FR4 ("at least one dataset for all three countries, retrieved live") without pretending the rest of the comparison is live.

---

## 6. The refresh endpoint

### 6.1 Contract

```
POST /api/refresh
body:     { source: "owid" | "ember" | "worldbank", countries: ["US","CA","FI"] }
response: { run: RefreshRun, metrics: MetricWithSource[], relinked: ClaimRef[] }
```

There is no URL parameter, and there never will be. The adapter builds its own request address from a fixed base (C9).

### 6.2 Sequence

1. **Authorize.** Signed in, registered, role `editor` or above, checked on the server (Phase 7). Otherwise `401` when not signed in, `403` when signed in without the role. No external call is made in either case.
2. **Open the run.** Insert a `refresh_runs` row with status `running`, the source key, the countries requested, and the caller.
3. **Fetch.** Call the adapter with a 10-second timeout and one retry on a network error, a 20-second budget in total. The key, if the adapter needs one, is read from hosted secrets at this moment and never held longer.
4. **Validate.** Every rule in §7, per country. A country that fails any rule contributes nothing.
5. **Write.** For each country that passed, and only where the value or the reporting period differs from the current row (P6-5), insert through `saveMetric` with the `refresh_run_id` set.
6. **Relink.** For each metric row written, repoint the claims that cited the superseded row, record them on the run, and mark them not yet re-verified (P6-4).
7. **Close the run.** Status `ok`, `partial` or `failed`, with `rows_added`, `countries_ok`, `countries_failed`, the error text, and the finish time.
8. **Return** the run summary and the current metrics, which is what the page redraws from.

### 6.3 Status codes

| Code | When |
|---|---|
| `200` | The run completed, whatever its outcome — including an upstream failure, because the caller needs the run summary and the last valid data |
| `400` | The request body is malformed, names an unknown source, or lists an unknown country |
| `401` | Not signed in |
| `403` | Signed in, but not an editor or above |
| `409` | A run for this source is already in progress |
| `500` | Only for a fault in our own code. An upstream failure is a `200` with a `failed` run |

An upstream failure is an expected outcome of this endpoint, not an error in it. That distinction is what FR9 is about.

---

## 7. Validation

The brief's seven checks, made concrete. Each is applied per country, before anything is written.

| # | Brief's check | Concrete rule |
|---|---|---|
| V1 | HTTP request succeeded | Status 200, a body of the expected content type, within the timeout |
| V2 | Expected fields exist | Country code, period, series name and value all present |
| V3 | Value is numeric where required | `Number.isFinite(value)`. A missing value becomes NULL with a note, never 0 |
| V4 | Units are recognized | The unit is in the Phase 4 §5.2 list |
| V5 | Reporting period is present | Matches `YYYY` or `YYYY-MM`, is not in the future, and is not more than five years old |
| V6 | Source and retrieval date recorded | `source_id` set to the adapter's source row; `retrieved_at` set to now |
| V7 | Values fall within reasonable ranges | Carbon intensity 0–1,200 gCO2/kWh; each generation share 0–100%; the shares for a country sum to 100 ± 3 |

Two further rules this design adds:

| # | Rule | Why |
|---|---|---|
| V8 | The country code maps to a seeded country | A source that renames or regroups a country must not create a new one |
| V9 | A new value more than 50% away from the current one is written, but the run is marked `partial` and the claim flagged for review | A plausible but wrong figure is the failure mode validation misses. It is recorded, not silently accepted |

**If any rule fails for a country, nothing is written for that country.** Its previous rows stay current, their retrieval dates unchanged, and the run records which rule failed and why. That is the brief's "preserve the last valid record", and it is FR9's acceptance criterion.

---

## 8. Credentials

Only the Ember adapter needs one, and only if it is selected.

- The browser calls our endpoint. The endpoint reads the key from hosted secrets. The endpoint calls the external service. The key never leaves the server.
- The key is never logged, never returned in a response, never put in an error message, and never committed. `EMBER_API_KEY` appears in the repository only as a name.
- An error shown to a user names the source and the failure — "the data source did not respond" — never the request address, which would carry the key.
- The adapter builds its own address. No caller, and no model, supplies one (C9).

The OpenAI key is handled the same way in Phase 8, and the brief says the instructor configures it.

---

## 9. The run record

`refresh_runs`, append-only, one row per attempt:

| Field | Content |
|---|---|
| `id`, `source_key`, `started_at`, `finished_at` | Identity and timing |
| `requested_by` | The editor's user record |
| `countries_requested`, `countries_ok`, `countries_failed` | What was asked for and what succeeded |
| `status` | `running`, `ok`, `partial`, `failed` |
| `rows_added` | Zero is a valid outcome, and means nothing changed (P6-5) |
| `relinked_claims` | Which claims were repointed, for the review queue (P6-4) |
| `error_text` | The rule that failed, or the upstream error. Never a request address |

The Evidence page shows the most recent run per source, and the review queue of claims a refresh has repointed.

---

## 10. Risks and fallbacks

| # | Risk | How it shows | Fallback |
|---|---|---|---|
| R1 | The default source changes its chart slug or column names | V2 fails for every country; the run is `failed` | The last valid data stays visible, which is the designed behaviour. Fix the adapter; the interface means no other code changes |
| R2 | A year's data is published for one country and not another | The run is `partial` | Correct and intended. Each country is written or skipped independently |
| R3 | The source republishes a revised figure that is wildly different | V9 marks the run partial and flags the claim | A person reviews it. The number is current either way, because claims relink |
| R4 | The relink marks many claims unverified at once | A long review queue after a refresh | Expected after the first live refresh. The queue is ordered by how much each claim affects the recommendation |
| R5 | The Ember key is selected but never configured | Startup error naming the missing secret | Switch the configuration value back to the keyless default. This is why the swap exists |
| R6 | Two editors press refresh at once | The second gets `409` | By design. One run per source at a time keeps the history clean |

---

## 11. Acceptance criteria

| ID | Criterion | Traces to |
|---|---|---|
| EX-1 | A refresh retrieves live data for all three countries and stores it with its retrieval time | FR4, brief Step 22 |
| EX-2 | After a refresh, the Country Comparison page shows the new value and the new retrieval time | FR10, brief Step 22 |
| EX-3 | With the always-fails adapter selected on the test Site, a refresh leaves every previously shown value and retrieval date unchanged, and records the failed run | FR9, brief Step 22 |
| EX-4 | A refresh by a signed-in non-editor returns `403`, and no external call is made. A refresh with no sign-in returns `401` | FR5, brief Step 22, Step 17 |
| EX-5 | Each of the nine validation rules has a test with a malformed response that triggers it, and nothing is written when it fires | C8, brief Step 14 |
| EX-6 | A response that fails validation for one country still writes the other two, and the run reads `partial` | §7 |
| EX-7 | A refresh whose values are identical to the current rows writes no metric row, and the page reads "checked … unchanged since …" | P6-5 |
| EX-8 | After a refresh, claims that cited the superseded row cite the new one, appear in the review queue, and are marked not yet re-verified | P6-4 |
| EX-9 | The endpoint accepts no URL: a body containing one is rejected, and the tool and endpoint definitions contain no URL parameter | C9, brief Step 13 |
| EX-10 | No key appears in the browser bundle, in any network response, in any log line, in any error message, or in the repository | C4, brief Step 15 |
| EX-11 | Selecting an adapter whose secret is absent fails at startup with a message naming the missing secret, and never falls back silently | R5 |
| EX-12 | A second concurrent refresh for the same source returns `409` | R6 |
| EX-13 | Switching the configuration from the default adapter to another changes no file outside `lib/sources/` | P6-1 |
| EX-14 | Every refreshed metric cites the adapter's source record, and the citation credits the publisher of the data | §4.3, FR14 |

---

## 12. Carried forward

| Item | Phase |
|---|---|
| The role check this endpoint calls is built here as an interface and implemented in Phase 7; until then it is the only endpoint whose authorization is stubbed, and Phase 7 closes it | 7 |
| The review queue for relinked claims needs an editor view | 7 |
| The adviser must never call this endpoint, and its tools take no URL | 8 |
| EX-1 to EX-14 become test cases; EX-3 and EX-4 are two of the brief's twelve named tests | 9 |
| The list of external sources and APIs is a submission item | 10 |
| If the instructor confirms an Ember key, switching to it is a configuration change and a line in the submission | 10 |

Human review required: the adapter's behaviour against a live source cannot be confirmed from a design document. The first real refresh is the test, and it belongs on the test Site.
