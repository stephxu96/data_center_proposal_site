import { getDb } from './client';
import {
  COUNTRY_CODES,
  LIVE_SOURCE,
  type CountryCode,
  type LiveCountry,
} from '../sources/owid';

const COUNTRY_NAMES: Record<CountryCode, string> = {
  US: 'United States',
  CA: 'Canada',
  FI: 'Finland',
};
const PARTS = [
  'Coal',
  'Gas',
  'Nuclear',
  'Hydropower',
  'Solar',
  'Wind',
  'Other',
] as const;
const NOW = () => new Date().toISOString();

export type StoredCountry = LiveCountry & {
  retrievedAt: string;
  sourceUrl: string;
  mixSourceUrl: string;
};
export type RefreshSummary = {
  status: 'ok' | 'partial' | 'failed';
  rowsAdded: number;
  finishedAt: string;
  error?: string;
};

function client() {
  return getDb().$client;
}

export async function getLiveCountries(): Promise<{
  countries: StoredCountry[];
  lastRun: RefreshSummary | null;
}> {
  const db = client();
  const result = await db
    .prepare(`SELECT c.seed_key AS code, m.metric_name AS name, m.value, m.reporting_period AS year,
    m.retrieved_at AS retrievedAt, s.url AS sourceUrl FROM metrics m
    JOIN countries c ON c.id = m.country_id JOIN sources s ON s.id = m.source_id
    WHERE m.id IN (SELECT MAX(id) FROM metrics WHERE metric_name LIKE 'live_%' GROUP BY country_id, metric_name)`)
    .all<{
      code: string;
      name: string;
      value: number;
      year: string;
      retrievedAt: string;
      sourceUrl: string;
    }>();
  const grouped = new Map<string, typeof result.results>();
  for (const row of result.results)
    grouped.set(row.code, [...(grouped.get(row.code) ?? []), row]);
  const countries = COUNTRY_CODES.flatMap((countryCode) => {
    const list = grouped.get(countryCode) ?? [];
    const intensity = list.find(
      (item) => item.name === 'live_grid_carbon_intensity',
    );
    if (!intensity) return [];
    const mix = Object.fromEntries(
      PARTS.map((part) => [
        part,
        list.find((item) => item.name === `live_share_${part.toLowerCase()}`)
          ?.value,
      ]),
    );
    if (Object.values(mix).some((value) => typeof value !== 'number'))
      return [];
    return [
      {
        countryCode,
        year: Number(intensity.year),
        carbonIntensity: intensity.value,
        mix: mix as StoredCountry['mix'],
        retrievedAt: intensity.retrievedAt,
        sourceUrl: intensity.sourceUrl,
        mixSourceUrl:
          list.find((item) => item.name === 'live_share_coal')?.sourceUrl ??
          intensity.sourceUrl,
      },
    ];
  });
  const run = await db
    .prepare(`SELECT status, rows_added AS rowsAdded, finished_at AS finishedAt, error
    FROM refresh_runs WHERE source_key = ? ORDER BY id DESC LIMIT 1`)
    .bind(LIVE_SOURCE.key)
    .first<RefreshSummary>();
  return { countries, lastRun: run ?? null };
}

async function ensureVocabulary(): Promise<void> {
  const db = client();
  const now = NOW();
  const statements = [
    db
      .prepare('INSERT OR IGNORE INTO units (code, description) VALUES (?, ?)')
      .bind('%', 'Percent of total generation'),
    db
      .prepare('INSERT OR IGNORE INTO units (code, description) VALUES (?, ?)')
      .bind('gCO2/kWh', 'Grams CO2 per kilowatt-hour'),
    ...COUNTRY_CODES.map((code) =>
      db
        .prepare(
          'INSERT OR IGNORE INTO countries (seed_key, name, region) VALUES (?, ?, ?)',
        )
        .bind(
          code,
          COUNTRY_NAMES[code],
          code === 'FI' ? 'Europe' : 'North America',
        ),
    ),
    db
      .prepare(`INSERT OR IGNORE INTO sources (seed_key,publisher,title,url,source_type,is_primary,accessed_at,notes)
      VALUES (?,?,?,?,?,?,?,?)`)
      .bind(
        'API-OWID-CARBON',
        LIVE_SOURCE.publisher,
        'Lifecycle carbon intensity of electricity',
        LIVE_SOURCE.carbonUrl.replace('.csv', ''),
        'api',
        0,
        now,
        'Delivered through Our World in Data; underlying data credited on the chart.',
      ),
    db
      .prepare(`INSERT OR IGNORE INTO sources (seed_key,publisher,title,url,source_type,is_primary,accessed_at,notes)
      VALUES (?,?,?,?,?,?,?,?)`)
      .bind(
        'API-OWID-MIX',
        LIVE_SOURCE.publisher,
        'Share of electricity by source',
        LIVE_SOURCE.mixUrl.replace('.csv', ''),
        'api',
        0,
        now,
        'Other is the residual after the six charted generation shares.',
      ),
    db
      .prepare(`INSERT OR IGNORE INTO metric_definitions (name,description,unit,subject,min_value,max_value)
      VALUES (?,?,?,?,?,?)`)
      .bind(
        'live_grid_carbon_intensity',
        'Lifecycle carbon intensity of electricity',
        'gCO2/kWh',
        'country',
        0,
        1200,
      ),
    ...PARTS.map((part) =>
      db
        .prepare(`INSERT OR IGNORE INTO metric_definitions (name,description,unit,subject,min_value,max_value)
      VALUES (?,?,?,?,?,?)`)
        .bind(
          `live_share_${part.toLowerCase()}`,
          `${part} share of electricity generation`,
          '%',
          'country',
          0,
          100,
        ),
    ),
  ];
  await db.batch(statements);
}

export async function saveLiveRefresh(
  data: LiveCountry[],
  startedAt: string,
  error?: string,
): Promise<RefreshSummary> {
  const db = client();
  const finishedAt = NOW();
  if (data.length) await ensureVocabulary();
  const existing = await getLiveCountries();
  const old = new Map(
    existing.countries.map((item) => [item.countryCode, item]),
  );
  const changed = data.flatMap((item) => {
    const previous = old.get(item.countryCode);
    const latest = [
      {
        name: 'live_grid_carbon_intensity',
        value: item.carbonIntensity,
        unit: 'gCO2/kWh',
        source: 'API-OWID-CARBON',
      },
      ...PARTS.map((part) => ({
        name: `live_share_${part.toLowerCase()}`,
        value: item.mix[part],
        unit: '%',
        source: 'API-OWID-MIX',
      })),
    ];
    return latest
      .filter(
        (metric) =>
          !previous ||
          previous.year !== item.year ||
          (metric.name === 'live_grid_carbon_intensity'
            ? previous.carbonIntensity
            : previous.mix[
                metric.name
                  .replace('live_share_', '')
                  .replace(/^./, (letter) =>
                    letter.toUpperCase(),
                  ) as keyof typeof previous.mix
              ]) !== metric.value,
      )
      .map((metric) => ({
        ...metric,
        countryCode: item.countryCode,
        year: item.year,
      }));
  });
  const status: RefreshSummary['status'] = error
    ? data.length
      ? 'partial'
      : 'failed'
    : 'ok';
  const run = await db
    .prepare(`INSERT INTO refresh_runs (source_key,started_at,finished_at,status,rows_added,error)
    VALUES (?,?,?,?,?,?) RETURNING id`)
    .bind(
      LIVE_SOURCE.key,
      startedAt,
      finishedAt,
      status,
      changed.length,
      error ?? null,
    )
    .first<{ id: number }>();
  if (!run) throw new Error('Could not record refresh');
  if (changed.length)
    await db.batch(
      changed.map((metric) =>
        db
          .prepare(`INSERT INTO metrics
    (country_id,metric_name,value,unit,reporting_period,claim_type,source_id,refresh_run_id,retrieved_at,confidence,notes)
    SELECT c.id,?,?,?,?,?,s.id,?,?,?,? FROM countries c CROSS JOIN sources s
    WHERE c.seed_key=? AND s.seed_key=?`)
          .bind(
            metric.name,
            metric.value,
            metric.unit,
            String(metric.year),
            'fact',
            run.id,
            finishedAt,
            'high',
            metric.name === 'live_share_other'
              ? 'Calculated remainder after six charted shares.'
              : 'Live chart API value.',
            metric.countryCode,
            metric.source,
          ),
      ),
    );
  return {
    status,
    rowsAdded: changed.length,
    finishedAt,
    ...(error ? { error } : {}),
  };
}
