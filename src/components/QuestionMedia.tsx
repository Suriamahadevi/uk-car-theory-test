import type { Question } from '../types';
import SignImage from './SignImage';
import { MarkingImage } from '../data/markings';
import CaseStudyVideo from './CaseStudyVideo';

/** Sign, road marking or case-study video that belongs with a question. */
export default function QuestionMedia({ q, compact }: { q: Question; compact?: boolean }) {
  return (
    <>
      {q.caseStudy && !compact && <CaseStudyVideo caseId={q.caseStudy} />}
      {q.sign && <SignImage id={q.sign} small={compact} />}
      {q.marking && <MarkingImage id={q.marking} small={compact} />}
    </>
  );
}
