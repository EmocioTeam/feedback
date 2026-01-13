# 003 — Platform/Navigation — Router v6 Migration

Status: Planned

Description
Migrate routing from React Router v5 to v6 to modernize navigation APIs and improve compatibility with newer React releases.

Why
- Router v6 simplifies route configuration and component usage.
- Aligns with modern React patterns (hooks and element-based routing).

Scope
- Replace <Switch> with <Routes>; use <Route element={...}> instead of render/component.
- Replace <Redirect> with <Navigate>.
- Refactor containers to use hooks (useNavigate, useParams, useLocation) instead of props-based routing.
- Validate navigation and deep links across /add-feed, /add-feed/:hashtag, /feed-page (Wall/Map toggle), /analytics, /profile.

Steps
1) Dependencies
   - Update react-router-dom to v6 in package.json; install.
2) App routing
   - Refactor src/App.js:
     - Import from react-router-dom v6 (BrowserRouter, Routes, Route, Navigate).
     - Convert Redirect to Navigate.
     - Use element property for Route configurations.
3) Containers
   - Update components using route props to hooks:
     - useParams for :hashtag in AddFeedback route
     - useNavigate for programmatic navigation if needed
     - useLocation for tab toggling in FeedPage if applicable
4) Validation
   - Verify direct navigation and tab toggles:
     - / (redirect to /add-feed)
     - /add-feed and /add-feed/:hashtag
     - /feed-page (Wall/Map)
     - /analytics
     - /profile

Acceptance Criteria
- All routes function identically under v6 with no runtime errors.
- Deep links (e.g., /add-feed/#Tag and /add-feed/:hashtag) behave correctly.
- Redirects replaced with Navigate work as expected.

Risks/Dependencies
- Prop-based routing patterns in containers must be migrated to hooks.
- Some legacy code may rely on history object; update to useNavigate.
- Ensure CSS/active nav states aren’t tied to v5-only constructs.

Revert
- git restore src/App.js package.json
- npm ci

For Cline execution (prompt)
"""
Apply commit governance [docs:check]. Migrate routing to React Router v6:
1) Update react-router-dom to v6 and refactor src/App.js to use Routes/Route element and Navigate.
2) Update affected containers to use hooks (useParams, useNavigate).
3) Validate navigation across all routes; create small commits per slice; update CHANGELOG, TODO_TIMELINE, TASK_COMPLETION_SUMMARIES; record issues in ERROR_LOG if any.
"""

Architect notes
- Consider future route guards (auth, roles) using wrapper components or hook checks.
- Keep routes small and composable; avoid heavy render functions within Route element.
- Plan to consolidate nav state handling with useLocation/useNavigate.

Links
- EMOCIO_CONTEXT.md (routes and navigation)
- docs/governance/STABILIZATION_README.md (status)
- docs/governance/TODO_TIMELINE.md (task entries)
- docs/governance/CHANGELOG.md (per-change record)
- docs/governance/ERROR_LOG.md (issues)
