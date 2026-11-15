import type { Difficulty, Question, TopicId } from '../../types';

type Opt = [text: string, note: string];
interface Extra {
  tags?: string[];
  ref?: string;
  scenario?: boolean;
  sign?: string;
  ruleKey?: string;
  verify?: string;
}

const D: Record<string, Difficulty> = { e: 'easy', m: 'medium', h: 'hard' };

/**
 * Compact authoring helper. Every question written for this site is based on the
 * current Highway Code / DVSA guidance (GOV.UK). `defaultRef` names the section.
 */
export function maker(topic: TopicId, defaultRef: string) {
  return function q(
    id: string,
    diff: 'e' | 'm' | 'h',
    text: string,
    opts: Opt[],
    correct: number | number[],
    explanation: string,
    rule: string,
    example?: string,
    extra: Extra = {},
  ): Question {
    return {
      id,
      topic,
      difficulty: D[diff],
      text,
      options: opts.map((o) => o[0]),
      optionNotes: opts.map((o) => o[1]),
      correct: Array.isArray(correct) ? correct : [correct],
      explanation,
      rule,
      example,
      source: { kind: 'official', ref: extra.ref ?? defaultRef },
      tags: extra.tags ?? [],
      kind: extra.scenario ? 'scenario' : 'standard',
      sign: extra.sign,
      ruleKey: extra.ruleKey,
      verify: extra.verify,
    };
  };
}
