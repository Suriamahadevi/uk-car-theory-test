import { Link, useNavigate } from 'react-router-dom';
import { useAppData } from '../../store/store';
import { QMAP } from '../../engine/bank';
import { startSession } from '../../store/actions';
import { TOPIC_MAP } from '../../data/topics';
import { toggleBookmark } from '../../components/BookmarkButton';

export default function BookmarksPage() {
  const data = useAppData();
  const nav = useNavigate();
  const qs = data.bookmarks.map((id) => QMAP[id]).filter(Boolean);
  return (
    <>
      <Link to="/tools" className="govuk-back-link">Study tools</Link>
      <h1 className="govuk-heading-xl">Bookmarks</h1>
      <p className="govuk-body">Bookmark any question in practice or revision with the "Bookmark" button.</p>
      {qs.length === 0 ? (
        <p className="govuk-body">You have no bookmarks yet.</p>
      ) : (
        <>
          <button type="button" className="govuk-button" onClick={() => { startSession({ title: 'Bookmarked questions', mode: 'learn', qids: qs.map((q) => q.id), returnTo: '/tools/bookmarks' }); nav('/session'); }}>
            Practise all {qs.length} bookmarks
          </button>
          <table className="govuk-table">
            <thead className="govuk-table__head"><tr className="govuk-table__row"><th className="govuk-table__header">Question</th><th className="govuk-table__header">Topic</th><th className="govuk-table__header"><span className="govuk-visually-hidden">Action</span></th></tr></thead>
            <tbody className="govuk-table__body">
              {qs.map((q) => (
                <tr className="govuk-table__row" key={q.id}>
                  <td className="govuk-table__cell">{q.text}</td>
                  <td className="govuk-table__cell">{TOPIC_MAP[q.topic].title}</td>
                  <td className="govuk-table__cell"><button type="button" className="govuk-button govuk-button--secondary govuk-!-margin-bottom-0" onClick={() => toggleBookmark(q.id)}>Remove<span className="govuk-visually-hidden"> bookmark</span></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  );
}
