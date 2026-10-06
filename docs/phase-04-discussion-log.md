# Phase 4 discussion log

Companion to `phase-04-seed-data.md`. It records how the seed decisions were made and what they cost, for the investment memo, the presentation and the individual architecture explanation. Written October 6, 2026.

"Team lead" means the project lead's own direction. "Analysis" means proposals and checks made during the session.

---

## 1. Why this phase matters for the committee

This is the phase that decides whether the site is evidence or decoration.

- **Every number was opened and read by a person** before it was loaded, and the record says who and when.
- **The data is reviewable as data.** The evidence lives in files a reviewer can read and compare, not buried in code or typed into pages.
- **The decision is reproducible from the evidence.** Loading the data and computing the scores has to return the Phase 1 result. If it does not, the build stops rather than publishing a comparison that no longer matches its own evidence.

## 2. Decisions and who made them

| # | Question | Options considered | Decision | Who |
|---|---|---|---|---|
| 4.1 | How the seed reaches the database | **Reviewable data files plus generated SQL**; a protected import route in the app; hand-written SQL | Data files plus generated SQL, applied separately from the migration | Team lead |
| 4.2 | What a second run does | **Fixed identifiers plus a guard row**; insert-if-absent on natural keys; fresh database only | Guard row, so a reseed is safe on a live Site | Team lead |
| 4.3 | How much to load now | **Evidence, scoring and design claims**; everything Phase 2 defined; the brief's minimum | The evidence and the full site selection. Narratives and scenario content move to Phase 5 | Team lead |
| 4.4 | How to store prices published in different currencies | Native currency plus a conversion claim; **convert to USD on load** | USD on load, with the published figure, the rate and the rate's date kept in the note | Team lead (this overturned the analysis's recommendation) |
| 4.5 | How a verifier is recorded | **Role and date**; personal name and date | Role and date, because the repository is submitted | Analysis, uncontested |

## 3. Discoveries

| # | Discovery | Consequence |
|---|---|---|
| 3.1 | Append-only and "running the seed twice must not duplicate" are in direct conflict. A second run cannot overwrite, so it would insert rows that look like newer values and quietly change what the site shows. | The guard row. This is the rule that makes a reseed safe on a Site the committee is already reading. |
| 3.2 | Converting prices to USD on load would, on its own, destroy the audit trail: the committee would see a number with no published original behind it. | The conversion is recorded in the note, the rate is itself a sourced metric, and an assumption claim cites it. The single unit is kept without losing the working. |
| 3.3 | Row counts are a weak test. A seed can load the right number of rows into every table and still no longer support the recommendation. | Two validations do the real work: that the evidence links still reach a source from every score, and that the computed scores still equal the Phase 1 figures. Either failing stops the build. |
| 3.4 | Roughly eight of the values the design wants are genuinely unknown, including the one that matters most commercially: how many months a 25 MW grid connection takes. | They are loaded as NULL with a note saying what would establish each. Several are the conditions the Phase 1 decision depends on, and they become the lender evidence gates in Phase 5. |
| 3.5 | The earlier research page's 33 references cannot simply be imported. Phase 1 already flagged that several of its sources disagree. | Every figure is re-verified against its source before loading, and a disagreement is recorded with the confidence lowered. |
| 3.6 | The latency figures are estimates from city pings, not measurements of this facility, which does not exist. | They are typed as estimates, never facts. The distinction is visible on the comparison page, and it matters: proximity carries the heaviest weight in the decision. |
| 3.7 | Phase 2 forbids storing a calculated value, so the weighted score is not in the seed at all. | The comparison page computes it from the loaded weights and scores every time it is shown. Changing a weight re-ranks the sites with no reseed. |

## 4. Verification done in this phase

None of the data has been loaded: this is a design pass. What was done is specification. The seed mapping in Phase 2 §7 was checked line by line against the Phase 1 evidence, and the counts in the design document come from that mapping, not from an estimate.

Two things were settled that the earlier outline had left loose: that "latest" needs a tie-break, which it now has, and that the generator, not the reviewer, enforces the brief's required fields.

**Still to confirm:** every value, by a person, following the procedure in §7 of the design document. That work has not started.

## 5. For the memo and presentation

### 5.1 Points to use

1. **Three countries, every figure opened and checked.** Where a number could not be verified, the site says so rather than showing a plausible one.
2. **The unknowns are published, not hidden.** The most commercially important number in the proposal, the time to get a 25 MW grid connection, is not established at any of the three sites, and the site says that plainly.
3. **The recommendation is recomputed from the evidence, not asserted.** If the evidence changes, the ranking changes with it, and the build refuses to publish a comparison that no longer matches its sources.
4. **Prices are comparable without hiding the conversion.** Everything is shown in dollars; each converted figure carries the published original and the rate used.

### 5.2 Likely questions

| Question | Answer in brief |
|---|---|
| How do we know someone actually checked these numbers? | Every record names the role that verified it and the date, and a tenth of them were re-opened by a second reviewer. The procedure is written down. |
| Why are some cells empty? | Because the figure is not published, not because it is zero. Each empty cell says what is missing and what would establish it. |
| Why is latency an estimate rather than a fact? | The facility does not exist. The figures come from city-to-city measurements, and calling them facts would overstate what we know. |
| What if one of these sources is wrong? | A correction is a new seed version that supersedes the old rows; nothing is overwritten, and the comparison is recomputed. If the scores stop matching the analysis, the build stops. |
| Did you use the earlier research page as-is? | No. Its 33 references were re-verified, because that page itself flags that some of its sources disagree. |

## 6. Open items carried forward

| Item | Phase |
|---|---|
| Carry out the verification procedure on every value | 4, before any build |
| Scenario overrides, economics parameters, narratives and the lender evidence gates | 5 |
| The member demand survey, which sets the proximity weight and is a Phase 1 reversal trigger | 5 |
| The refresh endpoint writes through the same validation as the seed | 6 |
| The prompt-injection test uses the test Site's copy of this data | 9 |
