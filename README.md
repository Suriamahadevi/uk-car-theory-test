# Theory Test Ready

Independent UK car theory test revision platform – React 19, TypeScript, Vite, SCSS. Not affiliated with the DVSA or the UK Government.

Live: https://suriamahadevi.github.io/uk-car-theory-test/ (GitHub Pages, deployed by `.github/workflows/main.yml` on push to `main`).

## Run

```bash
npm install
npm run dev        # http://localhost:5173/uk-car-theory-test/
npm run build      # type-check + production build into dist/
```

## Tests

| Command | What it checks |
| --- | --- |
| `npm test` | 32 unit tests: question bank integrity, official figures (rules 124/126), duplicates, mock format, Mistake Book/spaced repetition, data migration, hazard scoring, video manifest validation |
| `npm run test:e2e` | 99 browser checks (start `npx vite preview --port 4173` first): every page and button flow, mock exam, feedback, persistence, real-video playback with a generated test clip, mobile layout, console errors |
| `npm run test:visual` | 26 UI regression screenshots (desktop + mobile) and flat-exam checks. Use `-- --update-snapshots` after an intended design change |

## Key folders

| Path | Purpose |
| --- | --- |
| `src/styles/_tokens.scss` | Design tokens (palette, type, spacing, elevation, exam-mode overrides) |
| `src/styles/_components.scss`, `_layout.scss`, `_app.scss`, `_exam.scss` | Shared design system |
| `src/data/questions`, `src/engine/generator.ts` | Written and rule-generated questions |
| `src/data/hazardVideos.ts`, `public/hazard-videos/` | Real-video hazard library (manifest + licensing rules; currently pending licensed content) |
| `src/services/contracts.ts` | Interfaces for the planned backend (not implemented) |
| `docs/` | Upgrade checklist, content audit, commercial architecture plan |
