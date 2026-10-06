'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function RefreshData() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  async function refresh() {
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch('/api/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'owid', countries: ['US', 'CA', 'FI'] }),
      });
      const result = await response.json() as { error?: string; run: { status: string; rowsAdded: number } };
      if (!response.ok) throw new Error(result.error ?? 'Refresh failed');
      setMessage(result.run.status === 'failed' ? 'The data source did not respond. Last saved values remain visible.' :
        result.run.rowsAdded ? `Updated ${result.run.rowsAdded} values from the live source.` : 'Live source checked; published values are unchanged.');
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Refresh failed');
    } finally { setBusy(false); }
  }
  return <div className="refresh-control"><button className="button" type="button" onClick={refresh} disabled={busy}>{busy ? 'Checking source…' : 'Refresh live data ↻'}</button>{message && <p role="status" className="subtle">{message}</p>}</div>;
}
