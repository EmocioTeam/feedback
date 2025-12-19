# 001 — Security/Governance — Moderation and RBAC (Admin/Stakeholder)

Status: Planned

Description
Introduce moderation capabilities (flag/hide/remove content) and role-based access (admin, stakeholder, user) to govern elevated actions and content quality.

Why
- Protect the platform from abuse and low-quality content.
- Empower stakeholders/admins to act on flagged content.
- Align with personas (Anonymous, Authenticated, Stakeholder) and governance.

Scope
- Roles in users/{uid}: role: "admin" | "stakeholder" | "user" (default "user")
- Stakeholder: comments highlighted (existing); no destructive privileges
- Admin: moderate flagged content; hide/remove posts
- Flagging system: end-users flag posts for admin review
- Audit log for moderation actions (actor, ts, entity, action)

Steps
1) Data model
   - Extend users docs with role field (default "user")
   - Create flags collection (flags/{id}: {feedId, reason?, createdAt, flaggedBy})
   - Optional audit collection (moderationLogs/{id}: {action, actorUid, feedId, createdAt})
2) UI
   - FeedCard: add “Flag” button (visible to all)
   - Admin page: list flagged content; actions: “Hide”, “Remove”, “Dismiss”
   - Visual indicator on hidden content in admin view (soft-deleted)
3) Actions/Reducers
   - Action creators for flag, hide, remove, dismiss
   - Admin guard in UI based on role from users/{uid}
4) Firestore Security Rules (FIREBASE_RULES_DEV.md)
   - Allow flag creation for authenticated/anonymous as per policy
   - Restrict hide/remove to admins only
   - Ensure audit entries are write-once append
5) Logging
   - Write moderationLogs on admin actions
   - Optionally show admin-only audit trail UI

Acceptance Criteria
- End-user can flag any post; flags are listed in an admin dashboard
- Admin can hide (soft) or remove (hard) a post and dismiss flags
- Security rules prevent non-admin destructive actions
- Stakeholder comments remain highlighted without additional privileges
- Logs exist for all admin actions (actor, action, ts, entity)

Risks/Dependencies
- Complexity in rules; ensure strict admin check
- UI discoverability of flags/admin actions; avoid accidental deletions
- Anonymous flagging policy may require captcha or rate limiting

Revert
- git restore src/components/FeedCard.js src/actions/firebaseActions.js src/reducers/* src/containers/* FIREBASE_RULES_DEV.md
- Remove role field and moderation collections; revert rules

For Cline execution (prompt)
"""
Apply commit governance [docs:check]. Implement moderation and RBAC:
1) Extend users role (admin/stakeholder/user); default "user".
2) Add flags collection and moderationLogs.
3) UI: add “Flag” in FeedCard; build Admin screen listing flags with actions.
4) Actions/reducers for flag/hide/remove/dismiss; admin-gated UI.
5) Update Firestore rules: only admins can hide/remove; allow flags per policy; audit write-once.
6) Create small, auditable commits; update CHANGELOG, TODO_TIMELINE, ERROR_LOG (if issues), and TASK_COMPLETION_SUMMARIES.
"""

Architect notes
- Feature flags: gate Admin UI and actions behind env-based toggles in non-prod
- Pagination for flags list; lazy load to avoid heavy reads
- Consider soft delete (hidden: true) vs. hard delete; prefer soft delete for reversibility
- Ensure moderationLogs are append-only; avoid PII beyond actorUid
- Plan for role assignment UI/process (manual in early phase; automate later)

Links
- EMOCIO_CONTEXT.md (personas, flows)
- docs/governance/ERROR_LOG.md (for any new errors)
- docs/governance/FIREBASE_RULES_DEV.md (rules baseline/hardening)
- docs/governance/STABILIZATION_README.md (status updates)
- docs/governance/TODO_TIMELINE.md (task entry and AC)
