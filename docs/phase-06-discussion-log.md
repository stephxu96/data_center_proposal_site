# Phase 6 discussion log

Companion to `phase-06-external-sources.md`. It records how the external-source decisions were made, for the investment memo, the presentation and the individual architecture explanation. Written October 6, 2026.

"Team lead" means the project lead's own direction. "Analysis" means proposals and checks made during the session.

This was the phase where going back to the brief changed the answer.

---

## 1. Why this phase matters for the committee

- **One number on the comparison is live.** The generation mix and carbon intensity for all three countries come from a real external source, with the time they were retrieved shown next to them.
- **A failed source never changes what the committee sees.** If the source is down or returns something malformed, the previous values and their dates stay exactly as they were, and the failure is recorded rather than hidden.
- **Nothing refreshes itself.** Every update is pressed by a named person, and the record says who and when.

## 2. Decisions and who made them

| # | Question | Options considered | Decision | Who |
|---|---|---|---|---|
| 6.1 | How to handle the unknown API key | **One interface with swappable sources**; commit to one API; keyless only; wait for the instructor | A swap, so the source is a configuration value | Team lead |
| 6.2 | Which source is the default | Ember with a keyless backup; **Our World in Data, keyless, with Ember behind the same interface** | The keyless source is the default | Team lead, after the brief was re-read (3.1) |
| 6.3 | What triggers a refresh | **An editor presses it**; also an external scheduled caller | Editor only | Team lead |
| 6.4 | How the failure test runs | **An always-fails adapter on the test Site**; a query flag gated to non-production; unit tests only | The test-Site adapter | Team lead |
| 6.5 | What a refresh does to claims | Write metrics only and leave claims to a person; **relink claims to the newest value** | Relink, with the verification status not carried over and a review queue | Team lead (this overturned the analysis's recommendation) |

## 3. Discoveries

| # | Discovery | Consequence |
|---|---|---|
| 3.1 | The brief names no external data API and sets up no key for one. It mentions Ember exactly once, inside an example of how the adviser should format a citation. The only key it discusses is OpenAI's, and it says students need not create their own. The earlier outline had called Ember "recommended", which the brief does not say anywhere. | The default source became a keyless one. Nothing in this phase now waits on the instructor, and the risk of designing around a key that does not exist is gone. |
| 3.2 | Our World in Data republishes Ember's electricity dataset and serves it without a key. | The citation still credits Ember, matching the brief's own example, while the request needs no secret. The source record names the publisher and records the delivery path. |
| 3.3 | Ember's own API is free but requires sign-up and email verification, so it cannot simply be assumed available. | It stays implemented behind the same interface. If the instructor confirms a key, switching is a configuration change and a line in the submission. |
| 3.4 | Reading the brief directly also closed an older question. Its database binding example is introduced with the word "Conceptually", so the format difference found in Phase 3 was never a conflict. | Phase 3 and its log were corrected, and one instructor question was removed. |
| 3.5 | "Simulate API failure" is one of the brief's twelve named tests, so it has to work on a running site, not only in unit tests. | The always-fails adapter exists only in the test Site's build. Production has no code path that can be asked to fail. |
| 3.6 | Relinking claims to the newest value would, on its own, carry a claim's verified status onto a number no person had read. | The relink happens, but the verification status does not travel with it. Repointed claims enter a review queue marked "not yet re-verified". |
| 3.7 | The failure mode validation misses is a value that is plausible but wrong, since every range check would pass. | A new value more than half away from the current one is still written, because it may well be right, but the run is marked partial and the claim is flagged for review. |
| 3.8 | Writing a row on every refresh, even when nothing changed, would make "last updated" meaningless. | A no-change refresh writes nothing and the page distinguishes when the data was last checked from when it last changed. |

## 4. Verification done in this phase

The brief was extracted and read directly for the first time in this pass, rather than relied on through the earlier outline. That turned up 3.1 and 3.4, and confirmed the exact wording of the seven validation checks and the three relevant named tests.

Three external claims were checked against their publishers rather than assumed: that Ember's API requires a key, that the World Bank's does not, and that Our World in Data serves chart data without one. The Great Britain carbon-intensity API, which needs no key either, was ruled out because it does not cover any of the three countries.

**Still to confirm:** the adapter's behaviour against the live source, which only a real run on the test Site can establish.

## 5. For the memo and presentation

### 5.1 Points to use

1. **The electricity data is live, and dated on the page.** The committee can see when it was last checked and when it last changed, which are different questions.
2. **A broken source cannot corrupt the comparison.** Validation happens before anything is stored, a country that fails is skipped rather than zeroed, and the previous value stays visible.
3. **Every update has a person's name on it.** Nothing refreshes itself, which also means nothing changes between a committee reading the page and a committee discussing it, without someone having done it.
4. **The design does not depend on a key we were never given.** The source is a configuration value, and the default needs no credential at all.

### 5.2 Likely questions

| Question | Answer in brief |
|---|---|
| How current is this data? | Each cell shows when it was retrieved. The page separates when we last checked from when the number last changed. |
| What happens if the source goes down? | Nothing visible changes. The previous values stay, with their original dates, and the failed attempt is recorded. We test this deliberately. |
| Could a bad figure get in? | Nine checks run before anything is stored, including that generation shares sum to a hundred. A figure that passes every check but jumps by more than half is stored and flagged for a person to review rather than trusted. |
| Who can refresh it? | An editor or above, checked on the server. Hiding the button is not the control. |
| Why this source rather than the one in the brief? | The brief does not specify one. It mentions Ember in a citation example, and our citation still credits Ember, because our source republishes Ember's data without needing a key. |

## 6. Open items carried forward

| Item | Phase |
|---|---|
| The role check this endpoint depends on | 7 |
| An editor view for the queue of claims a refresh repointed | 7 |
| The adviser must never reach this endpoint, and its tools take no URL | 8 |
| Two of the brief's named tests are the acceptance criteria here | 9 |
| The list of external sources and APIs is a submission item | 10 |
