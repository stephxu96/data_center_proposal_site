import assert from 'node:assert/strict';
import { hasRole, validateDesign, validateEvidence } from '../lib/workspace-model.ts';

const expected = { visitor: [false,false,false], viewer: [true,false,false], committee: [true,false,false], editor: [true,true,false], admin: [true,true,true] };
for (const [role, permissions] of Object.entries(expected)) {
  ['viewer','editor','admin'].forEach((minimum,index) => assert.equal(hasRole(role, minimum), permissions[index], `${role} must satisfy ${minimum} correctly`));
}
const design = { itLoadMw: 20, pue: 1.25, operatingHours: 8760, rationale: 'Reference design assumptions.' };
assert.deepEqual(validateDesign(design), design);
for (const bad of [{pue:0.9},{pue:NaN},{itLoadMw:-20},{itLoadMw:'20'},{operatingHours:9000},{rationale:''}]) assert.throws(() => validateDesign({...design,...bad}));
const evidence = { country:'FI', metric:'grid_carbon_intensity', value:57.5, period:'2025', publisher:'Ember', title:'Grid carbon intensity', url:'https://ourworldindata.org/grapher/carbon-intensity-electricity', notes:'Annual country-level published value.', sourceType:'research_firm' };
assert.equal(validateEvidence(evidence).unit, 'gCO2/kWh');
for (const bad of [{country:'XX'},{value:Infinity},{value:-1},{value:1500},{period:'2025-99'},{url:'javascript:alert(1)'},{url:'https://user:secret@example.com'},{notes:''},{sourceType:'invented'}]) assert.throws(() => validateEvidence({...evidence,...bad}));
assert.throws(() => validateEvidence({...evidence,metric:'datacenter_count',value:1.2}));
console.log('PASS: role permission matrix and design/evidence input validation.');
