# Emocio Backlog Index

Purpose
- Centralized index of planned enhancements, categorized by benefit.
- Guides execution with commit governance and architect notes.
- Use this index to select a backlog item and implement it in small, auditable commits.

How to use
- Pick an item below based on category/benefit.
- Open the file and follow:
  - “Steps” for minimal viable slices
  - “Acceptance Criteria” for done-state
  - “For Cline execution” prompt block (enforces commit governance)
  - “Architect notes” for design and rollout guardrails

Categories and Items

Security/Governance
- 001 — Security/Governance — Moderation and RBAC (Admin/Stakeholder)
  - File: backlog/001-security-moderation-rbac.md
  - Add role-based permissions and moderation tooling (flag/hide/remove); audit actions; align Firestore rules.

Maps UX/Performance
- 002 — Maps UX/Performance — Marker Clustering
  - File: backlog/002-maps-uxperf-marker-clustering.md
  - Cluster markers for dense areas; click to expand; maintain performance and readability.

Platform/Navigation
- 003 — Platform/Navigation — Router v6 Migration
  - File: backlog/003-platform-navigation-router-v6.md
  - Migrate routing to React Router v6 (Routes/Route element; Navigate); refactor containers to hooks.

Platform/Maps
- 004 — Platform/Maps — Stack Refresh (react-map-gl/MapLibre)
  - File: backlog/004-platform-maps-stack-refresh.md
  - Replace react-mapbox-gl with react-map-gl or MapLibre; re-implement EmotionMap (markers, popups, clustering).

Platform/Security/Operations
- 005 — Platform/Security/Operations — Storage CORS Enablement and Mode Switch
  - File: backlog/005-platform-security-storage-cors-enable.md
  - Apply CORS to Firebase Storage and switch REACT_APP_PICTURE_MODE to “storage”; verify uploads.

Analytics/Performance/Scalability
- 006 — Analytics/Performance/Scalability — Server-side Analytics
  - File: backlog/006-analytics-perf-server-side-analytics.md
  - Move analytics to server endpoints with caching; client consumes APIs.

Commit Governance (must follow)
- Subject: <type>(<scope>): <summary> [track:<track>] [docs:check]
- Body:
  - Rationale, Files touched
  - Revert commands
  - Docs-Checklist (CHANGELOG, ERROR_LOG if any, TODO_TIMELINE, TASK_COMPLETION_SUMMARIES, README if user-facing)
  - Links (Tasks/Errors/CHANGELOG)
- Ask-to-merge gate for consolidation/PR merges (Approval Record required)

Cross-links
- Documentation index: docs/README.md
- Governance docs: docs/governance/*
- Context (current): EMOCIO_CONTEXT.md
- Context backup (tech updated only): docs/governance/EMOCIO_CONTEXT.backup.md
