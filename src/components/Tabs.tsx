import { useId, useRef, useState, type ReactNode, type KeyboardEvent } from 'react';

/** Accessible tabs (WAI-ARIA tabs pattern with arrow-key navigation). */
export default function Tabs({ tabs, initial = 0, label }: { tabs: { label: string; content: ReactNode }[]; initial?: number; label: string }) {
  const [active, setActive] = useState(initial);
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent, i: number) => {
    let next = -1;
    if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
    if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = tabs.length - 1;
    if (next >= 0) { e.preventDefault(); setActive(next); refs.current[next]?.focus(); }
  };
  return (
    <div className="app-tabs">
      <div className="app-tabs__list" role="tablist" aria-label={label}>
        {tabs.map((t, i) => (
          <button
            key={t.label}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            className="app-tabs__tab"
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${id}-panel-${active}`} aria-labelledby={`${id}-tab-${active}`} tabIndex={0} className="app-tabs__panel">
        {tabs[active].content}
      </div>
    </div>
  );
}
