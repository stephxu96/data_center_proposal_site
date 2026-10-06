# Seed data

`data/proposal.json` holds the design inputs, location assessment, conditions and scenario inputs used by the decision explorer. Calculated outputs live in `lib/db/proposal.ts`.

The eight additional JSON files materialize the phase-one specification into normalized records. `npm run seed:generate` validates them before emitting the eight ordered SQL files and a prepared-statement manifest. `npm test` exercises every validation family and replays the seed into a fresh SQLite database with all migrations, foreign keys, and append-only triggers enabled.

`lib/db/seed.ts` applies the manifest with a single transactional D1 batch and inserts the version marker last. Repeating the same version is a no-op. References resolve by stable seed keys, not assumed numeric IDs, so existing live-source records can coexist with the seed. Citations use the actual D1 source ID; seed labels remain internal provenance identifiers.

For deployment, configure a temporary secret `SEED_DEPLOY_TOKEN`, deploy, and POST `/api/seed` with the matching server-side bearer credential. Remove the temporary secret and redeploy once read-back checks succeed. This deployment route is disabled without the secret; it never accepts caller-supplied SQL or seed rows. Normal editors use the authenticated evidence endpoints instead. Never put the token in a URL, repository, browser, or log.

Applied seed versions are immutable. Corrections require a new version and new append-only records. `seed/assemble.mjs` is the one-time importer for the existing specification, not a routine refresh command. Do not rerun it over an applied dataset.
