export const roles = ['visitor', 'viewer', 'editor', 'admin'] as const;
export type WorkspaceRole = (typeof roles)[number];
export const roleNames: Record<WorkspaceRole, string> = {
  visitor: 'Visitor',
  viewer: 'Registered user',
  editor: 'Editor',
  admin: 'Team administrator',
};
export const roleDescriptions: Record<WorkspaceRole, string> = {
  visitor: 'Explore the public design, country comparison and evidence.',
  viewer:
    'Use the adviser to understand the design and its supporting evidence.',
  editor: 'Add source-backed evidence and refresh the connected data.',
  admin: 'Manage design assumptions and assign roles within your team.',
};
export function hasRole(
  role: WorkspaceRole | 'committee',
  minimum: Exclude<WorkspaceRole, 'visitor'>,
) {
  const rank = { visitor: 0, viewer: 1, committee: 1, editor: 2, admin: 3 };
  return rank[role] >= rank[minimum];
}
export type DesignInputs = {
  itLoadMw: number;
  pue: number;
  operatingHours: number;
  rationale: string;
};
export function validateDesign(input: DesignInputs) {
  if (
    !Number.isFinite(input.itLoadMw) ||
    input.itLoadMw < 0.1 ||
    input.itLoadMw > 2000 ||
    !Number.isFinite(input.pue) ||
    input.pue < 1 ||
    input.pue > 3 ||
    !Number.isFinite(input.operatingHours) ||
    input.operatingHours < 1 ||
    input.operatingHours > 8760 ||
    typeof input.rationale !== 'string' ||
    input.rationale.trim().length < 10 ||
    input.rationale.length > 2000
  ) {
    throw new Error(
      'Enter a valid IT load, PUE (1–3), annual hours (1–8,760), and a reason of at least 10 characters.',
    );
  }
  return input;
}
export const sourceTypes = [
  'government',
  'regulator',
  'grid_operator',
  'statistics_agency',
  'international_agency',
  'company',
  'academic',
  'research_firm',
  'press',
] as const;
export type EvidenceInput = {
  country: 'US' | 'CA' | 'FI';
  metric: string;
  value: number;
  period: string;
  publisher: string;
  title: string;
  url: string;
  notes: string;
  sourceType: (typeof sourceTypes)[number];
};
export const evidenceMetrics = {
  datacenter_count: {
    name: 'Reported data centers',
    unit: 'count',
    max: 1000000,
  },
  dc_electricity_use: {
    name: 'Data center electricity consumption',
    unit: 'GWh',
    max: 10000000,
  },
  grid_carbon_intensity: {
    name: 'Grid carbon intensity',
    unit: 'gCO2/kWh',
    max: 1200,
  },
} as const;
export function validateEvidence(input: EvidenceInput) {
  const definition =
    evidenceMetrics[input.metric as keyof typeof evidenceMetrics];
  if (
    !definition ||
    !sourceTypes.includes(input.sourceType) ||
    !['US', 'CA', 'FI'].includes(input.country) ||
    !Number.isFinite(input.value) ||
    input.value < 0 ||
    input.value > definition.max ||
    (input.metric === 'datacenter_count' && !Number.isInteger(input.value)) ||
    !/^\d{4}(-(?:0[1-9]|1[0-2]))?$/.test(input.period) ||
    Number(input.period.slice(0, 4)) > new Date().getUTCFullYear() ||
    ![input.publisher, input.title, input.notes].every(
      (value) =>
        typeof value === 'string' &&
        value.trim().length >= 3 &&
        value.length <= 2000,
    )
  ) {
    throw new Error(
      'Complete the country, metric, numeric value, reporting period, publisher, title and definition notes.',
    );
  }
  const url = new URL(input.url);
  if (
    !['https:', 'http:'].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw new Error('Use a public HTTP or HTTPS source link.');
  return definition;
}
