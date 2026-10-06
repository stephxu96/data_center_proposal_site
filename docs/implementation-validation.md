# Challenge completion audit

Authority: `Lesson 06 — Build a DataCenter Challenge.pdf`, pages 2–22, plus the phased implementation specifications. A passing local unit test is not a substitute for a passing deployed workflow. Status is implementation evidence, not an instructor grade.

| Phase | Required implementation and validation | Current evidence / remaining work (October 6, 22:05 UTC, commit `7e18f82`) |
|---|---|---|
| 1 | Requirements, baseline, assumptions, non-goals, six investment decisions | Done. Design record added to `/design`; six decisions indexed on `/` |
| 2 | Persistent typed evidence, assumptions, calculations, decisions; indexes | Done. Migration replay passes |
| 3 | Server-backed Sites, D1 binding, reproducible migrations | Done. Migration 0003 must be applied at the next deployment |
| 4 | Seed, provenance, null semantics, data-access layer, evidence trace | Done locally. Hosted apply and read-back remain (the deployed ledger shows 64 claims; the local seed has 101) |
| 5 | Required pages, deterministic calculations, source ledger, sensitivity, system diagram | Done locally (commit `a696065`). Gap: data-center count, electricity use and water figures need sourcing by the team |
| 6 | Genuine external API, validation, protected refresh, retain last valid data | Done locally (commit `2307d31`): unit check and full validation tests. Gap: three human-verified sources |
| 7 | Registration, roles, server permissions, committee decisions (FR17) | Code done and tested (commit `7e18f82`). Sign-in activation is the final step |
| 8 | Model-backed adviser, relevant D1 context, controlled tools, citations, rate limiting | Done locally (commit `b8fc90b`). Live answers blocked: instructor key not available |
| 9 | Twelve functional tests, prompt-injection test, request trace | Server behaviour checked locally; 10 of 13 blocked on the deployed Site. See `submission/test-results.md` |
| 10 | Published app, submission evidence, five-minute presentation, two-page memo, video | Submission documents in `docs/submission/`. Deck and memo audited, not edited; their build scripts need `deliverables/model-results.json`. Video remains |

Full requirement-by-requirement status: `docs/submission/requirements-traceability.md`.

## Investment deliverable checks

- Preserve the 0.5-month base delay and additional three-month sensitivity. The brief-required one-year full-grid delay and half forecast utilization are on `/investment` (done).
- For every required scenario and each build/lease/hybrid option: cash before opening, annual operations, productive GPU-hour cost, capital at risk.
- Ten-year cash flow separates facility and GPU fleet, grid upgrades, electricity, staffing, maintenance, financing, replacement and idle-capacity cost.
- Diagram includes grid, on-site power, UPS, backup, cooling, network, storage and failure paths; explain largest component loss and a 48-hour outage.
- Memo: executive summary; context and evidence-backed argument; conclusion/recommendation; three findings most likely to change it; exactly two rendered pages.
- Presentation: investment recommendation and evidence, required stress results, five-minute timing and question readiness.
- Submission: URL, architecture diagram, schema, sources/APIs, initial design, requirements table, test results, two-minute demonstration video, and individual request-path explanation.

## Final activation gate

Complete implementation, publish and test the public experience first. Then activate Sites sign-in/registration checks, remove temporary public-refresh and seed-deployment switches, and perform the signed-in role matrix. Keep public design/evidence readable. Live-model acceptance cannot pass without the instructor-provided server secret and an actual successful model response.
