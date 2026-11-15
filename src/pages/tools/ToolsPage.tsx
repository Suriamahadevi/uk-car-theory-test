import { Link, useNavigate } from 'react-router-dom';
import PageHead from '../../components/PageHead';
import { useAppData } from '../../store/store';
import { buildPractice, ALL_QUESTIONS } from '../../engine/bank';
import { startSession } from '../../store/actions';
import { TOPICS } from '../../data/topics';
import type { PracticeOptions } from '../../engine/bank';
import { CASE_STUDIES } from '../../data/caseStudies';
import { shuffle } from '../../engine/random';

const ALL = TOPICS.map((t) => t.id);

export default function ToolsPage() {
  const data = useAppData();
  const nav = useNavigate();
  const practise = (title: string, o: Partial<PracticeOptions>) => {
    const qids = buildPractice(data, { topics: ALL, count: 15, difficulty: 'any', prefer: 'smart', ...o });
    startSession({ title, mode: 'learn', qids, returnTo: '/tools' });
    nav('/session');
  };
  const caseStudies = () => {
    const ids = shuffle(CASE_STUDIES).flatMap((c) => c.questionIds);
    startSession({ title: 'Video case studies (simulated)', mode: 'learn', qids: ids, returnTo: '/tools' });
    nav('/session');
  };
  const multi = ALL_QUESTIONS.filter((q) => q.correct.length > 1).length;

  const card = (title: string, desc: string, action: React.ReactNode) => (
    <div className="app-card" key={title}>
      <h2 className="govuk-heading-s">{title}</h2>
      <p className="govuk-body-s">{desc}</p>
      <div className="app-card__foot">{action}</div>
    </div>
  );
  const btn = (label: string, fn: () => void) => <button type="button" className="govuk-button govuk-!-margin-bottom-0" onClick={fn}>{label}</button>;
  const link = (label: string, to: string) => <Link to={to} className="govuk-button govuk-!-margin-bottom-0">{label}</Link>;

  return (
    <>
      <PageHead eyebrow="Learn" title="Study tools" lead="Focused trainers for the rules that need practice." />

      <h2 className="govuk-heading-l">Plan and track</h2>
      <div className="app-card-grid">
        {card('Daily revision planner', 'A plan for today built from your mistakes, weak topics and test history.', link('Open planner', '/tools/planner'))}
        {card('Weak topic analytics', 'Accuracy by topic, difficulty and concept, with targeted practice.', link('View analytics', '/analytics'))}
        {card(`Bookmarks (${data.bookmarks.length})`, 'Questions you have bookmarked for later.', link('View bookmarks', '/tools/bookmarks'))}
        {card('Offline revision notes', 'All notes on one page – print, download, or use offline.', link('Open notes', '/tools/notes'))}
      </div>

      <h2 className="govuk-heading-l">Trainers</h2>
      <div className="app-card-grid">
        {card('Smart practice', 'Fifteen questions chosen from your weakest areas and unseen rules.', btn('Start smart practice', () => practise('Smart practice', {})))}
        {card('Traffic sign flashcards', 'Flip cards for every sign in the library, grouped by type.', link('Open flashcards', '/tools/flashcards'))}
        {card('Speed limit practice', 'National limits for cars and towing, including Wales.', btn('Practise speed limits', () => practise('Speed limit practice', { tags: ['speed-limits'] })))}
        {card('Stopping distance trainer', 'Thinking vs braking distance, conditions and a guessing game.', link('Open trainer', '/tools/stopping'))}
        {card('Road markings trainer', 'Lines, boxes, zig-zags and kerb markings.', btn('Practise markings', () => practise('Road markings trainer', { tags: ['markings'] })))}
        {card('Roundabout scenarios', 'Lanes, signals and priorities at roundabouts.', btn('Practise roundabouts', () => practise('Roundabout scenarios', { tags: ['roundabouts'] })))}
        {card('Motorway practice', 'Joining, lanes, signals, smart motorways and breakdowns.', btn('Practise motorways', () => practise('Motorway practice', { topics: ['motorway'] })))}
        {card('Video case studies', `${CASE_STUDIES.length} simulated silent video scenarios, each with 3 questions.`, btn('Practise case studies', caseStudies))}
        {card('First aid, CPR and AED', 'The 2026 first aid module with a quiz.', link('Open module', '/first-aid'))}
        {card(`"Mark two answers" questions (${multi})`, 'Practise questions with more than one correct answer.', btn('Practise', () => practise('Mark two answers', { multiOnly: true })))}
      </div>
    </>
  );
}
