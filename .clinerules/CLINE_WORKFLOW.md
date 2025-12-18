# Cline Workflow — Emocio Project

Purpose
- Define a consistent, auditable workflow for Cline operations in this repository.
- Ensure each change is planned, validated, documented, and safely revertible.
- Complement .clinerules/CLINE_RULES.md with operational steps.

A) Intake and Planning (Plan Mode)
- Sanitize inputs; remove PII/GDPR-sensitive data in prompts/logs.
- Read EMOCIO_CONTEXT.md, README.md, and relevant source files to establish context.
- Define scope, dependencies, acceptance criteria (AC), and revert path.
- Update TODO_TIMELINE.md:
  - Add a new Task ID (T-XXX) with Description, Why, Steps, AC, Risks, Dependencies, Owner, Target dates.
- Present a concrete plan for approval.

B) Exploration (Plan Mode)
- Use read_file/search_files/list_files to gather details.
- Prefer exploration tools over asking questions; ask only when blocked by missing data.
- Record findings/assumptions inline in code (when later editing) and in STABILIZATION_README.md or TODO_TIMELINE.md.

C) Proposal (Plan Mode)
- Provide step-by-step execution plan with AC and revert commands.
- Identify files to be touched and expected side effects.
- Include documentation obligations (README/STABILIZATION/TODO_TIMELINE/CHANGELOG/ERROR_LOG).

D) Implementation Loop (Act Mode)
1) Branching
   - git checkout -b feat/<task-name> (or checkout existing feature branch)
2) Execute smallest viable change
   - One logical change per commit; minimize blast radius.
3) Documentation updates
   - STABILIZATION_README.md: phase status, risks, outcomes
   - TODO_TIMELINE.md: task status/outcomes/links
   - CHANGELOG.md: entry with files touched, rationale, revert commands
   - ERROR_LOG.md: add entry if any errors occurred (sanitized)
4) Commit with required structure
   - Subject: <type>(<scope>): <summary>
   - Body:
     - Rationale: why this change was required; assumptions made
     - Revert: exact commands to revert (git revert <sha> / git restore <files>)
     - Files touched: explicit list or short diff summary
5) Wait for tool confirmation after each step; do not chain tools without confirmation.

E) Validation
- Run app/build as required; capture logs/screenshots for artifacts.
- Verify acceptance criteria in TODO_TIMELINE.md; mark status accordingly.
- If validation fails, add/augment ERROR_LOG.md with ID, environment, logs, analysis, resolution, and status.

F) Completion
- Use attempt_completion to summarize:
  - What changed, where documented, how to revert.
  - Links to TODO_TIMELINE tasks, CHANGELOG entries, and ERROR_LOG items.
- Write/update TASK_COMPLETION_SUMMARIES.md:
  - Capture a concise task-level summary and “explain changes” details
  - Verify acceptance criteria and record verification notes
  - Link to commits, CHANGELOG entries, TODO_TIMELINE tasks, and ERROR_LOG items
  - Include revert commands
- Perform a documentation formatting pass:
  - Prefer narrative paragraphs; use bullets only for checklists and crisp enumerations
  - Avoid nested lists beyond one level; use short subsections/headings instead
  - Normalize section titles and cross-links between README, STABILIZATION_README, TODO_TIMELINE, CHANGELOG, ERROR_LOG, TASK_COMPLETION_SUMMARIES

G) Error Handling (Error Knowledge Base)
- For each error:
  - Create an ERROR_LOG.md entry with:
    - ID: E-YYYYMMDD-XX
    - Timestamp (UTC), Environment (OS, Node, npm, shell, repo path)
    - Action/Command, Summary, sanitized log excerpts
    - Analysis (root cause), Resolution (commands/steps), Status
    - Links (Task IDs, CHANGELOG entries, commits/PRs), Revert if applicable
- Cross-link from CHANGELOG entries to the error IDs they resolve.

H) Project Brain (Cline Memory Bank)
- After non-trivial tasks, summarize:
  - Architecture/domain insights, dependencies, upgrade decisions, standard fixes/pitfalls
  - Store in an internal memory bank; mention in README that the project leverages a memory bank for continuity.

Phase-aware Workflows
- Phase 0 (Stabilization):
  - Allowed: remove native blockers (e.g., grpc), add env fallbacks, validate install/run, documentation/logging
  - Disallowed: feature refactors, broad library swaps, major API upgrades
- Phase 1+ (Modernization Tracks):
  - Router v6 migration, Firebase modular v10, Map stack replacement, Tooling (CRA5/Vite, React 18), Library cleanups
  - One track per PR with API diffs, docs updates, and guardrails

Commit Message Examples
- chore(deps): remove grpc; regenerate lockfile
  Rationale: grpc is unused by the browser app and causes native build failures on Windows; removal unblocks install.
  Revert: git revert <SHA>
  Files touched: package.json, package-lock.json
- docs(stabilization): add STABILIZATION_README with Phase 0 scope and checklist
  Rationale: operational log and revert hygiene for stabilization.
  Revert: git revert <SHA>
  Files touched: STABILIZATION_README.md

Acceptance Criteria Template
- “Install succeeds on Windows 11 with Node 14.15.4/npm 6.14.10; npm start runs at http://localhost:3000; core routes (AddFeedback, FeedPage Wall/Map, Analytics) render without runtime errors; documentation updated.”

Revert Template
- Revert last change:
  - git revert <SHA>
- Restore specific files:
  - git restore <file1> <file2>
- If package files changed:
  - npm install

Security and Sanitization
- Never commit secrets; use .env.local (template in .env.local.example)
- Sanitize logs and docs (<USER>, <TOKEN>, <ORG> placeholders)
- If a secret is exposed, rotate and record in CHANGELOG with a security note
