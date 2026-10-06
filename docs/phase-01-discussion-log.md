# Phase 1 discussion log

Companion to `phase-01-define-website.md`. It records how the Phase 1 decisions were reached: what was asked, what was found, where the analysis changed course, and why. Written October 6, 2026, for use in the investment memo and the committee presentation.

"Team lead" means the project lead's own direction. "Analysis" means research and calculations done during the session.

---

## 1. Starting point

| # | What happened | Outcome |
|---|---|---|
| 1.1 | The background video, "How Elon Musk is Building the World's Most Impossible Chip Factory", was transcribed and reviewed | The video is about **Terafab, a planned chip factory, not a data center**. Construction starts December 1, 2026, so nothing shown exists yet, and the footage appears AI-generated. Its site, schedule and cost match public announcements. Many specific numbers (50,000 piles, 5 GW) could not be traced to any source. |
| 1.2 | What the video still teaches | A chip factory and an AI data center share the same backbone: very large round-the-clock power from on-site gas turbines, Tesla Megapack batteries as a buffer, recycled water, and work that a one-second power blip can ruin |
| 1.3 | Reference case researched: xAI's Colossus 1 and 2 in Memphis | Gave the physical picture used throughout. The cooling plant runs on the same power as the GPUs. Training loads swing by tens of MW in under a second. In July 2024, about 1,500 MW of Virginia data centers disconnected at once during a grid fault. Large GPU clusters see a job interruption every few hours. |
| 1.4 | The course baseline was checked | 20 MW × 1.25 = 25 MW, and 25 MW × 8,760 h = 219 GWh. Both are correct. 219 GWh assumes full load every hour, so it is an upper bound. |

**Output from this stage:** the research page `ai-datacenter-requirements.html`. It covers physical requirements, a power, cooling, network and failure diagram, and data center requirements. Those requirements are now labelled DC-FR, to keep them apart from the website's FRs.

## 2. Reading the brief: three discoveries

| # | Discovery | Why it matters | Resolution |
|---|---|---|---|
| 2.1 | The brief's FR1–FR10 are requirements for the **website**, not the data center | Easy to conflate. The data center analysis is content the website shows, not what the website is. | Two separate requirement sets: website FRs and DC-FRs |
| 2.2 | The brief's example non-goal, "not a financial investment model", **contradicts PS3**, which requires a 10-year cash-flow model | Following the example literally would drop a required deliverable | Reworded: "not a bankable or audited financial model" |
| 2.3 | The brief states more requirements than it numbers (Steps 11–23 and the PS3 deliverables) | Unnumbered requirements are easy to miss | Brief FR1–FR10 kept verbatim. Engineering rules became constraints C1–C18. User-facing additions became FR11–FR19. |

## 3. How the requirements were shaped

| # | Question | Decision | Who |
|---|---|---|---|
| 3.1 | Who is the site for? | The investment committee first; the team and grader also served | Team lead |
| 3.2 | Are PS3's investment functions website requirements? | Yes. PS3 asks for "a website model with visible assumptions and sensitivity analysis". | Team lead |
| 3.3 | Brief FRs: verbatim, or rewritten as solution-neutral? | Verbatim, because they are graded | Team lead |
| 3.4 | What counts as an FR? | **Things a website user can do.** Engineering rules (server checks, secrets, validation, rate limits) are constraints, except FR1–FR10, which stay because the brief lists them as the minimum. | Team lead, correcting an early draft that mixed the two |
| 3.5 | Which user-facing FRs to add? | Compare build/lease/hybrid; test assumptions; record a committee decision; walk through failures; trace any number; grid-operator impact; small-institution access; lender evidence gates; what would reverse the recommendation | Team lead selected from proposed candidates |
| 3.6 | Structure | A hierarchy of six branches (Present, Store, Refresh, Protect, Advise, Decide) | Team lead |
| 3.7 | Stakeholders | Committee, large universities, small institutions, students, editors, grader, plus lenders and the grid operator | Team lead |

**Coupling check (axiomatic design).** The design matrix is lower-triangular, so the design is **decoupled**. Every requirement can be met, but only if the parts are fixed in a set order: evidence store, access control, data refresh, scenario engine, pages, adviser. This matches the brief's layering rule. Two couplings must be kept out:

- **The AI calculating numbers itself** (prevented by constraint C7)
- **Permissions checked only in the page** (prevented by constraint C10)

## 4. Site selection: how the answer changed

### 4.1 First framing

The team lead chose three countries: the **United States, Finland and Canada**. The analysis proposed one region in each: Massachusetts, Helsinki and Québec. The team lead changed the US region to **Texas**.

The comparison was first framed as choosing the consortium's *home country*, with selection criteria fixed before any evidence was gathered.

### 4.2 First pass: nine criteria, Helsinki won

The research covered nine criteria: grid connection, price, carbon, reliability, climate and water, research base, lease options, permitting, and heat reuse.

| | Texas | Québec | Helsinki |
|---|---|---|---|
| Weighted score | 3.00 | 2.85 | **3.45** |

Helsinki won on reliability, cooling climate, carbon, waste-heat sales and lease options. It led under every weighting tested.

### 4.3 The challenge

> **Team lead:** Finland is fine on energy, but the analysis was missing geographical or network proximity to the US, where most research is done. European data center demand is low. Data-transfer cost to the places that need the most AI has to be considered.

**What went wrong.** The first pass judged each site only by what is inside its fence. It never asked where the users are. Under the "home country" framing, a Finnish winner implied Finnish users, so distance looked irrelevant. That hid a site that is 100–170 ms from most of its users.

**Follow-up decisions by the team lead:**

- Users are **global, weighted by where AI demand actually is**
- Keep criteria **extremely simple**, with data that shows where demand lies
- Legal and compliance issues are recorded as **qualitative evidence only**, not scored
- Cloud usage (for example AWS) is acceptable as a proxy. The team lead expected North America to have the highest demand.

### 4.4 Second pass: what the demand evidence showed

| Finding | Evidence |
|---|---|
| **North America is about 47% of global data center electricity use, and about 62% of the demand a Western university consortium could serve** | IEA *Energy and AI*, April 2026, with China excluded as not addressable. The team lead's expectation is confirmed. |
| Within the US, demand is concentrated in the East | CBRE, first half of 2026: East 59.5%, Central 21.5%, West 19.0% |
| The US holds 54% of the large cloud providers' capacity | Synergy Research, 2025 |
| The AWS site count understates the US (25%) | It measures how widely AWS has spread, not how much it runs, so it is used only as a sensitivity case |
| **Data-transfer price does not separate the sites** | $0.09/GB out of AWS at all three locations. University research networks charge membership fees, not per-GB fees. |
| **The cost of distance is latency** | Texas is 25–50 ms from all US regions. Montréal is 11 ms from the US East Coast. Helsinki is 100–170 ms from US users. |

A new criterion was added: the **share of addressable demand within a 50 ms round trip**, weighted at 25%.

| | Texas | Québec | Helsinki |
|---|---|---|---|
| Demand within 50 ms | 62% | 51% | 20% |
| **Weighted score** | **3.60** | 3.05 | 3.05 |

**Texas was selected.** It stays first in all ten doubled-weight tests, and still leads even if its own grid connection fails.

### 4.5 What the reversal teaches

- **Helsinki leads only when proximity is ignored** (weight 0: Helsinki 3.40, Texas 3.13). The first pass made exactly that mistake.
- **The workload mix decides how much proximity matters.** Large batch training tolerates distance; teaching, notebooks and inference do not. The consortium does not yet know its mix, and finding out is now an open research item.
- The analysis did not rubber-stamp the team lead's expectation. Demand was checked against independent sources, and one proxy (the AWS site count) pointed the other way. It was documented and down-weighted with a stated reason.

## 5. Discoveries by site

| Site | Discovery | Significance |
|---|---|---|
| Texas | At 25 MW the site is **below the 75 MW threshold** of Senate Bill 6 (2025), so it avoids large-load deposits, studies and forced curtailment | A design rule: keep total demand below 75 MW |
| Texas | The large-load queue is 474.7 GW, 90% of it data centers; the governor ordered an audit (August 2026) | Political risk, which could reach smaller sites |
| Texas | Winter Storm Uri (2021) caused about 20,000 MW of rolling blackouts and 246 deaths | Drives backup and winterization requirements |
| Texas | Drought across 85% of the state; high water stress | No evaporative cooling, which puts the 1.25 PUE at risk |
| Québec | Supplying any data center of 5 MW or more needs ministerial authorization; about 2,500 MW of data center requests compete for a few hundred MW | Possible showstopper; the closest of the three sites to failing a gate |
| Québec | A proposed new rate would **roughly double** electricity prices for new data centers; the hearing runs October–December 2026 | A live reversal trigger |
| Québec | Grid carbon of 7.8 g/kWh; Montréal is 11 ms from the US East Coast | The strongest runner-up |
| Helsinki | New large loads in the Helsinki region are restricted until about 2027 | Grid connection is the weak point |
| Helsinki | Data center electricity tax rose from €0.5 to €22.4/MWh on July 1, 2026; the promised compensation was cancelled | Price shock, about €4.9M a year at this size |
| Helsinki | LUMI-AI, due in the second half of 2027, adds about 10× LUMI's AI capacity | The strongest "lease, don't build" case of the three |

## 6. For the memo and presentation

### 6.1 Points to use

1. **Demand decides location.** About 62% of the AI demand the consortium could serve is in North America. A site's power and climate advantages cannot make up for being 100+ ms from most users.
2. **Texas wins on proximity and research base, not on its grid.** Its lead survives even a failed grid connection. It is weakest on carbon, extreme weather and water, and the design conditions address each.
3. **Moving data costs the same everywhere. Distance costs time.** Transfer price is identical across the three sites, so the real cost of a distant site is latency.
4. **Staying at 25 MW is itself a design advantage in Texas.** It keeps the project outside the state's large-load regime.

### 6.2 The three findings most likely to change the recommendation (PS3 memo requirement)

1. **The member workload mix.** If demand is mostly batch training, proximity matters less and Helsinki leads.
2. **Québec's two pending decisions.** Ministerial authorization plus rejection of the new data center rate would make Québec the leader at 3.95.
3. **Texas policy reaching smaller sites.** If the large-load rules or the queue audit extend below 75 MW, grid and permitting risk rise and the site must be re-scored.

### 6.3 Questions the committee is likely to ask

| Question | Answer in brief | Where |
|---|---|---|
| Why not Finland, if it scored best at first? | The first pass ignored where users are; 80% of addressable demand is more than 50 ms from Helsinki | §4.3–4.5 above; Phase 1 doc §7.5 |
| Why exclude China from demand? | A Western university consortium cannot realistically serve it, because of export controls and network barriers. Including China does not change the winner. | Phase 1 doc §7.3, §7.5 |
| Isn't the Texas grid unreliable? | Yes, it scores 2 of 5. The design requires 48-hour backup and winterization. The site still leads because reliability is one criterion among ten. | §7.4, §7.6 |
| What about carbon? | Texas has the dirtiest grid of the three (373 g/kWh). A wind or solar supply contract is modelled as a variant. | §7.6 condition 5 |
| Why 50 ms? | An assumption for interactive use. At 30 ms the answer changes, which is why the workload survey matters. | §7.2, §7.5 |
| Is the transfer-cost finding solid? | The AWS prices are verified. The "no per-GB charge" finding for research networks is inferred from their fee structures, not stated outright by them. | §7.3 K11 |

## 7. How we worked (for the methodology note)

- Decisions were made one phase at a time, with the team lead choosing among options and the analysis supplying evidence and recommendations.
- Research followed fixed rules: unit, period, source, retrieval date and confidence for every value. Anything unverified is "not established" rather than estimated.
- Scoring was checked by script, and the sensitivity tests were run on every weight.
- The first site decision was published, challenged by the team lead, and reversed on new evidence. Both passes are kept in the record.

## 8. Open items carried to Phase 2 and beyond

| Item | Phase |
|---|---|
| Storage for criteria, weights, scores, gates, demand shares and latency data, so the comparison is reproducible on the site | 2 |
| Member workload survey (training vs. interactive mix) | 4 |
| Local-utility energization time and cost in Dallas–Fort Worth and Austin–San Antonio | 4 |
| Measured latency from the chosen metro to member campuses | 4 |
| Choice of Texas metro; build vs. lease against TACC's Horizon and Vista | 5 |
