# Emocio Changelog

Purpose
- Record every change with files touched, rationale, and exact revert instructions.
- Cross-link to TODO_TIMELINE.md tasks and ERROR_LOG.md entries when relevant.

Conventions
- Date: YYYY-MM-DD
- Commit: SHA (fill after commit if not yet known)
- Type(scope): summary
- Files touched: explicit list
- Rationale: why this change was needed
- Revert: exact commands to undo
- Links: Task IDs, Error IDs, PRs

Template
- Date: YYYY-MM-DD
- Commit: <SHA>
- Change: <type>(<scope>): <summary>
- Files touched: <list>
- Rationale: <details>
- Revert:
  - git revert <SHA>
  - or: git restore <file(s)>
- Links: T-XXX, E-YYYYMMDD-XX, PR #N

Entries

- Date: 2025-12-18
- Commit: (to be filled after commit)
- Change: docs(format): restore README governance bullets; add fenced code blocks; keep bullets in TODO timeline
- Files touched: README.md, STABILIZATION_README.md, TODO_TIMELINE.md
- Rationale: Align with Markdown best practices for scannability; improve legibility without changing meaning.
- Revert:
  - git restore README.md STABILIZATION_README.md TODO_TIMELINE.md
  - or: git revert <SHA>
- Links: T-006, T-007

- Date: 2025-12-18
- Commit: (to be filled after commit)
- Change: docs(format): add fenced copy-paste templates and restore cross-reference bullets
- Files touched: ERROR_LOG.md, TASK_COMPLETION_SUMMARIES.md, STABILIZATION_README.md
- Rationale: Provide copy/paste templates and improve scannability while preserving bullet-based structure per style guidance.
- Revert:
  - git restore ERROR_LOG.md TASK_COMPLETION_SUMMARIES.md STABILIZATION_README.md
  - or: git revert <SHA>
- Links: T-006, T-007

- Date: 2025-12-18
- Commit: (to be filled after commit)
- Change: docs(plan): insert “Stabilization and Modernization Plan (2025)” into README
- Files touched: README.md
- Rationale: Consolidate stabilize-first strategy, governance docs, and modernization tracks; make it discoverable for contributors.
- Revert:
  - git restore README.md
  - or: git revert <SHA> (replace with commit sha once known)
- Links: T-… (see TODO_TIMELINE), none

- Date: 2025-12-18
- Commit: (to be filled after commit)
- Change: docs(stabilization): add STABILIZATION_README.md (Phase 0 scope, env, quickstart, checklist)
- Files touched: STABILIZATION_README.md
- Rationale: Live operational log for stabilization work; defines acceptance criteria and risks.
- Revert:
  - git rm STABILIZATION_README.md
  - git commit -m "revert: remove STABILIZATION_README.md"
  - or: git revert <SHA>
- Links: T-006

- Date: 2025-12-18
- Commit: (to be filled after commit)
- Change: docs(tracking): add TODO_TIMELINE.md (tasks T-001..T-013)
- Files touched: TODO_TIMELINE.md
- Rationale: Track plan/act tasks with AC, risks, and outcomes; source for changelog entries.
- Revert:
  - git rm TODO_TIMELINE.md
  - git commit -m "revert: remove TODO_TIMELINE.md"
  - or: git revert <SHA>
- Links: T-001..T-013

- Date: 2025-12-18
- Commit: (to be filled after commit)
- Change: docs(changelog): add CHANGELOG.md (this file) with conventions and templates
- Files touched: CHANGELOG.md
- Rationale: Establish consistent logging and revert hygiene; enable auditing of future changes.
- Revert:
  - git rm CHANGELOG.md
  - git commit -m "revert: remove CHANGELOG.md"
  - or: git revert <SHA>
- Links: T-007

- Date: 2025-12-18
- Commit: 818240652242dbe467f2d5c0a6b3b42ea9c55d38
- Change: docs(governance): add stabilization plan, tracking docs, and Cline rules/workflow
- Files touched: README.md, STABILIZATION_README.md, TODO_TIMELINE.md, CHANGELOG.md, ERROR_LOG.md, .clinerules/CLINE_RULES.md, .clinerules/CLINE_WORKFLOW.md
- Rationale: Introduce consolidated Stabilization and Modernization Plan, Phase 0 operational log, task timeline, changelog, error KB, and Cline rules/workflow to enforce consistent, revertible execution.
- Revert:
  - git revert 818240652242dbe467f2d5c0a6b3b42ea9c55d38
  - or: git restore README.md STABILIZATION_README.md TODO_TIMELINE.md CHANGELOG.md ERROR_LOG.md ".clinerules/CLINE_RULES.md" ".clinerules/CLINE_WORKFLOW.md"
- Links: T-006, T-007; PR: N/A

- Date: 2025-12-18
- Commit: 19ed183d1dda241fb9198c9a5b2ad659af8f0ade
- Change: docs(governance): require task completion summaries and add documentation style rules
- Files touched: README.md, .clinerules/CLINE_RULES.md, .clinerules/CLINE_WORKFLOW.md, TASK_COMPLETION_SUMMARIES.md
- Rationale: Add TASK_COMPLETION_SUMMARIES.md artifact, reference it in governance, and codify documentation style + formatting pass to improve readability.
- Revert:
  - git revert 19ed183d1dda241fb9198c9a5b2ad659af8f0ade
  - or: git restore README.md ".clinerules/CLINE_RULES.md" ".clinerules/CLINE_WORKFLOW.md" TASK_COMPLETION_SUMMARIES.md
- Links: T-006, T-007; PR: N/A

- Date: 2025-12-18
- Commit: bf100fc
- Change: chore(deps): remove grpc; regenerate lockfile
- Files touched: package.json, package-lock.json
- Rationale: grpc is not required for this CRA browser app and frequently fails native builds on Windows; removal unblocks installation.
- Revert:
  - git revert bf100fc
  - or: git restore package.json package-lock.json && npm install
- Links: T-002, T-004; Error: E-20251218-01

- Date: 2025-12-18
- Commit: 153a576
- Change: chore(env): add env fallbacks for Firebase and Mapbox (Phase 0)
- Files touched: src/config.js, src/components/EmotionMap.js
- Rationale: Prefer REACT_APP_* environment variables with temporary fallback to legacy constants; adds inline comments noting assumptions and future rotation/removal in Phase 2.
- Revert:
  - git revert 153a576
  - or: git restore src/config.js src/components/EmotionMap.js
- Links: T-003

Notes
- After each commit, update the Commit field with the actual SHA (git log -1 --pretty=format:%H).
- If a change fixes an error, add an ERROR_LOG.md entry and reference its ID here.
