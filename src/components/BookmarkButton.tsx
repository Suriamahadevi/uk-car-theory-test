import { setState, useAppData } from '../store/store';

export function toggleBookmark(qid: string) {
  setState((s) => ({ ...s, bookmarks: s.bookmarks.includes(qid) ? s.bookmarks.filter((b) => b !== qid) : [...s.bookmarks, qid] }));
}

export default function BookmarkButton({ qid }: { qid: string }) {
  const data = useAppData();
  const on = data.bookmarks.includes(qid);
  return (
    <button type="button" className="govuk-button govuk-button--secondary" aria-pressed={on} onClick={() => toggleBookmark(qid)}>
      {on ? '★ Bookmarked' : '☆ Bookmark'}
    </button>
  );
}
