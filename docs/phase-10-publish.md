# Phase 10: Publish and document

Brief reference: Steps 25–26 (page 22); PS3 deliverables (page 3)
Depends on: Phase 9
Produces: the live site, the submission package, the PS3 memo and presentation
Status: draft

## 1. Pre-publication checklist (brief Step 25)

- [ ] D1 binding `DB` is configured
- [ ] Migrations apply successfully on a fresh database (0001, then 0002 if adopted)
- [ ] Hosted secrets are configured (OpenAI; external API)
- [ ] No credentials appear in browser code (T14)
- [ ] Protected routes perform server-side checks (T2, T3, T10)
- [ ] Source URLs and timestamps are visible on Comparison and Evidence
- [ ] The build completes without errors
- [ ] The deployed site passes the same tests as the preview (Phase 9)
- [ ] The website URL has been added to the class's shared document (brief, page 1)

## 2. Submission package (brief Step 26)

| # | Item | Where it comes from |
|---|---|---|
| 1 | Published website URL | Sites publish |
| 2 | Architecture diagram (the website system: browser → backend → D1 / external API / OpenAI) | New diagram from Phases 3, 6, 7, 8; different from the data center system diagram |
| 3 | D1 schema | Phase 2 (0001, plus 0002 if adopted) |
| 4 | List of external sources and APIs | Phase 4 seed sources; Phase 6 API |
| 5 | Initial data center design | Initial Design page; Phase 1 assumption record |
| 6 | Functional-requirements table | Phase 1 §1 with Phase 9 pass/fail filled in |
| 7 | Test results | Phase 9 table with evidence |
| 8 | Two-minute demonstration video | Script below |
| 9 | Short individual explanation of one request from browser to D1 to OpenAI and back | Phase 9 §3 trace; each member writes their own |

### Two-minute demo script (draft)

| Time | Show |
|---|---|
| 0:00–0:20 | Overview: recommendation, 25 MW, the three uncertainties |
| 0:20–0:40 | Country Comparison: data vintage, a NULL value with its explanation |
| 0:40–1:00 | Initial Design: diagram and the 48-hour outage walkthrough |
| 1:00–1:20 | Signed out → adviser blocked; sign in, register → adviser works |
| 1:20–1:45 | Ask about PUE → cited answer; change the PUE → new answer |
| 1:45–2:00 | Refresh fails → last valid data remains |

## 3. PS3 deliverables

These are separate from the website submission but use the same evidence.

| Deliverable | Content | Draws on |
|---|---|---|
| Two-page investment memo | Recommendation (approve / reject / send back); the three findings most likely to change it; base case and stress-case outputs; what additional data would verify the uptime target | Investment Case page; Phase 1 §4 |
| Five-minute committee presentation, then questions | Decision first, then the evidence and the risks | Same |
| System diagram (one page) | Power, cooling, networking, failure paths | Initial Design page |

The PS3 brief's framing applies to all three: "Your team's objective is not to make the project look attractive." The memo should lead with whether a shared 25 MW facility meets a **demonstrated** need at an acceptable cost and risk.

## Done when

- [ ] Every checklist item is ticked, with evidence
- [ ] All nine submission items are collected
- [ ] The memo, presentation and diagram agree with the live site's numbers
