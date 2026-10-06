# Phase 4 schema reconciliation

Recorded after the first successful deployment of migration `0001` to the isolated test Site. `0001` is immutable. These changes belong in a later numbered migration and in the seed specification before any evidence is loaded.

| Phase 4 statement | Deployed Phase 2 schema | Resolution |
|---|---|---|
| An unknown metric has `claim_type: unknown` and `source_id: null` | `metrics.claim_type` accepts only `fact` or `estimate`; `source_id` is required | Store the gap as an `unknown` design claim with `value NULL` and a reason. Do not insert a metric row that falsely implies a source. Comparison queries join the unknown claim for that criterion. |
| Sources and metrics carry `verified_by` and `verified_at` | Neither table has those columns | Add nullable verifier role and date columns in `0002`. A pending record must not be presented as human verified. |
| Numeric-ID records also have a stable `seed_key` | No `seed_key` column exists | Add nullable, unique `seed_key` columns to seeded tables in `0002`. Keep numeric primary keys for foreign keys and source citations. |
| Every seed record has an identifier and many references use text IDs | Most Phase 2 primary keys are integers | The generator maps each text ID to its stable numeric row through `seed_key`. Source IDs `S1`–`S63` map to numeric IDs 1–63. |
| The generator writes eight SQL files and applies them as a unit | `seed_runs` exists in `0001` | Keep the SQL separate from migrations and insert the marker last. Apply to an empty database until a transactional retry path is verified. |

Phase 6 also conflicts with the append-only contract: `refresh_runs` cannot start as `running` because its status check permits only completed states and `finished_at` is required. Its proposed in-place relinking of `claim_links` is prohibited by append-only triggers. The implementation must record one completed run and supersede affected claims with new claims and links. Concurrency control needs a separate mutable lock, not a `refresh_runs` update.
