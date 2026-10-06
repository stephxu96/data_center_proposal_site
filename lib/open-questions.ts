// The three largest unresolved uncertainties (brief Step 11, Overview). Shared so the
// Overview and Evidence pages cannot drift apart. Each is a claim of type "unknown".
export const largestUncertainties = [
  { key: 'grid-connection', title: 'Grid connection', text: 'No site-specific energization date or connection cost is established for the three candidates.' },
  { key: 'member-commitment', title: 'Member commitment', text: 'Contracted GPU-hours and each institution’s minimum reservation remain to be agreed.' },
  { key: 'vendor-pricing', title: 'Vendor pricing', text: 'Equipment, construction, lease and service-level offers determine the bankable economics.' },
] as const;

// Where each of the brief's six investment decisions is answered on the site.
export const sixDecisions = [
  ['Requirements', 'Users, productive GPU-hours, availability and data security, and whether they justify 25 MW.', '/design#workload_requirements'],
  ['Technical architecture', 'Grid, backup, UPS, cooling, network, storage and GPU strategy, with both failure cases.', '/design'],
  ['Economics', 'Ten-year cash flow separating facility and GPU fleet across build, lease and hybrid.', '/investment'],
  ['Financing', 'Evidence required before equity, construction debt and equipment finance, and who bears each risk.', '/investment#funding-gates'],
  ['Governance', 'Ownership, allocation, pricing, membership and protection against capacity capture.', '/investment#governance'],
  ['Alternatives and external effects', 'Three locations, existing facilities, energy, water, permitting and other grid customers.', '/countries'],
] as const;
