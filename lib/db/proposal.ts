import proposal from '../../seed/data/proposal.json';

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

export type ModelInputs = typeof proposal.illustrativeModel & { pue: number };
export function investmentModel(input: ModelInputs) {
  const annualPower = annualPowerCostMillions(input.powerPriceUsdMwh, input.pue);
  const productiveHours = input.gpuCount * proposal.design.operatingHours * input.utilizationPct / 100;
  const delayCapital = input.gridDelayMonths / 12;
  const options = [
    { id: 'build', name: 'Build and own', beforeOpening: input.buildCapexMillions, annual: input.annualNonPowerOpsMillions + annualPower, capitalAtRisk: input.buildCapexMillions },
    { id: 'lease', name: 'Lease capacity', beforeOpening: 0, annual: input.annualLeaseMillions + annualPower, capitalAtRisk: input.annualLeaseMillions * delayCapital },
    { id: 'hybrid', name: 'Phased hybrid', beforeOpening: input.hybridCapexMillions, annual: input.hybridLeaseMillions + input.annualNonPowerOpsMillions / 2 + annualPower, capitalAtRisk: input.hybridCapexMillions },
  ];
  return options.map(option => ({
    ...option,
    costPerProductiveHour: productiveHours > 0 ? option.annual * 1_000_000 / productiveHours : null,
    beforeOpeningWithDelay: option.beforeOpening + option.annual * delayCapital,
  }));
}
