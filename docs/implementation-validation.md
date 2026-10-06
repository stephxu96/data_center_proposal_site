# Challenge completion audit

Authority: `Lesson 06 — Build a DataCenter Challenge.pdf`, pages 2–22, plus the phased implementation specifications. A passing local unit test is not a substitute for a passing deployed workflow. Status is implementation evidence, not an instructor grade.

| Phase | Required implementation and validation | Current evidence / remaining work |
|---|---|---|
| 1 | Requirements, baseline, assumptions, non-goals, six investment decisions | Existing phase-one specification; audit each rendered decision section in Phase 5 |
| 2 | Persistent typed evidence, assumptions, calculations, decisions; indexes | Applied schema and current-value views; migration replay tests pass |
| 3 | Server-backed Sites, D1 binding, reproducible migrations | Existing main/test Sites; schema-only migrations replay successfully |
| 4 | Seed, provenance, null semantics, data-access layer, evidence trace | Eight normalized files, prepared seed manifest, transactional apply, repeat no-op and sixteen negative validation fixtures implemented; hosted apply/read-back remains |
| 5 | Required pages, deterministic calculations, source ledger, sensitivity, system diagram | Existing pages plus new database claim ledger; complete database read-through and detailed facility/GPU economics next |
| 6 | Genuine external API, validation, protected refresh, retain last valid data | Existing live OWID connection and persistence; broaden regression tests and remove temporary public refresh at final auth activation |
| 7 | Registration, four roles, server permissions | Prepared handlers and interactive workspace; actual sign-in activation and authenticated tests are the final step by user instruction |
| 8 | Model-backed adviser, relevant D1 context, controlled tools, citations, rate limiting | Guided content currently; model-backed route and conversation UI remain. Instructor key is not currently available |
| 9 | Twelve functional tests, prompt-injection test, request trace | Migration/seed/workspace tests exist; full integration and deployed role/model tests remain |
| 10 | Published app, submission evidence, five-minute presentation, two-page memo, video | Existing app/deck/memo; full requirement alignment, artifact rendering, system/architecture diagrams and two-minute video remain |

## Investment deliverable checks

- Preserve the 0.5-month base delay and additional three-month sensitivity. Add the brief-required one-year full-grid delay as a separate scenario, plus half forecast utilization.
- For every required scenario and each build/lease/hybrid option: cash before opening, annual operations, productive GPU-hour cost, capital at risk.
- Ten-year cash flow separates facility and GPU fleet, grid upgrades, electricity, staffing, maintenance, financing, replacement and idle-capacity cost.
- Diagram includes grid, on-site power, UPS, backup, cooling, network, storage and failure paths; explain largest component loss and a 48-hour outage.
- Memo: executive summary; context and evidence-backed argument; conclusion/recommendation; three findings most likely to change it; exactly two rendered pages.
- Presentation: investment recommendation and evidence, required stress results, five-minute timing and question readiness.
- Submission: URL, architecture diagram, schema, sources/APIs, initial design, requirements table, test results, two-minute demonstration video, and individual request-path explanation.

## Final activation gate

Complete implementation, publish and test the public experience first. Then activate Sites sign-in/registration checks, remove temporary public-refresh and seed-deployment switches, and perform the signed-in role matrix. Keep public design/evidence readable. Live-model acceptance cannot pass without the instructor-provided server secret and an actual successful model response.
