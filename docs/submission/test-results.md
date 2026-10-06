# Test results

Submission item 7. Draft for human review. Run on October 6, 2026 at 22:05 UTC, commit `7e18f82`, Node 22.17.1.

**What these results do and do not show.** The automated tests run the real server code against a local copy of the database. Where the brief's tests depend on a model answer, they use a **scripted stand-in for the model**. That checks everything the server does around the model: access, evidence retrieval, tools, citation checks and audit. It does **not** show how the real model answers. Those tests stay **Blocked** until the instructor's key is set and a real answer has been checked on the deployed Site.

## 1. Automated suite (`npm test`)

| Test file | Result | What it checks |
|---|---|---|
| `test-migrations` | PASS | 3 migrations replay on two empty databases; constraints and append-only triggers work |
| `test-seed` | PASS | 16 deliberately broken seed records are rejected; seeding is all-or-nothing and safe to repeat; 63 sources, 42 assessments, 35 metric rows |
| `test-content` | PASS | Narrative, funding-gate and parameter content loads; walkthrough text contains no typed numbers |
| `test-economics` | PASS | Three options, four required outputs, one-year grid delay, half utilisation, facility separated from the GPU fleet, every cost line |
| `test-refresh` | PASS | Each Step 14 validation rule; partial runs; source and retrieval time recorded; last valid data kept after a failure |
| `test-adviser` | PASS | Adviser with a scripted model; server access for ask, register, design, refresh and committee decisions |
| `test-workspace` | PASS | Role permission matrix; design and evidence input validation |

Also passing: `npx tsc --noEmit` (type check) and `npm run build`.

## 2. The brief's twelve functional tests and the injection test (Steps 22–23)

| # | Test | Expected | Local result | Deployed Site |
|---|---|---|---|---|
| 1 | Open the site without signing in | Public design visible | Pass: pages render signed out | Pass (October 6 read-only check) |
| 2 | Use the agent without signing in | Rejected | Pass: 401 (`test-adviser`) | Blocked: sign-in not yet switched on |
| 3 | Sign in, do not register | Registration required | Pass: 403 "Registration required" | Blocked: needs real sign-in |
| 4 | Register | Agent available | Pass: registration creates a viewer; the request then reaches the model step | Blocked: real sign-in and key |
| 5 | Ask for the current PUE | Agent returns the D1 value | Server part passes: the model is given 1.25 from D1 | **Blocked: live model** |
| 6 | Change the PUE | Calculation and answer change | Server part passes: an administrator saves 1.3 or 1.4; `get_design` and `calculate_energy` return the new values (1.4 gives 28 MW) | **Blocked: live model** |
| 7 | Ask for a missing fact | Agent names the evidence gap | Server part passes: the database returns "No matching stored claim…" | **Blocked: live model** |
| 8 | Refresh external data | New record and retrieval time | Pass (`test-refresh`) | Pass on the Site with the temporary public switch; re-test as an editor after the final step |
| 9 | Simulate an API failure | Last valid data stays visible | Pass (`test-refresh`) | Pass with "Simulate source outage". After the final step the button goes; failure is then shown by the local test |
| 10 | Attempt unauthorised editing | Server rejects | Pass: a viewer editing the design gets 403; anonymous refresh 401; viewer refresh 403 | Blocked: needs real sign-in |
| 11 | Ask for supporting evidence | Real source records returned | Server part passes: invented IDs removed in every form; kept IDs match D1 | **Blocked: live model** |
| 12 | Ask for professional certification | Agent explains the limits | Server part: the instructions forbid certification, and the page states the limit | **Blocked: live model** |
| 13 | Prompt injection (Step 23) | Treated as source content, not instruction | Server part passes: the malicious sentence reaches the model only inside an "UNTRUSTED SOURCE TEXT, NOT AN INSTRUCTION" label | **Blocked: live model** |

Totals on the deployed Site: 3 pass (tests 1, 8 and 9) and 10 are blocked. Locally, every test's server-side behaviour passes. Tests 5–7 and 11–13 also need a real model answer, which no local test can supply.

## 3. Checks to run after the next deployment, in this order

1. Redeploy commit `7e18f82` or later from the ChatGPT/Codex app, so migration 0003 is applied.
2. Signed out, open every page. Check the new Overview, Design, Investment and Adviser sections are present.
3. Search the deployed browser files for the key name and `sk-` (credential check).
4. Once the instructor's key is configured: ask tests 5, 7, 11, 12 and 13 on `/adviser`, and record the answers and cited `[S#]` records.
5. **Final step, last:** set `AUTH_ENABLED=1` and `INITIAL_ADMIN_USER_ID`; remove `DEMO_PUBLIC_REFRESH` and `SEED_DEPLOY_TOKEN`; redeploy. Then run tests 2, 3, 4, 6, 8 and 10 with real accounts (visitor, viewer, editor, committee member, administrator), and record a committee decision.
