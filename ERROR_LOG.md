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
