import { Link, useNavigate } from 'react-router-dom';
import { useAppData } from '../store/store';
import { MOCK_MINUTES, MOCK_QUESTIONS, PASS_MARK, startMock } from '../store/actions';
import { ALL_QUESTIONS } from '../engine/bank';

export default function MockStart() {
  const data = useAppData();
  const nav = useNavigate();
  const used = new Set(data.mocks.flatMap((m) => m.answers.map((a) => a.qid)));
  const fresh = ALL_QUESTIONS.filter((q) => !q.verify && !used.has(q.id)).length;
  const lastNeedsRevision = [...data.mocks].reverse().find((m) => !m.revisionCompleted && m.score < m.total);

  return (
    <>
      <h1 className="govuk-heading-xl">Mock test</h1>
      <p className="govuk-body-l">This mock test follows the format of the multiple-choice part of the UK car (category B) theory test.</p>
      <table className="govuk-table">
        <tbody className="govuk-table__body">
          <tr className="govuk-table__row"><th className="govuk-table__header" scope="row">Questions</th><td className="govuk-table__cell">{MOCK_QUESTIONS}, covering all 14 topics</td></tr>
          <tr className="govuk-table__row"><th className="govuk-table__header" scope="row">Time allowed</th><td className="govuk-table__cell">{MOCK_MINUTES} minutes</td></tr>
          <tr className="govuk-table__row"><th className="govuk-table__header" scope="row">Pass mark</th><td className="govuk-table__cell">{PASS_MARK} out of {MOCK_QUESTIONS}</td></tr>
          <tr className="govuk-table__row"><th className="govuk-table__header" scope="row">Answers</th><td className="govuk-table__cell">Not shown until you submit</td></tr>
          <tr className="govuk-table__row"><th className="govuk-table__header" scope="row">Unused questions left</th><td className="govuk-table__cell">{fresh} you have not had in a mock test yet</td></tr>
        </tbody>
      </table>

      <h2 className="govuk-heading-m">During the test you can</h2>
      <ul className="govuk-list govuk-list--bullet">
        <li>move between questions with Previous and Next, or jump to any question number</li>
        <li>flag questions to come back to</li>
        <li>change any answer before you submit</li>
        <li>review unanswered and flagged questions before you finish</li>
      </ul>
      <div className="govuk-warning-text">
        <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
        <strong className="govuk-warning-text__text"><span className="govuk-visually-hidden">Warning</span>The timer keeps running if you leave or refresh the page. When time runs out, the test is submitted automatically.</strong>
      </div>
      <p className="govuk-body">In the real test, 3 of the 50 questions are about a short video clip. This mock cannot show the official video, so those are replaced by written questions.</p>

      {lastNeedsRevision && (
        <div className="govuk-inset-text">
          Tip: before your next mock test, <Link className="govuk-link" to={`/mock/results/${lastNeedsRevision.id}`}>revise the questions you got wrong last time</Link>.
        </div>
      )}

      {data.activeMock ? (
        <Link to="/mock/exam" role="button" className="govuk-button">Return to the test in progress</Link>
      ) : (
        <button type="button" className="govuk-button govuk-button--start" onClick={() => { startMock(); nav('/mock/exam'); }}>
          Start the mock test
        </button>
      )}
    </>
  );
}
