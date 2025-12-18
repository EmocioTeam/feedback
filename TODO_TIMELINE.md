# Emocio TODO Timeline (Plan and Act Log)

Purpose
- Track planned and executed tasks with clear ownership, rationale, acceptance criteria, and outcomes.
- Each completed task must be reflected in CHANGELOG.md with files touched and revert instructions.
- Cross-link to commits/PRs and ERROR_LOG.md entries where applicable.

Conventions
- Task IDs: T-XXX (e.g., T-001)
- Status: Planned | In Progress | Blocked | Done
- Dates: ISO (YYYY-MM-DD)
- Fields per task: Description, Why, Steps, Acceptance Criteria, Risks, Dependencies, Owner, Outcome, Links

Live Checklist
- [x] Decide path: Stabilize-first
- [ ] T-001 Create migration branch feat/stabilize-phase-0
- [ ] T-002 Remove grpc and regenerate lockfile
- [ ] T-003 Add env fallbacks (config.js, EmotionMap.js), keep behavior; warn and document rotation
- [ ] T-004 Clean install and run locally; document Node/npm approach; Windows caveats
- [ ] T-005 Smoke tests: /add-feed, /feed-page (Wall/Map), /analytics; document outcomes
- [ ] T-006 Add STABILIZATION_README.md; keep status, risks, and revert instructions updated
- [ ] T-007 Add CHANGELOG.md; create entries per task with files touched and rationale
- [ ] T-008 Plan modernization tracks (Router v6, Firebase modular, Map swap, Tooling, Lib replacements) and schedule
- [ ] T-009 Execute Track A (Router v6)
- [ ] T-010 Execute Track B (Firebase modular v10)
- [ ] T-011 Execute Track C (Maps stack refresh)
- [ ] T-012 Execute Track D (Tooling: CRA5 or Vite; React 18)
- [ ] T-013 Execute Track E (Library cleanups and replacements)

Tasks

T-001 Create migration branch feat/stabilize-phase-0
- ID: T-001
- Status: Planned
- Owner: Cline
- Start: YYYY-MM-DD
- Target: YYYY-MM-DD
- Description:
  - Create an isolated branch for Phase 0 stabilization work to avoid blocking main.
- Why:
  - Enables controlled, revertible changes and safe iteration.
- Steps:
  - git checkout -b feat/stabilize-phase-0
  - If branch exists: git checkout feat/stabilize-phase-0
- Acceptance Criteria:
  - Branch created/existing, set as current working branch.
- Risks:
  - None.
- Dependencies:
  - None.
- Outcome:
  - To be filled after execution.
- Links:
  - Commit(s): …
  - CHANGELOG: …

T-002 Remove grpc and regenerate lockfile
- ID: T-002
- Status: Planned
- Owner: Cline
- Start: YYYY-MM-DD
- Target: YYYY-MM-DD
- Description:
  - Remove “grpc” native module from package.json (unused by this client); run npm install to refresh lockfile.
- Why:
  - Avoid native build failures on Windows and reduce install friction.
- Steps:
  - npm uninstall grpc
  - rmdir /s /q node_modules (Windows) or rm -rf node_modules
  - del /f /q package-lock.json (Windows) or rm package-lock.json
  - npm cache clean --force
  - npm install
- Acceptance Criteria:
  - Install completes with no grpc/node-pre-gyp errors.
  - App compiles with no missing imports referencing grpc.
- Risks:
  - Hidden references to grpc (unlikely); build would flag them.
- Dependencies:
  - T-001
- Outcome:
  - To be filled after execution.
- Links:
  - Commits: …
  - CHANGELOG: …
  - ERROR_LOG: E-20251218-01 (npm install failure context)

T-003 Add env fallbacks in config.js and EmotionMap.js
- ID: T-003
- Status: Planned
- Owner: Cline
- Start: YYYY-MM-DD
- Target: YYYY-MM-DD
- Description:
  - Read Firebase/Mapbox configuration from process.env; keep temporary fallback to current constants with inline security notes.
- Why:
  - Security hygiene and developer convenience; non-breaking during stabilization.
- Steps:
  - src/config.js: prefer process.env for config; fallback to existing values.
  - src/components/EmotionMap.js: pass mapbox token from process.env with fallback.
  - Add inline comments and TODO for rotation/removal of fallbacks in Phase 2.
- Acceptance Criteria:
  - App runs using .env.local when present; no behavior change otherwise.
- Risks:
  - None if fallbacks are correct.
- Dependencies:
  - T-002
- Outcome:
  - To be filled after execution.
- Links:
  - Commits: …
  - CHANGELOG: …

T-004 Clean install and run locally
- ID: T-004
- Status: Planned
- Owner: Cline
- Start: YYYY-MM-DD
- Target: YYYY-MM-DD
- Description:
  - Perform a clean install and run the app under recommended Node/npm; document Windows caveats.
- Why:
  - Validate stabilization and provide reproducible steps.
- Steps:
  - Node 14.15.4 + npm 6.14.10 (preferred) or legacy-peer-deps on modern Node.
  - Clean install commands (see STABILIZATION_README.md).
  - npm start and verify on http://localhost:3000
- Acceptance Criteria:
  - App starts with no runtime errors; core pages render.
- Risks:
  - OneDrive locks; peer dependency mismatch.
- Dependencies:
  - T-002, T-003
- Outcome:
  - To be filled after execution.
- Links:
  - STABILIZATION_README.md results

T-005 Smoke tests and documentation
- ID: T-005
- Status: Planned
- Owner: Cline
- Start: YYYY-MM-DD
- Target: YYYY-MM-DD
- Description:
  - Manual smoke testing of primary flows; record expected vs. actual and issues found.
- Why:
  - Establish baseline behavior to detect regressions during later modernization.
- Steps:
  - /add-feed flow, /feed-page (Wall/Map), /analytics metrics.
  - Add findings to STABILIZATION_README.md.
- Acceptance Criteria:
  - All routes render; core interactions work; issues documented.
- Risks:
  - Misconfigured Firebase/Mapbox might block flows; document and resolve.
- Dependencies:
  - T-004
- Outcome:
  - To be filled after execution.
- Links:
  - STABILIZATION_README.md section: …
  - CHANGELOG: N/A

T-006 Maintain STABILIZATION_README.md
- ID: T-006
- Status: Planned
- Owner: Cline
- Description:
  - Keep the stabilization log up to date with status, risks, and revert steps.
- Acceptance Criteria:
  - File updated at each task state change.

T-007 Maintain CHANGELOG.md
- ID: T-007
- Status: Planned
- Owner: Cline
- Description:
  - Add one entry per completed task, including files touched and rationale, with revert instructions.
- Acceptance Criteria:
  - Each change is reflected with date and exact revert steps.

T-008–T-013 Modernization Tracks (placeholders)
- Will be detailed after Phase 0 completion:
  - T-009 Router v6
  - T-010 Firebase modular v10
  - T-011 Maps stack refresh
  - T-012 Tooling (CRA5 or Vite; React 18)
  - T-013 Library cleanups/replacements

Links
- README.md — Consolidated plan overview
- STABILIZATION_README.md — Phase 0 scope and live status
- CHANGELOG.md — Per-change record with revert steps
- ERROR_LOG.md — Error knowledge base (IDs, logs, root cause, fix)
