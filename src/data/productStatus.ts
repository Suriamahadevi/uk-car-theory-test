/** Single source of truth for what exists today and what is planned. Shown on the About page. */
export type Status = 'completed' | 'in-progress' | 'planned';

export interface StatusItem { area: string; item: string; status: Status; note?: string }

export const PRODUCT_STATUS: StatusItem[] = [
  // Learning product – completed
  { area: 'Learning', item: '14 topic modules with notes, rules and exam traps', status: 'completed' },
  { area: 'Learning', item: 'Question bank (~500 questions) with explanations for every option and source references', status: 'completed' },
  { area: 'Learning', item: 'Practice modes: smart, unseen, weak topics, scenarios, difficult, "mark two"', status: 'completed' },
  { area: 'Learning', item: 'Mistake Book with spaced repetition and mastery tracking', status: 'completed' },
  { area: 'Learning', item: 'Revision centre, flashcards, trainers, planner, milestones and analytics', status: 'completed' },
  { area: 'Learning', item: 'First aid, CPR and AED module (2026 guidance)', status: 'completed' },
  { area: 'Testing', item: '50-question, 57-minute mock exam with review, flags and case study', status: 'completed' },
  { area: 'Hazard perception', item: 'Video player, click timing, scoring, missed/late feedback, history', status: 'completed', note: 'Engine and UI are complete' },
  { area: 'Hazard perception', item: 'Licensed real-road video clips', status: 'in-progress', note: 'Pending licensed content – no footage has been supplied' },
  { area: 'Hazard perception', item: 'Animated timing trainer (labelled simulation)', status: 'completed' },
  { area: 'Testing', item: 'Real video for mock-exam case studies', status: 'in-progress', note: 'Architecture ready; simulations used until licensed clips exist' },
  { area: 'Content', item: 'Content audit and automated accuracy checks', status: 'completed' },
  { area: 'Content', item: 'Local content review tool (browse, search, verification flags)', status: 'completed', note: 'Read-only, no login' },
  { area: 'Platform', item: 'Offline support, export/import of progress, GitHub Pages deployment', status: 'completed' },
  { area: 'Platform', item: 'Progress stored in this browser (localStorage) behind a Repository interface', status: 'completed' },

  // Commercial platform – planned
  { area: 'Accounts', item: 'Registration, secure sign-in, password recovery, profiles', status: 'planned' },
  { area: 'Accounts', item: 'Progress synchronisation across devices', status: 'planned', note: 'Service interface defined in src/services' },
  { area: 'Admin', item: 'Admin dashboard: users, questions, videos, topics, publishing workflow', status: 'planned' },
  { area: 'Admin', item: 'Performance reports for learners and instructors', status: 'planned' },
  { area: 'Payments', item: 'Subscription plans, payment provider, access control, renewals, invoices', status: 'planned' },
  { area: 'Infrastructure', item: 'Database, secure API, error monitoring, analytics, backups, security controls', status: 'planned' },
];

export const STATUS_LABEL: Record<Status, string> = { completed: 'Completed', 'in-progress': 'In progress', planned: 'Planned' };
