// Fixed OWID chart exports. Callers never supply an external URL.
export const LIVE_SOURCE = {
  key: 'owid',
  publisher: 'Ember / Our World in Data',
  mixUrl: 'https://ourworldindata.org/grapher/share-electricity-source-facet.csv',
  carbonUrl: 'https://ourworldindata.org/grapher/carbon-intensity-electricity.csv',
} as const;

export const COUNTRY_CODES = ['US', 'CA', 'FI'] as const;
export type CountryCode = (typeof COUNTRY_CODES)[number];

const ISO3: Record<CountryCode, string> = { US: 'USA', CA: 'CAN', FI: 'FIN' };
const MIX_COLUMNS = ['Coal', 'Gas', 'Nuclear', 'Hydropower', 'Solar', 'Wind'] as const;

export type LiveCountry = {
  countryCode: CountryCode;
  year: number;
  carbonIntensity: number;
  mix: Record<(typeof MIX_COLUMNS)[number] | 'Other', number>;
};

function rows(csv: string): Record<string, string>[] {
  const lines = csv.trim().split(/\r?\n/);
  const header = lines.shift()?.split(',');
  if (!header || !['Code', 'Year'].every((key) => header.includes(key))) {
    throw new Error('External source fields changed');
  }
  return lines.map((line) => {
    const values = line.split(',');
    return Object.fromEntries(header.map((key, index) => [key, values[index] ?? '']));
  });
}

function finite(value: string): number {
  if (!value.trim()) throw new Error('External source has a missing value');
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error('External source has a nonnumeric value');
  return parsed;
}

async function fetchCsv(url: string, signal: AbortSignal): Promise<string> {
  const response = await fetch(url, { signal, headers: { Accept: 'text/csv' }, cache: 'no-store' });
  if (!response.ok) throw new Error('External source did not respond');
  const contentType = response.headers.get('content-type') ?? '';
  if (!/csv|plain|octet-stream/i.test(contentType)) throw new Error('External source format changed');
  return response.text();
}

export async function fetchOwid(countries: CountryCode[], signal: AbortSignal): Promise<LiveCountry[]> {
  const [mixCsv, carbonCsv] = await Promise.all([
    fetchCsv(LIVE_SOURCE.mixUrl, signal),
    fetchCsv(LIVE_SOURCE.carbonUrl, signal),
  ]);
  const mixRows = rows(mixCsv);
  const carbonRows = rows(carbonCsv);
  const currentYear = new Date().getUTCFullYear();
  return countries.map((countryCode) => {
    const code = ISO3[countryCode];
    const mix = mixRows.filter((row) => row.Code === code).sort((a, b) => Number(b.Year) - Number(a.Year))[0];
    const carbon = carbonRows.filter((row) => row.Code === code).sort((a, b) => Number(b.Year) - Number(a.Year))[0];
    if (!mix || !carbon) throw new Error(`External source omitted ${countryCode}`);
    const year = finite(mix.Year);
    if (!Number.isInteger(year) || year > currentYear || year < currentYear - 5 || Number(carbon.Year) !== year) {
      throw new Error(`External source period is invalid for ${countryCode}`);
    }
    const values = Object.fromEntries(MIX_COLUMNS.map((column) => [column, finite(mix[column])])) as LiveCountry['mix'];
    for (const value of Object.values(values)) if (value < 0 || value > 100) throw new Error(`Generation share is out of range for ${countryCode}`);
    const subtotal = Object.values(values).reduce((sum, value) => sum + value, 0);
    if (subtotal > 103 || subtotal < 0) throw new Error(`Generation mix is invalid for ${countryCode}`);
    values.Other = Math.max(0, 100 - subtotal);
    const carbonIntensity = finite(carbon['Carbon intensity']);
    if (carbonIntensity < 0 || carbonIntensity > 1200) throw new Error(`Carbon intensity is out of range for ${countryCode}`);
    return { countryCode, year, carbonIntensity, mix: values };
  });
}
