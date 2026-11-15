import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Icon from './Icon';

export const NAV_GROUPS: { heading: string | null; items: { to: string; label: string; icon: string }[] }[] = [
  { heading: null, items: [{ to: '/', label: 'Dashboard', icon: 'home' }] },
  { heading: 'Learn', items: [
    { to: '/topics', label: 'Learn by topic', icon: 'book' },
    { to: '/practice', label: 'Practice questions', icon: 'list' },
    { to: '/revision', label: 'Revision centre', icon: 'cards' },
    { to: '/tools', label: 'Study tools', icon: 'tool' },
  ] },
  { heading: 'Test', items: [
    { to: '/mock', label: 'Mock test', icon: 'clock' },
    { to: '/hazard', label: 'Hazard perception', icon: 'eye' },
  ] },
  { heading: 'Progress', items: [
    { to: '/mistakes', label: 'Mistake Book', icon: 'alert' },
    { to: '/analytics', label: 'Performance', icon: 'chart' },
    { to: '/history', label: 'Test history', icon: 'list' },
    { to: '/settings', label: 'Settings', icon: 'gear' },
  ] },
];
export const NAV = NAV_GROUPS.flatMap((g) => g.items);

export const DISCLAIMER =
  'This website is an independent revision resource. It is not affiliated with or endorsed by the DVSA or the UK Government.';

function Brand() {
  return (
    <Link to="/" className="app-brand">
      <span className="app-brand__mark" aria-hidden="true">TT</span>
      <span>
        <span className="app-brand__name">Theory Test Ready</span>
        <span className="app-brand__tagline">Independent UK Driving Theory Test Practice</span>
      </span>
    </Link>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMenuOpen(false); toggleRef.current?.focus(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const isActive = (to: string) => (to === '/' ? pathname === '/' : pathname.startsWith(to));

  return (
    <div className={`app-shell${menuOpen ? ' is-menu-open' : ''}`}>
      <a href="#main-content" className="govuk-skip-link app-skip" onClick={(e) => { e.preventDefault(); document.getElementById('main-content')?.focus(); }}>
        Skip to main content
      </a>

      <header className="app-topbar">
        <Brand />
        <button
          ref={toggleRef}
          type="button"
          className="app-menu-toggle"
          aria-controls="app-navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} />
          <span>{menuOpen ? 'Close' : 'Menu'}</span>
        </button>
      </header>

      <aside className="app-sidebar" id="app-navigation" aria-label="Site menu">
        <div className="app-sidebar__brand"><Brand /></div>
        <nav aria-label="Main">
          {NAV_GROUPS.map((g, gi) => (
            <div className="app-nav__group" key={gi}>
              {g.heading && <p className="app-nav__heading" id={`nav-h-${gi}`}>{g.heading}</p>}
              <ul className="app-nav" aria-labelledby={g.heading ? `nav-h-${gi}` : undefined}>
                {g.items.map((n) => (
                  <li key={n.to}>
                    <Link className={`app-nav__link${isActive(n.to) ? ' is-active' : ''}`} to={n.to} aria-current={isActive(n.to) ? 'page' : undefined}>
                      <span className="app-nav__icon"><Icon name={n.icon} size={18} /></span>
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <p className="app-sidebar__note">Independent revision resource. Not affiliated with the DVSA or the UK Government.</p>
      </aside>
      <button type="button" className="app-scrim" aria-hidden="true" tabIndex={-1} onClick={() => setMenuOpen(false)} />

      <div className="app-main">
        <p className="app-disclaimer" role="note">
          <span className="app-disclaimer__chip">Independent</span>
          Not affiliated with or endorsed by the DVSA or the UK Government.
        </p>
        <main className="app-content" id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
        <footer className="app-footer">
          <ul className="app-footer__links">
            <li><Link className="govuk-link" to="/about">About this site and sources</Link></li>
            <li><a className="govuk-link" href="https://www.gov.uk/guidance/the-highway-code" target="_blank" rel="noreferrer">The Highway Code (GOV.UK)</a></li>
            <li><a className="govuk-link" href="https://www.gov.uk/book-theory-test" target="_blank" rel="noreferrer">Book your theory test (GOV.UK)</a></li>
          </ul>
          <p className="govuk-body-s">{DISCLAIMER}</p>
          <p className="govuk-body-s">
            Rules are based on the Highway Code and other guidance published on GOV.UK, available under the Open Government Licence v3.0. Questions on this site are written for practice and are not real or leaked DVSA test questions.
          </p>
        </footer>
      </div>
    </div>
  );
}
