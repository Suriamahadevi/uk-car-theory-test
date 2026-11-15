# Theory Test Ready

Independent UK car theory test revision platform (React + TypeScript + Vite, styled with GOV.UK Frontend v6 using Arial – not affiliated with the DVSA or the UK Government).

## Run

- Double-click `Start Theory Test Ready.bat` in the parent folder, or
- `npm install` then `npm run dev` and open http://localhost:5173

`npm run build` creates a static site in `dist/` (relative paths; serve with `npx vite preview`).

## Tests

- `npm test` – question bank integrity, mock generation, Mistake Book mastery, hazard scoring (vitest)
- `npm run e2e` – 61 browser checks on desktop and mobile (start `npx vite preview --port 4173` first)

## Structure

| Path | Purpose |
| --- | --- |
| `src/data/questions/*.ts` | Hand-written questions per topic (official Highway Code / GOV.UK sources) |
| `src/engine/generator.ts` | Rule-based generator: road signs (3 variants each), speed limits (rule 124), stopping distances (rule 126) |
| `src/engine/bank.ts` | Question bank, stats, practice and 50-question mock selection |
| `src/data/signs.tsx` | SVG road-sign library |
| `src/data/hazardClips.ts` | 14 simulated hazard perception clips (15 hazards) |
| `src/store/repository.ts` | Persistence boundary – swap `LocalStorageRepository` for an API/database later |
| `src/pages/*` | Dashboard, topics, practice, mock exam/results, hazard, Mistake Book, revision, history, settings |

## Adding the AA book later

Questions have a `source` field with `kind: 'book'` and `page` support. When book pages are available, add questions with `source: { kind: 'book', ref: 'AA …', page: N }`.
