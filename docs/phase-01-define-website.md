# Phase 1: Define the website and select the site

Brief reference: Steps 1–2 (pages 6–8); PS3 challenge (pages 1–3)
Depends on: nothing
Feeds: every later phase
Status: complete for review. Research checked October 6, 2026.

This document does four things:

- defines what the website must let people do (§4)
- sets the limits the design must work within (§5)
- checks the design for coupling (§6)
- selects the data center site from researched evidence, including proximity to AI demand (§7)

Every requirement has an acceptance criterion. No website code is written in this phase.

---

## 1. Purpose

**FR0:** Help an investment committee decide whether to approve, reject, or send back a proposal for a shared 25 MW university AI data center.

The site is designed for the committee first. Registered-user and editor features serve the project team, and they also demonstrate the architecture the course requires.

## 2. Decisions made in this phase

| # | Topic | Decision | Reason |
|---|---|---|---|
| D1 | Framing | Users are global, weighted by where AI demand is. The three-country comparison selects where the facility is built. | Revised after review: the first version ignored distance to users and favored a site far from most demand |
| D2 | Candidate regions | United States: Texas. Canada: Québec. Finland: Helsinki area. Compared at country level, as the brief requires, with one region each. | National averages hide what matters most in the US and Canada |
| D3 | **Selected site** | **United States, Texas, with conditions (§7.6)** | Highest weighted score (3.60, against 3.05 and 3.05). It stays first under every single doubled weight, and holds even if its own grid connection proves slow. |
| D4 | Design across countries | One common design, plus country-specific variants | Shows real differences without tripling the design work |
| D5 | PS3 scope | The investment functions are website requirements | PS3 asks for "a website model with visible assumptions and sensitivity analysis" |
| D6 | FR wording | Brief FR1–FR10 are kept verbatim | They are the graded minimum |
| D7 | FR scope | FRs describe what users can do. Engineering rules are constraints (§5), except FR1–FR10, which stay as given | Keeps FRs user-facing without dropping any brief requirement |
| D8 | FR structure | A hierarchy with six branches under FR0 | Supports the FR→DP decomposition in axiomatic-design step 3 |
| D9 | Step-3 depth | Top-level design parameters plus a coupling matrix | Catches coupling early; deeper levels are designed in later phases |
| D10 | Baseline | The course baseline, stored as editable assumptions | The brief allows changes with an explanation |
| D11 | Non-goal wording | "Not a bankable or audited financial model" replaces "not a financial investment model" | The brief's example conflicts with PS3's required 10-year cash flow |

## 3. Stakeholders (customer attributes)

| ID | Stakeholder | What they need from the site |
|---|---|---|
| CA1 | Investment committee | A clear decision path, the risks, and evidence they can check |
| CA2 | Large research universities | Confidence that large training workloads would be served |
| CA3 | Small institutions | Fair access for teaching and inference workloads |
| CA4 | Students (registered users) | Answers about the design, grounded in its evidence |
| CA5 | Team editors | A way to keep data current and see whether updates worked |
| CA6 | Instructor / grader | A demonstrable way to check every brief requirement |
| CA7 | Lenders and funders | Evidence that is ready before each funding stage |
| CA8 | Utility / grid operator | The site's effect on the grid and on other customers |

## 4. Functional requirements and acceptance criteria

IDs FR1–FR10 are the brief's minimum, quoted verbatim. FR11–FR19 are user-facing requirements added from PS3. Each acceptance criterion is written so that a tester can mark it pass or fail. The Phase 9 test plan will reference these IDs.

### Present: what any visitor can see

| ID | Requirement | For | Acceptance criterion |
|---|---|---|---|
| FR1 | Present the proposed datacenter location and initial design. | CA1, CA6 | Without signing in, the Overview shows all of the following, each with a type label: the selected country and region, IT load, PUE, facility load, annual energy, the major design decision, and the three largest uncertainties. |
| FR2 | Compare at least three countries. | CA1, CA6 | The comparison shows the United States, Canada and Finland (with their regions) against every criterion in §7.2. Each cell shows a value or "not established" with a reason, plus unit, reporting period, source link and retrieval date. |
| FR11 | Let users step through what happens when the largest electrical component fails and when grid power is unavailable for 48 hours. | CA1, CA7 | Each of the two walkthroughs states, step by step, what fails, what takes over, for how long, which loads are shed (if any), and the evidence used. Every number in it is labelled calculation or assumption. |
| FR12 | Show the grid operator the site's expected demand on the grid, its backup plan, and its effect on other grid customers. | CA8 | The view shows peak demand, annual energy, expected short-term load swings, whether the site can cut load on request, the backup plan, and a stated effect on other customers. Each item is typed and sourced. |
| FR13 | Show how capacity and costs would be shared among member institutions, and how small institutions are protected from a few large users taking most of the capacity. | CA2, CA3 | The view shows the allocation rule, the cost-sharing rule, the share reserved for small institutions, and the cap on any single member. Each is labelled as a design decision. |

### Store: evidence the user can trust and trace

| ID | Requirement | For | Acceptance criterion |
|---|---|---|---|
| FR3 | Store evidence, sources, and design assumptions persistently. | CA1, CA6 | After a redeploy, the number and content of evidence, source and assumption records are unchanged. |
| FR8 | Distinguish facts, estimates, calculations, and unknowns. | CA1, CA4 | Every value displayed anywhere on the site carries exactly one of five labels: fact, assumption, calculation, design decision, unknown. An audit of every page finds no unlabelled value. |
| FR10 | Show when each data item was last updated. | CA1, CA5 | Every metric displays its retrieval date, and every source displays its access date. |
| FR14 | Let users trace any number on the site to its source, its date, and its type. | CA1, CA7 | From any number on any public page, a user reaches its source record (or its formula, for calculations) in at most two clicks. |

### Refresh: current data, failure-tolerant

| ID | Requirement | For | Acceptance criterion |
|---|---|---|---|
| FR4 | Retrieve at least one dataset from an external API. | CA5, CA6 | One dataset for all three countries is retrieved live from an external API and stored with its retrieval time. Generation mix or carbon intensity is planned. |
| FR9 | Retain the last valid data if an external source fails. | CA1, CA5 | During a simulated API failure, the values previously shown and their retrieval dates stay unchanged, and the failed attempt is recorded. |

### Protect: who may use what

| ID | Requirement | For | Acceptance criterion |
|---|---|---|---|
| FR6 | Prevent unregistered users from calling the AI endpoint. | CA6 | A direct request to the AI endpoint is rejected in both cases, and no model call is made: a request without sign-in is rejected as unauthenticated, and a request from a signed-in but unregistered user is rejected as forbidden. |

### Advise: evidence-bound answers

| ID | Requirement | For | Acceptance criterion |
|---|---|---|---|
| FR5 | Allow registered users to ask the AI agent questions. | CA4 | A registered user submits a question and receives an answer within 30 seconds. |
| FR7 | Cite the evidence used in each substantive AI answer. | CA4, CA6 | In a test set of 20 substantive questions, every answer has at least one citation, and every citation resolves to an existing source record. Zero invented identifiers. |

### Decide: support the committee's decision

| ID | Requirement | For | Acceptance criterion |
|---|---|---|---|
| FR15 | Let users compare build-and-own, lease, and phased hybrid side by side on the same outputs: cash required before opening, annual operating cost, cost per productive GPU-hour, and capital at risk. | CA1, CA7 | All three options appear together, showing all four outputs for the base case. |
| FR16 | Let users change key assumptions and see the outputs update, including the base case and the two required stress cases: full grid power one year late, and GPU utilization at half the forecast. | CA1 | Changing electricity price, utilization, PUE or grid delay updates all four outputs. Both stress cases can be selected, and each shows all four outputs. |
| FR17 | Let a committee member record a decision (approve, reject, or send back for more evidence) with a reason. | CA1 | A committee member can save a decision with a reason, and the record shows who decided and when. The same action by any other role is rejected by the server. |
| FR18 | Show lenders, for each funding stage (development equity, construction debt, equipment financing), what evidence is required and what exists so far. | CA7 | For each of the three stages, the site lists the required evidence items, each marked exists, partial or missing, with links. |
| FR19 | Show the recommendation together with the unknowns and findings that could reverse it. | CA1, CA7 | The recommendation is shown with at least three reversal conditions, each linked to its evidence. The §7.7 reversal triggers are the starting set. |

## 5. Constraints

These are limits on any acceptable design, not functions users see. Each later phase must show it respects the constraints assigned to it.

| ID | Constraint | Source in brief | Designed in phase | Acceptance criterion |
|---|---|---|---|---|
| C1 | Built on OpenAI Sites with a server-backed architecture; a static-only site is not acceptable | Steps 3, 6 | 3 | The deployed site runs server routes for data, sign-in and AI |
| C2 | Persistent storage in Cloudflare D1 through a logical binding (`DB`); no password or connection string in code | Step 7 | 3 | The hosting configuration declares `DB`; a code search finds no connection string |
| C3 | Applied migrations are never rewritten; changes go in new migrations | Step 8 | 2, 3 | Migration history replays cleanly on an empty database; no applied migration file has changed |
| C4 | No API keys or database access in browser code; keys are hosted secrets, never returned to the browser or committed | Steps 6, 15 | 3, 6 | A search of the browser bundle, network responses and repository finds no key |
| C5 | All database queries use prepared parameters, through a small data-access layer | Step 10 | 4 | A code search finds database calls only inside the data-access module |
| C6 | An unavailable value is stored as NULL with an explanation, never as zero | Step 9 | 2, 4 | No metric with value 0 lacks a note confirming that zero is the real value |
| C7 | Derived values are calculated in application code; the AI may explain results but never produce them | Step 12 | 5, 8 | Every derived number on the site traces to a named function |
| C8 | External data is validated before it is saved | Step 14 | 6 | Malformed test responses are rejected and nothing is saved |
| C9 | No open live web search in version 1; no tool accepts an arbitrary URL from the model | Steps 13, 19 | 6, 8 | Tool definitions contain no URL parameter |
| C10 | Permissions are enforced on the server for the AI, refresh, editing and decision endpoints | Step 17 | 7 | Direct requests that bypass the interface are rejected for every role lacking permission |
| C11 | Text retrieved from sources is treated as evidence, never as instructions | Step 23 | 8 | The brief's prompt-injection test passes |
| C12 | Every citation identifier corresponds to a real source record | Step 21 | 8 | See FR7 |
| C13 | The model receives only the records relevant to a question | Step 20 | 8 | A request log shows only the retrieved records being sent |
| C14 | AI use is rate-limited and token usage is tracked | Step 20; page 4 | 8 | Exceeding the limit is refused before any model call; tokens are logged per request |
| C15 | The adviser page states that it discusses an initial design and does not issue professional engineering certification | Step 11 | 5, 8 | The statement is visible on the page; a certification request gets an explanation of the limits |
| C16 | Authorized team members can add or refresh data without rebuilding the site | Page 4 | 6 | An editor adds a metric and it appears without a redeploy |
| C17 | At least one genuine external API and at least three human-verified source records | Step 13 | 4, 6 | Both counts are met in the stored data |
| C18 | Pages include Overview, Country Comparison, Initial Design, Evidence, and Ask the Adviser | Step 6 | 5 | All five are reachable from the navigation |

## 6. Top-level design parameters and coupling check

| DP | Design parameter | Satisfies | Designed in |
|---|---|---|---|
| DP-S | Evidence store: every value carries a type, a source and a retrieval date | Store | 2, 4 |
| DP-Pr | Server-side access control: identity, then registration, then role | Protect | 7 |
| DP-R | Validated refresh service that adds records and never overwrites the last valid one | Refresh | 6 |
| DP-D | Deterministic scenario engine plus a decision record | Decide | 5 |
| DP-P | Public pages rendered from stored data | Present | 5 |
| DP-A | Evidence-bound adviser with controlled tools | Advise | 8 |

### Design matrix

An **X** means that design parameter affects that requirement branch.

|  | DP-S | DP-Pr | DP-R | DP-D | DP-P | DP-A |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Store** | X | | | | | |
| **Protect** | | X | | | | |
| **Refresh** | X | | X | | | |
| **Decide** | X | X | | X | | |
| **Present** | X | | | X | X | |
| **Advise** | X | X | | X | | X |

**Reading:** the matrix is lower-triangular, so the design is **decoupled**. Every requirement can be met, provided the parameters are fixed in this order: store, access control, refresh, scenario engine, pages, adviser. This matches the brief's layering rule and sets the build order for the later phases.

**Couplings to keep out:**

- **The adviser producing numbers.** If the adviser calculated numbers itself, Advise and Decide would affect each other in both directions. Constraint C7 prevents this.
- **Permissions checked only in the page.** Recording a committee decision (FR17) needs a role check. If that check lived only in the page rather than on the server, Protect would depend on Present. Constraint C10 prevents this.

**Acceptance criterion:** each later phase's doc restates which DP it designs and confirms it adds no X above the diagonal.

---

## 7. Site selection

### 7.1 Research requirements

The selection must rest on evidence that meets these rules. They are the same rules the stored data must meet later (brief, Step 9).

| Rule | Requirement |
|---|---|
| R1 | Every value has a unit, a reporting period, a publisher, a URL and a retrieval date |
| R2 | Every value has a confidence rating (high / medium / low) with a reason |
| R3 | Primary sources are preferred (grid operators, regulators, statistics agencies, governments); secondary sources are marked as such |
| R4 | A value that could not be verified is recorded as **not established**, never estimated silently |
| R5 | Every derived figure is labelled a calculation, with its inputs |
| R6 | The same criteria are researched for every site |
| R7 | Criteria are kept simple: each is one measurable quantity, or a 1–5 score against a written rubric. Legal and compliance matters are recorded as qualitative evidence and are not scored. |

### 7.2 Method

**Who the site serves.** Users are global, weighted by where AI demand actually is. Siting is therefore judged on two things: what the site offers inside its fence (power, climate, permits), and how close it is to the people who will use it.

**Step 1: must-pass gates.** A site that fails any gate is excluded, whatever its score.

| Gate | Test |
|---|---|
| G1 | A grid connection for about 25 MW is legally and practically obtainable, even if conditionally |
| G2 | No law prohibits a facility of this kind |
| G3 | No single hazard exists that on-site backup and design cannot reasonably mitigate |

**Step 2: weighted scoring.** Each criterion is scored 1 (worst) to 5 (best) against its rubric, then weighted.

| # | Criterion | Weight | Why this weight | Score 5 | Score 3 | Score 1 |
|---|---|---|---|---|---|---|
| K10 | **Proximity to demand**: share of addressable AI demand within 50 ms round trip | **25** | Users are global and weighted by demand. Distance affects every interactive session and every dataset or saved-progress move. | ≥ 60% | 30–45% | < 15% |
| K1 | Time to obtain a grid connection | 15 | Sets the opening date; drives PS3 stress case A | Standard process, no capacity restriction | Restricted or queued, with a defined process | Discretionary approval, competing for scarce power |
| K2 | Electricity price, delivered | 15 | 219 GWh/yr makes power the largest running cost | ≤ $50/MWh | $65–80/MWh | > $95/MWh |
| K4 | Grid reliability and extreme weather | 10 | Uptime target; PS3's 48-hour outage case | Very high reliability, low exposure | Notable but mitigable events | Repeated large-scale failures |
| K6 | Research ecosystem and likely members | 10 | Anchor members and demand | Dense, large AI research base | Moderate | Thin |
| K3 | Grid carbon intensity | 5 | Reputation and emissions reporting | < 25 g/kWh | 100–250 g/kWh | > 450 g/kWh |
| K5 | Climate and water for cooling | 5 | Sets the achievable PUE and the water draw | Cool, low water stress | Moderate | Hot, high water stress |
| K7 | Existing facilities to lease | 5 | Enables a phased hybrid | Large, accessible capacity | Some | Little |
| K8 | Permitting regime | 5 | Schedule risk | Clear, fast, politically stable | Clear but sequential, or under political review | Uncertain or hostile |
| K9 | Waste-heat reuse | 5 | Operating credit; community benefit | Established market for buying data center heat | Networks exist, few examples | None |
| K11 | Data-transfer price per TB to users | 0 | **Evaluated, but it does not separate the sites (§7.3)** | — | — | — |

Interpolation between listed points: K10, 4 = 45–60%, 2 = 15–30%; K2, 4 = $50–65, 2 = $80–95/MWh; other criteria in the same way.

**Why K10 uses "share within 50 ms".** It is the simplest measure that answers the question "how much of the demand is close?". The threshold of 50 ms is an assumption: about the round trip at which interactive use (notebooks, teaching sessions, inference responses) starts to feel slow. The demand-weighted average round-trip time is reported alongside as a cross-check, and the threshold is tested in §7.5.

**Step 3: sensitivity.** Re-rank under equal weights, with each weight doubled in turn, with K10 removed, under alternative demand measures and thresholds, and under named scenarios. The decision is robust if the winner holds in every case that keeps the demand criterion meaningful.

### 7.3 Evidence

Conversions (calculations): 1 USD = 1.4254 CAD (Bank of Canada, Oct 5, 2026) [S1]; 1 EUR = 1.13 USD (Eurostat 2025 average, as used in [S30]). Source IDs refer to §7.9.

#### Where demand is (input to K10)

**Primary measure: data center electricity use, by region** (IEA *Energy and AI*, regional data updated April 2026) [S51]

| Region | 2025 TWh | Share of world |
|---|---|---|
| United States | 224 | 46.2% |
| Canada + Mexico | 5 | 1.0% |
| Europe | 72 | 14.8% |
| China | 117 | 24.1% |
| Asia-Pacific excluding China | 56 | 11.5% |
| Rest of world | ~11 | 2.3% |

The US is split East / Central / West using the data center capacity in service in its eight main markets (CBRE, first half of 2026) [S37]:

- **East (59.5%):** Northern Virginia, Atlanta, New York
- **Central (21.5%):** Dallas–Fort Worth, Chicago
- **West (19.0%):** Phoenix, Silicon Valley, Oregon

**Addressable demand: China excluded.** This is a design decision. A Western university consortium cannot realistically serve users in mainland China: US export controls on advanced AI chips and China's network controls both stand in the way. Including China is tested in §7.5.

| Demand region | Share of addressable demand (calculation) |
|---|---|
| US East | 36.3% |
| US Central + Canada/Mexico | 14.4% |
| US West | 11.6% |
| Europe | 19.5% |
| Asia-Pacific excluding China | 15.2% |
| Rest of world | 3.0% |
| **North America total** | **62.3%** |

Cross-checks:

- The large cloud providers hold 54% of their data center capacity in the US (Synergy Research, March 2025) [S52].
- 59 of the notable AI models released in 2025 came from the US and 35 from China (Stanford AI Index 2026) [S54].
- The US is the largest single country for Claude usage, at 21.6% (Anthropic Economic Index, September 2025) [S55].
- Counting AWS sites (Availability Zones) instead gives North America only 25% [S53]. That count measures how widely AWS has spread, not how much computing it runs, so it is used only as a sensitivity case.

#### Round-trip network time from each site (ms)

City-to-city ping averages, retrieved October 6, 2026 [S57]. Azure's inter-region medians [S56] agree within about 15 ms everywhere except Montréal–US East, where the Azure proxy (Québec City) is about 15 ms slower than Montréal itself.

| Site → | US East (NY / Wash. / Boston) | US Central (Chicago) | US West (SF) | Europe (Frankfurt / London) | Asia-Pacific (Tokyo / Singapore) |
|---|---|---|---|---|---|
| Texas (Dallas) | 39 | 23 | 45 | 116 | 179 |
| Québec (Montréal) | 11 | 21 | 66 | 83 | 208 |
| Helsinki | 106 | 129 | 169 | 30 | 224 |

Rest of world: the average of the Europe and Asia-Pacific values (assumption).

#### K10 Proximity to demand

| | Texas | Québec | Helsinki |
|---|---|---|---|
| Demand regions within 50 ms | US East, US Central, US West | US East, US Central | Europe |
| **Share of addressable demand within 50 ms** (calculation) | **62.3%** | **50.7%** | **19.5%** |
| Cross-check: demand-weighted average round trip | 77 ms | 67 ms | 120 ms |
| **Score** | **5** | **4** | **2** |

#### K11 Data-transfer price (evaluated, weight 0)

| Evidence | Texas | Québec | Helsinki |
|---|---|---|---|
| AWS price to send data to the internet, first 10 TB/month [S58] | $0.09/GB (Ohio / Oregon used; no Texas region) | $0.09/GB (ca-central-1) | $0.09/GB (Stockholm used; no Finland region) |
| AWS price to send data to another AWS region | $0.02/GB | $0.02/GB | $0.02/GB |
| University research networks (Internet2, CANARIE, Funet/NORDUnet) | Membership fee, no per-GB charge (inferred from fee structures) [S60] | same | same |

**Finding:** the price of moving data is the same at all three sites, so it cannot separate them. Distance costs show up as round-trip time (K10), not as price. Wholesale internet bandwidth is cheapest in US and European hubs [S59].

#### K1 Grid connection

| | Texas (ERCOT) | Québec (Hydro-Québec) | Helsinki (Fingrid / Helen) |
|---|---|---|---|
| Rule for a 25 MW load | Below the 75 MW threshold of Texas Senate Bill 6 (2025), so no large-load deposits or forced curtailment [S2][S3] | Supply to any data center of 5 MW or more needs authorization from the energy ministry (Bills 2 and 69) [S12][S13] | Normal process. An agreement needs a valid land-use plan and building permit. [S24] |
| Current constraint | Large-load queue of 474.7 GW, 90% data centers; governor's audit of the queue (Aug 2026) [S4] | About 2,500 MW of data center requests for "a few hundred MW" of spare power; no new supply before 2028 [S14] | Helsinki region "temporarily restricted" 2025–2027 [S25]; about 68 GW of enquiries [S26] |
| Months to connect 25 MW | Not established (local utility) | Not established | Not established |
| **Score** | **4** | **1** | **2** |

#### K2 Electricity price

| | Texas | Québec | Helsinki |
|---|---|---|---|
| Evidence | EIA industrial average, Jan–Jul 2026: 6.72 ¢/kWh [S5]; 2024 wholesale about $29–32/MWh [S6] | Current rate LG ≈ C$6.59 ¢/kWh [S15]; proposed data center rate about 13 ¢ CAD, under hearing Oct–Dec 2026 [S16][S17] | €42.2/MWh (second half of 2025) [S27] + €22.4/MWh electricity tax from Jul 2026 [S28]; compensation cancelled [S29] |
| Delivered (calculation) | ≈ $67/MWh | ≈ $46 now; ≈ $91 proposed | ≈ $73/MWh |
| **Score** | **3** | **2** (5 if the new rate is rejected) | **3** |

#### K3 Carbon, K4 Reliability, K5 Climate and water

| | Texas | Québec | Helsinki |
|---|---|---|---|
| K3 evidence | 373 g/kWh (2024) [S7] | 7.8 g/kWh (2025) [S18] | 66 g/kWh (2025) [S30] |
| **K3 score** | **2** | **5** | **4** |
| K4 evidence | Winter Storm Uri 2021: ~20,000 MW of rolling blackouts, 246 deaths [S8]; Hurricane Beryl 2024: 2.26M customers out [S9] | 1998 and 2023 ice storms, each >1M customers out [S20]; 436 min average outage per customer (2024) [S21] | National grid 99.9998% reliable (first half of 2026) [S26]; Baltic cable incidents [S31] |
| **K4 score** | **2** | **3** | **4** |
| K5 evidence | Austin ~3,290 cooling degree-days; drought and high water stress [S10][S44] | 271 cooling degree-days; low water stress [S22][S23] | 83–89% of hours ≤ 18 °C; low water stress [S32][S33] |
| **K5 score** | **2** | **4** | **5** |

#### K6 Research base, K7 Lease options, K8 Permitting, K9 Heat reuse

| | Texas | Québec | Helsinki |
|---|---|---|---|
| K6 evidence | 16 top-tier (R1) research universities, the most of any state; TACC [S11] | Mila: 140+ professors, 8 universities [S34] | FCAI: about 70 professors [S35] |
| **K6 score** | **5** | **4** | **3** |
| K7 evidence | Horizon (~4,000 Blackwell GPUs) and Vista at TACC [S36] | Rorqual (324 H100 GPUs) [S38]; federal sovereign-compute funding [S39] | LUMI (11,912 GPUs; Finland ~23% share) [S40]; LUMI-AI (2027) [S41]; Roihu [S42] |
| **K7 score** | **4** | **3** | **5** |
| K8 evidence | No statewide zoning; simple permit route for diesel backup [S43]; political headwinds [S4][S44] | No provincial environmental review today, but under pressure [S45] | Municipal plan and building permit; generator permit at ≥ 50 MW fuel input [S46]; EU reporting [S47] |
| **K8 score** | **3** | **3** | **3** |
| K9 evidence | No district heating | Montréal network; QScale example [S48] | Helen buys data center heat [S49]; Fortum–Microsoft [S50] |
| **K9 score** | **1** | **3** | **5** |

#### Compliance (qualitative, not scored)

| Topic | Texas | Québec | Helsinki |
|---|---|---|---|
| Where US research data sits | In the US; no cross-border issue | Outside the US. Some funder and data-use agreements may require US-only storage (unverified). | Same as Québec |
| Privacy law | US federal and state law | Canadian federal privacy law; Québec's Law 25 requires a privacy assessment before data leaves Québec (unverified) | EU GDPR applies to a Finnish operating entity and to EU personal data [S62] |
| US export controls on AI chips | None | Was in the most-favoured tier of the rescinded 2025 diffusion rule; no current country restriction [S61] | Was in the middle tier of that rule; no current restriction, but a replacement rule could change this [S61] |
| US research-security rules | Apply to member institutions everywhere | Neither Canada nor Finland is a "country of concern" | Same |

**Reading:** compliance adds friction outside the US but no prohibition. It strengthens, rather than changes, the ranking below.

### 7.4 Results

**Gates:** all three sites pass, each conditionally. Québec is closest to failing G1, because it needs discretionary ministerial authorization against scarce supply.

| Criterion | Weight | Texas | Québec | Helsinki |
|---|---|---|---|---|
| K10 Proximity to demand | 25 | 5 | 4 | 2 |
| K1 Grid connection | 15 | 4 | 1 | 2 |
| K2 Price | 15 | 3 | 2 | 3 |
| K4 Reliability | 10 | 2 | 3 | 4 |
| K6 Research base | 10 | 5 | 4 | 3 |
| K3 Carbon | 5 | 2 | 5 | 4 |
| K5 Climate & water | 5 | 2 | 4 | 5 |
| K7 Lease options | 5 | 4 | 3 | 5 |
| K8 Permitting | 5 | 3 | 3 | 3 |
| K9 Heat reuse | 5 | 1 | 3 | 5 |
| K11 Transfer price | 0 | — | — | — |
| **Weighted score** | 100 | **3.60** | **3.05** | **3.05** |

### 7.5 Sensitivity

| Test | Texas | Québec | Helsinki | Leader |
|---|---|---|---|---|
| Planned weights | 3.60 | 3.05 | 3.05 | **Texas** |
| Any single weight doubled (10 cases; closest is reliability ×2: 3.45 / 3.05 / 3.14) | — | — | — | **Texas in all 10** |
| K10 scored by demand-weighted average round trip instead (TX 3, QC 4, HEL 1) | 3.10 | 3.05 | 2.80 | Texas, by 0.05 |
| Texas grid connection turns out slow (K1 = 2) | 3.30 | 3.05 | 3.05 | Texas |
| Texas grid connection fails outright (K1 = 1) | 3.15 | 3.05 | 3.05 | Texas |
| Québec authorized only (K1 = 4) | 3.60 | 3.50 | 3.05 | Texas |
| **Québec authorized and new rate rejected** (K1 = 4, K2 = 5) | 3.60 | **3.95** | 3.05 | **Québec** |
| **Stricter 30 ms threshold** (Texas share falls to 14%) | 2.60 | 3.05 | 3.05 | **Québec / Helsinki tie** |
| **Equal weights** (proximity counts for only 10%) | 3.10 | 3.20 | **3.60** | **Helsinki** |
| **Proximity ignored** (K10 weight 0) | 3.13 | 2.73 | **3.40** | **Helsinki** |
| China included in demand (Asia-Pacific becomes 35.6%) | Texas, Québec and Helsinki shares within 50 ms fall to 47.2%, 38.4% and 14.8%; scores 4 / 3 / 1 | — | — | Texas |

**Reading:**

- Texas leads whenever proximity to demand carries real weight.
- Helsinki leads only when proximity is ignored or diluted. This is the error the first version of this analysis made.
- Québec can overtake Texas in two cases: if both pending government decisions go its way, or if users need very low latency (30 ms or less), which favors the US East Coast, where Montréal sits 11 ms away.

### 7.6 Decision

**Selected site: United States, Texas.** Type: design decision. Rests on §7.3–7.5.

The exact metro (Dallas–Fort Worth or the Austin–San Antonio corridor) is chosen in the Initial Design (Phase 5). The latency evidence above uses Dallas.

Conditions to meet before development money is committed (these feed FR18, the lender evidence gates):

1. **Connection date and cost.** Obtain a written energization timeline and cost from the local utility for about 25 MW.
2. **Stay below 75 MW.** Hold total site demand, including any later phases, below the 75 MW threshold of Senate Bill 6, or plan explicitly for its deposits, studies and curtailment duties.
3. **Weather and grid emergencies.** Design backup for the PS3 48-hour outage and winterize to post-Uri standards.
4. **No evaporative cooling.** Use dry or closed-loop cooling because of drought and water stress. Accept the higher PUE risk this brings and record it in the cooling design.
5. **Carbon.** Model a wind or solar supply contract as a variant, to address the 373 g/kWh grid average.

### 7.7 Reversal triggers (starting set for FR19)

| Trigger | Evidence that would show it | Effect |
|---|---|---|
| Québec gets ministerial authorization **and** the regulator rejects the new data center rate | Ministerial decision; Régie de l'énergie ruling (expected Dec 2026 – early 2027) | Québec scores 3.95 and overtakes Texas |
| Member demand is mostly large batch training, which tolerates distance, so proximity matters little | Phase-4 demand survey of members (PS3 decision 1) | With proximity weight near 0, Helsinki leads (3.40) |
| Members need very low latency (≤ 30 ms) concentrated on the US East Coast | Same demand survey | Québec and Helsinki tie ahead of Texas |
| Texas political action extends large-load rules or the queue audit down to 25 MW sites | PUC rulemaking; 2027 legislative session | Raises K1 and K8 risk; re-score |

Texas does **not** lose its lead if its own grid connection proves slow, or fails outright. Its lead rests mainly on proximity and the research base.

### 7.8 Site variants carried into the design

| Site | Variant | Status |
|---|---|---|
| Texas (selected) | Winterization; dry or closed-loop cooling; total demand held below 75 MW; optional wind or solar supply contract | Base design |
| Québec | Hydro supply under ministerial authorization; low latency to the US East Coast | Runner-up, tracked via reversal triggers |
| Helsinki | Waste-heat sale to district heating; strongest lease alternative (LUMI-AI) | Comparison only |

### 7.9 Sources

All retrieved October 6, 2026.

| ID | Publisher, title | URL |
|---|---|---|
| S1 | Bank of Canada, USD/CAD exchange rate | https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json?recent=3 |
| S2 | Texas Legislature, SB 6 enrolled bill analysis | https://capitol.texas.gov/tlodocs/89R/analysis/html/SB00006F.htm |
| S3 | Foley & Lardner, PUC proposed large-load interconnection rules (Mar 2026) | https://www.foley.com/insights/publications/2026/03/public-utility-commission-of-texas-issues-proposed-rules-for-large-load-interconn/ |
| S4 | POWER Magazine, governor orders audit of the Texas data center queue | https://powermag.com/abbott-orders-full-audit-of-texas-data-center-interconnection-queue-threatens-to-deny-grid-access/ |
| S5 | EIA, Electric Power Monthly, Table 5.6.B | https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_5_6_b |
| S6 | ERCOT, commercial markets update (Jan 2025) | https://www.ercot.com/files/docs/2025/01/27/9-3-commercial-markets-update.pdf |
| S7 | EIA, Texas electricity profile | https://www.eia.gov/electricity/state/texas/ |
| S8 | FOX 4, Texas health department Uri death toll | https://www.fox4news.com/news/texas-dshs-reports-higher-death-toll-from-february-winter-storm |
| S9 | Texas Tribune, Hurricane Beryl outages | https://www.texastribune.org/2024/07/08/hurricane-beryl-texas-damage-updates-rain |
| S10 | National Weather Service, Austin climate normals | https://www.weather.gov/media/ewx/climate/ATTJuly.pdf |
| S11 | UTSA, Carnegie classification reaffirmed (2025) | https://utsa.edu/today/2025/02/story/carnegie-classification-reaffirmed.html |
| S12 | Government of Québec, Bill 2 adopted | https://www.quebec.ca/nouvelles/actualites/details/adoption-du-projet-de-loi-no-2-hausse-des-tarifs-dhydro-quebec-limitee-a-3-pour-les-quebecois-45784 |
| S13 | BLG, data centre regulation in Québec (Jul 2026) | https://www.blg.com/en/insights/2026/07/data-centre-regulation-in-quebec-from-honeyed-promise-to-iron-control |
| S14 | Radio-Canada, half of electricity requests are data centers | https://ici.radio-canada.ca/nouvelle/2289961/moitie-demandes-electricite-centres-donnees-quebec |
| S15 | Hydro-Québec, electricity rates (Apr 1, 2026) | https://www.hydroquebec.com/data/documents-donnees/pdf/electricity-rates.pdf |
| S16 | Hydro-Québec, proposed rate for large data centres | https://news.hydroquebec.com/news/press-releases/all-quebec/hydro-quebec-proposing-regie-energie-new-rate-large-data-centres-adjustment-rate-cryptographic-use-applied-blockchains.html |
| S17 | CP24, Hydro-Québec data centre rate hearing (Oct 2026) | https://www.cp24.com/news/canada/2026/10/01/hydro-quebec-to-face-off-against-industry-actors-like-google-in-data-centre-hearing/ |
| S18 | Hydro-Québec, GHG emission rate 2025 | https://www.hydroquebec.com/data/developpement-durable/pdf/2026G195A-4_Emission_GES.pdf |
| S19 | Hydro-Québec, supply mix 2025 | https://www.hydroquebec.com/data/developpement-durable/pdf/2026G195A-1_Quebec.pdf |
| S20 | Hydro-Québec, 1998 ice storm; CBC, April 2023 outages | https://www.hydroquebec.com/ice-storm-1998/ ; https://www.cbc.ca/1.6802034 |
| S21 | Hydro-Québec, 2024 distribution accountability report | https://news.hydroquebec.com/news/press-releases/all-quebec/hydro-quebec-positive-assessment-2024-distribution-activities-published-annual-accountability-report.html |
| S22 | Environment and Climate Change Canada, Montréal climate normals | https://api.weather.gc.ca/collections/climate-normals/items?CLIMATE_IDENTIFIER=7025250&MONTH=13 |
| S23 | WRI Aqueduct baseline water stress (Resource Watch) | https://resourcewatch.org |
| S24 | Fingrid, phases of a grid connection agreement | https://www.fingrid.fi/en/grid/grid-connection-agreement-phases/ |
| S25 | Fingrid, consumption connections temporarily tight in southern Finland (Jan 2025) | https://www.fingrid.fi/en/news/news/2025/the-connection-of-electricity-consumption-to-the-main-grid-is-temporarily-tight-in-southern-finland |
| S26 | Fingrid, half-year report 2026 | https://www.investegate.co.uk/announcement/gnw/fingrid-oyj--38fe/fingrid-group-s-half-year-report-1-1-30-6-20-/9684352 |
| S27 | Eurostat, non-household electricity prices (nrg_pc_205) | https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/nrg_pc_205?geo=FI&nrg_cons=MWH70000-149999 |
| S28 | Finnish Tax Administration, electricity tax | https://vero.fi/yritykset-ja-yhteisot/verot-ja-maksut/valmisteverotus/sahkovero/ |
| S29 | The Star (wire), Finland drops planned data center support (Sep 2026) | https://www.thestar.com.my/news/world/2026/09/02/finland-drops-planned-financial-support-for-data-centers |
| S30 | Electricity Maps, Finland grid review 2025 | https://www.electricitymaps.com/grid-in-review-2025/finland |
| S31 | Fingrid, Estlink 2 returns to use (Jun 2025) | https://www.fingrid.fi/en/news/news/2025/estlink-2-electricity-transmission-link-returns-to-commercial-use/ |
| S32 | Finnish Meteorological Institute, open data (Kaisaniemi) | https://opendata.fmi.fi/wfs |
| S33 | WRI, Aqueduct 4.0 country rankings | https://datasets.wri.org/datasets/aqueduct-40-current-and-future-country-rankings |
| S34 | Mila, about | https://mila.quebec/en/mila/ |
| S35 | FCAI, about | https://fcai.fi/about |
| S36 | TACC, Horizon and Vista announcements | https://tacc.utexas.edu/news/latest-news/2025/11/17/nsf-lccf-horizon-supercomputer-to-power-breakthroughs-for-the-nations-leading-scientists/ |
| S37 | CBRE, North American data center trends, first half of 2026 | https://www.cbre.com/press-releases/north-american-data-center-demand-continues-to-outpace-supply-despite-record-construction-activity |
| S38 | Digital Research Alliance of Canada, Rorqual | https://alliancecan.ca/en/services/compute/rorqual |
| S39 | Government of Canada, Sovereign AI Compute Strategy note | https://search.open.canada.ca/qpnotes/record/ic%2CAIDI-2026-QP-00004 |
| S40 | LUMI documentation and TOP500 entry | https://docs.lumi-supercomputer.eu/hardware/lumig/ ; https://www.top500.org/system/180048/ |
| S41 | AMD, LUMI-AI announcement (Aug 2026) | https://newsroom.amd.com/news/amd-instinct-gpus-epyc-cpus-power-lumi-ai-supercomputer/ |
| S42 | CSC, Roihu documentation | https://docs.csc.fi/computing/systems-roihu |
| S43 | UT Arlington, Powering Large Loads: diesel generators | https://uta.pressbooks.pub/poweringlargeloads/chapter/4-diesel-generators/ |
| S44 | E&E News, Texas water plan and data centers | https://www.eenews.net/articles/texas-water-plan-ignores-data-center-surge/ |
| S45 | Le Nouvelliste, calls for a BAPE review of data centres (Sep 2026) | https://www.lenouvelliste.ca/actualites/environnement/2026/09/17/le-boom-des-centres-de-donnees-ravive-les-appels-a-un-bape-STQ736KECRDFTFHADPME4UZQN4/ |
| S46 | Finlex, Environmental Protection Act 527/2014 and decree | https://finlex.fi/api/media/statute/59827/mainPdf/main.pdf |
| S47 | DLA Piper, EU data centre reporting regulation 2024/1364 | https://www.dlapiper.com/en/insights/publications/2024/09/new-data-centre-sustainability-reporting-obligations-introduced-through-eu-20241364-regulation |
| S48 | Government of Québec, Montréal heat recovery grant; Sustainable Biz, QScale and Énergir | https://sustainablebiz.ca/qscale-partners-with-energir-for-waste-heat-recovery-projects |
| S49 | Helen, waste heat from new data centre (2026) | https://www.helen.fi/en/news/2026/helen-hyodyntaa-uuden-datakeskuksen-hukkalampoa-helsingin-kaukolammossa |
| S50 | Microsoft, Finland datacenter region and district heating (2022) | https://news.microsoft.com/europe/2022/03/17/microsoft-announces-intent-to-build-a-new-datacenter-region-in-finland-accelerating-sustainable-digital-transformation-and-enabling-large-scale-carbon-free-district-heating/ |
| S51 | IEA, Energy and AI, regional data (Apr 2026), via Our World in Data | https://www.iea.org/data-and-statistics/data-product/energy-and-ai ; https://api.ourworldindata.org/v1/indicators/1295512.metadata.json |
| S52 | Synergy Research Group, US accounts for 54% of hyperscale capacity (Mar 2025) | https://srgresearch.com/articles/hyperscale-data-center-count-hits-1136-average-size-increases-us-accounts-for-54-of-total-capacity |
| S53 | AWS, global infrastructure: Regions and Availability Zones | https://aws.amazon.com/about-aws/global-infrastructure/regions_az/ |
| S54 | Stanford HAI, AI Index 2026, research and development | https://hai.stanford.edu/ai-index/2026-ai-index-report/research-and-development |
| S55 | Anthropic, Economic Index: geography (Sep 2025) | https://www.anthropic.com/research/economic-index-geography |
| S56 | Microsoft, Azure network round-trip latency statistics | https://learn.microsoft.com/en-us/azure/networking/azure-network-latency |
| S57 | WonderNetwork, global ping statistics (Dallas, Montreal, Helsinki) | https://wondernetwork.com/pings/Dallas |
| S58 | AWS, data transfer pricing (Price List API, Sep 2026) | https://aws.amazon.com/ec2/pricing/on-demand/ |
| S59 | TeleGeography, IP transit price erosion (2026) | https://resources.telegeography.com/ip-transit-price-erosion-significant-regional-differences-remain |
| S60 | Internet2 dues and fees; CANARIE connection fees; CSC/Funet | https://internet2.edu/community/membership/research-and-education-networks-membership/research-and-education-network-dues-and-fees |
| S61 | Steptoe, rescission of the AI diffusion rule (2025) | https://www.steptoe.com/en/news-publications/international-compliance-blog/trump-administration-charts-new-path-on-ai-export-controls-with-significant-new-guidance-and-rescission-of-diffusion-rule.html |
| S62 | Bird & Bird, EU–US Data Privacy Framework upheld (Sep 2025) | https://cm.twobirds.com/en/insights/2025/euus-data-privacy-framework-survives-legal-challenge-what-the-latombe-decision-means-for-internation |

### 7.10 Open research items (carried to Phase 4)

| Item | Why it matters |
|---|---|
| Local-utility energization time and cost for about 25 MW in Dallas–Fort Worth and Austin–San Antonio | Decision condition 1; K1 score |
| Whether the governor's queue audit or the PUC rules reach sites below 75 MW | Reversal trigger 4 |
| The member workload mix: share of batch training vs. interactive teaching and inference | Reversal triggers 2 and 3; sets how much K10 should weigh |
| Measured latency from the chosen Texas metro to member campuses (not city proxies) | Confidence in K10 |
| Outcome of Québec's new-rate hearing, and the timeline for ministerial decisions | Reversal trigger 1 |
| Funder and data-use agreements that require US-only storage | Compliance (qualitative) |

---

## 8. Design baseline

The given values, stored as editable assumptions. A change must be explained.

| Variable | Initial value | Type |
|---|---|---|
| IT load | 20 MW | assumption |
| PUE (total facility power ÷ IT power) | 1.25 | assumption |
| Facility electrical load | 25 MW | calculation (20 × 1.25) |
| Annual operating hours | 8,760 | assumption |
| Annual facility electricity | 219 GWh | calculation (25 × 8,760 ÷ 1,000) |

The PUE stays at the course value of 1.25. Texas heat, combined with the no-evaporation condition (§7.6), puts this value at risk. The cooling design (Phase 5) must confirm it or record a change with its reason.

The brief also requires these fields. Each is filled in the phase shown.

| Field | Value now | Filled in |
|---|---|---|
| Selected country and region | United States, Texas; metro chosen in Phase 5 (§7.6) | Done (metro pending) |
| Grid connection concept | — | Phase 5 |
| Backup-power concept | — | Phase 5 |
| Cooling approach | — | Phase 5 |
| Water requirements | — | Phase 5 |
| Network-connectivity requirements | — | Phase 5 |
| Expected electricity sources | Texas grid mix (§7.3 K3); live data in Phase 6 | Phase 6 |
| Major engineering uncertainties | Starting set in §7.7 and §7.10 | Phase 5 |

## 9. Non-goals

| This website is not | Meaning |
|---|---|
| A construction-ready engineering design | No stamped drawings, equipment schedules or sizing calculations |
| A real-time grid-control system | Describes the site's grid behavior; controls nothing |
| A bankable or audited financial model | The economics are indicative, with every assumption labelled |
| Professional engineering certification | The adviser states this when asked (C15) |
| A general-purpose chatbot | Answers only questions about this proposal and its evidence |
| An open web-research tool | Answers come only from stored evidence and approved sources (C9) |
| An operating system for the consortium | Allocation, pricing and governance rules are described, not run |
| A specific site selection | Stops at a candidate region; no land parcel, permit application or utility contract |
| Hardware design | GPUs, servers and racks are described only by their published specifications |

## 10. Carried forward

| Item | Phase |
|---|---|
| A committee-member role, plus storage for recorded decisions (FR17) | 2, 7 |
| Storage for scenario inputs, criteria weights, scores and gate results (FR15, FR16, §7) | 2 |
| Loading the §7.3 evidence and §7.9 sources as seed records, and closing the §7.10 open items | 4 |
| Content for the failure walkthroughs, grid-impact view, access view and lender evidence gates (FR11–FR13, FR18), using the §7.6 conditions | 5 |
| Choosing the Texas metro; testing build vs. lease against TACC's Horizon and Vista | 5 |
| Surveying members' workload mix, which sets how much proximity should weigh (§7.7) | 4 |

## 11. Phase 1 acceptance criteria

- [ ] Every FR (FR1–FR19) has a stakeholder and a pass/fail acceptance criterion (§4)
- [ ] Every constraint (C1–C18) has a source in the brief, an owning phase, and an acceptance criterion (§5)
- [ ] The design matrix is lower-triangular, and the two couplings to keep out are named (§6)
- [ ] Every evidence value in §7.3 meets research rules R1–R7, or is marked "not established"
- [ ] The scores in §7.4 can be reproduced from §7.2 and §7.3: a second reviewer's scores differ by no more than 1 on any criterion and give the same winner
- [ ] The sensitivity table (§7.5) covers equal weights, each doubled weight, removing proximity, alternative demand measures and thresholds, and the named scenarios
- [ ] The decision (§7.6) states its conditions, and the reversal triggers (§7.7) name the evidence that would show each one
