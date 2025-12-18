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

Notes
- After each commit, update the Commit field with the actual SHA (git log -1 --pretty=format:%H).
- If a change fixes an error, add an ERROR_LOG.md entry and reference its ID here.
