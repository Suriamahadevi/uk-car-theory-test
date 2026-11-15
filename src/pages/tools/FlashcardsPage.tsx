import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { setState, useAppData } from '../../store/store';
import { SIGNS, CATEGORY_LABEL, type SignCategory } from '../../data/signs';
import SignImage from '../../components/SignImage';
import { shuffle } from '../../engine/random';

export default function FlashcardsPage() {
  const data = useAppData();
  const [cat, setCat] = useState<SignCategory | 'all' | 'unknown'>('all');
  const [seed, setSeed] = useState(0);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const known = (id: string) => !!data.revisionCardsDone[`flash-${id}`];

  const deck = useMemo(() => {
    const base = SIGNS.filter((s) => (cat === 'all' ? true : cat === 'unknown' ? !known(s.id) : s.category === cat));
    return seed ? shuffle(base) : base;
  }, [cat, seed]); // eslint-disable-line react-hooks/exhaustive-deps
  const s = deck[Math.min(i, deck.length - 1)];
  const knownCount = SIGNS.filter((x) => known(x.id)).length;

  const mark = (k: boolean) => {
    setState((st) => {
      const n = { ...st.revisionCardsDone };
      if (k) n[`flash-${s.id}`] = Date.now(); else delete n[`flash-${s.id}`];
      return { ...st, revisionCardsDone: n };
    });
    setFlipped(false);
    setI((x) => (x + 1) % Math.max(deck.length, 1));
  };

  return (
    <>
      <Link to="/tools" className="govuk-back-link">Study tools</Link>
      <h1 className="govuk-heading-xl">Traffic sign flashcards</h1>
      <p className="govuk-body">You know {knownCount} of {SIGNS.length} signs. Look at the sign, say what it means, then reveal the answer.</p>
      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--s" htmlFor="deck">Deck</label>
        <select className="govuk-select" id="deck" value={cat} onChange={(e) => { setCat(e.target.value as typeof cat); setI(0); setFlipped(false); }}>
          <option value="all">All signs ({SIGNS.length})</option>
          <option value="unknown">Signs I do not know yet ({SIGNS.length - knownCount})</option>
          {(Object.keys(CATEGORY_LABEL) as SignCategory[]).map((c) => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
        </select>
        <button type="button" className="govuk-button govuk-button--secondary govuk-!-margin-bottom-0 govuk-!-margin-left-2" onClick={() => { setSeed((x) => x + 1); setI(0); setFlipped(false); }}>Shuffle</button>
      </div>

      {!s ? (
        <p className="govuk-body">No cards in this deck – well done!</p>
      ) : (
        <div className="app-revision-card" style={{ maxWidth: 480, textAlign: 'center' }} aria-live="polite">
          <p className="govuk-body-s">Card {Math.min(i, deck.length - 1) + 1} of {deck.length}</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}><SignImage id={s.id} label="Road sign – what does it mean?" /></div>
          {flipped ? (
            <>
              <p className="govuk-heading-m">{s.meaning}</p>
              <p className="govuk-body-s">{CATEGORY_LABEL[s.category]} – {s.look}.{s.tip ? ` ${s.tip}` : ''}</p>
              <div className="app-actions" style={{ justifyContent: 'center' }}>
                <button type="button" className="govuk-button" onClick={() => mark(true)}>I knew it</button>
                <button type="button" className="govuk-button govuk-button--warning" onClick={() => mark(false)}>I did not know it</button>
              </div>
            </>
          ) : (
            <button type="button" className="govuk-button" onClick={() => setFlipped(true)}>Show meaning</button>
          )}
          {known(s.id) && <p className="govuk-body-s"><strong className="govuk-tag govuk-tag--green">Known</strong></p>}
        </div>
      )}
    </>
  );
}
