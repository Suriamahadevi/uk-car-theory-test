# Commercial architecture plan

Status key: **Completed** (live in this repository) · **In progress** (started, blocked or partial) · **Planned** (designed, not built).
The live app is entirely client-side (static site on GitHub Pages). **No backend, accounts, payments or admin system exist yet.** The same status list is shown to users on the About page (`src/data/productStatus.ts`).

## 1. Current state (Completed)
- React 19 + TypeScript + Vite static build; HashRouter for GitHub Pages; service worker for offline use.
- Persistence: `LocalStorageRepository` behind the `Repository` interface (`src/store/repository.ts`); schema migration in `normalise()`; export/import JSON.
- Content as code: questions (`src/data/questions`), rule-based generator (`src/engine/generator.ts`), audit tests (`src/engine/bank.test.ts`).
- Hazard video engine with a validated manifest (`public/hazard-videos/manifest.json`, `src/data/hazardVideos.ts`).
- Local, read-only content review page (`#/content-review`).

## 2. In progress
- **Licensed hazard perception footage** – pipeline complete; needs a licensed footage supplier (e.g. commissioned dash-cam filming with signed releases, or a licence from a training-content provider). Each clip needs timings verified by two reviewers.
- **Video case studies** in the mock exam – `CaseStudy.videoId` links a licensed clip; simulations are used until then.

## 3. Planned architecture
```
Browser (this React app)
   │  HTTPS, JWT access token (short-lived) + refresh token (httpOnly cookie)
   ▼
API (Node/TypeScript, e.g. Fastify) ──► PostgreSQL (users, progress, content, billing)
   │                                 └► Object storage + CDN (video, posters) with signed URLs
   ├─► Identity provider (hosted auth: email/password, magic link, MFA for admins)
   ├─► Payment provider (checkout + webhooks → entitlements table)
   └─► Observability (error monitoring, structured logs, uptime checks, privacy-friendly analytics)
```
Service contracts are already defined in `src/services/contracts.ts` (`AuthService`, `SyncService`, `ContentService`, `BillingService`). A `RemoteRepository` would implement the existing `Repository` interface so no UI rewrite is needed.

### User management (Planned)
Registration, sign-in, password recovery (time-limited single-use tokens), profiles, account deletion and data export (UK GDPR). Progress sync: server copy of `AppData`, version number per user, merge on login (attempts are append-only, so merging is a union).

### Admin dashboard (Planned)
Role-based access (admin, editor, reviewer). Modules: users, questions (draft → in review → verified → published → retired, second-reviewer rule), videos (upload, hazard timing editor, licence record), topics, performance reports, audit log.

### Payments (Planned)
Plans: free tier (limited questions) and paid access periods. Provider-hosted checkout; webhooks update an `entitlements` table; access checked server-side; renewal reminders; invoices from the provider. No pass guarantees in marketing.

### Infrastructure and security (Planned)
Managed PostgreSQL with daily backups and point-in-time recovery; secrets in a vault; OWASP ASVS L2 controls (input validation, rate limiting, CSRF protection for cookie flows, CSP); dependency scanning in CI; error monitoring; performance budgets (code-split routes, CDN video). ICO registration and a privacy notice before collecting personal data.

## 4. Suggested delivery order
1. Licensed video content (highest learner value).
2. Accounts + sync (unlocks multi-device use).
3. Admin content workflow (scales content safely).
4. Payments and entitlements.
5. Reporting for driving instructors.
