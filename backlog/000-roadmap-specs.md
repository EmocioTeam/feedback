# 000 — Backlog Roadmap (Aggregator)

Purpose
- This file now serves as an index/aggregator for individual backlog specification documents.
- Each item is split into its own numbered, categorized file for focused execution and review.
- Use backlog/README.md as the master index for navigation and commit governance reminders.

Backlog Items (Split Files)
- 001 — Security/Governance — Moderation and RBAC (Admin/Stakeholder)
  - File: backlog/001-security-moderation-rbac.md
  - Summary: Role-based permissions (admin/stakeholder/user), flagging, admin hide/remove, audit logs, rules hardening.

- 002 — Maps UX/Performance — Marker Clustering
  - File: backlog/002-maps-uxperf-marker-clustering.md
  - Summary: Cluster emotion markers, expand clusters on click, maintain performance and readability.

- 003 — Platform/Navigation — Router v6 Migration
  - File: backlog/003-platform-navigation-router-v6.md
  - Summary: Migrate from React Router v5 to v6 (Routes/Route/Navigate, hooks), verify navigation and deep links.

- 004 — Platform/Maps — Stack Refresh (react-map-gl/MapLibre)
  - File: backlog/004-platform-maps-stack-refresh.md
  - Summary: Replace react-mapbox-gl; re-implement EmotionMap with modern stack (markers, popups, clustering hook).

- 005 — Platform/Security/Operations — Storage CORS Enablement and Mode Switch
  - File: backlog/005-platform-security-storage-cors-enable.md
  - Summary: Apply bucket CORS and switch REACT_APP_PICTURE_MODE to “storage”; verify upload flows and docs.

- 006 — Analytics/Performance/Scalability — Server-side Analytics
  - File: backlog/006-analytics-perf-server-side-analytics.md
  - Summary: Move analytics to server endpoints, add caching; update client to consume APIs with graceful fallback.

How to Execute
- Start at backlog/README.md for category overview and commit governance.
- Execute one backlog item at a time with small, auditable commits.
- Update docs/governance/TODO_TIMELINE.md and docs/governance/CHANGELOG.md as you progress.
- Record any issues in docs/governance/ERROR_LOG.md (with Prevention notes).

Cross-links
- Backlog index: backlog/README.md
- Documentation index: docs/README.md
- Context (current): EMOCIO_CONTEXT.md
- Context backup (tech stack updated only): docs/governance/EMOCIO_CONTEXT.backup.md
