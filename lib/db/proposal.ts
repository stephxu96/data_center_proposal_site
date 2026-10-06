import proposal from '../../seed/data/proposal.json';
import economics from '../../seed/data/economics.json';
import { calculateInvestment, type EconomicsInputs } from './economics';
export const economicsDefaults=economics;

export const proposalData = proposal;
export type Candidate = (typeof proposal.candidates)[number];

export function facilityPowerMw(itLoadMw = proposal.design.itLoadMw, pue = proposal.design.pue) {
  return itLoadMw * pue;
}

export function annualEnergyGwh(itLoadMw = proposal.design.itLoadMw, pue = proposal.design.pue, hours = proposal.design.operatingHours) {
  return facilityPowerMw(itLoadMw, pue) * hours / 1000;
}

export function outageEnergyMwh(hours = proposal.design.gridOutageHours) {
  return facilityPowerMw() * hours;
}

export function weightedScore(scores: number[]) {
  return proposal.criteria.reduce((sum, criterion, index) => sum + scores[index] * criterion.weight / 100, 0);
}

export function annualPowerCostMillions(priceUsdPerMwh: number, pue = proposal.design.pue) {
  return annualEnergyGwh(proposal.design.itLoadMw, pue) * priceUsdPerMwh / 1000;
}

export function numericInput(raw: string | string[] | undefined, min: number, max: number): number | null {
  const value = typeof raw === 'string' && raw.trim() !== '' ? Number(raw) : null;
  return value !== null && Number.isFinite(value) && value >= min && value <= max ? value : null;
}

export type ModelInputs = typeof proposal.illustrativeModel & { pue: number } & Partial<typeof economics> & {itLoadMw?:number;operatingHours?:number};
export const modelDefinitions = [
  ['powerPriceUsdMwh','Power price','USD / MWh',0,500],
  ['utilizationPct','GPU utilization','%',0,100],
  ['gpuCount','GPU count','units',1,100000],
  ['pue','Facility PUE','ratio',1,3],
  ['buildCapexMillions','Build capital','USD millions',0,10000],
  ['hybridCapexMillions','Hybrid capital','USD millions',0,10000],
  ['annualLeaseMillions','Annual lease','USD millions',0,10000],
  ['hybridLeaseMillions','Hybrid annual lease','USD millions',0,10000],
  ['annualNonPowerOpsMillions','Non-power operations','USD millions / year',0,10000],
  ['delayCarryingMillionsPerMonth','Delay carrying cost','USD millions / month',0,10000],
  ['gridDelayMonths','Grid delay','months',0,60],
  ['gpuPriceUsd','GPU acquisition price','USD / GPU',0,100000],
  ['gridUpgradeMillions','Grid upgrades within capital','USD millions',0,10000],
  ['landMillions','Land within capital','USD millions',0,10000],
  ['staffMillions','Staff within non-power operations','USD millions / year',0,10000],
  ['maintenanceMillions','Maintenance within non-power operations','USD millions / year',0,10000],
  ['constructionMonths','Planned construction','months',0,60],
  ['replacementYears','GPU replacement cycle','years',1,10],
  ['debtSharePct','Debt share of initial capital','%',0,100],
  ['debtRatePct','Debt interest','% / year',0,30],
  ['debtTermYears','Debt amortization','years',1,30],
  ['discountRatePct','Discount rate','%',0,30],
  ['availabilityPct','Productive availability','%',0,100],
  ['salvagePct','Year-three capital recovery','%',0,100],
  ['leaseEscalationPct','Lease escalation','% / year',0,30],
  ['hybridOwnedPct','Hybrid owned capacity','%',0,100],
  ['hybridPhaseYear','Hybrid construction start','year',1,10],
  ['memberChargeUsdHour','Member recovery charge','USD / productive GPU-hour',0,100],
] as const;
export function investmentModel(input: ModelInputs) {
  return calculateInvestment({...economics,itLoadMw:proposal.design.itLoadMw,operatingHours:proposal.design.operatingHours,...input} as EconomicsInputs);
}

export function applyScenario(input: ModelInputs, scenario: string): ModelInputs {
  if (scenario === 'grid-delay') return { ...input, gridDelayMonths: input.gridDelayMonths + 3 };
  if (scenario === 'grid-year-delay') return { ...input, gridDelayMonths: input.gridDelayMonths + 12 };
  if (scenario === 'half-utilization') return { ...input, utilizationPct: input.utilizationPct / 2 };
  return input;
}

export function tenYearCostPath(option: ReturnType<typeof investmentModel>[number], input: ModelInputs) {
  return option.rows;
}

// One-at-a-time sensitivity: each input moved ±25% from the current values, all
// else held. Rows sort by the widest swing in ten-year cost per productive GPU-hour.
export const sensitivityKeys = ['utilizationPct','annualLeaseMillions','buildCapexMillions','gpuPriceUsd','replacementYears','annualNonPowerOpsMillions','hybridLeaseMillions','hybridCapexMillions','powerPriceUsdMwh','pue','debtRatePct','gridDelayMonths'] as const;
export function sensitivity(input: ModelInputs, swing = 0.25) {
  const cost = (value: ModelInputs) => { try { return investmentModel(value).map(o => o.costPerProductiveHour); } catch { return null; } };
  const base = cost(input);
  return sensitivityKeys.map(key => {
    const definition = modelDefinitions.find(([k]) => k === key)!;
    const bounded = (v: number) => Math.min(definition[4], Math.max(definition[3], v));
    const low = bounded((input[key] as number) * (1 - swing)), high = bounded((input[key] as number) * (1 + swing));
    const lowCost = cost({ ...input, [key]: low }), highCost = cost({ ...input, [key]: high });
    const spread = [0, 1, 2].map(i => lowCost?.[i] != null && highCost?.[i] != null ? Math.abs(highCost[i]! - lowCost[i]!) : 0);
    return { key, label: definition[1], unit: definition[2], low, high, lowCost, highCost, swing: Math.max(...spread) };
  }).sort((a, b) => b.swing - a.swing).map(row => ({ ...row, base }));
}
