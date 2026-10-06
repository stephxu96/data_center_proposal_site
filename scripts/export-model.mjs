// Writes deliverables/model-results.json for the memo and deck builders. It runs the
// application's own code (getModelInputs, applyScenario, investmentModel) against the
// seeded database, so document figures match the Site's Investment page exactly.
// Run: node --import ./scripts/test-support/register.mjs --experimental-transform-types scripts/export-model.mjs
import { writeFileSync } from 'node:fs';
import { env } from 'cloudflare:workers';
import { createD1 } from './test-support/d1.mjs';
import { getModelInputs } from '../lib/db/model-inputs.ts';
import { applyScenario, investmentModel } from '../lib/db/proposal.ts';

env.DB = createD1().binding;
const inputs = await getModelInputs();
// Scenario IDs match the builders; each maps to the Site's own scenario key.
const scenarios = [['base', 'base'], ['year-delay', 'grid-year-delay'], ['half-utilization', 'half-utilization']].map(([id, siteKey]) => ({
  id,
  siteKey,
  options: investmentModel(applyScenario(inputs, siteKey)).map(({ rows, ...option }) => option),
}));
const output = new URL('../deliverables/model-results.json', import.meta.url);
writeFileSync(output, JSON.stringify({ generatedAt: new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC', inputs, scenarios }, null, 2) + '\n');
console.log(`Wrote ${output.pathname}`);
for (const s of scenarios) for (const o of s.options) console.log(s.id.padEnd(17), o.id.padEnd(7), 'before', o.beforeOpeningWithDelay.toFixed(1), 'annual', o.annual.toFixed(1), '$/h', o.costPerProductiveHour?.toFixed(2), 'risk', o.capitalAtRiskWithDelay.toFixed(1));
