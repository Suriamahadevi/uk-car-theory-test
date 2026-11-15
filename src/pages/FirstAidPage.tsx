import { Link, useNavigate } from 'react-router-dom';
import PageHead from '../components/PageHead';
import { setState, useAppData } from '../store/store';
import { buildPractice } from '../engine/bank';
import { startSession } from '../store/actions';

const SECTIONS: { id: string; title: string; points: string[] }[] = [
  {
    id: 'fa-response', title: 'Emergency response at a road traffic incident',
    points: [
      'Deal with danger first: warn other traffic (hazard warning lights), switch off engines, watch for spilt fuel and broken glass, and do not let anyone smoke.',
      'Call 999 or 112 as soon as possible. Give the exact location (including direction of travel on a motorway), the number of vehicles and the condition of casualties.',
      'Do not move casualties from their vehicles unless there is a threat of further danger.',
      'Do not remove a motorcyclist\'s helmet unless it is essential.',
      'Keep casualties warm, dry and comfortable. Reassure them. Do not give them anything to eat or drink.',
    ],
  },
  {
    id: 'fa-drabc', title: 'DR ABC',
    points: [
      'D – Danger: check it is safe to approach.',
      'R – Response: gently shake the shoulders and ask loudly "Are you all right?"',
      'A – Airway: if there is no response, open the airway by lifting the chin forward.',
      'B – Breathing: check they are breathing normally. If not, start CPR.',
      'C – Circulation: if nothing is embedded, apply firm pressure over a bleeding wound.',
      'Unconscious and breathing normally: place them in the recovery position until help arrives.',
    ],
  },
  {
    id: 'fa-cpr', title: 'CPR (cardiopulmonary resuscitation)',
    points: [
      'If someone is unresponsive and not breathing normally, call 999 (on speakerphone) and start CPR straight away. The call handler can talk you through it.',
      'Adult: interlock your fingers, place them in the centre of the chest and press down hard and fast – about 5 to 6 cm deep, about twice a second (100 to 120 a minute).',
      'Child: you may only need one hand, and you should not press down as far.',
      'Infant: use two fingers in the middle of the chest and press down about one third of the chest depth.',
      'Do not stop until the casualty starts breathing again or a medical professional takes over.',
    ],
  },
  {
    id: 'fa-aed', title: 'Defibrillators (AEDs)',
    points: [
      'A defibrillator gives a shock to the heart, which can help restore a normal rhythm.',
      'Public access defibrillators are designed to be used by anyone. No training is needed.',
      'If someone is with you, ask them to find an AED and bring it as soon as possible while you continue CPR.',
      'The 999 call handler can tell you where the nearest registered defibrillator is (registered devices are listed on The Circuit, the national defibrillator network).',
      'Switch it on and follow the spoken instructions. It tells you where to put the pads, when not to touch the casualty and when to continue CPR.',
      'It only gives a shock if one is needed – you cannot make things worse by using it on someone in cardiac arrest.',
    ],
  },
  {
    id: 'fa-injuries', title: 'Bleeding, burns and shock',
    points: [
      'Bleeding: protect yourself, check for objects in the wound and do not remove anything stuck in it. Apply firm pressure, or build padding either side of an embedded object, then bandage.',
      'Burns: put out flames safely. Cool the burn for at least 20 minutes with plenty of clean, cool water. Cover with cling film if available. Do not remove anything sticking to it.',
      'Shock: keep the casualty warm and calm, and stay with them.',
    ],
  },
];

export default function FirstAidPage() {
  const data = useAppData();
  const nav = useNavigate();
  const done = (id: string) => !!data.revisionCardsDone[id];
  const toggle = (id: string) => setState((s) => {
    const n = { ...s.revisionCardsDone };
    if (n[id]) delete n[id]; else n[id] = Date.now();
    return { ...s, revisionCardsDone: n };
  });
  const quiz = (title: string, tags: string[]) => {
    startSession({ title, mode: 'learn', qids: buildPractice(data, { topics: ['incidents'], count: 12, difficulty: 'any', prefer: 'unseen', tags }), returnTo: '/first-aid' });
    nav('/session');
  };
  const completed = SECTIONS.filter((s) => done(s.id)).length;

  return (
    <>
      <PageHead eyebrow="Incidents, accidents and emergencies" title="First aid, CPR and defibrillators" />
      <div className="govuk-notification-banner" role="region" aria-labelledby="fa-new">
        <div className="govuk-notification-banner__header"><h2 className="govuk-notification-banner__title" id="fa-new">Important</h2></div>
        <div className="govuk-notification-banner__content">
          <p className="govuk-notification-banner__heading">DVSA has added questions on CPR and defibrillators (AEDs) to the car theory test, and the Highway Code first aid annex was updated on 22 October 2025.</p>
          <p className="govuk-body">This module reflects that guidance. For example, burns should now be cooled for <strong>at least 20 minutes</strong>.</p>
        </div>
      </div>
      <p className="govuk-body">{completed} of {SECTIONS.length} sections revised.</p>

      {SECTIONS.map((s) => (
        <section key={s.id} className={`app-revision-card${done(s.id) ? ' is-done' : ''}`}>
          <h2 className="govuk-heading-m">{s.title}</h2>
          <ul className="govuk-list govuk-list--bullet">{s.points.map((p) => <li key={p}>{p}</li>)}</ul>
          <button type="button" className="govuk-button govuk-button--secondary govuk-!-margin-bottom-0" onClick={() => toggle(s.id)}>
            {done(s.id) ? 'Mark as not revised' : 'Mark as revised'}
          </button>
        </section>
      ))}

      <h2 className="govuk-heading-l">Test yourself</h2>
      <div className="app-actions">
        <button type="button" className="govuk-button" onClick={() => quiz('CPR and defibrillator questions', ['cpr', 'aed'])}>CPR and AED questions</button>
        <button type="button" className="govuk-button govuk-button--secondary" onClick={() => quiz('First aid questions', ['first-aid', 'collisions'])}>All first aid questions</button>
      </div>

      <div className="govuk-warning-text">
        <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
        <strong className="govuk-warning-text__text"><span className="govuk-visually-hidden">Warning</span>This is revision for the theory test, not a substitute for practical first aid training. Consider a course from a recognised provider.</strong>
      </div>

      <h2 className="govuk-heading-m">Sources</h2>
      <ul className="govuk-list govuk-list--bullet">
        <li><a className="govuk-link" href="https://www.gov.uk/guidance/the-highway-code/annex-7-first-aid-on-the-road" target="_blank" rel="noreferrer">Highway Code Annex 7: First aid on the road (GOV.UK, updated 22 October 2025)</a></li>
        <li><a className="govuk-link" href="https://www.gov.uk/government/news/new-theory-test-questions-aim-to-boost-cardiac-arrest-survival-rate" target="_blank" rel="noreferrer">New theory test questions aim to boost cardiac arrest survival rate (GOV.UK, 13 August 2025)</a></li>
        <li><a className="govuk-link" href="https://www.resus.org.uk/public-resource/defibrillation" target="_blank" rel="noreferrer">Defibrillation – Resuscitation Council UK</a></li>
        <li><a className="govuk-link" href="https://www.resus.org.uk/public-resource/defibrillation/circuit" target="_blank" rel="noreferrer">The Circuit – national defibrillator network</a></li>
      </ul>
      <p className="govuk-body"><Link className="govuk-link" to="/topics/incidents">Back to the Incidents, accidents and emergencies topic</Link></p>
    </>
  );
}
