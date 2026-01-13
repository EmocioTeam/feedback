# 002 — Maps UX/Performance — Marker Clustering

Status: Planned

Description
Enable clustering of emotion markers on the map to improve readability and performance when many posts have locations.

Why
- Dense marker distributions are hard to read and interact with.
- Clustering improves UX (overview first, drill-down on demand) and reduces render overhead.

Scope
- Convert feed-with-location to a GeoJSON source (features contain mood, id, coordinates).
- Use mapbox-gl clustering (cluster=true) or an equivalent for MapLibre.
- Render cluster circles/labels; expand clusters on click.
- Preserve mood differentiation where feasible (mixed clusters show aggregate counts or neutral cluster styles).

Steps
1) Data preparation
   - Transform snapshots of location-enabled feeds to GeoJSON:
     { type: "Feature", geometry: { type: "Point", coordinates: [lon, lat] }, properties: { id, mood } }
2) Map source/layer configuration
   - Add source: { type: "geojson", data, cluster: true, clusterRadius: 50 (tune), clusterMaxZoom: 14 (tune) }
   - Add layers:
     - cluster circles (visual size scaled by point_count)
     - cluster count symbol (point_count)
     - unclustered points (mood-specific icon-image)
3) Interaction
   - On cluster click: get cluster expansion zoom; animate zoom and center to expand
   - On unclustered point click: show FeedCard popup overlay (existing)
4) Performance tuning
   - Tune clusterRadius/MaxZoom; avoid excessive re-rendering of layers
   - Memoize GeoJSON building or throttle feed updates

Acceptance Criteria
- Clusters appear at appropriate zoom levels with readable counts.
- Clicking a cluster zooms in to reveal underlying markers.
- Unclustered markers continue to display mood icons and popup cards on click.
- Performance is acceptable on typical datasets (no significant frame drops).

Risks/Dependencies
- The current EmotionMap architecture uses symbol layers with per-mood images; clustering requires an additional source/layers logic.
- Large snapshots may require data throttling or memoization.
- If Mapbox stack is later replaced (MapLibre/react-map-gl), clustering implementation specifics change.

Revert
- git restore src/components/EmotionMap.js
- Revert any GeoJSON transformation utilities added under src/utils

For Cline execution (prompt)
"""
Apply commit governance [docs:check]. Implement marker clustering:
1) Build a GeoJSON feature builder from the real-time feed snapshot (location-enabled feeds).
2) Add a clustered geojson source and layers (cluster circles + count, unclustered mood markers).
3) Implement onClick for clusters to expand; maintain existing unclustered marker behavior with FeedCard popups.
4) Tune cluster parameters and memoize data building for performance.
5) Create small commits per slice; update CHANGELOG, TODO_TIMELINE, TASK_COMPLETION_SUMMARIES; record any errors in ERROR_LOG.
"""

Architect notes
- Keep the existing mood-specific icons for unclustered points; use a neutral style for clusters (mixed moods).
- Consider a threshold to switch clustering off if datasets are small.
- Prepare for future stack refresh (MapLibre/react-map-gl): abstract data building and interaction handlers to ease migration.

Links
- EMOCIO_CONTEXT.md (Map workflows)
- docs/governance/STABILIZATION_README.md (status updates)
- docs/governance/TODO_TIMELINE.md (task entry and AC)
- docs/governance/CHANGELOG.md (per-change record)
- docs/governance/ERROR_LOG.md (record runtime issues)
