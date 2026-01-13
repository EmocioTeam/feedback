# 004 — Platform/Maps — Stack Refresh (react-map-gl/MapLibre)

Status: Planned

Description
Replace react-mapbox-gl with a modern, maintained stack (react-map-gl + mapbox-gl or MapLibre GL) and re-implement EmotionMap features (markers, popups, optional clustering).

Why
- Reduce reliance on deprecated/less-maintained libraries.
- Improve compatibility and performance with modern mapping stacks.
- Prepare for future enhancements (clustering, vector tiles, style switching).

Scope
- Introduce react-map-gl (Mapbox GL) or MapLibre GL as the map renderer.
- Re-implement EmotionMap with:
  - <Map> container, <Marker> icons by mood, and popup details on click.
  - Centering on user coords (if available) with graceful fallback.
  - Optional clustering integration point (see 002 — Marker Clustering).
- Maintain token guard with REACT_APP_MAPBOX_TOKEN and non-blocking warning.

Steps
1) Dependency choice and installation
   - Option A (Mapbox GL): @deck.gl/core (optional), react-map-gl@^7, mapbox-gl@^2
   - Option B (Open-source): maplibre-gl and react-map-gl with MapLibre provider
   - Install packages and update tooling if required
2) Component rewrite
   - Create a new EmotionMapV2 (co-exist for migration) using react-map-gl (or MapLibre):
     - <Map initialViewState={center/zoom}>; style/tiles configured
     - Render mood markers via <Marker position> and mood icon
     - Popup on marker click with FeedCard details (existing component)
     - Maintain token guard; show warning if missing
3) Data flow
   - Use existing feed-with-location selector to drive marker array
   - Memoize markers to reduce re-renders
4) Behavior parity and performance
   - Center on user coords if available; default fallback otherwise
   - Validate pan/zoom performance on common datasets
   - Prepare an optional clustering hook-up using supercluster/deck.gl layer (future)
5) Switch-over plan
   - Keep legacy EmotionMap during evaluation (feature flag)
   - Document rollout steps; remove legacy once parity is confirmed

Acceptance Criteria
- New map renders mood-specific markers with popups on click
- Map centers correctly and maintains good interaction performance
- Token guard remains: missing token shows a non-blocking banner
- Code is structured to allow future clustering with minimal changes

Risks/Dependencies
- CSS/asset changes for icons may be needed in react-map-gl/MapLibre
- Token and style configuration differences between stacks
- Clustering requires additional libs (supercluster/deck.gl) if not using built-in features

Revert
- git restore src/components/EmotionMap.js package.json
- npm ci

For Cline execution (prompt)
"""
Apply commit governance [docs:check]. Refresh map stack:
1) Add react-map-gl (Mapbox GL) or MapLibre GL dependencies; configure token style/template.
2) Implement EmotionMapV2 with <Map>, <Marker>, popup; token guard banner remains.
3) Memoize marker generation; validate interactions and rendering.
4) Optionally gate the new map behind a feature flag; document rollout steps.
5) Commit in small slices; update CHANGELOG, TODO_TIMELINE, TASK_COMPLETION_SUMMARIES; record any errors in ERROR_LOG.
"""

Architect notes
- Consider MapLibre if avoiding Mapbox license constraints.
- Keep mood icons under public/emojii; ensure scaling and anchoring are correct in the new stack.
- Prepare for theme/styles by abstracting map style URL into config/env.
- Evaluate deck.gl for future clustering/heatmap layers.

Links
- EMOCIO_CONTEXT.md (Map workflows)
- docs/governance/STABILIZATION_README.md (status updates)
- docs/governance/TODO_TIMELINE.md (task entry and AC)
- docs/governance/CHANGELOG.md (per-change record)
- docs/governance/ERROR_LOG.md (record runtime issues)
