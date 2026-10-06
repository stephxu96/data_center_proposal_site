import { NextResponse } from 'next/server'; export async function POST() { return NextResponse.json({ error: 'Not built: Phase 6 external refresh.' }, { status: 501 }); }
