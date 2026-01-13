# 006 — Analytics/Performance/Scalability — Server-side Analytics

Status: Backlog

Description
Move analytics computations (totals, top emotion, top hashtag, radar datasets) to server-side endpoints with a caching layer to improve performance and reliability.

Why
- Client-side aggregations can be heavy and inconsistent under load.
- Server-side aggregation and caching provides consistent, faster responses and scales better.

Scope
- Backend endpoints:
  - GET /analytics → { totalEmocios, commentsCount, topEmotion, topHashtag }
  - GET /analytics/radar?hashtags=H1,H2 → mood distributions per hashtag
- Caching layer (in-memory or KV store) with TTL and invalidation strategy
- Client updates to consume the endpoints and render analytics accordingly
- Error handling and fallback to client-side when server is unavailable (optional)

Steps
1) API schemas
   - Define response formats and error models for /analytics and /analytics/radar
2) Implementation
   - Implement aggregation logic (e.g., Firestore queries or DB calls) server-side
   - Add caching with TTL; invalidate on feedback/hashtag writes or via scheduled refresh
3) Client integration
   - Update Results and radar components to fetch from endpoints
   - Handle loading/error states; optionally fallback to client aggregation
4) Documentation and ops
   - Document deployment, env variables, and caching settings
   - Update README and docs/governance/TODO_TIMELINE.md with outcomes
   - Record any issues in ERROR_LOG.md

Acceptance Criteria
- Client displays analytics from server endpoints with correct values
- Radar datasets are served for selected hashtags efficiently
- Caching reduces response times and load on the database
- Fallback behavior documented (optional)

Risks/Dependencies
- Backend hosting and authentication requirements
- Rate limits and cost considerations on aggregation operations
- Cache invalidation complexity (writes to feedback/hashtags collections)

Revert
- Restore client to local aggregation paths
- Remove server endpoint calls; revert docs

For Cline execution (prompt)
"""
Apply commit governance [docs:check]. Implement server-side analytics:
1) Add /analytics and /analytics/radar endpoints with aggregation and caching.
2) Update client to consume endpoints; handle loading/error states.
3) Create small commits per slice; update CHANGELOG, TODO_TIMELINE, TASK_COMPLETION_SUMMARIES; record issues in ERROR_LOG if any.
"""

Architect notes
- Consider pre-computation triggers on feedback/hashtag writes to update cached aggregates
- Caching: choose TTL based on traffic; provide manual invalidation hooks
- Security: authenticate endpoints if required; avoid exposing raw DB details

Links
- EMOCIO_CONTEXT.md (analytics definitions)
- docs/governance/TODO_TIMELINE.md (task entry and AC)
- docs/governance/CHANGELOG.md (per-change record)
- docs/governance/ERROR_LOG.md (issues)
