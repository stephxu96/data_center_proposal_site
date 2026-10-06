# Phase 5 discussion log

Companion to `phase-05-interface.md`. It records how the interface and economics decisions were made, for the investment memo, the presentation and the individual architecture explanation. Written October 6, 2026.

"Team lead" means the project lead's own direction. "Analysis" means proposals and checks made during the session.

The decisions were taken in two rounds, because this phase carries more choices than the others put together.

---

## 1. Why this phase matters for the committee

This is the phase the committee actually sees. Three things in it decide whether the site earns their trust:

- **No number is typed into a page.** Every figure is computed or recalled, labelled with what kind of thing it is, and traceable to a source in two clicks.
- **The committee can push back and watch the answer move.** Changing the electricity price, the utilization, the efficiency or the grid delay re-runs the whole case, and the result is computed where it can be audited, not in the reader's browser.
- **What is not known is published.** The most important commercial unknowns, how long a grid connection takes and what the member institutions will actually commit, appear as unknowns rather than as plausible figures.

## 2. Decisions and who made them

### Round one: structure

| # | Question | Options considered | Decision | Who |
|---|---|---|---|---|
| 5.1 | Where a visitor's what-if is computed | **On the server, one implementation**; in the browser; hybrid with provisional figures | Server. Controls apply a change rather than sliding live | Team lead |
| 5.2 | Where the thirty economics inputs live | **All in the database as parameters**; headline drivers only; an assumptions file mirrored as claims | All in the database, each with a claim and a source | Team lead |
| 5.3 | How the narrative content is loaded | **The Phase 4 pipeline, as a new seed version**; page copy in code; an editor screen in the app | The Phase 4 pipeline | Team lead |
| 5.4 | How the system diagram is produced | **Hand-authored inline SVG**; Mermaid; an exported image | Inline SVG, with its figures injected from claims | Team lead |

### Round two: content

| # | Question | Options considered | Decision | Who |
|---|---|---|---|---|
| 5.5 | How stress cases are expressed | **Parameter overrides only**; overrides plus a code branch; three hand-computed result sets | Overrides only, which needed two new parameters | Team lead |
| 5.6 | How the cash flow is presented | **Nominal table with a discounted summary**; discounted headline; nominal only | Nominal rows, with present value among the summary outputs | Team lead |
| 5.7 | Whether Phase 5 records a committee decision | **Display only**; build the form now | Display only; the form waits for the role checks in Phase 7 | Team lead |
| 5.8 | How terms are explained | Inline on first use plus a glossary; inline only; **a glossary page with linked terms** | A glossary route, with entries linking back to the pages | Team lead (this overturned the analysis's recommendation) |

## 3. Discoveries

| # | Discovery | Consequence |
|---|---|---|
| 3.1 | Computing what-ifs in the browser would have broken the rule the whole project rests on. The figures on screen would have come from a different run than the adviser's answers, and from a place the committee cannot audit. | Everything goes through one registry on the server. The cost is a round trip, so the controls apply a change rather than sliding live. It is the right trade. |
| 3.2 | A one-year grid delay is not naturally an input to anything. It only has an effect if the model knows when the site starts earning. | Two new parameters, a delay and a utilization, turn both stress cases into pure data. The cash flow has one code path, and a fourth case would be a data change. |
| 3.3 | The economics cannot produce a return, because nobody has yet asked the member institutions what they will commit. | The model reports cost per productive GPU-hour instead, and the page says why. The survey is already a Phase 1 reversal trigger; this makes its absence visible to the committee rather than papering over it. |
| 3.4 | Thirty economics inputs, each needing a claim and a source, is the largest content job in the project. | Accepted deliberately: a figure on the Investment Case page with nothing behind it would undo what Phases 2 and 4 are for. Inputs may be assumptions sourced to the course baseline, as long as each says so. |
| 3.5 | The lender evidence view will read mostly missing or partial. | That is the truthful state of a proposal at this stage. The page frames it as the evidence plan rather than a scorecard, and the memo makes the same point rather than hiding it. |
| 3.6 | The walkthroughs need numbers that do not exist yet, such as fuel quantities for 48 hours. | Each becomes a claim: a calculation with its formula, or an unknown. Phase 2's rule that step text contains no digits is what forces this, and it is worth the friction. |
| 3.7 | An exported image of the system diagram would have been invisible to the adviser and to a screen reader, and would have gone stale silently. | Inline SVG with figures injected from claims, and a labelled table carrying the same content. The diagram cannot show a number the database does not hold. |
| 3.8 | The stub for this phase referenced requirements FR21 and FR22, which do not exist: Phase 1 ends at FR19. | Corrected. The content those identifiers pointed at is covered by FR15, FR16 and FR19. |

## 4. Verification done in this phase

Nothing was built. The checking done here was consistency: every page block in the design document was traced to a requirement, every requirement from FR1 to FR19 was traced to a page block, and every calculation key in Phase 2's registry was carried forward or explicitly extended.

Three gaps were found and closed in the document rather than left for the build: the stale requirement identifiers (3.8), the absence of any parameter that a grid delay could act on (3.2), and the fact that no formula existed for the four outputs FR15 names.

**Still to confirm:** every economics figure, by a person, with a source. None has been set.

## 5. For the memo and presentation

### 5.1 Points to use

1. **Challenge any number and watch the case move.** Electricity price, utilization, efficiency and grid delay all re-run the ten-year cash flow, including both stress cases.
2. **A one-year grid delay is modelled, not described.** It is the stress case that matters most in Texas, and it is a parameter the committee can set themselves.
3. **We report cost per productive GPU-hour, not a return.** Nobody has surveyed what the member institutions will commit, so a return would be invented. The site says so.
4. **The evidence lenders will ask for is listed, with what exists so far.** Most of it does not exist yet, which is the honest position for a proposal at this stage.
5. **One page shows the whole system, including both failure paths**, and every figure on it comes from the database rather than from the drawing.

### 5.2 Likely questions

| Question | Answer in brief |
|---|---|
| Can we change the assumptions ourselves? | Yes, on the Investment Case and the comparison. The recomputation happens on the server, using the same formulas the rest of the site uses, so nothing you see is a different calculation from the one behind the recommendation. |
| Why is there no rate of return? | Because the demand side is not yet evidenced. We publish cost per productive GPU-hour, which depends only on things we can source, and we name the survey that would let us go further. |
| Why does the lender evidence look so empty? | Because it is early. The page is the plan for closing those gaps, in the order a lender will ask for them. |
| Are these costs reliable? | They are indicative and every input is labelled. This is explicitly not a bankable or audited financial model, and the site says so. |
| What happens if the grid connection slips? | Select the stress case. The site re-runs the ten years with the site earning nothing for an extra year, and shows what that does to the cash required and the cost per GPU-hour. |

## 6. Open items carried forward

| Item | Phase |
|---|---|
| Set and source every economics parameter | 5, before any build |
| The committee decision form, with its role check | 7 |
| The adviser uses this registry and these claims | 8 |
| The twenty-two acceptance criteria become test cases | 9 |
| The member demand survey, which sets both the proximity weight and the committed hours | 10, or dropped with the gap stated |
