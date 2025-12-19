# Emocio Error Knowledge Base (ERROR_LOG)

Purpose
- Capture all errors encountered during stabilization and modernization with full technical context.
- Serve as a searchable knowledge base to prevent regressions and accelerate troubleshooting.
- Cross-link to TODO_TIMELINE.md tasks, CHANGELOG.md entries, and commits/PRs.

Conventions
- Error ID: E-YYYYMMDD-XX
- Status: Open | Resolved | Regression
- Always sanitize personal data (paths, usernames, tokens). Use placeholders like <USER>, <TOKEN>.

Error Entry Template
- ID:
- Timestamp (UTC):
- Environment:
  - OS:
  - Node:
  - npm:
  - Shell:
  - Repo path:
- Action/Command:
- Error Summary:
- Log Excerpts (sanitized):
- Analysis (Root Cause):
- Resolution (steps/commands):
- Status:
- Links:
  - Tasks (TODO_TIMELINE): T-XXX
  - CHANGELOG entry:
  - Commits/PRs:
- Revert (if applicable):

```md
ID: E-YYYYMMDD-XX
Timestamp (UTC): 2025-12-18T00:00:00Z
Environment:
  - OS: Windows 11
  - Node: 14.15.4
  - npm: 6.14.10
  - Shell: cmd.exe
  - Repo path: C:\Users\<USER>\OneDrive - <ORG>\Documents\FaroLabs\emocio-legacy
Action/Command:
  - <command that produced the error>
Error Summary:
  - <1-2 line summary>
Log Excerpts (sanitized):
  - <relevant, sanitized lines>
Analysis (Root Cause):
  - <root cause analysis>
Resolution (steps/commands):
  1) <step one>
  2) <step two>
Status: Open
Links:
  - Tasks (TODO_TIMELINE): T-XXX
  - CHANGELOG entry: <link or description>
  - Commits/PRs: <SHA or PR #>
Revert (if applicable):
  - <revert commands if a change was made>
```

Entries

ID: E-20251218-01
Timestamp (UTC): 2025-12-18T12:24:23Z
Environment:
  - OS: Windows 11
  - Node: unknown at time of failure (likely != 14.15.4)
  - npm: unknown at time of failure
  - Shell: cmd.exe
  - Repo path: C:\Users\<USER>\OneDrive - <ORG>\Documents\FaroLabs\emocio-legacy
Action/Command:
  - npm install
Error Summary:
  - npm install failed; referenced debug log: C:\Users\<USER>\AppData\Local\npm-cache\_logs\2025-12-18T12_24_23_704Z-debug-0.log
  - Symptoms consistent with native module failure (grpc@1.24.x via node-pre-gyp/node-gyp) and/or peer-dependency resolution on npm 7+
Log Excerpts (sanitized):
  - See referenced npm debug log (sanitized path above)
Analysis (Root Cause):
  - Legacy dependency “grpc” requires native builds and commonly fails on Windows.
  - Project engines pin Node 14.15.4 / npm 6.14.10; mismatched Node/npm can trigger ERESOLVE or OpenSSL issues.
Resolution (steps/commands):
  1) Remove grpc: npm uninstall grpc
  2) Align toolchain (preferred):
     - nvm install 14.15.4
     - nvm use 14.15.4
     - npm i -g npm@6.14.10
  3) Clean install:
     - rmdir /s /q node_modules
     - del /f /q package-lock.json
     - npm cache clean --force
     - npm install
  4) If using modern Node temporarily:
     - npm config set legacy-peer-deps true
     - npm install
Status: Resolved (pending execution confirmation during Phase 0)
Links:
  - Tasks: T-002, T-004
  - CHANGELOG: to be added post-commit
  - Commits/PRs: TBD
Revert:
  - Reinstall grpc (not recommended): npm install grpc@1.24.4

ID: E-20251218-02
Timestamp (UTC): 2025-12-18T14:37:16Z
Environment:
  - OS: Windows 11
  - Node: N/A
  - npm: N/A
  - Shell: git via cmd.exe
  - Repo path: C:\Users\<USER>\OneDrive - <ORG>\Documents\FaroLabs\emocio-legacy
Action/Command:
  - git checkout -b feat/stabilize-phase-0
Error Summary:
  - fatal: a branch named 'feat/stabilize-phase-0' already exists
Analysis (Root Cause):
  - Branch creation attempted when branch already existed.
Resolution (steps/commands):
  - git checkout feat/stabilize-phase-0
Status: Resolved
Links:
  - Tasks: T-001
  - CHANGELOG: N/A
  - Commits/PRs: N/A
Revert:
  - To delete the branch (if needed): git branch -D feat/stabilize-phase-0 (only if safe)

ID: E-20251219-01
Timestamp (UTC): 2025-12-19T16:35:00Z
Environment:
  - OS: Windows 11
  - Node: 25.1.0
  - npm: 11.6.2
  - Shell: cmd.exe
  - Repo path: C:\farolabs\emocio-legacy
Action/Command:
  - Create feedback (AddFeedback → App.addFeedback → addFeedbackAction)
Error Summary:
  - Redux: Actions must be plain objects. Actual type was: 'Promise'.
Log Excerpts (sanitized):
  - ERROR: Actions must be plain objects. Instead, the actual type was: 'Promise'... at boundActionCreators.addFeedbackAction ... at App.addFeedback ...
Analysis (Root Cause):
  - addFeedback action creator returned a Promise instead of a thunk function; connect shorthand dispatched a non-plain object.
Resolution (steps/commands):
  1) Refactor addFeedback to return async (dispatch) => Promise<{id}> and dispatch success action.
  2) Adjust App.js to use res.id (returned payload) instead of array index.
Status: Resolved
Links:
  - Tasks: T-Redux-Thunk-Fix
  - CHANGELOG: 2025-12-19 chore(firebase): modular SDK, thunks
  - Commits/PRs: pending SHA
Revert (if applicable):
  - git restore src/actions/firebaseActions.js src/App.js
Prevention:
  - Enforce thunk shape for all async actions; components await returned payloads.

ID: E-20251219-02
Timestamp (UTC): 2025-12-19T16:36:00Z
Environment:
  - OS: Windows 11
  - Node: 25.1.0
  - npm: 11.6.2
  - Shell: cmd.exe
  - Repo path: C:\farolabs\emocio-legacy
Action/Command:
  - React to feedback (addReactionAction)
Error Summary:
  - Redux: Actions must be plain objects. Actual type was: 'undefined'.
Log Excerpts (sanitized):
  - ERROR: Actions must be plain objects... at boundActionCreators.addReactionAction ...
Analysis (Root Cause):
  - addReaction returned undefined instead of a thunk/Promise.
Resolution (steps/commands):
  1) Refactor addReaction to return (dispatch) => updateDoc(...).then(() => dispatch({type:'reactionAdded',...}); return true).
Status: Resolved
Links:
  - Tasks: T-Redux-Thunk-Fix
  - CHANGELOG: 2025-12-19 chore(firebase): modular SDK, thunks
Revert:
  - git restore src/actions/firebaseActions.js
Prevention:
  - All async actions must be thunks; return Promises and dispatch explicit success actions.

ID: E-20251219-03
Timestamp (UTC): 2025-12-19T11:28:00Z
Environment:
  - OS: Windows 11
  - Node: 25.1.0
  - npm: 11.6.2
  - Shell: cmd.exe
  - Repo path: C:\farolabs\emocio-legacy
Action/Command:
  - App load → radar chart reducer
Error Summary:
  - “Reduce of empty array with no initial value”
Analysis (Root Cause):
  - getTopEmotion used reduce on empty keys without guard.
Resolution (steps/commands):
  1) Guard keys.length===0 and return "-" default.
  2) Use keys.reduce(...) on non-empty arrays.
Status: Resolved
Links:
  - Tasks: T-Radar-Fix
  - CHANGELOG: 2025-12-19 entry for radar reducer fix
Prevention:
  - Always guard reduce() with empty inputs; set domain defaults.

ID: E-20251219-04
Timestamp (UTC): 2025-12-19T11:35:00Z
Environment:
  - OS: Windows 11
  - Node: 25.1.0
  - npm: 11.6.2
  - Shell: cmd.exe
  - Repo path: C:\farolabs\emocio-legacy
Action/Command:
  - Render FeedCard
Error Summary:
  - “Cannot read properties of null (reading 'seconds')”
Analysis (Root Cause):
  - Firestore timestamp not yet resolved or field absent; direct access to timestamp.seconds.
Resolution (steps/commands):
  1) Derive tsMs safely from number or Firestore Timestamp; guard nulls.
  2) Render empty string when missing; no crash.
Status: Resolved
Links:
  - Tasks: T-FeedCard-Timestamp
  - CHANGELOG: 2025-12-19 entry
Prevention:
  - Guard all timestamp renderers; use serverTimestamp() on writes; tolerate nulls on first-render.

ID: E-20251219-05
Timestamp (UTC): 2025-12-19T14:24:00Z
Environment:
  - OS: Windows 11
  - Node: 25.1.0
  - npm: 11.6.2
  - Shell: cmd.exe
  - Repo path: C:\farolabs\emocio-legacy
Action/Command:
  - Analytics filter → radar reducer
Error Summary:
  - “state.defaultSeries is not iterable”
Analysis (Root Cause):
  - defaultSeries not initialized and used in spread [...state.defaultSeries].
Resolution (steps/commands):
  1) Initialize default fields in initialState (defaultSeries and associated totals) and guard fallbacks.
Status: Resolved
Links:
  - Tasks: T-Radar-Fix
  - CHANGELOG: 2025-12-19 entry
Prevention:
  - Initialize state defaults for all optional collections; prefer safe spreads.

ID: E-20251219-06
Timestamp (UTC): 2025-12-19T16:38:00Z
Environment:
  - OS: Windows 11
  - Node: 25.1.0
  - npm: 11.6.2
  - Shell: cmd.exe
  - Repo path: C:\farolabs\emocio-legacy
Action/Command:
  - npm start (CRA dev server)
Error Summary:
  - ENOTFOUND 127.0.0.1 (HOST binding), port 3000 occupied; page not loading.
Log Excerpts (sanitized):
  - Attempting to bind to HOST environment variable: 127.0.0.1
  - Error: getaddrinfo ENOTFOUND 127.0.0.1
Analysis (Root Cause):
  - HOST env variable caused binding failure (note trailing space in error’s hostname); port 3000 had existing listener.
Resolution (steps/commands):
  1) Clear HOST/PORT or set PORT=3001 and start.
  2) If needed, free port 3000 process and retry.
Status: Resolved (server compiled on http://localhost:3001)
Links:
  - Tasks: T-Dev-Server
  - CHANGELOG: 2025-12-19 entries
Prevention:
  - Avoid forcing HOST; document port fallback; include netstat/kill and PORT override in README.

ID: E-20251219-07
Timestamp (UTC): 2025-12-19T16:30:00Z
Environment:
  - OS: Windows 11
  - Node: 25.1.0
  - npm: 11.6.2
  - Shell: cmd.exe
  - Repo path: C:\farolabs\emocio-legacy
Action/Command:
  - npm audit
Error Summary:
  - Vulnerabilities via CRA chain: nth-check, postcss, webpack-dev-server.
Analysis (Root Cause):
  - Transitive deps in react-scripts chain; audit fix --force would downgrade/break react-scripts.
Resolution (steps/commands):
  1) Add npm overrides (nth-check, css-select, postcss, webpack-dev-server).
  2) Add .svgrrc { "svgo": false } to avoid vulnerable svgo loading path.
  3) Reinstall and re-audit; accept remaining CRA advisories.
Status: Mitigated
Links:
  - Tasks: T-Security-Audit
  - CHANGELOG: 2025-12-19 “chore(security)” entry
Prevention:
  - Prefer conservative overrides for CRA; avoid “--force” audit fixes that break tooling.

ID: E-20251219-08
Timestamp (UTC): 2025-12-19T16:20:00Z
Environment:
  - OS: Windows 11
  - Node: 25.1.0
  - npm: 11.6.2
  - Shell: cmd.exe
  - Repo path: C:\farolabs\emocio-legacy
Action/Command:
  - npm start/build on modern Node
Error Summary:
  - OpenSSL provider errors with CRA5/webpack under Node 17+; OneDrive path locks.
Analysis (Root Cause):
  - Node 17+ requires legacy OpenSSL provider for some older webpack stacks; OneDrive can lock files during install.
Resolution (steps/commands):
  1) Add NODE_OPTIONS=--openssl-legacy-provider to scripts.
  2) Move repo to non-OneDrive path (C:\farolabs\emocio-legacy).
Status: Resolved
Links:
  - Tasks: T-Tooling-Compat
  - CHANGELOG: 2025-12-19 entries
Prevention:
  - Keep NODE_OPTIONS in scripts until CRA/tooling upgraded; avoid OneDrive paths for active node_modules.

ID: E-20251219-09
Timestamp (UTC): 2025-12-19T21:20:00Z
Environment:
  - OS: Windows 11
  - Node: 25.1.0
  - npm: 11.6.2
  - Shell: cmd.exe
  - Repo path: C:\farolabs\emocio-legacy
Action/Command:
  - VS Code opening workspace; running tasks within editor
Error Summary:
  - VS Code cannot access workspace directory. ENOENT: no such file or directory, access 'C:\Users\<USER>\Desktop'
Log Excerpts (sanitized):
  - "Cannot access workspace directory. Please ensure VS Code has permission to access your workspace. Error: ENOENT: no such file or directory, access 'C:\Users\<USER>\Desktop'"
Analysis (Root Cause):
  - Stale workspace references (Desktop/OneDrive) remained in an open VS Code window or extension cache after the repository was relocated to C:\farolabs\emocio-legacy.
Resolution (steps/commands):
  1) Close any VS Code windows referencing Desktop/OneDrive paths.
  2) Open the correct workspace: File → Open Folder → C:\farolabs\emocio-legacy or open emocio-legacy.code-workspace (path ".").
  3) Add .vscode/settings.json excludes to avoid scanning user profile/OneDrive Desktop paths.
  4) Document relocation and mitigation in STABILIZATION_README and TODO_TIMELINE.
Status: Resolved
Links:
  - Tasks (TODO_TIMELINE): T-Workspace-Relocation-Fix
  - CHANGELOG entry: 2025-12-19 (workspace and governance updates)
  - Commits/PRs: .vscode/settings.json addition; STABILIZATION_README/TODO_TIMELINE updates
Prevention:
  - Always open C:\farolabs\emocio-legacy as the workspace (folder or .code-workspace).
  - Avoid using OneDrive-synced folders for active Node projects to reduce file lock and path issues.
  - Maintain .vscode/settings.json excludes for legacy Desktop/OneDrive patterns.

Known Fix Patterns (Prevention Appendix)
- Redux async:
  - All async actions must be thunks; return Promises and optionally dispatch success actions. Components await returned payloads.
- Empty dataset guards:
  - Always guard reduce on empty collections; set domain defaults (e.g., “-”, []).
- Timestamp rendering:
  - Use serverTimestamp() on writes; guard nulls in UI; handle both number and Firestore Timestamp.
- Dev server ports/host:
  - Avoid HOST in env; document PORT fallback (3001).
- CRA advisories:
  - Use npm overrides and disable svgo; avoid “audit fix --force” against react-scripts chain.
