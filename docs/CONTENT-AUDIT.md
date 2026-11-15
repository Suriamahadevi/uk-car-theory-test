# Content audit – question bank

Date: 15 November 2026. Scope: all 496 questions (297 written incl. 12 case-study, 199 generated).

## Method
1. **Automated checks** (`src/engine/bank.test.ts`) run on every build:
   - unique IDs; no duplicate question (text + image + options);
   - every question has a source reference, explanation, rule and a note for every option;
   - answer keys within range; "mark two" questions say how many to mark;
   - every topic has easy, medium and hard questions;
   - stopping distances equal Highway Code rule 126 and thinking + braking = total;
   - speed limits equal Highway Code rule 124 for cars and towing;
   - questions flagged for verification never appear in mock tests.
2. **Manual review** of written questions against the Highway Code (GOV.UK), Know Your Traffic Signs, GOV.UK guidance and, for first aid, Highway Code Annex 7 (updated 22 October 2025), DVSA's CPR/AED announcement (13 August 2025) and Resuscitation Council UK.

## Changes made
| Item | Problem | Fix |
| --- | --- | --- |
| IN-03 + notes | Burns cooling time said 10 minutes; Annex 7 now says at least 20 minutes and cling film | Updated (previous upgrade) |
| DR ABC wording | "C" described as compressions | Now "Circulation", as in Annex 7 |
| GEN-SPEED-*-built-up-0 | Called the 30 mph built-up limit a "national speed limit" (that term means 60/70 mph) | Reworded to "speed limit" |
| Sign "Two-way traffic straight ahead" | Arrow layout could not be verified against Know Your Traffic Signs | Removed from the sign library and its 3 generated questions |
| Mock exam case studies | Real test has a short video with 3 questions | Added 3-question case study; simulated until licensed video is supplied |

## Flagged for verification
| ID | Reason |
| --- | --- |
| DC-14 | Drink-drive limit (England and Wales) – a 2026 government consultation proposed lowering it. Shown with a warning; excluded from mock tests. |

## Known limitations
- Road-sign drawings are simplified illustrations for learning, not official artwork.
- No AA book content was supplied, so no question cites the book.
- Generated questions are rule-based practice items, not DVSA questions.
