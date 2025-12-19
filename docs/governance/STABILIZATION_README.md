# Emocio Stabilization Plan (Phase 0)

Purpose
- Stabilize the legacy app to run locally with the smallest possible code/dependency changes.
- Avoid feature refactors; focus on making install and runtime reliable on Windows 11.
- Document every step, outcome, and revert commands. Keep logs up to date.

Scope (Phase 0 only)
- Remove native dependency blockers (e.g., grpc).
- Provide environment variable fallbacks (Firebase/Mapbox). Do not commit secrets.
- Ensure npm install and npm start succeed.
- Document smoke test outcomes and governance updates.

Environment Baseline
- OS: Windows 11
- Node: 25.1.0 (modern toolchain; OpenSSL legacy provider set in scripts for CRA5/webpack)
- npm: 11.6.2
- Shell: cmd.exe
- Repo path: C:\farolabs\emocio-legacy (moved from OneDrive to avoid file locks)
- VS Code Workspace: open folder “C:\farolabs\emocio-legacy” or “emocio-legacy.code-workspace” (path “.”). Avoid opening prior Desktop/OneDrive workspace windows.

Quickstart Commands (preferred)
```bat
npm install
npm start
```

Alternative (legacy Node if needed)
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

OneDrive/Workspace Mitigation
- Pause OneDrive sync during install or move repo to non-synced path (C:\farolabs\emocio-legacy).
- Open the correct workspace: File → Open Folder → C:\farolabs\emocio-legacy
- If using .code-workspace, open emocio-legacy.code-workspace (path “.”).
- Add VSCode excludes in .vscode/settings.json to avoid scanning old Desktop/OneDrive paths.

Road so far (2025-12-19)
- Firebase modular migration and new project switch; env-based configuration via src/config.js.
- Redux async fixes: Convert async actions (addFeedback, addReaction, addComment, deleteFeedback) to thunks; App.js consumes returned payloads.
- Runtime fixes:
  - Radar reducer: guard reduce on empty arrays; initialize defaults.
  - FeedCard: guard null Firestore timestamps; derive milliseconds safely.
- Image uploads:
  - Base64 fallback implemented (REACT_APP_PICTURE_MODE=base64) for environments without Firebase Storage/CORS. AddFeedback now consumes URL returned by uploadImg.
  - Correct storage bucket normalized and bound (gs://emocio-legacy.appspot.com) when Storage is enabled.
- Governance:
  - .clinerules updated — no-branch commit gating; commit subject schema with [track:], Docs-Checklist; ask-to-merge Approval Record policy.
  - Backlog runbook added (commit governance and approval) with Cline/manual prompts.
- Error knowledge base:
  - ERROR_LOG.md backfilled with E-20251219-01..08 (Redux errors, Radar, Timestamp, Dev server HOST/port, CRA advisories, OpenSSL/OneDrive).
  - Workspace ENOENT to be logged as E-20251219-09 (see Known Issues).

Phase 0 Checklist (live)
- [ ] T-Docs-Stabilization: Regenerate stabilization log and Road so far
- [ ] T-Docs-Timeline: Overhaul TODO_TIMELINE with Done/Obsolete/Replaced; add new tasks
- [ ] T-Workspace-Relocation-Fix: VS Code ENOENT mitigation; add .vscode/settings.json excludes
- [ ] T-Mapbox-Guard: Read REACT_APP_MAPBOX_TOKEN and warn if missing; doc setup in README/.env.local.example
- [ ] T-Docs-Reorg: Move governance docs to docs/; update master README links
- [ ] T-Personas-Verify: Validate stakeholder highlighting and users/{uid} creation
- [ ] T-Storage-CORS (Backlog): If Storage enabled later, apply CORS and switch mode to “storage”

Acceptance Criteria (Phase 0)
- npm install completes without native build failures.
- npm start runs on http://localhost:3000 or http://localhost:3001 without runtime errors on core pages:
  - /add-feed (mood selection, comment, hashtags; image upload via base64; geolocation optional)
  - /feed-page (Wall real-time updates; Map markers and card popup; hashtag filtering)
  - /analytics (totals, top emotion/hashtag, radar chart)
- README and governance documentation updated; error KB contains resolved errors with prevention notes.

Risks and Assumptions
- Firebase Storage not available in current plan: use base64 fallback; enable Storage + set CORS later if needed.
- Mapbox token missing: guard gracefully with a visual warning and doc setup instructions.
- VS Code workspace ENOENT: stale references to Desktop/OneDrive. Mitigate with correct workspace and excludes.

Known Issues and Resolutions
- VS Code Workspace ENOENT:
  - Symptom: “Cannot access workspace directory… access 'C:\Users\<USER>\Desktop'”
  - Resolution: open C:\farolabs\emocio-legacy as workspace; add .vscode/settings.json excludes; close old windows.
  - Prevention: always open the correct folder or .code-workspace; avoid OneDrive/long path issues.

Revert Instructions (Global)
- Revert last commit:
```bat
git revert <commit-sha>
```
- Restore specific files:
```bat
git restore <file1> <file2>
```
- For dependency changes:
```bat
npm ci
```

Status Log (append newest on top)
- 2025-12-19 21:20 — Stabilization plan regenerated; Road so far documented; workspace relocation noted; base64 upload fallback retained. Owner: Cline. Status: Running.
- 2025-12-19 16:41 — Modernization pivot: Firebase modular upgrade, new project env applied; dev server compiled successfully on http://localhost:3001. Vulnerability mitigations (overrides, svgo disabled) applied. Owner: Cline. Status: Running.
- YYYY-MM-DD HH:MM — Initialized Phase 0 stabilization plan (this file). Owner: Cline. Status: Planned.

Cross-References
- docs/governance/TODO_TIMELINE.md — task-level detail with acceptance criteria and outcomes
- docs/governance/CHANGELOG.md — per-change record (date, files touched, rationale, revert)
- docs/governance/ERROR_LOG.md — error knowledge base (ID, env, logs, root cause, fix)
- docs/runbooks/commit-governance-and-approval.md — commit naming/approval runbook
- README.md — consolidated plan overview and setup guidance
