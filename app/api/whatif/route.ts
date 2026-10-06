import { applyScenario, investmentModel, modelDefinitions, proposalData, tenYearCostPath, type ModelInputs } from '../../../lib/db/proposal';

const scenarios = ['base', 'grid-delay', 'half-utilization'] as const;
const optionIds = ['build', 'lease', 'hybrid'] as const;
const limits = new Map<string, readonly [number, number]>(modelDefinitions.map(([key,,,min,max]) => [key, [min, max]]));

function invalid(message: string) {
  return Response.json({ error: message }, { status: 400 });
}

export async function POST(request: Request) {
  let body: unknown;
  try { body = await request.json(); } catch { return invalid('Expected a JSON body.'); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return invalid('Expected an object.');
  const payload = body as Record<string, unknown>;
  if (Object.keys(payload).some(key => !['scenario', 'option', 'overrides'].includes(key))) return invalid('Unknown request field.');
  if (typeof payload.scenario !== 'string' || !scenarios.some(value => value === payload.scenario)) return invalid('Unknown scenario.');
  if (typeof payload.option !== 'string' || !optionIds.some(value => value === payload.option)) return invalid('Unknown option.');
  if (!payload.overrides || typeof payload.overrides !== 'object' || Array.isArray(payload.overrides)) return invalid('Expected an overrides object.');

  const overrides = payload.overrides as Record<string, unknown>;
  const entries = Object.entries(overrides);
  if (entries.length > 20) return invalid('Too many overrides.');
  for (const [key, value] of entries) {
    const range = limits.get(key);
    if (!range) return invalid(`Unknown parameter: ${key}.`);
    if (typeof value !== 'number' || !Number.isFinite(value)) return invalid(`Invalid numeric value for ${key}.`);
    if (value < range[0] || value > range[1]) return invalid(`Value outside the allowed range for ${key}.`);
  }

  const base = { ...proposalData.illustrativeModel, pue: proposalData.design.pue };
  const input = applyScenario({ ...base, ...overrides } as ModelInputs, payload.scenario);
  const options = investmentModel(input);
  const selected = options.find(option => option.id === payload.option);
  if (!selected) return invalid('Unknown option.');
  return Response.json({
    parameters: modelDefinitions.map(([key,,unit]) => ({ key, value: input[key], unit, claimId: null })),
    outputs: options,
    rows: tenYearCostPath(selected, input),
  });
}
