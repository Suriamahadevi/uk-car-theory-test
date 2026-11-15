import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export const NAV = [
  { to: '/', label: 'Dashboard' },
  { to: '/topics', label: 'Learn by topic' },
  { to: '/practice', label: 'Practice questions' },
  { to: '/mock', label: 'Mock test' },
  { to: '/hazard', label: 'Hazard perception' },
  { to: '/mistakes', label: 'Mistake Book' },
  { to: '/revision', label: 'Revision centre' },
  { to: '/history', label: 'Test history' },
  { to: '/settings', label: 'Settings' },
];

export const DISCLAIMER =
  'This website is an independent revision resource. It is not affiliated with or endorsed by the DVSA or the UK Government.';

function LogoMark() {
  return (
    <svg className="app-logo-mark" width="30" height="30" viewBox="0 0 30 30" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="28" height="28" fill="#ffdd00" />
      <text x="15" y="21" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="16" fill="#0b0c0c">TT</text>
    </svg>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 40.0525rem)').matches);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 40.0525rem)');
    const fn = () => setIsMobile(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  useEffect(() => setMenuOpen(false), [pathname]);

  const isActive = (to: string) => (to === '/' ? pathname === '/' : pathname.startsWith(to));

  return (
    <>
      <a href="#main-content" className="govuk-skip-link" onClick={(e) => { e.preventDefault(); document.getElementById('main-content')?.focus(); }}>
        Skip to main content
      </a>
      <header className="govuk-generic-header" role="banner">
        <div className="govuk-generic-header__container govuk-width-container">
          <div className="govuk-generic-header__logo">
            <Link to="/" className="govuk-generic-header__homepage-link">
              <LogoMark />
              Theory Test Ready
            </Link>
            <p className="app-header-tagline">Independent UK Driving Theory Test Practice</p>
          </div>
        </div>
      </header>
      <section className="govuk-service-navigation" aria-label="Site menu">
        <div className="govuk-width-container">
          <div className="govuk-service-navigation__container">
            <nav aria-label="Menu" className="govuk-service-navigation__wrapper">
              {isMobile && (
                <button
                  type="button"
                  className="govuk-service-navigation__toggle"
                  aria-controls="navigation"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((o) => !o)}
                >
                  Menu
                </button>
              )}
              <ul className="govuk-service-navigation__list" id="navigation" hidden={isMobile && !menuOpen}>
                {NAV.map((n) => (
                  <li key={n.to} className={`govuk-service-navigation__item${isActive(n.to) ? ' govuk-service-navigation__item--active' : ''}`}>
                    <Link className="govuk-service-navigation__link" to={n.to} aria-current={isActive(n.to) ? 'page' : undefined}>
                      {isActive(n.to) ? <strong className="govuk-service-navigation__active-fallback">{n.label}</strong> : n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>
      <div className="govuk-width-container">
        <div className="app-disclaimer">
          <strong className="govuk-tag govuk-tag--yellow">Independent</strong>
          {DISCLAIMER}
        </div>
        <main className="govuk-main-wrapper" id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
      <footer className="govuk-footer">
        <div className="govuk-width-container">
          <div className="govuk-footer__meta">
            <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
              <h2 className="govuk-visually-hidden">Support links</h2>
              <ul className="govuk-footer__inline-list">
                <li className="govuk-footer__inline-list-item"><Link className="govuk-footer__link" to="/about">About this site and sources</Link></li>
                <li className="govuk-footer__inline-list-item"><a className="govuk-footer__link" href="https://www.gov.uk/guidance/the-highway-code" target="_blank" rel="noreferrer">The Highway Code (GOV.UK)</a></li>
                <li className="govuk-footer__inline-list-item"><a className="govuk-footer__link" href="https://www.gov.uk/book-theory-test" target="_blank" rel="noreferrer">Book your theory test (GOV.UK)</a></li>
              </ul>
              <p className="govuk-body-s">{DISCLAIMER}</p>
              <p className="govuk-body-s">
                Rules are based on the Highway Code and other guidance published on GOV.UK, available under the Open Government Licence v3.0. Questions on this site are written for practice and are not real or leaked DVSA test questions.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
