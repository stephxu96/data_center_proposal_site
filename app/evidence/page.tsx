import {
  annualEnergyGwh,
  facilityPowerMw,
  outageEnergyMwh,
  proposalData,
  weightedScore,
} from '../../lib/db/proposal';
import { getLiveCountries } from '../../lib/db/live';
import { LiveEvidenceTable } from '../../components/live-evidence-table';

export const dynamic = 'force-dynamic';

export default async function Evidence() {
  const d = proposalData.design;
  const live = await getLiveCountries();
  return (
    <>
      <section className="page-head">
        <div className="shell">
          <span className="eyebrow">Decision basis</span>
          <h1>Follow the working.</h1>
          <p>
            Design inputs, calculations, judgment scores and open questions are
            separated so the basis of the recommendation remains legible.
          </p>
          <div className="button-row" style={{marginTop:24}}><a className="button secondary" href="/workspace?role=editor#add-evidence">Contribute evidence ↗</a></div>
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <div className="section-head">
            <div>
              <span className="eyebrow">Calculated figures</span>
              <h2>Formulas behind the headline.</h2>
            </div>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Output</th>
                  <th>Result</th>
                  <th>Working</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                <tr id="facility-load">
                  <td>Facility load</td>
                  <td>
                    <strong>{facilityPowerMw()} MW</strong>
                  </td>
                  <td>
                    {d.itLoadMw} MW IT × {d.pue.toFixed(2)} PUE
                  </td>
                  <td>
                    <span className="tag">Calculation</span>
                  </td>
                </tr>
                <tr id="annual-energy">
                  <td>Annual energy</td>
                  <td>
                    <strong>{annualEnergyGwh()} GWh</strong>
                  </td>
                  <td>
                    {facilityPowerMw()} MW × {d.operatingHours.toLocaleString()}{' '}
                    hours ÷ 1,000
                  </td>
                  <td>
                    <span className="tag">Calculation</span>
                  </td>
                </tr>
                <tr id="backup-energy">
                  <td>Backup event energy</td>
                  <td>
                    <strong>{outageEnergyMwh().toLocaleString()} MWh</strong>
                  </td>
                  <td>
                    {facilityPowerMw()} MW × {d.gridOutageHours} hours
                  </td>
                  <td>
                    <span className="tag">Calculation</span>
                  </td>
                </tr>
                {proposalData.candidates.map((c) => (
                  <tr id={'score-' + c.id} key={c.id}>
                    <td>{c.site} weighted score</td>
                    <td>
                      <strong>{weightedScore(c.scores).toFixed(2)}</strong>
                    </td>
                    <td>Sum of each criterion score × its weight</td>
                    <td>
                      <span className="tag">Calculation</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="section band" id="live-evidence">
        <div className="shell">
          <div className="section-head">
            <div>
              <span className="eyebrow">Live source ledger</span>
              <h2>Published electricity figures.</h2>
            </div>
            <a className="text-link" href="/countries#live-electricity">
              Refresh and compare ↗
            </a>
          </div>
          <p className="lead">
            Each row records its reporting year, retrieval time and source. The
            comparison page retains these last saved values if a source check
            fails.
          </p>
          {live.countries.length ? (
            <LiveEvidenceTable countries={live.countries} />
          ) : (
            <p>
              No live figures have been saved yet.{' '}
              <a className="text-link" href="/countries#live-electricity">
                Connect the data source ↗
              </a>
            </p>
          )}
        </div>
      </section>
      <section className="section band" id="design-inputs">
        <div className="shell">
          <div className="section-head">
            <div>
              <span className="eyebrow">Input ledger</span>
              <h2>Assumptions and decisions.</h2>
            </div>
          </div>
          <div className="grid-2">
            <div className="card">
              <h3>Design assumptions</h3>
              <ul className="list">
                <li>IT demand: {d.itLoadMw} MW</li>
                <li>Facility PUE: {d.pue.toFixed(2)}</li>
                <li>
                  Annual operating hours: {d.operatingHours.toLocaleString()}
                </li>
                <li>Latency threshold: {d.latencyThresholdMs} ms round trip</li>
              </ul>
            </div>
            <div className="card">
              <h3>Design decisions</h3>
              <ul className="list">
                <li>Reference location: {d.location}</li>
                <li>Cooling: {d.cooling}</li>
                <li>Shared capacity across member institutions</li>
                <li>Stage-gated investment path</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="section" id="investment-model">
        <div className="shell">
          <div className="section-head">
            <div>
              <span className="eyebrow">Investment model</span>
              <h2>How the example is calculated.</h2>
            </div>
            <a className="text-link" href="/investment?example=1">
              Open the editable example ↗
            </a>
          </div>
          <div className="grid-2">
            <div className="card">
              <h3>Example assumptions</h3>
              <ul className="list">
                <li>Facility PUE: {d.pue.toFixed(2)} · assumption</li>
                <li>
                  Power price: {proposalData.illustrativeModel.powerPriceUsdMwh}{' '}
                  USD/MWh · assumption
                </li>
                <li>
                  GPU utilization:{' '}
                  {proposalData.illustrativeModel.utilizationPct}% · assumption
                </li>
                <li>
                  GPU count:{' '}
                  {proposalData.illustrativeModel.gpuCount.toLocaleString()} ·
                  assumption
                </li>
                <li>
                  Build capital:{' '}
                  {proposalData.illustrativeModel.buildCapexMillions} USD
                  million · assumption
                </li>
                <li>
                  Hybrid capital:{' '}
                  {proposalData.illustrativeModel.hybridCapexMillions} USD
                  million · assumption
                </li>
                <li>
                  Annual lease:{' '}
                  {proposalData.illustrativeModel.annualLeaseMillions} USD
                  million/year · assumption
                </li>
                <li>
                  Hybrid annual lease:{' '}
                  {proposalData.illustrativeModel.hybridLeaseMillions} USD
                  million/year · assumption
                </li>
                <li>
                  Non-power operations:{' '}
                  {proposalData.illustrativeModel.annualNonPowerOpsMillions} USD
                  million/year · assumption
                </li>
                <li>
                  Grid delay: {proposalData.illustrativeModel.gridDelayMonths}{' '}
                  months · assumption
                </li>
                <li>
                  Delay carrying cost:{' '}
                  {proposalData.illustrativeModel.delayCarryingMillionsPerMonth}{' '}
                  USD million/month · assumption
                </li>
              </ul>
            </div>
            <div className="card">
              <h3>Calculation chain</h3>
              <ol className="working-list">
                <li>
                  Annual power cost = facility MW × operating hours × power
                  price.
                </li>
                <li>
                  Productive GPU-hours = GPU count × operating hours ×
                  utilization.
                </li>
                <li>
                  Cash before opening = option capital + delay months × monthly
                  carrying cost.
                </li>
                <li>
                  Annual operating cost = option-specific lease and operating
                  costs + annual power cost.
                </li>
                <li>
                  Cost per productive GPU-hour = annual operating cost ÷
                  productive GPU-hours.
                </li>
                <li>
                  The ten-year path prorates operating cost in a partial opening
                  year.
                </li>
              </ol>
            </div>
          </div>
          <p className="subtle" style={{ marginTop: 18 }}>
            The scenario controls may replace these example assumptions. The
            grid-delay stress adds three months to the entered grid delay; the
            utilization stress halves the entered utilization.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <div className="section-head">
            <div>
              <span className="eyebrow">Open questions</span>
              <h2>What still determines approval.</h2>
            </div>
          </div>
          <div className="grid-3">
            <div className="card">
              <span className="tag gray">Unknown</span>
              <h3>Grid connection</h3>
              <p>
                No site-specific energization date or connection cost is
                established for the three candidates.
              </p>
            </div>
            <div className="card">
              <span className="tag gray">Unknown</span>
              <h3>Member commitment</h3>
              <p>
                Contracted GPU-hours and each institution’s minimum reservation
                remain to be agreed.
              </p>
            </div>
            <div className="card">
              <span className="tag gray">Unknown</span>
              <h3>Vendor pricing</h3>
              <p>
                Equipment, construction, lease and service-level offers
                determine the bankable economics.
              </p>
            </div>
          </div>
          <p className="lead" style={{ marginTop: 30 }}>
            The{' '}
            <a className="text-link" href="/countries">
              country comparison
            </a>{' '}
            shows judgment scores; the{' '}
            <a className="text-link" href="/investment">
              investment explorer
            </a>{' '}
            applies editable scenario inputs. Neither replaces a utility offer
            or a contracted price.
          </p>
        </div>
      </section>
    </>
  );
}
