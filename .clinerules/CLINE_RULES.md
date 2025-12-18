# Cline Rules — Emocio Project

Purpose and Scope
- Enforce consistent, auditable execution by Cline for this repository.
- Complement global .clinerules; encode project-specific constraints, documentation duties, and revert hygiene.
- Apply across stabilization and modernization phases.

Operating Constraints
- Start in Plan Mode with a concrete plan; implement only after approval.
- One tool use per step; wait for confirmation after each tool use.
- Prefer minimal, reversible changes; small commits with clear messages.
- Never expose secrets; sanitize PII/GDPR data. Use env variables for keys.
- Respect Windows/OneDrive caveats (file locks, long paths).

Task Lifecycle (must follow)
1) Analyze: read EMOCIO_CONTEXT.md, README.md, related files for full context.
2) Plan: list steps, acceptance criteria, and revert path for each change.
3) Implement: smallest viable change to meet acceptance criteria.
4) Validate: run or simulate; capture outputs/screenshots/logs.
5) Document: update README (if user-facing change), STABILIZATION_README.md, TODO_TIMELINE.md, CHANGELOG.md, ERROR_LOG.md as applicable.
6) Commit: descriptive message, rationale, explicit files touched, and “Run-this-to-revert” commands.
7) Revert-ready: each commit must be safely revertible without side effects.

Documentation Obligations (per change)
- README.md: update when setup, plan, or user-visible behavior changes.
- STABILIZATION_README.md: live status for Phase 0 (scope, risks, ACC, outcomes, revert).
- TODO_TIMELINE.md: add/update tasks (ID, Description, Why, Steps, ACC, Risks, Deps, Owner, Outcome, Links).
- CHANGELOG.md: per-change entry with date, commit SHA, files touched, rationale, and revert steps.
- ERROR_LOG.md: record errors with environment, logs, root cause, resolution, and status; link tasks/commits.
- Project Brain (Cline memory): summarize new structural insights, decisions, and recurring fixes.

Coding Standards
- Follow SOLID for classes. Document each function: input → transformation → output.
- Add inline comments where assumptions are made.
- Optimize hot paths when tests exceed 100ms.
- Use environment variables for Firebase/Mapbox. Never commit real secrets.

Git Discipline
- Branching: feature branches per task (e.g., feat/stabilize-phase-0, chore/remove-grpc, refactor/firebase-modular).
- Commits: one logical change per commit; present-tense imperative subject; second paragraph for rationale and revert.
- PRs: one modernization track per PR; include API diffs and doc updates.

Security and Sanitization
- Sanitize logs (mask usernames, tokens, emails). Use placeholders like <USER>, <TOKEN>.
- If a secret is exposed, rotate immediately and document in CHANGELOG with a security note.
- Keep .env.local out of VCS; provide .env.local.example only.

Acceptance Criteria Templates
- Install succeeds on Windows 11 with Node 14.15.4/npm 6.14.10; npm start runs at http://localhost:3000; core routes render without runtime errors (AddFeedback, FeedPage Wall/Map, Analytics).

Revert Template (include in each commit)
- Revert: git revert <SHA>
- Or restore files: git restore <file1> <file2>
- Re-install deps if package files changed: npm install

Phase Awareness
- Phase 0 (Stabilize-first): limit changes to removing native blockers (e.g., grpc), env fallbacks, install/run validation, and documentation/logging.
- Later phases: Router v6, Firebase modular, Map stack, Tooling (CRA5/Vite), library cleanups — each in separate PRs with guardrails.
