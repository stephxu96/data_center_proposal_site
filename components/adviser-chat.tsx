'use client';
import { useState } from 'react';

type Citation = { id: number; publisher: string; title: string; url: string; publication_date: string | null; accessed_at: string };
type Answer = { answer: string; evidenceUsed: string[]; assumptions: string[]; uncertainty: string[]; citations: Citation[]; removedCitationCount: number };
type Turn = { question: string; answer?: Answer; error?: string };

// Citations render as links to the D1 source record; plain text never becomes HTML.
function Cited({ text }: { text: string }) {
  return <>{text.split(/(\[S\d+\])/g).map((part, i) => {
    const id = part.match(/^\[S(\d+)\]$/)?.[1];
    return id ? <a key={i} className="text-link" href={`/evidence#source-${id}`}>{part}</a> : part;
  })}</>;
}
const Section = ({ title, items }: { title: string; items: string[] }) => items.length ? <><h4>{title}</h4><ul className="working-list">{items.map((item, i) => <li key={i}><Cited text={item} /></li>)}</ul></> : null;

export function AdviserChat({ suggestions }: { suggestions: string[] }) {
  const [question, setQuestion] = useState('');
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  async function ask(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setBusy(true); setQuestion('');
    // Only the question and the last two exchanges are sent; the server retrieves all evidence.
    const history = turns.filter(t => t.answer).slice(-2).flatMap(t => [{ role: 'user', content: t.question.slice(0, 1500) }, { role: 'assistant', content: t.answer!.answer.slice(0, 1500) }]);
    let turn: Turn = { question: q };
    try {
      const response = await fetch('/api/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: q, history }) });
      const body = await response.json().catch(() => ({})) as Record<string, unknown>;
      turn = response.ok ? { question: q, answer: body as unknown as Answer } : { question: q, error: `${typeof body.error === 'string' ? body.error : 'The adviser could not answer.'} (HTTP ${response.status})` };
    } catch {
      turn = { question: q, error: 'The adviser could not be reached. Your design and evidence are unchanged.' };
    }
    setTurns(list => [...list, turn]); setBusy(false);
  }
  return <div className="adviser-chat">
    <div className="card">
      <h3>Suggested questions</h3>
      <div className="button-row">{suggestions.map(s => <button key={s} type="button" className="button light" disabled={busy} onClick={() => void ask(s)}>{s}</button>)}</div>
    </div>
    <div aria-live="polite" className="adviser-conversation">{turns.map((t, i) => <article key={i} className="card">
      <span className="eyebrow">Question</span><h3>{t.question}</h3>
      {t.error && <p role="alert" className="workspace-status">{t.error}</p>}
      {t.answer && <>
        <h4>Answer</h4><p><Cited text={t.answer.answer} /></p>
        <Section title="Evidence used" items={t.answer.evidenceUsed} />
        <Section title="Assumptions" items={t.answer.assumptions} />
        <Section title="Uncertainty" items={t.answer.uncertainty} />
        <h4>Citations</h4>
        {t.answer.citations.length ? <ul className="list">{t.answer.citations.map(c => <li key={c.id}><a className="text-link" href={`/evidence#source-${c.id}`}>[S{c.id}]</a> {c.publisher}, <a className="text-link" href={c.url} target="_blank" rel="noreferrer">{c.title} ↗</a><br /><span className="subtle">{c.publication_date ? `Published ${c.publication_date} · ` : ''}accessed {c.accessed_at.slice(0, 10)}</span></li>)}</ul> : <p className="subtle">No source record was cited for this answer.</p>}
      </>}
    </article>)}</div>
    <form className="card" onSubmit={e => { e.preventDefault(); void ask(question); }}>
      <div className="field"><label htmlFor="adviser-question">Your question</label><textarea id="adviser-question" rows={3} maxLength={1600} value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask about the design, its evidence or its open questions" /></div>
      <button className="button" type="submit" disabled={busy || !question.trim()} style={{ marginTop: 16 }}>{busy ? 'Checking the evidence…' : 'Ask the adviser ↗'}</button>
    </form>
  </div>;
}
