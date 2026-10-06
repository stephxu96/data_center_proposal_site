import assert from 'node:assert/strict';
import { env } from 'cloudflare:workers';
import { createD1 } from './test-support/d1.mjs';
import { fetchOwid, LIVE_SOURCE } from '../lib/sources/owid.ts';
import { getLiveCountries, saveLiveRefresh } from '../lib/db/live.ts';

// Brief Step 14 checks, each against the real adapter with a scripted upstream.
const year = new Date().getUTCFullYear() - 1;
const mixHeader = 'Entity,Code,Year,Coal,Gas,Nuclear,Hydropower,Solar,Wind';
const mixRow = (code, values = '20,40,18,6,6,10') => `${code},${code},${year},${values}`;
const carbonRow = (code, value = 380) => `${code},${code},${year},${value}`;
const csv = (mix, carbon) => ({ [LIVE_SOURCE.mixUrl]: `${mixHeader}\n${mix.join('\n')}`, [LIVE_SOURCE.carbonUrl]: `Entity,Code,Year,Carbon intensity\n${carbon.join('\n')}` });
const good = () => csv(['USA', 'CAN', 'FIN'].map(c => mixRow(c)), ['USA', 'CAN', 'FIN'].map(c => carbonRow(c)));
function upstream(bodies, { status = 200, type = 'text/csv' } = {}) {
  globalThis.fetch = async url => new Response(bodies[url] ?? '', { status, headers: { 'content-type': type } });
}
const run = () => fetchOwid(['US', 'CA', 'FI'], new AbortController().signal);

upstream(good());
let r = await run();
assert.equal(r.data.length, 3); assert.deepEqual(r.errors, []);
assert.equal(r.data[0].year, year); assert.equal(r.data[0].mix.Other, 0);

upstream(good(), { status: 503 });
await assert.rejects(run, /did not respond/, 'HTTP request succeeded');
upstream(good(), { type: 'text/html' });
await assert.rejects(run, /format changed/, 'response format');
upstream({ [LIVE_SOURCE.mixUrl]: 'Entity,Country\nx,y', [LIVE_SOURCE.carbonUrl]: 'Entity,Country\nx,y' });
await assert.rejects(run, /fields changed/, 'expected fields exist');

const one = (mix, carbon) => { upstream(csv([mixRow('USA', mix), mixRow('CAN'), mixRow('FIN')], [carbonRow('USA', carbon), carbonRow('CAN'), carbonRow('FIN')])); return run(); };
r = await one('20,forty,18,6,6,10'); assert.match(r.errors[0], /^US: .*nonnumeric/, 'numeric where required');
r = await one('20,,18,6,6,10'); assert.match(r.errors[0], /^US: .*missing value/, 'missing value');
r = await one(undefined, 5000); assert.match(r.errors[0], /^US: .*out of range/, 'carbon intensity range');
r = await one('20,140,18,6,6,10'); assert.match(r.errors[0], /^US: /, 'share range');
assert.equal(r.data.length, 2, 'other countries still accepted (partial)');
upstream(csv(['USA', 'CAN', 'FIN'].map(c => `${c},${c},${year - 9},20,40,18,6,6,10`), ['USA', 'CAN', 'FIN'].map(c => `${c},${c},${year - 9},380`)));
r = await run(); assert.equal(r.data.length, 0); assert.match(r.errors[0], /period is invalid/, 'reporting period present and current');

// Persistence: source and retrieval date recorded; last valid data retained on failure.
env.DB = createD1().binding;
upstream(good()); r = await run();
let saved = await saveLiveRefresh(r.data, new Date().toISOString());
assert.equal(saved.status, 'ok'); assert.equal(saved.rowsAdded, 24);
let live = await getLiveCountries();
assert.equal(live.countries.length, 3);
for (const c of live.countries) { assert.ok(c.retrievedAt); assert.match(c.sourceUrl, /^https:\/\/ourworldindata\.org\//); }
const before = JSON.stringify(live.countries);

saved = await saveLiveRefresh([], new Date().toISOString(), 'Simulated external source outage');
assert.equal(saved.status, 'failed'); assert.equal(saved.rowsAdded, 0);
live = await getLiveCountries();
assert.equal(JSON.stringify(live.countries), before, 'last valid data remains after a failed refresh');
assert.equal(live.lastRun.status, 'failed');

saved = await saveLiveRefresh(r.data, new Date().toISOString());
assert.equal(saved.rowsAdded, 0, 'unchanged values add no rows');

// Units recognized: a value outside its registered definition is rejected; that country keeps its old record.
const bad = r.data.map(c => c.countryCode === 'FI' ? { ...c, mix: { ...c.mix, Other: 150 } } : { ...c, carbonIntensity: c.carbonIntensity + 1 });
saved = await saveLiveRefresh(bad, new Date().toISOString());
assert.equal(saved.status, 'partial'); assert.match(saved.error, /FI: unit or range/);
live = await getLiveCountries();
assert.equal(live.countries.find(c => c.countryCode === 'FI').mix.Other, r.data[2].mix.Other);
assert.equal(live.countries.find(c => c.countryCode === 'US').carbonIntensity, r.data[0].carbonIntensity + 1);
console.log('PASS: refresh validation (HTTP, format, fields, numeric, period, ranges, units), partial runs, provenance and last-valid retention.');
