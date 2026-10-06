'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const outcomes = [['approve', 'Approve'], ['reject', 'Reject'], ['send_back', 'Send back for more evidence']] as const;

// The form is shown to everyone; /api/decisions accepts it only from a committee member.
export function CommitteeDecisionForm() {
  const router = useRouter();
  const [outcome, setOutcome] = useState('send_back');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit() {
    setBusy(true); setStatus('');
    try {
      const response = await fetch('/api/decisions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ outcome, reason }) });
      const body = await response.json().catch(() => ({})) as Record<string, unknown>;
      if (response.ok) { setReason(''); setStatus('Decision recorded.'); router.refresh(); }
      else setStatus(`${typeof body.error === 'string' ? body.error : 'The decision was not recorded.'} (HTTP ${response.status})`);
    } catch {
      setStatus('The decision service could not be reached.');
    }
    setBusy(false);
  }
  return <form className="card" onSubmit={e => { e.preventDefault(); void submit(); }}>
    <h3>Record the committee decision</h3>
    <p>Only committee members can record a decision. The server rejects every other role.</p>
    <div className="field-grid" style={{ marginTop: 18 }}>
      <div className="field"><label htmlFor="decision-outcome">Decision</label><select id="decision-outcome" value={outcome} onChange={e => setOutcome(e.target.value)}>{outcomes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
    </div>
    <div className="field" style={{ marginTop: 16 }}><label htmlFor="decision-reason">Reason (at least 20 characters)</label><textarea id="decision-reason" rows={3} maxLength={2000} value={reason} onChange={e => setReason(e.target.value)} /></div>
    <button className="button" type="submit" disabled={busy || reason.trim().length < 20} style={{ marginTop: 16 }}>{busy ? 'Recording…' : 'Record decision ↗'}</button>
    {status && <p className="workspace-status" role="status" style={{ marginTop: 16 }}>{status}</p>}
  </form>;
}
