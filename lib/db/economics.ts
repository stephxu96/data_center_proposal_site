export type EconomicsInputs = {
  powerPriceUsdMwh: number; utilizationPct: number; gpuCount: number; pue: number;
  buildCapexMillions: number; hybridCapexMillions: number; annualLeaseMillions: number;
  hybridLeaseMillions: number; annualNonPowerOpsMillions: number;
  delayCarryingMillionsPerMonth: number; gridDelayMonths: number; itLoadMw: number;
  operatingHours: number; gpuPriceUsd: number; gridUpgradeMillions: number; landMillions: number;
  staffMillions: number; maintenanceMillions: number; constructionMonths: number;
  replacementYears: number; debtSharePct: number; debtRatePct: number; debtTermYears: number;
  discountRatePct: number; availabilityPct: number; salvagePct: number; leaseEscalationPct: number;
  hybridOwnedPct: number; hybridPhaseYear: number; memberChargeUsdHour: number;
};
export type CashRow = {
  year: number; facility: number; gpu: number; grid: number; land: number; capital: number;
  delay: number; electricity: number; staffing: number; maintenance: number;
  otherOperations: number; lease: number; operating: number; financing: number;
  replacement: number; recovery: number; productiveHours: number; unusedCapacityCost: number;
  debtDraw: number; debtPrincipal: number; net: number; equityNet: number;
  cumulative: number; discounted: number;
};
const inputKeys = [
  'powerPriceUsdMwh', 'utilizationPct', 'gpuCount', 'pue', 'buildCapexMillions',
  'hybridCapexMillions', 'annualLeaseMillions', 'hybridLeaseMillions',
  'annualNonPowerOpsMillions', 'delayCarryingMillionsPerMonth', 'gridDelayMonths',
  'itLoadMw', 'operatingHours', 'gpuPriceUsd', 'gridUpgradeMillions', 'landMillions',
  'staffMillions', 'maintenanceMillions', 'constructionMonths', 'replacementYears',
  'debtSharePct', 'debtRatePct', 'debtTermYears', 'discountRatePct', 'availabilityPct',
  'salvagePct', 'leaseEscalationPct', 'hybridOwnedPct', 'hybridPhaseYear', 'memberChargeUsdHour',
] as const satisfies readonly (keyof EconomicsInputs)[];

export function validateEconomics(i: EconomicsInputs) {
  for (const key of inputKeys) {
    if (!Number.isFinite(i[key]) || i[key] < 0) throw Error(`Invalid model input: ${key}`);
  }
  if (i.pue < 1 || i.pue > 3 || i.operatingHours > 8760 || i.utilizationPct > 100 ||
      i.availabilityPct > 100 || i.debtSharePct > 100 || i.salvagePct > 100 ||
      i.hybridOwnedPct > 100 || i.replacementYears < 1 || i.debtTermYears < 1 ||
      i.hybridPhaseYear < 1 || i.hybridPhaseYear > 10) {
    throw Error('Model input outside its allowed range.');
  }
  if (i.staffMillions + i.maintenanceMillions > i.annualNonPowerOpsMillions) {
    throw Error('Staffing plus maintenance must not exceed total non-power operations.');
  }
  const gpu = i.gpuCount * i.gpuPriceUsd / 1e6;
  if (gpu + i.gridUpgradeMillions + i.landMillions > i.buildCapexMillions) {
    throw Error('Build capital must cover GPU fleet, grid upgrades and land.');
  }
  if ((gpu + i.gridUpgradeMillions + i.landMillions) * i.hybridOwnedPct / 100 > i.hybridCapexMillions) {
    throw Error('Hybrid capital must cover its owned GPU fleet, grid upgrades and land.');
  }
}

const emptyRow = (year: number): CashRow => ({
  year, facility: 0, gpu: 0, grid: 0, land: 0, capital: 0, delay: 0,
  electricity: 0, staffing: 0, maintenance: 0, otherOperations: 0, lease: 0,
  operating: 0, financing: 0, replacement: 0, recovery: 0, productiveHours: 0,
  unusedCapacityCost: 0, debtDraw: 0, debtPrincipal: 0, net: 0, equityNet: 0,
  cumulative: 0, discounted: 0,
});

export function calculateInvestment(i: EconomicsInputs) {
  validateEconomics(i);
  const fullEnergy = i.itLoadMw * i.pue * i.operatingHours / 1000;
  const fullPowerCost = fullEnergy * i.powerPriceUsdMwh / 1000;
  const fullHours = i.gpuCount * i.operatingHours * i.utilizationPct / 100 * i.availabilityPct / 100;
  return (['build', 'lease', 'hybrid'] as const).map(id => {
    const owned = id === 'lease' ? 0 : id === 'build' ? 1 : i.hybridOwnedPct / 100;
    const start = id === 'hybrid' ? (i.hybridPhaseYear - 1) * 12 : 0;
    const constructionEnd = start + i.constructionMonths;
    const openAt = id === 'lease' ? 0 : constructionEnd + i.gridDelayMonths;
    const capex = id === 'lease' ? 0 : id === 'build' ? i.buildCapexMillions : i.hybridCapexMillions;
    const gpu = i.gpuCount * i.gpuPriceUsd / 1e6 * owned;
    const grid = i.gridUpgradeMillions * owned, land = i.landMillions * owned;
    const facility = capex - gpu - grid - land;
    const rows = Array.from({ length: 10 }, (_, index) => emptyRow(index + 1));
    const debtShare = i.debtSharePct / 100;
    const monthlyPrincipal = capex * debtShare / (i.debtTermYears * 12);
    const monthlyInterest = i.debtRatePct / 100 / 12;
    let balance = 0, outstandingDebt = 0, preOpeningNetOutflow = 0, preOpeningPeak = 0;
    let preOpeningInterest = 0, preOpeningLease = 0, preOpeningRecovery = 0;

    // Year rows cover [0,120) months. Funding is also evaluated through opening
    // when a chosen construction/delay assumption puts opening beyond year ten.
    const end = Math.max(120, openAt);
    const points = new Set<number>([0, end]);
    for (let month = 1; month <= end; month++) points.add(month);
    for (const event of [start, constructionEnd, openAt]) if (event <= end) points.add(event);
    const replacements = new Set<number>();
    for (let cycle = 1; ; cycle++) {
      const when = openAt + cycle * i.replacementYears * 12;
      if (when >= 120) break;
      replacements.add(when); points.add(when);
    }
    const timeline = [...points].sort((a, b) => a - b);
    const fundBeforeOpening = (outflow: number) => {
      preOpeningNetOutflow += outflow;
      preOpeningPeak = Math.max(preOpeningPeak, preOpeningNetOutflow);
    };
    for (let index = 0; index < timeline.length; index++) {
      const at = timeline[index];
      const row = at < 120 ? rows[Math.floor(at / 12)] : undefined;
      if (at === 120) outstandingDebt = balance;
      const addCapital = (facilitySpend: number, gridSpend: number, landSpend: number, gpuSpend: number) => {
        const capital = facilitySpend + gridSpend + landSpend + gpuSpend;
        if (row) {
          row.facility += facilitySpend; row.grid += gridSpend; row.land += landSpend;
          row.gpu += gpuSpend; row.capital += capital; row.debtDraw += capital * debtShare;
        }
        balance += capital * debtShare;
        return capital;
      };
      if (i.constructionMonths === 0 && at === start) {
        fundBeforeOpening(addCapital(facility, grid, land, 0));
      }
      // Commissioning equipment is funded at opening, not while it sits idle
      // through construction. A replacement is an equity-funded expense.
      if (at === openAt) fundBeforeOpening(addCapital(0, 0, 0, gpu));
      if (replacements.has(at) && row) row.replacement += gpu;
      if (index === timeline.length - 1) break;
      const duration = timeline[index + 1] - at;
      const active = at >= openAt;
      const fraction = i.constructionMonths > 0 && at >= start && at < constructionEnd
        ? duration / i.constructionMonths : 0;
      const capital = (facility + grid + land) * fraction;
      const draw = capital * debtShare;
      // Construction draws accrue uniformly; debt amortizes uniformly from
      // commissioning. Interest integrates the actual balance over each period.
      const openingBalance = balance;
      const principal = active ? Math.min(openingBalance, monthlyPrincipal * duration) : 0;
      const interestDuration = active && monthlyPrincipal > 0 && principal === openingBalance
        ? Math.min(duration, openingBalance / monthlyPrincipal) : duration;
      const interest = active
        ? (openingBalance - principal / 2) * monthlyInterest * interestDuration
        : (openingBalance + draw / 2) * monthlyInterest * duration;
      balance = Math.max(0, openingBalance + draw - principal);
      const delay = at >= constructionEnd && !active
        ? duration * i.delayCarryingMillionsPerMonth * owned : 0;
      const electricity = active ? fullPowerCost * owned * duration / 12 : 0;
      const staff = active ? i.staffMillions * owned * duration / 12 : 0;
      const maintenance = active ? i.maintenanceMillions * owned * duration / 12 : 0;
      const other = active ? (i.annualNonPowerOpsMillions - i.staffMillions - i.maintenanceMillions) * owned * duration / 12 : 0;
      const escalation = (1 + i.leaseEscalationPct / 100) ** (Math.floor(at) / 12);
      const leaseRate = id === 'lease' ? i.annualLeaseMillions : id === 'hybrid'
        ? active ? i.hybridLeaseMillions : i.annualLeaseMillions : 0;
      const lease = leaseRate * duration / 12 * escalation;
      const operating = electricity + staff + maintenance + other + lease;
      const productive = fullHours * (id === 'build' && !active ? 0 : 1) * duration / 12;
      const recovery = productive * i.memberChargeUsdHour / 1e6;
      if (row) {
        row.facility += facility * fraction; row.grid += grid * fraction;
        row.land += land * fraction; row.capital += capital; row.debtDraw += draw;
        row.debtPrincipal += principal; row.financing += interest; row.delay += delay;
        row.electricity += electricity; row.staffing += staff; row.maintenance += maintenance;
        row.otherOperations += other; row.lease += lease; row.operating += operating;
        row.productiveHours += productive; row.recovery += recovery;
        // An allocation of an included cost, never an additional cash outflow.
        row.unusedCapacityCost += operating * (1 - i.utilizationPct / 100);
      }
      if (at < openAt && id !== 'lease') {
        preOpeningInterest += interest; preOpeningLease += lease; preOpeningRecovery += recovery;
        fundBeforeOpening(capital + delay + interest + lease - recovery);
      }
    }
    const annual = owned * (i.annualNonPowerOpsMillions + fullPowerCost) +
      (id === 'lease' ? i.annualLeaseMillions : id === 'hybrid' ? i.hybridLeaseMillions : 0);
    let cumulative = 0;
    for (const r of rows) {
      r.net = r.recovery - r.capital - r.operating - r.financing - r.replacement - r.delay;
      r.equityNet = r.net + r.debtDraw - r.debtPrincipal;
      cumulative += r.net; r.cumulative = cumulative;
      r.discounted = r.net / (1 + i.discountRatePct / 100) ** r.year;
    }
    const firstThree = rows.slice(0, 3);
    const spentByThree = firstThree.reduce((sum, row) => sum + row.capital + row.replacement, 0);
    // No resale proceeds are assumed for retired fleets. The stopping scenario
    // applies its entered salvage percentage only to capital still in service.
    const recoverableCapital = firstThree.reduce((sum, row) => sum + row.capital, 0) * i.salvagePct / 100;
    const capitalAtRisk = Math.max(0, spentByThree - recoverableCapital);
    const totalHours = rows.reduce((sum, row) => sum + row.productiveHours, 0);
    const totalCost = rows.reduce((sum, row) => sum + row.capital + row.operating + row.financing + row.replacement + row.delay, 0);
    return {
      id, name: id === 'build' ? 'Build and own' : id === 'lease' ? 'Lease capacity' : 'Phased hybrid',
      beforeOpening: capex, beforeOpeningWithDelay: preOpeningPeak,
      preOpeningInterest, preOpeningLease, preOpeningRecovery, annual, capitalAtRisk,
      capitalAtRiskWithDelay: capitalAtRisk + firstThree.reduce((sum, row) => sum + row.delay + row.financing, 0),
      costPerProductiveHour: totalHours > 0 ? totalCost * 1e6 / totalHours : null,
      annualProductiveHours: fullHours, tenYearProductiveHours: totalHours,
      npv: rows.reduce((sum, row) => sum + row.discounted, 0), totalCost, rows,
      openingMonth: openAt, facilityCapital: facility, gridCapital: grid,
      landCapital: land, gpuCapital: gpu, annualUnusedCapacityCost: annual * (1 - i.utilizationPct / 100),
      outstandingDebt,
    };
  });
}
