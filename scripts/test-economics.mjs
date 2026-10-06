import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { calculateInvestment } from '../lib/db/economics.ts';

const read = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));
const proposal = read('seed/data/proposal.json'), economics = read('seed/data/economics.json');
const base = { ...proposal.illustrativeModel, ...economics, pue: proposal.design.pue, itLoadMw: proposal.design.itLoadMw, operatingHours: proposal.design.operatingHours };
const byId = input => Object.fromEntries(calculateInvestment(input).map(o => [o.id, o]));
const b = byId(base);

// Brief: compare build and own, lease, and a phased hybrid.
assert.deepEqual(Object.keys(b), ['build', 'lease', 'hybrid']);
for (const o of Object.values(b)) {
  assert.equal(o.rows.length, 10, 'ten-year cash flow');
  for (const v of [o.beforeOpeningWithDelay, o.annual, o.costPerProductiveHour, o.capitalAtRiskWithDelay]) assert.ok(Number.isFinite(v), `${o.id} reports the four required outputs`);
  // Every brief cost line exists as its own column.
  for (const k of ['facility', 'gpu', 'grid', 'electricity', 'staffing', 'maintenance', 'financing', 'replacement', 'unusedCapacityCost']) assert.ok(k in o.rows[0], `${o.id} has ${k}`);
}
// Facility is separated from the GPU fleet, grid and land.
assert.equal(b.build.gpuCapital, base.gpuCount * base.gpuPriceUsd / 1e6);
assert.ok(Math.abs(b.build.facilityCapital + b.build.gpuCapital + b.build.gridCapital + b.build.landCapital - base.buildCapexMillions) < 1e-9);
assert.ok(b.build.rows.some(r => r.replacement > 0), 'GPU replacement within ten years');

// Brief stress 1: one-year delay in full grid power.
const year = byId({ ...base, gridDelayMonths: base.gridDelayMonths + 12 });
assert.equal(year.build.openingMonth, base.constructionMonths + base.gridDelayMonths + 12);
assert.ok(year.build.beforeOpeningWithDelay > b.build.beforeOpeningWithDelay, 'delay raises cash before opening');
assert.ok(year.build.capitalAtRiskWithDelay > b.build.capitalAtRiskWithDelay, 'delay raises capital at risk');
assert.equal(year.lease.costPerProductiveHour, b.lease.costPerProductiveHour, 'lease does not wait for the grid');

// Brief stress 2: GPU utilization at half the forecast.
const half = byId({ ...base, utilizationPct: base.utilizationPct / 2 });
for (const id of ['build', 'lease', 'hybrid']) assert.ok(half[id].costPerProductiveHour > b[id].costPerProductiveHour * 1.9, `${id} cost per productive hour roughly doubles`);
assert.ok(half.build.annualUnusedCapacityCost > b.build.annualUnusedCapacityCost);

// No productive hours means the unit cost is undefined, never zero.
assert.equal(byId({ ...base, utilizationPct: 0 }).build.costPerProductiveHour, null);
// Inconsistent capital is rejected rather than silently producing a negative facility cost.
assert.throws(() => calculateInvestment({ ...base, buildCapexMillions: 10 }));
console.log('PASS: three options, four required outputs, one-year grid delay, half utilization, facility/GPU separation and cost lines.');
