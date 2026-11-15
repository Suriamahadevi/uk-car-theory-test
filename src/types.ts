export type TopicId =
  | 'alertness'
  | 'attitude'
  | 'safety-vehicle'
  | 'safety-margins'
  | 'hazard-awareness'
  | 'vulnerable'
  | 'other-vehicles'
  | 'vehicle-handling'
  | 'motorway'
  | 'rules-of-road'
  | 'signs'
  | 'documents'
  | 'incidents'
  | 'loading';

export type Difficulty = 'easy' | 'medium' | 'hard';

/** Where a question's facts come from. */
export interface SourceRef {
  /** 'official' = written for this site from official GOV.UK / DVSA / Highway Code rules.
   *  'generated' = produced by the rule-based generation engine from official rule data.
   *  'book' = taken from pages of the user's AA book (none uploaded yet). */
  kind: 'official' | 'generated' | 'book';
  ref: string;
  page?: number;
}

export interface Question {
  id: string;
  topic: TopicId;
  difficulty: Difficulty;
  text: string;
  options: string[];
  /** Indexes of the correct option(s). More than one means "Mark N answers". */
  correct: number[];
  /** Why the correct answer is right, in plain English. */
  explanation: string;
  /** One note per option explaining why it is right or wrong. */
  optionNotes: string[];
  /** The rule to remember. */
  rule: string;
  /** Practical real-road example. */
  example?: string;
  source: SourceRef;
  tags: string[];
  kind: 'standard' | 'scenario' | 'generated';
  /** Questions sharing a ruleKey test the same rule; a session only uses one of them. */
  ruleKey?: string;
  /** Options shown as road-sign pictures (sign IDs), one per option. */
  optionSigns?: string[];
  /** Optional road sign drawn above the question. */
  sign?: string;
  /** Rule may have changed or is under review – shown with a warning, never used in mock tests. */
  verify?: string;
}

export interface Attempt {
  qid: string;
  selected: number[];
  correct: boolean;
  at: number;
  mode: 'learn' | 'mock' | 'revision' | 'quick';
  sessionId: string;
}

export interface MistakeEntry {
  qid: string;
  lastSelected: number[];
  timesWrong: number;
  firstWrongAt: number;
  lastAttemptAt: number;
  /** Session IDs in which the question was answered correctly since the last wrong answer. */
  correctSessions: string[];
  mastered: boolean;
}

export interface MockAnswer {
  qid: string;
  selected: number[];
  flagged: boolean;
}

export interface ActiveMock {
  id: string;
  startedAt: number;
  deadline: number;
  answers: MockAnswer[];
  current: number;
}

export interface MockResult {
  id: string;
  startedAt: number;
  finishedAt: number;
  durationMs: number;
  answers: MockAnswer[];
  score: number;
  total: number;
  passed: boolean;
  timedOut: boolean;
  revisionCompleted: boolean;
}

export interface ActiveSession {
  id: string;
  title: string;
  mode: 'learn' | 'revision' | 'quick';
  qids: string[];
  index: number;
  /** Answers given in this session, keyed by question ID. */
  answered: Record<string, number[]>;
  startedAt: number;
  /** If this session revises a mock test, its ID. */
  fromMockId?: string;
  returnTo?: string;
}

export interface HazardClipResult {
  clipId: string;
  score: number;
  clicks: number[];
  cheated: boolean;
}

export interface HazardResult {
  id: string;
  at: number;
  full: boolean;
  clips: HazardClipResult[];
  score: number;
  max: number;
  passed: boolean;
}

export interface Settings {
  autoAdvance: boolean;
  showTimer: boolean;
  largeText: boolean;
  masteryTarget: number;
}

export interface AppData {
  version: 1;
  attempts: Attempt[];
  mistakes: Record<string, MistakeEntry>;
  mocks: MockResult[];
  activeMock: ActiveMock | null;
  activeSession: ActiveSession | null;
  notesRead: Partial<Record<TopicId, number>>;
  revisionCardsDone: Record<string, number>;
  hazard: HazardResult[];
  hazardLessonsDone: boolean;
  settings: Settings;
}
