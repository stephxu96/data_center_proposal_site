'use client';

import { useState } from 'react';
import type { StoredCountry } from '../lib/db/live';

const COUNTRY_NAME = {
  US: 'United States',
  CA: 'Canada',
  FI: 'Finland',
} as const;

export function LiveEvidenceTable({
  countries,
}: {
  countries: StoredCountry[];
}) {
  const [filter, setFilter] = useState('all');
  const rows = countries
    .filter((country) => filter === 'all' || filter === country.countryCode)
    .flatMap((country) => [
      {
        country: country.countryCode,
        metric: 'Grid carbon intensity',
        value: country.carbonIntensity.toFixed(1),
        unit: 'gCO₂/kWh',
        year: country.year,
        retrievedAt: country.retrievedAt,
        sourceUrl: country.sourceUrl,
      },
      ...Object.entries(country.mix).map(([metric, value]) => ({
        country: country.countryCode,
        metric: `${metric} share of generation${metric === 'Other' ? ' (calculated remainder)' : ''}`,
        value: value.toFixed(1),
        unit: '%',
        year: country.year,
        retrievedAt: country.retrievedAt,
        sourceUrl: country.mixSourceUrl,
      })),
    ]);
  return (
    <>
      <div className="evidence-filter">
        <label htmlFor="live-country-filter">Country</label>
        <select
          id="live-country-filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">All three countries</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="FI">Finland</option>
        </select>
      </div>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Country</th>
              <th>Published metric</th>
              <th>Value</th>
              <th>Period</th>
              <th>Retrieved UTC</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.country}-${row.metric}`}>
                <td>{COUNTRY_NAME[row.country]}</td>
                <td>{row.metric}</td>
                <td>
                  <strong>
                    {row.value} {row.unit}
                  </strong>
                </td>
                <td>{row.year}</td>
                <td>
                  {new Date(row.retrievedAt).toLocaleString('en-US', {
                    timeZone: 'UTC',
                  })}
                </td>
                <td>
                  <a
                    className="text-link"
                    href={row.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open source ↗
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
