# Phase 5: Build the website interface

Brief reference: Steps 11–12 (pages 14–15); the PS3 deliverables
Depends on: Phase 3 (routes and the data-access boundary), Phase 4 (the loaded evidence and the query functions)
Feeds: Phase 6 (the refresh writes into what these pages read), Phase 8 (the adviser answers from the same claims and calls the same calculation registry), Phase 9 (the tests), Phase 10 (the memo and the presentation draw on these pages)
Status: complete for review, October 6, 2026

This is the largest phase. It builds seven pages, the calculation registry every number on the site passes through, the economics model, the two failure walkthroughs, the system diagram, and the content that Phase 4 deferred.

The rule that governs all of it: **the application calculates, the database remembers, and no number is typed into a page.** A page that needs a number asks the registry or the claim store for it, and renders it with its type label and a route to its evidence.

---

## 1. Decisions made in this phase

| # | Topic | Decision | Reason |
|---|---|---|---|
| P5-1 | Where what-ifs are computed | **On the server.** A visitor's change posts to `/api/whatif`, the registry recomputes, the page re-renders. Controls apply a change; they are not live sliders. | One implementation of every formula. The page, the adviser and the tests cannot disagree, and no number is produced in a place the committee cannot audit (C7). |
| P5-2 | Where the economics inputs live | **All of them are design parameters in the database**, each with an assumption claim and a source. Nothing is hard-coded. | A committee member can challenge any input and see what it rests on. Changing one re-runs the cash flow with no rebuild (C16). |
| P5-3 | How content is loaded | **Through the Phase 4 pipeline**, as a new seed version: `seed/data/content.json` → generator → `seed/sql/0009_content.sql`. | One mechanism for all data. The validator enforces Phase 2's rule that numbers appear in narrative text only as claim placeholders. |
| P5-4 | The system diagram | **Hand-authored inline SVG** in the repository, with its figures injected from claims and a labelled table carrying the same content. | Precise control of the failure paths; readable in both themes; available to a screen reader and to the adviser, which an exported image is not. |
| P5-5 | Stress cases | **Parameter overrides only.** Two new parameters, `energization_delay_months` and `gpu_utilization`, make each case a set of overrides on the base case. | One code path. A scenario stays data, so a fourth case is a data change. |
| P5-6 | Cash-flow presentation | **Ten nominal rows as the main table**, with a summary carrying peak cash before opening, annual operating cost, cost per productive GPU-hour, capital at risk, and net present value at a discount-rate parameter. | The committee's question is how much money and when. The discounted view answers the question that follows it. |
| P5-7 | Recording a committee decision | **Phase 5 displays only.** The recommendation and any decision history are read-only here; the form that records a decision is built in Phase 7, where the committee role is enforced. | Avoids a stubbed access check, which is the pattern the brief warns against. |
| P5-8 | Plain language | **A glossary route.** Terms on the pages link to `/glossary#term`; each entry links back to the pages that use it. This adds a seventh route to the six Phase 3 scaffolded. | Pages stay uncluttered. The return links limit the cost of sending a reader away mid-sentence. |

Settled without a separate decision:

- Pages are server-rendered. Filters and selections are query parameters, so any view a committee member is looking at can be linked to and cited.
- Nothing a visitor does is saved (P2-6). `/api/whatif` writes nothing.
- Every figure on every page carries a type label as a word, not only a colour.
- `/glossary` is public, like the other six pages.

---

## 2. Requirement coverage

| Requirement | Where it is satisfied |
|---|---|
| FR1 present location and design | Overview §3.1, Initial Design §3.3 |
| FR2 compare three countries | Country Comparison §3.2 |
| FR8 show the type of every value | Display rules §8.1, every page |
| FR10 show when data was last updated | Freshness line §8.3 |
| FR11 failure walkthroughs | Initial Design §3.3, content §6 |
| FR12 grid-impact view | Initial Design §3.3, content §6 |
| FR13 capacity and cost sharing | Investment Case §3.5, content §6 |
| FR14 trace any number in two clicks | Evidence §3.4, display rules §8.2 |
| FR15 compare build, lease and hybrid | Investment Case §3.5, economics §5 |
| FR16 change assumptions, see outputs update | What-if endpoint §5.5, scenarios §5.4 |
| FR17 record a committee decision | **Displayed here, recorded in Phase 7** (P5-7) |
| FR18 lender evidence by funding stage | Investment Case §3.5, content §6.3 |
| FR19 recommendation with reversal conditions | Overview §3.1, Investment Case §3.5 |
| C15 adviser limitation notice | Ask the Adviser §3.6 |
| C18 the brief's five pages reachable | Navigation §8.4 |

---

## 3. The pages

Every page reads through the Phase 4 query functions. No page opens the database, and no page contains a number.

### 3.1 Overview (`/`)

| Block | Content | Source |
|---|---|---|
| Recommendation | Approve, reject or send back, in one line, with the reason | `getDesignClaims(design, ['design_decision'])`, topic `recommendation` |
| Selected location | United States, Texas; the reference city, and a note that the metro is settled on the Initial Design page | `getDesign`, `getSites` |
| The design in five numbers | IT load, PUE, facility load, annual energy, operating hours | `getDesign` parameters; facility load and annual energy from the registry |
| The major design decision | Closed-loop cooling, with its reason | claim, topic `cooling` |
| The three largest uncertainties | The three unknowns with the greatest effect on the decision | claims of type `unknown`, ordered by a seeded rank |
| What would change the recommendation | The reversal conditions, each linked to the evidence that would show it (FR19) | claims, topic `reversal_trigger` |
| Freshness | When the underlying data was last updated | §8.3 |

Every figure carries its type label and links to its claim on the Evidence page.

### 3.2 Country Comparison (`/countries`)

Three columns, one per candidate site, with the country named above it. Rows:

- reported data centers, electricity use, generation mix, carbon intensity
- industrial electricity price, in USD, with the published figure and rate in the cell's note
- climate and water measures
- grid reliability
- research base
- lease capacity available
- months to a 25 MW grid connection — **not established at any of the three sites**
- share of addressable demand within 50 ms, and the demand-weighted round trip
- every criterion score, the weight, and the weighted total

Rules: a missing value reads **"Not established"** with the reason, never zero and never blank. Every cell shows its reporting period and its retrieval date. The weighted total is computed by the registry at render time and is never read from storage.

Below the table: the gate results, and a short statement that scores are judgements against a published rubric, linked to the rubric itself.

Query parameters: `?sort=<criterion>&threshold=<ms>`. The latency threshold is adjustable here, because it is the assumption the Phase 1 decision is most sensitive to; changing it re-runs the proximity calculation through `/api/whatif`.

### 3.3 Initial Design (`/design`)

| Block | Content |
|---|---|
| System diagram | §7 |
| Principal assumptions | Every design parameter, its value, its type and its claim |
| Data center requirements | The DC-FR summary from the earlier research page, each item linked to its claim |
| Failure walkthrough 1 | The largest electrical component fails. Rendered from the narrative steps |
| Failure walkthrough 2 | Grid power unavailable for 48 hours, including the energy required, the fuel quantity, the refuelling assumption, and which loads are shed if fuel runs short |
| Grid impact (FR12) | Peak demand, annual energy, expected swings, whether load can be cut on request, the backup plan, and the stated effect on other customers |
| Metro choice | Dallas–Fort Worth or the Austin–San Antonio corridor, with the reason, closing the item Phase 1 left open |
| Texas conditions | The five conditions from Phase 1 §7.6, each linked to its lender evidence gate on the Investment Case page |

Walkthrough steps are rendered from `getNarrative`, with each `{claim:<id>}` placeholder replaced by the current value, its unit and its type label. A step's text contains no digits of its own.

### 3.4 Evidence (`/evidence`)

A filterable table of every claim and every source.

Columns: claim, type, value and unit, source, reporting period, retrieved, confidence, status.

Filters, all as query parameters so a view can be linked and cited: `?type=`, `?status=`, `?country=`, `?site=`, `?publisher=`, `?topic=`, `?q=`.

Each row expands to show what the claim rests on: its sources, the metrics and parameters it cites, and the other claims beneath it. This is the FR14 trace, and it must reach a source from any number on the site in at most two clicks.

Calculation claims show their formula and their inputs instead of a stored value, because none is stored.

A banner lists stale claims — those whose evidence has been refreshed since the claim was made — from `getStaleClaims`.

### 3.5 Investment Case (`/investment`)

| Block | Content |
|---|---|
| The three options side by side | Build and own, lease, phased hybrid, on the four outputs (FR15) |
| Scenario selector | Base case, grid one year late, utilization at half forecast (FR16) |
| Ten-year cash flow | Nominal, by year: capital, operating, financing, replacement, recovery, net, cumulative |
| Summary | Peak cash before opening, annual operating cost, cost per productive GPU-hour, capital at risk, net present value |
| Assumption controls | Electricity price, utilization, PUE, grid delay, GPU price, discount rate. Each applies through `/api/whatif` |
| Capacity and cost sharing (FR13) | The allocation rule, the cost-sharing rule, the share reserved for smaller institutions, and the cap on any single member, each labelled a design decision |
| Lender evidence (FR18) | Three funding stages, each listing its required evidence as exists, partial or missing, with links |
| Recommendation and reversal conditions (FR19) | Repeated from the Overview, with the full reasoning |
| Committee decision | Any recorded decision, read-only (P5-7) |

Every output carries the scenario and the option it belongs to, so a screenshot cannot be read out of context.

### 3.6 Ask the Adviser (`/adviser`)

Built in Phase 8. Phase 5 builds the page around it: the suggested questions, the conversation area, the registration state, the space where citations appear, and the fixed notice required by C15 — *"The adviser discusses an initial design concept. It does not provide professional engineering certification."* The page is public; the conversation requires registration.

### 3.7 Glossary (`/glossary`)

One entry per term: the term, a definition in plain words with no other jargon in it, and links back to the pages where it is used. Entries are anchored, so `/glossary#pue` lands on the right one.

Content lives in `seed/data/glossary.json` and loads through the Phase 4 pipeline. Starting list: PUE, GPU-hour, productive GPU-hour, utilization, availability, UPS, N+1, load shedding, curtailment, energization, grid connection queue, round trip, demand region, carbon intensity, water stress, cooling degree-day, capital cost, operating cost, capital at risk, net present value, discount rate, development equity, construction debt, equipment financing.

A term used on a page links to its entry on first use in each page.

---

## 4. The calculation registry

`lib/db/calc.ts`. Every number on the site, and every number the adviser cites, comes from here. The registry reads its inputs from the current-value views and returns a value together with the inputs it used, so a page can show the working.

### 4.1 Contract

```ts
type CalcInput  = { key: string; value: number | null; unit: string; claimId: string | null }
type CalcResult = {
  key: string
  value: number | null          // null when an input is not established
  unit: string
  inputs: CalcInput[]
  undefinedReason?: string      // set when value is null
}
calc(key: string, ctx: CalcContext): Promise<CalcResult>
```

`ctx` carries the design, the scenario, the option and any what-if overrides. A calculation whose input is missing returns `null` with a reason, and never zero, and never a thrown error that a page would render as a blank.

### 4.2 Registry entries from Phase 2

| Key | Formula |
|---|---|
| `facility_power_mw` | IT load × PUE |
| `annual_energy_gwh` | facility power × operating hours ÷ 1,000 |
| `addressable_demand_share` | each addressable region's demand ÷ total addressable demand |
| `demand_share_within_threshold` | sum of addressable shares for regions within the latency threshold |
| `demand_weighted_rtt_ms` | Σ share × round trip |
| `weighted_site_score` | Σ (score × weight) ÷ Σ weights |
| `currency_to_usd` | value × exchange rate |

### 4.3 Registry entries added here

| Key | Formula | Notes |
|---|---|---|
| `gpu_count` | IT load × 1,000 ÷ kW per GPU | Rounded down |
| `productive_gpu_hours` | GPU count × operating hours × utilization × availability | Per year |
| `annual_energy_cost_usd` | annual energy GWh × 1,000 × electricity price per MWh | |
| `annual_operating_cost_usd` | energy + maintenance + staff + insurance + water + network | First full operating year |
| `cash_flow` | Ten rows: capital, operating, financing, replacement, recovery, net, cumulative | §5.3 |
| `peak_cash_before_opening_usd` | The largest cumulative outflow before the energization year | |
| `cost_per_productive_gpu_hour_usd` | Ten-year total cost ÷ ten-year productive GPU-hours | Returns null, reading "not defined", when the hours are zero |
| `capital_at_risk_usd` | Capital spent and unrecovered if the project stops after year three | |
| `npv_usd` | Σ net ÷ (1 + discount rate) ^ year | |

### 4.4 Unit tests

| Input | Expected |
|---|---|
| 20 MW × 1.25 | 25 MW |
| 25 MW × 8,760 h ÷ 1,000 | 219 GWh |
| Utilization 0 | Cost per productive GPU-hour is null, displayed "not defined", never infinity |
| PUE changed in the database | Overview, Initial Design, Investment Case and the adviser all change on reload |
| An input metric set to NULL | The result is null with a reason naming the missing input |
| The Phase 1 weights and scores | 3.60 Texas, 3.05 Québec, 3.05 Helsinki |

---

## 5. The economics model

### 5.1 Parameters

All of these are rows in `design_parameters`, each with an assumption claim and a source (P5-2). Values are set when this phase's content is written; the table below fixes the names and units so the registry can be built against them.

| Group | Parameters |
|---|---|
| Facility capital | `capex_build_usd_per_mw`, `capex_land_usd`, `capex_grid_connection_usd`, `construction_months`, `energization_delay_months` |
| Facility operating | `maintenance_pct_of_capex`, `staff_cost_usd_per_year`, `insurance_pct_of_capex`, `property_tax_pct`, `water_cost_usd_per_year`, `network_cost_usd_per_year` |
| Power | `electricity_price_usd_mwh`, `demand_charge_usd_kw_month` |
| Compute | `kw_per_gpu`, `gpu_price_usd`, `gpu_life_years`, `gpu_replacement_cycle_years`, `networking_capex_pct_of_gpu`, `storage_capex_usd` |
| Operating assumptions | `gpu_utilization`, `availability_pct`, `operating_hours` |
| Finance | `discount_rate`, `debt_share_pct`, `debt_rate_pct`, `debt_term_years`, `development_equity_usd` |
| Lease option | `lease_price_usd_per_gpu_hour`, `lease_available_gpu_count`, `lease_escalation_pct` |
| Hybrid option | `hybrid_lease_share_pct`, `hybrid_phase_two_year` |
| Recovery | `member_charge_usd_per_gpu_hour` |

`committed_gpu_hours` stays an **unknown** from Phase 4. The model therefore reports cost per productive GPU-hour rather than a return, and the Investment Case page says why: nobody has yet surveyed what the member institutions will commit. That survey is a Phase 1 reversal trigger and remains open.

### 5.2 The three options (FR15)

| Option | What it models |
|---|---|
| Build and own | Full facility capital, full GPU fleet, replacement at the GPU cycle, financing on the debt and equity split |
| Lease | No facility capital; GPU hours bought at the lease price with its escalation, capped by the available GPU count |
| Phased hybrid | Lease for the share and the years set by the hybrid parameters, then build; both cost structures in the same ten years |

All three run through one `cash_flow` function. They differ only by their parameter sets, so no option has code of its own.

### 5.3 The cash flow

Ten rows, one per year, each with: capital, operating, financing, replacement, recovery, net and cumulative. Years run from the start of construction. The energization year is construction months plus `energization_delay_months`; before it there are no productive GPU-hours, which is exactly what makes stress case A bite.

### 5.4 Scenarios (P5-5)

| Scenario | Overrides |
|---|---|
| Base case | None |
| Stress A — grid one year late | `energization_delay_months` = 12 |
| Stress B — utilization at half forecast | `gpu_utilization` = half the base value |

Stored as `scenarios` with `scenario_overrides`, seeded through the content pipeline. Adding a case is a data change.

### 5.5 The what-if endpoint

```
POST /api/whatif
body:     { scenario: string, option: string, overrides: { [parameter]: number } }
response: { parameters: CalcInput[], outputs: { [key]: CalcResult }, rows: CashFlowRow[] }
```

Rules:

- It writes nothing. Not a row, not a log entry beyond the ordinary request record (P2-6).
- It rejects an unknown parameter name, a value outside the range in `parameter_definitions`, a non-numeric value, and a request carrying more than twenty overrides.
- The response carries the inputs used, with their claim identifiers, so the page can show the working and label each figure.
- It is a public endpoint, since the pages are public, and so it is rate-limited by address.

---

## 6. Content

Authored in `seed/data/content.json` and loaded through the Phase 4 pipeline as a new seed version (P5-3).

### 6.1 Narratives

| Key | Content | Requirement |
|---|---|---|
| `failure_largest_component` | Losing one of two main transformers, step by step: what fails, what carries the load, for how long, what is shed | FR11 |
| `failure_grid_48h` | A 48-hour grid outage: the energy required, the fuel quantity, the refuelling assumption, the shedding order | FR11 |
| `grid_impact` | Peak demand, annual energy, load swings, whether load can be cut on request, the backup plan, the effect on other customers | FR12 |
| `capacity_sharing` | The allocation rule, the cost-sharing rule, the reserved share for smaller institutions, the cap on a single member | FR13 |

Each step is text plus `{claim:<id>}` placeholders. The validator rejects any digit in step text outside a placeholder, which is Phase 2's DM-17 and the thing that stops a number drifting out of step with its evidence.

### 6.2 The 48-hour case

The facility draws 25 MW, so 48 hours is about 1,200 MWh. The walkthrough states the fuel quantity this implies, the refuelling assumption behind it, and the shedding order if fuel runs short. Each of those is a claim: the energy figure a calculation, the fuel conversion a calculation, the refuelling assumption an assumption, and the shedding order a design decision.

### 6.3 Lender evidence gates (FR18)

Three stages, seeded as `evidence_requirements` with their linked claims:

| Stage | Required evidence, in outline |
|---|---|
| Development equity | Site control, the load study, the preliminary connection response, the member demand survey |
| Construction debt | A written energization timeline and cost, the cooling design with its water position, the interconnection agreement, the construction contract basis |
| Equipment financing | The GPU procurement basis, the replacement assumption, the utilization evidence, the member commitments |

Status is computed by Phase 2's rule, not asserted: missing when nothing is linked or anything linked is unknown, exists when every linked claim is a verified fact, calculation or design decision, partial otherwise. The five Texas conditions from Phase 1 §7.6 map into the first two stages.

On today's evidence most of these read missing or partial, and the page says so. That is the honest state of a proposal at this stage, and it is what FR18 exists to show.

---

## 7. The system diagram

`components/SystemDiagram.tsx`, hand-authored inline SVG (P5-4).

**What it shows:** grid supply and the connection point; two main transformers marked N+1; switchgear; backup generation with its fuel store; the uninterruptible supply; the IT load; the closed-loop cooling circuit with its heat rejection; network connections to the demand regions; and the two failure paths, drawn as marked routes rather than described in a caption.

**How numbers get in:** the shapes and labels are static; every figure is a `<text>` node filled from a claim at render time. The diagram cannot show a number that is not in the database, and cannot go stale when a parameter changes.

**Requirements:**

- A labelled table beside it carries the same content, so the diagram is readable by a screen reader, quotable by the adviser, and usable in the PS3 memo where a figure is reproduced in print.
- It reads correctly in light and dark, and does not rely on colour alone to distinguish a failure path.
- It fits one page when printed, which is the PS3 deliverable.

---

## 8. Display rules

### 8.1 Type labels

Six types: fact, estimate, assumption, calculation, design decision, unknown. Each appears as a word, with a consistent colour and shape as reinforcement, never colour alone. The same label is used on every page and in the adviser's answers.

### 8.2 Numbers

- Every number shows its unit.
- Every number links to its claim, and from the claim to its source, in at most two clicks (FR14).
- A missing value reads "Not established" with the reason. Never zero, never blank, never a dash on its own.
- A calculation shows its formula and inputs on demand, because no value is stored for it.
- Figures converted to USD show the published figure, its currency and the rate in the cell's note.

### 8.3 Freshness

Each page carries a line giving the oldest retrieval date among the values it shows, and the Evidence page lists claims whose evidence has moved since (FR10).

### 8.4 Navigation

The brief's five pages are reachable from every page (C18), with the Investment Case and the glossary alongside them. The glossary is linked from the footer as well as from the terms themselves.

---

## 9. Risks and fallbacks

| # | Risk | How it shows | Fallback |
|---|---|---|---|
| R1 | A round trip per what-if feels slow | A control takes noticeably long to apply | Batch the controls behind one apply action, which the design already assumes, and cache the unchanged parts of the response. The server stays the only place a number is produced |
| R2 | Thirty economics parameters, each needing a claim and a source, is a lot of content | The phase runs long | Parameters may be seeded as assumptions sourced to the course baseline, provided each says so. An assumption with an honest label is acceptable; an unlabelled figure is not |
| R3 | The walkthroughs need numbers that do not exist yet, such as fuel quantities | A placeholder has no claim to point at | Add the claim, as a calculation with its formula, or as an unknown. Never write the number into the step text |
| R4 | The diagram grows past one printed page | It stops being the PS3 deliverable | Split the detail into the table beside it; the diagram keeps the paths, the table keeps the figures |
| R5 | The lender gates read almost entirely missing | It looks like the work is unfinished | It is the truthful state, and the page frames it as the evidence plan rather than a scorecard. The memo makes the same point |

---

## 10. Acceptance criteria

| ID | Criterion | Traces to |
|---|---|---|
| UI-1 | All seven routes render from stored data; a search of the page templates finds no number | Brief Step 11 |
| UI-2 | Every figure on every page carries a type label as a word | FR8 |
| UI-3 | From any number on any public page, its source or its formula is reachable in at most two clicks | FR14 |
| UI-4 | A NULL value renders "Not established" with its reason, on every page that can show one | C6 |
| UI-5 | Changing PUE in the database changes the Overview, the Initial Design, the Investment Case and the adviser's answer after a reload | Brief Step 12, C7 |
| UI-6 | The comparison's weighted scores, computed at render, read 3.60, 3.05 and 3.05 | Phase 1 §7.4, SD-8 |
| UI-7 | Changing the latency threshold re-runs the proximity figures and changes the ranking at 30 ms, matching Phase 1 §7.5 | FR16, Phase 1 |
| UI-8 | All three options appear together on all four outputs for the base case | FR15 |
| UI-9 | Both stress cases can be selected, and each shows all four outputs | FR16 |
| UI-10 | `/api/whatif` writes nothing: row counts are identical before and after a hundred calls | P2-6 |
| UI-11 | `/api/whatif` rejects an unknown parameter, an out-of-range value, a non-numeric value and more than twenty overrides | §5.5 |
| UI-12 | Utilization set to zero shows "not defined" for cost per productive GPU-hour, not infinity and not zero | §4.4 |
| UI-13 | Both failure walkthroughs render every step, and no step's text contains a digit outside a claim placeholder | FR11, Phase 2 DM-17 |
| UI-14 | The grid-impact view shows all six required items, each typed and sourced | FR12 |
| UI-15 | The sharing view shows the allocation rule, the cost-sharing rule, the reserved share and the single-member cap, each labelled a design decision | FR13 |
| UI-16 | Each of the three funding stages lists its evidence items as exists, partial or missing, with links, computed by the Phase 2 rule | FR18, Phase 2 DM-12 |
| UI-17 | The recommendation appears with at least three reversal conditions, each linked to its evidence | FR19 |
| UI-18 | The diagram shows power, cooling, network and both failure paths; the table beside it carries the same content; it prints on one page | PS3, FR11 |
| UI-19 | Every glossary term used on a page links to its entry, and every entry links back to at least one page | P5-8 |
| UI-20 | The adviser notice required by C15 is visible on `/adviser` without scrolling | C15 |
| UI-21 | Every page carries a freshness line, and the Evidence page lists stale claims | FR10 |
| UI-22 | Each page is readable at a phone width, in both light and dark, with no information carried by colour alone | §8.1 |

---

## 11. Carried forward

| Item | Phase |
|---|---|
| The refresh endpoint writes new metric rows; these pages must show the new values and flag the claims that moved | 6 |
| The committee decision form, with the role check that P5-7 deferred | 7 |
| The adviser fills the page built here, using the same registry and the same claims, citing as `[S<id>]` | 8 |
| The twenty-two criteria above become test cases; the what-if rejections become the injection-adjacent input tests | 9 |
| The diagram, the cash flow and the lender gates are the three exhibits the memo and the presentation draw on | 10 |
| The member demand survey, still open, sets both the proximity weight and `committed_gpu_hours` | 10, or dropped with the gap stated |

Human review required: the economics in this phase are indicative, every input is an assumption until someone sources it, and the non-goal stands — this is not a bankable or audited financial model.
