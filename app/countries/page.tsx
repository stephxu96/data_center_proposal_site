import { proposalData, weightedScore } from '../../lib/db/proposal';
import { getLiveCountries } from '../../lib/db/live';
import { RefreshData } from '../../components/refresh-data';
import { env } from 'cloudflare:workers';

export const dynamic = 'force-dynamic';

export default async function Countries() {
  const candidates = proposalData.candidates;
  const live = await getLiveCountries();
  return (
    <>
      <section className="page-head">
        <div className="shell">
          <span className="eyebrow">Location strategy</span>
          <h1>Three places. One decision.</h1>
          <p>
            The same weighted criteria compare a Texas, Québec and Helsinki
            reference site. Scores are design judgments on a five-point scale.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <div className="grid-3">
            {candidates.map((c, i) => (
              <article className={i === 0 ? 'card accent' : 'card'} key={c.id}>
                <span className="eyebrow">
                  {i === 0 ? 'Selected reference' : 'Alternative'}
                </span>
                <h3>
                  {c.site}
                  <br />
                  <span className="subtle">{c.country}</span>
                </h3>
                <div className="number">
                  <a href={'/evidence#score-' + c.id}>
                    {weightedScore(c.scores).toFixed(2)}
                  </a>
                </div>
                <div className="scorebar">
                  <span
                    style={{ width: (weightedScore(c.scores) / 5) * 100 + '%' }}
                  />
                </div>
                <p style={{ marginTop: 20 }}>
                  {c.demandShare}% of modeled addressable demand within{' '}
                  {proposalData.design.latencyThresholdMs} ms round trip ·
                  calculation
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section band" id="live-electricity">
        <div className="shell">
          <div className="section-head">
            <div>
              <span className="eyebrow">Connected evidence</span>
              <h2>Electricity data, direct from the source.</h2>
            </div>
            <RefreshData allowFailureTest={env.DEMO_PUBLIC_REFRESH === '1'} />
          </div>
          <p className="lead">
            The backend retrieves current published electricity mix and carbon
            intensity from Our World in Data, validates it, and saves the
            accepted record. The reporting year and retrieval time are shown
            separately.
          </p>
          {live.countries.length ? (
            <div className="grid-3">
              {(['US', 'CA', 'FI'] as const).map((code) => {
                const item = live.countries.find(
                  (row) => row.countryCode === code,
                );
                return (
                  <article className="card" key={code}>
                    <span className="eyebrow">
                      {code === 'US'
                        ? 'United States'
                        : code === 'CA'
                          ? 'Canada'
                          : 'Finland'}
                    </span>
                    {item ? (
                      <>
                        <h3>{item.carbonIntensity.toFixed(1)} gCO₂/kWh</h3>
                        <p>Grid carbon intensity · {item.year}</p>
                        <div className="mix-list">
                          {Object.entries(item.mix).map(([name, value]) => (
                            <div key={name}>
                              <span>{name}</span>
                              <strong>{value.toFixed(1)}%</strong>
                            </div>
                          ))}
                        </div>
                        <p className="subtle">
                          Retrieved{' '}
                          {new Date(item.retrievedAt).toLocaleString('en-US', {
                            timeZone: 'UTC',
                          })}{' '}
                          UTC ·{' '}
                          <a
                            className="text-link"
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Carbon source ↗
                          </a>
                          {' · '}
                          <a
                            className="text-link"
                            href={item.mixSourceUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Generation mix source ↗
                          </a>
                        </p>
                      </>
                    ) : (
                      <p>No saved live value for this country yet.</p>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="card">
              <h3>Ready to connect</h3>
              <p>
                Use “Refresh live data” to retrieve the first three-country
                record. No placeholder figures are shown as live results.
              </p>
            </div>
          )}
          {live.lastRun && (
            <p className="subtle" style={{ marginTop: 18 }}>
              Last source check:{' '}
              {new Date(live.lastRun.finishedAt).toLocaleString('en-US', {
                timeZone: 'UTC',
              })}{' '}
              UTC ·{' '}
              {live.lastRun.rowsAdded
                ? `${live.lastRun.rowsAdded} new values`
                : 'published values unchanged'}
              {live.lastRun.status === 'failed'
                ? ' · previous saved values retained'
                : ''}
            </p>
          )}
        </div>
      </section>
      <section className="section tight">
        <div className="shell">
          <div className="section-head">
            <div>
              <span className="eyebrow">Assessment</span>
              <h2>Where the score comes from</h2>
            </div>
            <a className="text-link" href="/evidence">
              Method and evidence ↗
            </a>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Criterion</th>
                  <th>Weight</th>
                  {candidates.map((c) => (
                    <th key={c.id}>{c.site}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {proposalData.criteria.map((criterion, index) => (
                  <tr key={criterion.id}>
                    <td>
                      <strong>{criterion.name}</strong>
                      <br />
                      <span className="subtle">{criterion.id}</span>
                    </td>
                    <td>{criterion.weight}%</td>
                    {candidates.map((c) => (
                      <td key={c.id}>
                        {criterion.weight === 0
                          ? 'No differentiation'
                          : c.scores[index] + ' / 5'}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td>
                    <strong>Weighted total</strong>
                  </td>
                  <td>100%</td>
                  {candidates.map((c) => (
                    <td key={c.id}>
                      <strong>{weightedScore(c.scores).toFixed(2)}</strong>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="subtle">
            Data-transfer price carries zero weight because the assessed prices
            do not differentiate the candidates. Grid connection carries its
            stated weight; site-specific energization dates remain open.
          </p>
        </div>
      </section>
      <section className="section band">
        <div className="shell">
          <div className="section-head">
            <div>
              <span className="eyebrow">What could change</span>
              <h2>The choice stays conditional.</h2>
            </div>
          </div>
          <div className="grid-2">
            {proposalData.reversalTriggers.map((x, i) => (
              <div className="card" key={x}>
                <span className="eyebrow">Trigger {i + 1}</span>
                <h3>{x}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
