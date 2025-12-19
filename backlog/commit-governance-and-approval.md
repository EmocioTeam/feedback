# Commit Governance and Approval — No-Branch Mode (Runbook)

Purpose
- Enforce disciplined, auditable commits without using branches for now.
- Require per-commit documentation/logging gating and explicit approval capture when merging/consolidating.
- Provide prompts and checklists to run via Cline or manually.

Scope
- Commit naming and description segregation
- Docs-Checklist gating (no-skip)
- Revert hygiene
- Approval Record policy (“Ask-to-merge” gate)
- Tracks metadata for commit subject

Implementation Documentation
- Starting a backlog item:
  - Add a T-ID entry in docs/governance/TODO_TIMELINE.md (Status: Planned) and link to the backlog/<number>-<title>.md file.
  - If environment/setup changes are expected, add a note in docs/governance/STABILIZATION_README.md (Status Log).
- During implementation:
  - Keep commits small; include [track:<track>] and [docs:check] in the subject.
  - Update the backlog item file with a “Progress” subsection:
    - Progress:
      - Status: Planned | In progress | Done | Blocked
      - Last updated (UTC): YYYY-MM-DDTHH:mm:ssZ
      - T-IDs: T-XXX
      - Commits: <SHAs if available>
      - Links: TODO_TIMELINE | CHANGELOG | ERROR_LOG
- On completion:
  - Set Status: Done in the backlog item and add a short outcome note.
  - Update docs/governance/TODO_TIMELINE.md (AC verified, links) and TASK_COMPLETION_SUMMARIES.md (explain-changes, AC verification, next actions).
  - Ensure docs/governance/CHANGELOG.md has a per-change entry with revert commands.

Backlog Enforcement and Progress Tracking
- Aggregator and Index:
  - backlog/000-roadmap-specs.md is the authoritative aggregator; keep links/summaries up to date when scope or status meaningfully changes.
  - backlog/README.md is the index by category/benefit.
- Commit requirements (when touching backlog/*.md):
  - Include a “Backlog-Refs” subsection in the commit body listing changed backlog files and T-IDs.
  - Update docs/governance/TODO_TIMELINE.md (Status and links).
  - Update backlog/000-roadmap-specs.md summary line(s) if scope/status changed.
  - Ensure Docs-Checklist includes [x] CHANGELOG and [x] TODO_TIMELINE checks.

Status template (to embed in each backlog file)
- Progress:
  - Status: Planned | In progress | Done | Blocked
  - Last updated (UTC): YYYY-MM-DDTHH:mm:ssZ
  - T-IDs: T-XXX
  - Commits: <optional SHAs>
  - Links: TODO_TIMELINE | CHANGELOG | ERROR_LOG

Commit Subject Schema
- Format:
  <type>(<scope>): <summary> [track:<track>] [docs:check] [approval:required]
- Examples:
  - feat(upload): enable base64 fallback when Storage not available [track:upload-fallback] [docs:check]
  - fix(radar,feedcard): guards for empty arrays and null timestamps [track:ui-stability] [docs:check]
  - chore(security): npm overrides + .svgrrc to mitigate CRA advisories [track:security] [docs:check]
  - docs(governance): add dev rules and enforcement [track:governance] [docs:check]
- Allowed types: feat | fix | chore | docs | refactor | perf | test
- Common scopes: upload | radar | feedcard | firebase | security | governance | personas | map

Commit Body Template (must be included)
- Rationale:
  - Why this change is necessary; assumptions made
- Files touched:
  - List explicit files
- Revert:
  - git revert <SHA>
  - or: git restore <files> && npm ci (if package files changed)
- Docs-Checklist (all must be checked before commit considered “done”):
  - [ ] CHANGELOG.md entry updated (date, files, rationale, revert)
  - [ ] ERROR_LOG.md entry(ies) added/updated (sanitized logs, Analysis, Resolution, Prevention note)
  - [ ] TODO_TIMELINE.md task updated (AC, outcomes, links)
  - [ ] TASK_COMPLETION_SUMMARIES.md updated (acceptance verification + Next best actions, links)
  - [ ] README.md/STABILIZATION_README.md updated if user-facing or environment behavior changed
- Links:
  - Tasks (TODO_TIMELINE IDs)
  - Error IDs (ERROR_LOG)
  - CHANGELOG entry reference
- Approval Record (only for merge/consolidation-like commits):
  - Requested by: Cline
  - Approved by: <USER> at <UTC timestamp>
  - Cline chat reference: <date/time or message anchor>

Tracks (use as [track:<track>] metadata)
- firebase-modular-v12
- upload-fallback
- ui-stability
- security
- governance
- personas
- map

Prompts — Run with Cline (copy/paste)
- Pre-commit enforcement (ask Cline):
  """
  Apply commit governance (no-branch mode):
  1) Validate Docs-Checklist updated: CHANGELOG, ERROR_LOG (with Prevention), TODO_TIMELINE, TASK_COMPLETION_SUMMARIES, and README/STABILIZATION_README if applicable.
  2) Prepare commit subject using schema with [track:], [docs:check], and [approval:required] if this is a merge/consolidation.
  3) Prepare commit body with Rationale, Files touched, Revert, Docs-Checklist (checked), Links, Approval Record (if applicable).
  4) Stop and ask for my approval before any PR-like merge, and include Approval Record in the commit body.
  """
- Ask-to-merge gate (for consolidation):
  """
  Request approval to merge/consolidate the following changes:
  - Summary: <short description>
  - Verified AC: <bullets>
  - Docs updated: CHANGELOG / ERROR_LOG / TODO_TIMELINE / TASK_COMPLETION_SUMMARIES / README/STABILIZATION (yes/no)
  - Revert plan: <commands>
  Approve merge? (yes/no). On approval, record Approval Record in the commit body.
  """

Manual Steps — Developer Checklists (Windows cmd.exe)
1) Validate Docs-Checklist:
   - Update CHANGELOG.md, ERROR_LOG.md, TODO_TIMELINE.md, TASK_COMPLETION_SUMMARIES.md
   - If user-facing change: update README.md/STABILIZATION_README.md
2) Prepare commit subject:
   - Include [track:<track>] and [docs:check]; [approval:required] for merge-like changes
3) Prepare commit body:
   - Include Rationale, Files touched, Revert, Docs-Checklist (checked), Links, Approval Record (if applicable)
4) Request approval via Cline chat when needed, then record Approval Record in the next commit body

Examples
- Subject:
  feat(upload): add base64 data URL fallback [track:upload-fallback] [docs:check]
- Body:
  Rationale: free Firebase plan has no Storage; avoid CORS by embedding images as base64.
  Files touched: src/actions/firebaseUploadImg.js; src/containers/AddFeedback.js; .env.local; .env.local.example
  Revert:
    - git restore src/actions/firebaseUploadImg.js src/containers/AddFeedback.js .env.local .env.local.example
  Docs-Checklist:
    - [x] CHANGELOG updated
    - [x] ERROR_LOG updated (E-20251219-07/08)
    - [x] TODO_TIMELINE updated
    - [x] TASK_COMPLETION_SUMMARIES updated
    - [x] README updated (image mode)
  Links:
    - T-Upload-Fallback
    - E-20251219-07, E-20251219-08
    - CHANGELOG 2025-12-19 entry

Revert Hygiene
- Each commit must include exact revert commands.
- For dependency changes, include npm ci in revert steps.

Index of Related Docs
- .clinerules/CLINE_RULES.md — governance policies (Ask-to-merge gate; Docs-Checklist gating)
- .clinerules/CLINE_WORKFLOW.md — operational workflow steps
- CHANGELOG.md — per-change record
- ERROR_LOG.md — error KB with Prevention patterns
- TODO_TIMELINE.md — tasks with AC and outcomes
- TASK_COMPLETION_SUMMARIES.md — explain changes and verification
- README.md / STABILIZATION_README.md — user-facing setup and stabilization log

Next Best Actions

- Update .clinerules to encode this no-branch commit gating and Ask-to-merge enforcement.
- Keep commits small and auditable; maintain Docs-Checklist rigor.
