# Emocio Stabilization Plan (Phase 0)

Purpose
- Stabilize the legacy app to run locally with the smallest possible code/dependency changes.
- Avoid feature refactors; focus on making install and runtime reliable on Windows 11.
- Document every step, outcome, and revert commands. Keep logs up to date.

Scope (Phase 0 only)
- Remove native dependency blockers (e.g., grpc).
- Provide environment variable fallbacks for Firebase and Mapbox (no hard-coded secrets in future phases).
- Ensure npm install and npm start succeed.
- Document smoke test outcomes.

Environment Baseline
- OS: Windows 11
- Node: 14.15.4 (preferred for CRA 3.4.x) or temporarily modern Node with legacy peer deps enabled
- npm: 6.14.10 (preferred for legacy peer dependency behavior)
- Shell: cmd.exe
- Repo path: avoid active OneDrive sync to reduce file locks (or temporarily pause sync during install)

Quickstart Commands (preferred)
```bat
nvm install 14.15.4
nvm use 14.15.4
npm i -g npm@6.14.10
rmdir /s /q node_modules
del /f /q package-lock.json
npm cache clean --force
npm uninstall grpc
npm install
npm start
```

Alternative (if you must use modern Node)
```bat
npm config set legacy-peer-deps true
npm uninstall grpc
npm install
npm start
```

OneDrive Mitigation
- Option A: Pause OneDrive sync during install.
- Option B: Clone/move repo to a non-synced path (e.g., C:\dev\emocio-legacy).

Phase 0 Checklist (live)
- [ ] T-001 Create migration branch feat/stabilize-phase-0
- [ ] T-002 Remove grpc and regenerate lockfile
- [ ] T-003 Add env fallbacks (src/config.js, src/components/EmotionMap.js), keep behavior
- [ ] T-004 Clean install and run locally; document Node/npm approach; Windows caveats
- [ ] T-005 Smoke tests: /add-feed, /feed-page (Wall/Map), /analytics; document outcomes
- [ ] T-006 Keep this file updated (status, risks, revert)
- [ ] T-007 Maintain CHANGELOG.md entries per task

Acceptance Criteria (Phase 0)
- npm install completes without native build failures.
- npm start runs on http://localhost:3000 without console runtime errors on core pages:
  - /add-feed (mood selection, comment, hashtags; image upload if authenticated; geolocation optional)
  - /feed-page (Wall real-time updates; Map markers and card popup; hashtag filtering)
  - /analytics (totals, top emotion/hashtag, radar chart)
- README and documentation updated with stabilization plan and commands.
- Errors encountered are logged in ERROR_LOG.md with analysis and resolution.

Risks and Assumptions
- grpc is not needed for a browser-only app; removal should not impact runtime.
- Existing hard-coded Firebase and Mapbox tokens exist; we will add env fallbacks for stabilization and rotate/remove hard-coded values in future phases.
- OneDrive may lock files; mitigate by pausing or relocating the repo.

Revert Instructions (Global)
- Revert last commit:
```bat
git revert <commit-sha>
```
- Restore files:
```bat
git restore <file1> <file2>
```
- For dependency changes (after revert), re-run install:
```bat
npm install
```

Status Log (append newest on top)
- YYYY-MM-DD HH:MM — Initialized Phase 0 stabilization plan (this file). Owner: Cline. Status: Planned.

Cross-References
- TODO_TIMELINE.md — task-level detail with acceptance criteria and outcomes
- CHANGELOG.md — per-change record (date, files touched, rationale, revert)
- ERROR_LOG.md — error knowledge base (ID, env, logs, root cause, fix)
- README.md — contains the consolidated plan overview
