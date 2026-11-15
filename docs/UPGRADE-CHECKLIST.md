# Upgrade checklist (audit of 15 November 2026)

## Audit findings

| Area | Finding | Action |
| --- | --- | --- |
| Question bank | 200 written + 178 generated (378). No multiple-answer questions, despite UI support. | Add ~90 written questions incl. "mark two answers", first aid, roundabouts, markings, case studies. Add road-marking generator. |
| Accuracy | IN-03 says cool burns for 10 minutes. Highway Code Annex 7 (updated 22 Oct 2025) now says **at least 20 minutes** and cover with cling film. | Fix IN-03 and revision card. |
| Accuracy | First-aid content predates DVSA's CPR/AED question expansion (GOV.UK news, 13 Aug 2025). | Add CPR/AED module and questions from GOV.UK + Resuscitation Council UK. |
| Duplicates | No automated duplicate-text check. | Add normalised duplicate detection unit test. |
| Mock exam | No video case study (real test: 3 questions on a short clip). | Add silent animated case-study scenarios (clearly labelled simulations), 47 + 3 format. |
| Topic completion | Required 80% of all questions – signs topic has ~140 generated items, making it near-impossible. | Measure coverage by distinct rules (ruleKey). |
| Mock revision | "End session now" marked a mock as revised even if nothing was answered. | Mark revised only when every question was answered. |
| Learning mode | No related questions, no bookmarks. | Add related questions + bookmarks. |
| Mistake Book | No correct-attempt count, no spaced revision, no reactivation tracking. | Add correctCount, nextDue (1/3/7-day spacing), reactivations; "due today" session. |
| Smart generation | Weak-topic weighting only. | Add smart practice: weak topics + frequently missed tags + difficult + unseen. |
| Hazard perception | No missed-hazard analysis or average score; no real-video option. | Add early/late/missed analysis, average, own-video practice (user supplies licensed clip). |
| Tools | Missing flashcards, trainers, planner, bookmarks, offline notes, analytics. | New Study tools section. |
| Dashboard | No readiness assessment, streak or trend. | Add evidence-based readiness assessment. |
| Deployment | GitHub Actions + `base: '/uk-car-theory-test/'`. SCSS asset path is absolute `/govuk-assets/`. | Keep base; make asset path relative-safe. |
| Data | localStorage `theory-test-ready:v1`. | Add fields with defaults via `normalise()` – existing progress kept. |

## Out of scope / needs external content
- Official DVSA hazard perception and case-study video clips are licensed (Safe Driving for Life). Not embedded; simulations are labelled.
- The AA book was never supplied – no book references.

## Status (15 November 2026)
All actions above are implemented. Verification: 22 unit tests (vitest) and 88 browser checks (Playwright, desktop + mobile, no console errors) pass; `npm run build` succeeds with the GitHub Pages base path.
