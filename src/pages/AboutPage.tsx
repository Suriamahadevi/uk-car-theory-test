import { Link } from 'react-router-dom';
import { ALL_QUESTIONS, WRITTEN } from '../engine/bank';
import { DISCLAIMER } from '../components/Layout';
import { PRODUCT_STATUS, STATUS_LABEL, type Status } from '../data/productStatus';
import Tabs from '../components/Tabs';
import PageHead from '../components/PageHead';

const TAG: Record<Status, string> = { completed: 'govuk-tag--green', 'in-progress': 'govuk-tag--yellow', planned: 'govuk-tag--grey' };

export default function AboutPage() {
  const generated = ALL_QUESTIONS.length - WRITTEN.length;
  const verify = ALL_QUESTIONS.filter((q) => q.verify);

  const about = (
    <>
      <p className="govuk-body-l">{DISCLAIMER}</p>
      <p className="govuk-body">Theory Test Ready helps learners prepare for the UK car theory test with short practice sessions, clear explanations and realistic mock tests.</p>
      <p className="govuk-body">None of the questions are real or leaked DVSA questions. They are practice questions that test the same rules.</p>
      <h2 className="govuk-heading-s">Your data</h2>
      <p className="govuk-body">Progress is stored in this browser on this device only. Nothing is sent to a server. You can export it in <Link className="govuk-link" to="/settings">Settings</Link>.</p>
      <p className="govuk-body-s app-muted">Contains public sector information licensed under the Open Government Licence v3.0. Road sign drawings are simplified illustrations.</p>
    </>
  );

  const sources = (
    <>
      <table className="govuk-table">
        <thead className="govuk-table__head"><tr className="govuk-table__row"><th className="govuk-table__header">Source</th><th className="govuk-table__header govuk-table__header--numeric">Questions</th></tr></thead>
        <tbody className="govuk-table__body">
          <tr className="govuk-table__row"><td className="govuk-table__cell">Written from the Highway Code and GOV.UK / DVSA guidance (incl. scenarios and case studies)</td><td className="govuk-table__cell govuk-table__cell--numeric">{WRITTEN.length}</td></tr>
          <tr className="govuk-table__row"><td className="govuk-table__cell">Generated from official rule data (signs, markings, speed limits, stopping distances)</td><td className="govuk-table__cell govuk-table__cell--numeric">{generated}</td></tr>
          <tr className="govuk-table__row"><td className="govuk-table__cell">AA book (not supplied)</td><td className="govuk-table__cell govuk-table__cell--numeric">0</td></tr>
        </tbody>
      </table>
      {verify.length > 0 && <p className="govuk-body">{verify.length} question{verify.length > 1 ? 's are' : ' is'} flagged because the law may change. Flagged questions never appear in mock tests.</p>}
      <p className="govuk-body"><Link className="govuk-link" to="/content-review">Review every question and its source</Link></p>
      <h2 className="govuk-heading-s">Official resources</h2>
      <ul className="govuk-list govuk-list--bullet">
        <li><a className="govuk-link" href="https://www.gov.uk/guidance/the-highway-code" target="_blank" rel="noreferrer">The Highway Code</a></li>
        <li><a className="govuk-link" href="https://www.gov.uk/government/publications/know-your-traffic-signs" target="_blank" rel="noreferrer">Know Your Traffic Signs</a></li>
        <li><a className="govuk-link" href="https://www.gov.uk/theory-test" target="_blank" rel="noreferrer">Theory test: cars</a></li>
        <li><a className="govuk-link" href="https://www.gov.uk/take-practice-theory-test" target="_blank" rel="noreferrer">Free official practice theory test</a></li>
        <li><a className="govuk-link" href="https://www.gov.uk/guidance/the-highway-code/annex-7-first-aid-on-the-road" target="_blank" rel="noreferrer">Highway Code Annex 7: First aid on the road</a></li>
      </ul>
    </>
  );

  const status = (
    <>
      <p className="govuk-body">What exists today and what is planned. Accounts, payments and admin tools are <strong>not</strong> built yet.</p>
      {(['completed', 'in-progress', 'planned'] as Status[]).map((st) => (
        <section key={st} className="app-section">
          <h2 className="govuk-heading-m">{STATUS_LABEL[st]}</h2>
          <ul className="app-status-list">
            {PRODUCT_STATUS.filter((x) => x.status === st).map((x) => (
              <li key={x.item}>
                <strong className={`govuk-tag ${TAG[st]}`}>{x.area}</strong>
                <span>{x.item}{x.note && <span className="app-muted"> – {x.note}</span>}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );

  return (
    <>
      <PageHead eyebrow="About" title="About Theory Test Ready" lead="An independent UK driving theory revision platform." />
      <Tabs label="About sections" tabs={[
        { label: 'About', content: about },
        { label: 'Sources', content: sources },
        { label: 'Product status', content: status },
      ]} />
    </>
  );
}
