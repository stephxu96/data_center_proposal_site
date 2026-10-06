import { NextResponse } from 'next/server';
import { getSchemaHealth } from '../../../lib/db/queries';

export async function GET() {
  try { return NextResponse.json(await getSchemaHealth()); }
  catch { return NextResponse.json({ error: 'Schema unavailable' }, { status: 503 }); }
}
