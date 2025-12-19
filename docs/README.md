# Emocio Documentation Index

Purpose
- Central entry point to the project’s governance, guides, and runbooks.
- Improve discoverability and enforce documentation hygiene.

Governance
- Stabilization Log (Phase 0): docs/governance/STABILIZATION_README.md
- Task Timeline (Plan/Act, AC, risks, outcomes): docs/governance/TODO_TIMELINE.md
- Changelog (per-change log with revert): docs/governance/CHANGELOG.md
- Error Knowledge Base (ERROR_LOG): docs/governance/ERROR_LOG.md
- Firebase Rules (Dev baseline + hardening): docs/governance/FIREBASE_RULES_DEV.md

Runbooks
- Commit Governance and Approval (no-branch mode): backlog/commit-governance-and-approval.md
  - Contains commit subject/body templates, Docs-Checklist gating, Approval Record usage, and revert hygiene.
- Dev server port/host conflicts (Planned)
- Storage CORS application (Backlog; enabled if switching to Storage uploads)

Guides (Planned)
- Environment setup (Node/Windows considerations; OneDrive caveats; npm scripts)
- Personas overview and initialization (Anonymous/Authenticated/Stakeholder)
- Image modes: Storage vs Base64 (REACT_APP_PICTURE_MODE)
- Mapbox token and map configuration

Notes
- The master README at the repository root links into this index for deeper documentation.
- Documentation updates are subject to governance rules in .clinerules/CLINE_RULES.md and .clinerules/CLINE_WORKFLOW.md.
