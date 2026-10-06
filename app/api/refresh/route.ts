import { env } from 'cloudflare:workers';
import { NextResponse } from 'next/server';
import { requireRole, routeError } from '../../../lib/access';
import { getLiveCountries, saveLiveRefresh } from '../../../lib/db/live';
import {
  COUNTRY_CODES,
  fetchOwid,
  type CountryCode,
} from '../../../lib/sources/owid';

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin)
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });

  // Only the isolated public demo Site has this temporary switch. Other Sites
  // require the existing server-side editor role, ready for the final auth phase.
  if (env.DEMO_PUBLIC_REFRESH !== '1') {
    try {
      await requireRole(request, 'editor');
    } catch (error) {
      return routeError(error);
    }
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body))
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  const input = body as Record<string, unknown>;
  const requestedCountries = input.countries;
  const outageTest =
    env.DEMO_PUBLIC_REFRESH === '1' && input.source === 'always-fails';
  if (
    Object.keys(input).sort().join(',') !== 'countries,source' ||
    (input.source !== 'owid' && !outageTest) ||
    !Array.isArray(requestedCountries) ||
    requestedCountries.length !== 3 ||
    !COUNTRY_CODES.every((code) => requestedCountries.includes(code)) ||
    requestedCountries.some(
      (code) => !COUNTRY_CODES.includes(code as CountryCode),
    )
  ) {
    return NextResponse.json(
      { error: 'Only the fixed three-country OWID refresh is supported' },
      { status: 400 },
    );
  }

  const startedAt = new Date().toISOString();
  let run;
  try {
    if (outageTest) throw new Error('Simulated external source outage');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const result = await fetchOwid(
        COUNTRY_CODES.slice() as CountryCode[],
        controller.signal,
      );
      run = await saveLiveRefresh(
        result.data,
        startedAt,
        result.errors.length ? result.errors.join('; ') : undefined,
      );
    } finally {
      clearTimeout(timer);
    }
  } catch {
    run = await saveLiveRefresh(
      [],
      startedAt,
      'The external data source did not return valid data. Previous values remain available.',
    );
  }
  const current = await getLiveCountries();
  return NextResponse.json({ run, metrics: current.countries });
}
