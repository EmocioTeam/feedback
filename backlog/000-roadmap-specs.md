# Emocio Roadmap Specs — Collection (Moderation/RBAC, Clustering, Router v6, Map Refresh, Storage CORS, Server-side Analytics)

Purpose
- Provide architect-grade specifications and actionable prompts for Cline to implement, aligned with commit governance.
- Each section contains Description, Why, Scope, Steps, Acceptance Criteria, Risks/Dependencies, Revert, For Cline execution, and Architect notes.

Index
- T-Moderation-and-RBAC
- T-Map-Marker-Clustering
- T-Router-v6-Migration
- T-Map-Stack-Refresh
- T-Storage-CORS-Enablement
- T-Server-side-Analytics

-------------------------------------------------------------------------------
ID: T-Moderation-and-RBAC
Title: Moderation tooling and Role-based Access (Admin/Stakeholder)
Status: Planned

Description
Introduce basic moderation capabilities (hide/remove content, flagging) and role-based access (admin, stakeholder) to control elevated actions.

Why
Ensure content quality and empower stakeholders/admins with appropriate privileges; align with personas model.

Scope
- RBAC roles: anonymous, authenticated, stakeholder, admin
- Admin tools: hide/remove post, view flags queue
- Stakeholder: highlight comments; optional limited moderation actions (e.g., hide own comments)
- Flagging system: users can flag content for review

Steps
1) Data model: add roles in users collection (role: "admin"|"stakeholder"|"user")
2) UI: add “Flag” on FeedCard; admin screen to list flagged posts
3) Actions: admin-only delete/hide endpoints/actions
4) Rules: Firestore security rules aligned with role-based permissions
5) Logging: audit moderation actions

Acceptance Criteria
- Admin can list flagged posts and hide/remove content
- Stakeholder comments are visually highlighted; stakeholder cannot perform admin actions
- Firestore rules prevent non-admin destructive actions
- Flagging works; flags visible in admin screen

Risks/Dependencies
- Security rules complexity; UI discoverability
- Need clear audit trail

Revert
- git restore src/components/FeedCard.js src/actions/firebaseActions.js src/reducers/* FIREBASE_RULES_DEV.md
- Remove role fields from users docs

For Cline execution (prompt)
"""
Apply commit governance [docs:check]; implement RBAC (users.role), flagging (FeedCard flag button, flags collection), and admin view:
- Update Firestore rules for role-based actions.
- Add admin screen listing flagged posts; hide/remove actions for admin only.
- Create commits per feature slices; update CHANGELOG/TODO_TIMELINE/ERROR_LOG as needed.
"""

Architect notes
- Use feature flags for moderation UI
- Consider pagination for flags list
- Keep destructive actions audited (log actor, timestamp, entity)

-------------------------------------------------------------------------------
ID: T-Map-Marker-Clustering
Title: Clustered markers for high-density map areas
Status: Planned

Description
Enable clustering of markers to improve usability and performance on dense maps.

Why
Improve map readability and performance when many markers exist.

Scope
- Cluster markers by proximity
- Cluster count badge and expansion on click
- Maintain mood categories where feasible (mixed clusters show aggregate)

Steps
1) Evaluate mapbox-gl clustering (GeoJSON source with cluster=true)
2) Convert feed-with-location to GeoJSON features with properties {mood, id}
3) Render clusters (Layer with circle or symbol) and cluster labels
4) On cluster click, zoom/expand to show constituent markers

Acceptance Criteria
- Clusters visible at appropriate zoom levels
- Clicking cluster expands to reveal underlying markers
- Performance maintained

Risks/Dependencies
- Adjust EmotionMap to GeoJSON sources/layers
- Mood differentiation inside clusters (aggregate or mixed indicator)

Revert
- git restore src/components/EmotionMap.js
- Revert GeoJSON source conversion

For Cline execution (prompt)
"""
Implement clustering using mapbox-gl cluster sources; convert feed-with-location to GeoJSON; render cluster layer and click expansion. Follow commit governance and update docs.
"""

Architect notes
- Consider MapLibre or react-map-gl if later migrating stack
- Provide zoom thresholds for cluster splitting

-------------------------------------------------------------------------------
ID: T-Router-v6-Migration
Title: Migrate React Router v5 to v6
Status: Planned

Description
Update routing to React Router v6, simplifying route components and redirects.

Why
Modernize routing with improved API and compatibility with newer React releases.

Scope
- Switch <Switch> to <Routes>, <Route component/render> to <Route element>
- Replace <Redirect> with <Navigate>
- Adjust route props usage (use hooks: useNavigate/useParams)

Steps
1) Update dependencies to react-router-dom v6
2) Refactor App.js routes and containers using hooks
3) Validate navigation and links
4) Update tests/docs

Acceptance Criteria
- App routes function identically under v6
- No runtime errors during navigation

Risks/Dependencies
- Some containers rely on route props; must refactor to hooks

Revert
- git restore src/App.js package.json
- npm ci

For Cline execution (prompt)
"""
Migrate router v5 to v6 in src/App.js and related containers; use Routes/Route element; replace Redirect with Navigate; test navigation; commit with [docs:check].
"""

Architect notes
- Prepare deprecation map of props-based patterns
- Ensure lazy-loading and analytics routes continue to work

-------------------------------------------------------------------------------
ID: T-Map-Stack-Refresh
Title: Replace react-mapbox-gl with react-map-gl (or MapLibre)
Status: Planned

Description
Refresh map stack due to maintenance and token constraints.

Why
Reduce reliance on deprecated libraries and align with modern mapping frameworks.

Scope
- Integrate react-map-gl or MapLibre GL
- Re-implement EmotionMap with <Map>, <Marker>, clustering extension as needed
- Token management still via env with guard

Steps
1) Add react-map-gl or maplibre packages
2) Rewrite EmotionMap to new components
3) Port mood-based marker icons; popup card on click
4) Integrate clustering solution

Acceptance Criteria
- Map renders markers, popups, and clustering with similar UX
- Token guard remains

Risks/Dependencies
- UI differences in new stack; performance tuning required

Revert
- git restore src/components/EmotionMap.js package.json
- npm ci

For Cline execution (prompt)
"""
Swap map stack to react-map-gl/MapLibre; re-implement EmotionMap markers, popup, clustering; ensure token guard; follow commit governance and docs updates.
"""

Architect notes
- Consider map performance metrics; avoid excessive re-renders
- Icon assets remain under public/emojii

-------------------------------------------------------------------------------
ID: T-Storage-CORS-Enablement
Title: Enable Firebase Storage and configure CORS; switch image mode to storage
Status: Backlog

Description
When Storage is available, configure CORS and switch from base64 to storage mode for images.

Why
Reduce Firestore payload size; standardize image handling via Storage.

Scope
- Apply CORS to bucket
- Update .env to storage mode
- Ensure uploadImg returns storage URLs; remove base64 fallback in prod

Steps
1) Apply storage-cors.json via Console/gsutil
2) Set REACT_APP_PICTURE_MODE=storage
3) Verify upload path and UI image rendering
4) Update docs and ERROR_LOG if issues arise

Acceptance Criteria
- Upload works without CORS errors
- Images stored in gs://bucket and retrieved via getDownloadURL

Risks/Dependencies
- CORS misconfiguration; auth/permissions

Revert
- REACT_APP_PICTURE_MODE=base64
- Restore uploadImg fallback

For Cline execution (prompt)
"""
Apply CORS (storage-cors.json) to the Storage bucket; set picture mode to storage; verify uploads and update docs; commits per governance.
"""

Architect notes
- Keep base64 path as dev fallback for non-Storage plans
- Document rules for authenticated writes

-------------------------------------------------------------------------------
ID: T-Server-side-Analytics
Title: Server-side analytics and caching
Status: Backlog

Description
Move analytics computations server-side for performance and reliability; add caching.

Why
Reduce client load and support scalable aggregation.

Scope
- API endpoints for totals, top emotion, top hashtag, radar datasets
- Caching layer (in-memory or KV store)
- Client updates to use server endpoints

Steps
1) Define API schemas: /analytics, /analytics/radar?hashtags=...
2) Implement aggregations and caching
3) Update client to fetch from endpoints
4) Add error handling and fallback

Acceptance Criteria
- Client displays analytics from server endpoints
- Caching improves response times; consistent results

Risks/Dependencies
- Backend hosting, authentication, rate limits

Revert
- Client returns to local computations

For Cline execution (prompt)
"""
Add server-side analytics endpoints and caching; update client to consume them; commit with governance and update docs (CHANGELOG, TODO_TIMELINE).
"""

Architect notes
- Consider pre-computation triggers on write (feedback/hashtags)
- Cache invalidation strategy must be defined

-------------------------------------------------------------------------------

Governance Alignment
- Commit Subject: <type>(<scope>): <summary> [track:<track>] [docs:check]
- Commit Body: Rationale, Files touched, Revert commands, Docs-Checklist, Links (Tasks/Errors/CHANGELOG)
- Ask-to-merge: approval required for consolidation/PR merges, include Approval Record in description.

References
- docs/README.md (documentation index)
- docs/governance/* (CHANGELOG, ERROR_LOG, STABILIZATION_README, TODO_TIMELINE, FIREBASE_RULES_DEV)
- EMOCIO_CONTEXT.md (modernization overlay)
- docs/governance/EMOCIO_CONTEXT.backup.md (original context with updated tech stack)
