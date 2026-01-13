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
- TASK_COMPLETION_SUMMARIES.md: after each task completion, add a concise summary and explain-changes details with acceptance verification and links (commits, CHANGELOG, TODO_TIMELINE, ERROR_LOG); include revert commands.
- Project Brain (Cline memory): summarize new structural insights, decisions, and recurring fixes.

Documentation Style
- Prefer narrative paragraphs and short subsections over long bullet lists.
- Use bullets only for checklists, discrete enumerations, or command sequences.
- Avoid nested lists beyond one level; use headings or paragraphs instead.
- Keep sentences concise and use active voice; limit headings to 1–3 levels.
- Cross-link governance artifacts (README, STABILIZATION_README, TODO_TIMELINE, CHANGELOG, ERROR_LOG, TASK_COMPLETION_SUMMARIES) for discoverability.

Coding Standards
- Follow SOLID for classes. Document each function: input → transformation → output.
- Add inline comments where assumptions are made.
- Optimize hot paths when tests exceed 100ms.
- Use environment variables for Firebase/Mapbox. Never commit real secrets.

Git Discipline
- No-branch mode (current): keep small, auditable commits on main working line. Use segregated commit naming and descriptions; branches may be enabled later.
- Commit Subject Schema:
  - <type>(<scope>): <summary> [track:<track>] [docs:check] [approval:required]
  - Example: feat(upload): enable base64 fallback [track:upload-fallback] [docs:check]
  - Allowed types: feat | fix | chore | docs | refactor | perf | test
- Commit Body Requirements (every commit):
  - Rationale: why the change was required; assumptions
  - Files touched: explicit list
  - Revert:
    - git revert <SHA>
    - or: git restore <files> && npm ci (if package files changed)
  - Docs-Checklist (must be checked before commit considered “done”):
    - [ ] CHANGELOG.md updated (date, files, rationale, revert)
    - [ ] ERROR_LOG.md updated (sanitized logs, Analysis, Resolution, Prevention note)
    - [ ] TODO_TIMELINE.md updated (AC, outcomes, links)
    - [ ] TASK_COMPLETION_SUMMARIES.md updated (acceptance verification + Next best actions, links)
    - [ ] README/STABILIZATION_README updated if user-facing or environment changed
  - Links: TODO_TIMELINE Task IDs, ERROR_LOG IDs, related CHANGELOG entries
  - Backlog-Refs (when touching backlog/*.md):
    - Include a “Backlog-Refs” subsection in the commit body listing changed backlog paths and related T-IDs
    - Update docs/governance/TODO_TIMELINE.md (Status and links) and backlog/000-roadmap-specs.md (summary/status) if scope/status changed
    - Docs-Checklist must include [x] CHANGELOG and [x] TODO_TIMELINE for backlog changes
  - Approval Record (only for merge/consolidation-like commits):
    - Requested by: Cline
    - Approved by: <USER> at <UTC timestamp>
    - Cline chat reference: <date/time or message anchor>
- Tracks metadata in subject: include [track:<track>] (e.g., firebase-modular-v12, upload-fallback, ui-stability, security, governance, personas, map)
- Ask-to-merge Gate (PR/merge policy):
  - Cline must explicitly ask for approval before merging any PR (or consolidation commit).
  - PR/merge description must include Approval Record and a checked Docs-Checklist.
  - Merges are blocked until user approval is recorded.

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
