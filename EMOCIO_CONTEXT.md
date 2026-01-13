# Emocio Feedback App — Comprehensive Context and Reproduction Guide

This document captures the full context of the Emocio feedback application to enable stack-agnostic reproduction. It distills requirements, user flows, data models, page structure, integrations, and operational guidance into a single source-of-truth. Use it to rebuild or extend the application in any technology stack.

## 1. Executive Summary

Emocio is a lightweight social feedback application where users:
- Post emotions with mood categorization, text, hashtags, optional image, and optional geo-location.
- Browse a real-time “wall” of feedback and a geospatial “map” view of emotions.
- Interact with posts by adding comments and reactions (emoji-like counters).
- Explore analytics showing aggregated counts, top emotions, and top hashtags, with radar-style charts for selected hashtags.

The current implementation uses React + Redux on the front-end and integrates with Firebase (Auth, Firestore, Storage) and Mapbox GL for maps. Deployment is configured via a static buildpack manifest.

This document abstracts these into stack-agnostic requirements and models, and documents the original implementation for context.

Modernization Overlay (2025-12-19)
- Frontend/Tooling: React 18 and CRA 5 baseline with Redux + Thunk; React Router 5 currently (Router v6 migration planned).
- Firebase: Modular SDK (Auth, Firestore, Storage). Image uploads support an environment-controlled mode:
  - REACT_APP_PICTURE_MODE=base64 (default for environments without Storage/CORS) — images are embedded as data URLs.
  - storage mode (future) — uploads to Firebase Storage; requires CORS setup and Storage plan.
- Maps: react-mapbox-gl with a Mapbox token guard. When REACT_APP_MAPBOX_TOKEN is not set, the app renders a non-blocking warning.
- Governance and Documentation: Operational docs centralized under docs/governance (CHANGELOG, ERROR_LOG, STABILIZATION_README, TODO_TIMELINE, FIREBASE_RULES_DEV). See docs/README.md for index.
- Personas: Anonymous (no image uploads), Authenticated (image uploads permitted), Stakeholder (comments highlighted; metadata via users/{uid}).
- Links:
  - Governance index: docs/README.md
  - Stabilization log: docs/governance/STABILIZATION_README.md
  - Timeline: docs/governance/TODO_TIMELINE.md
  - Error KB: docs/governance/ERROR_LOG.md
  - Rules (dev baseline): docs/governance/FIREBASE_RULES_DEV.md
  - Original context backup (tech stack updated only): docs/governance/EMOCIO_CONTEXT.backup.md

---

## 2. Key Objectives and Use Cases

- Post emotional feedback quickly and intuitively with mood selection cards.
- Tag feedback with hashtags for discoverability.
- Optionally attach an image (requires authentication).
- Optionally attach location (geo point).
- View a live, real-time feed and filter by hashtags.
- View emotions on a city/world map per mood, click markers to see post details.
- Interact through comments (limited to 140 chars) and mood-based reactions.
- View analytics: totals, top emotion, top hashtag, comments count, radar chart per selected hashtags.

---

## 3. Terminology

- Feedback/Emocio: A post created by a user describing their emotion.
- Mood: The emotion category (Happy, Excited, Bored, Frustrated, Sad).
- Hashtag: A tag string prefixed by `#` used to categorize feedback.
- Reaction: A mood-specific counter increased when users “like” via emoji palette.
- Stakeholder: A special flag on comment author indicating stakeholder status (UI highlights such comments).
- Radar Chart: A visualization showing mood distributions for selected hashtags.
- Wall: The scrolling list of emotions.
- Map: Geospatial visualization of emotions filtered and rendered by mood.

---

## 4. Functional Requirements (Stack-Agnostic)

4.1 Feedback Creation
- Select mood from a predefined set.
- Enter comment text (multi-line allowed).
- Enter hashtags (normalize to ensure `#` prefix and alphanumeric only).
- Optionally attach a single image; uploading requires authenticated user.
- Optionally attach geo-location (latitude, longitude).
- Record server-side timestamp at creation.

4.2 Hashtag Aggregation
- Maintain per-hashtag counts.
- Maintain per-hashtag mood distribution counters (e.g., moods["Happy"]++, moods["Sad"]++).
- Support retrieval of hashtag list sorted by overall count.

4.3 Real-Time Feed
- Provide live updates for newly added or modified feedback.
- Display wall of posts with mood ribbon/color, hashtags, text (linkified), timestamp.
- Allow filtering by selected hashtags.
- Lazy loading or infinite scrolling to load more posts.

4.4 Map View
- Display markers for feedback with location.
- Group markers by mood for icon differentiation.
- Clicking a marker shows a compact post card overlay.

4.5 Interactions
- Add comment to a post (limit 140 characters).
- Comments include timestamp and optional author metadata (name, stakeholder flag).
- Add reaction to a post; reaction increments a counter by reaction type.

4.6 Analytics
- Compute and display:
  - Total number of Emocios (feedback posts)
  - Total number of comments
  - Top emotion by occurrence
  - Top hashtag by count
- Radar chart visualization for selected hashtags showing mood distributions.

4.7 Authentication
- Detect authentication state.
- Fetch user record to determine `stakeholder` flag.
- Require authentication to upload images; warn otherwise.

---

## 5. Non-Functional Requirements

- Performance: Real-time feed updates should be responsive; lazy loading to reduce initial payload.
- Scalability: Data model supports aggregation and filtering; map view should handle reasonable marker volumes.
- Usability: Mobile-first bottom navigation, simple input flows, linkified comments.
- Accessibility: Basic keyboard navigation, readable contrast, avoid crucial information conveyed by color alone where possible.
- Privacy: Geolocation optional; image upload requires auth; avoid storing sensitive PII beyond what’s necessary.
- Security: Validate inputs (hashtags normalization), enforce auth for sensitive actions (image uploads), server timestamps to avoid spoofing.

---

## 6. Information Architecture and Navigation

Routes (Canonical):
- `/add-feed` — Add Feedback page (mood deck + comment modal)
- `/add-feed/:hashtag` — Pre-populates default hashtag.
- `/feed-page` — Wall and Map tabs (toggle via header nav tabs).
- `/analytics` — Analytics dashboard.
- `/profile` — Profile page (exists in codebase; implementation may be minimal).
- Root `/` redirects to `/add-feed`.

Bottom Navigation (Fixed, mobile-first):
- Feed (links to `/feed-page/`)
- Add (+) (links to `/add-feed/`)
- Results (links to `/analytics/`)

Header Tab Toggle (on `/feed-page`):
- Wall
- Map

---

## 7. Data Model (Stack-Agnostic)

7.1 Entities

Feedback
- id: string (generated)
- author: string | null
- comment: string
- mood: enum {Happy, Excited, Bored, Frustrated, Sad}
- hashtags: string[] (each like `#Tag`)
- location: { latitude: number, longitude: number } | null
- picture: url string | null
- reactions: { [reactionName: string]: number } // reactionName typically equals mood names
- comments: Array<Comment>
- timestamp: server timestamp (milliseconds or ISO string)

Comment
- timestamp: number | ISO string
- comment: string
- author?: { name?: string, stakeholder?: boolean }

Hashtag
- id: string // e.g., "#Lisbon"
- count: number
- moods: { [moodName: string]: number } // counts per mood

User (for stakeholder flag)
- id: string (auth uid)
- displayName?: string
- email?: string
- stakeholder?: boolean

7.2 Derived/Computed
- Top Emotion: mood with highest aggregated count across all feedback.
- Top Hashtag: highest `count`.
- Comments Count: sum of all comment arrays lengths.
- Radar Chart Dataset: per selected hashtags: mood distributions.

7.3 Indexing and Query Considerations
- Feedback ordered by timestamp desc.
- Hashtags list fetched and sorted by count.
- Map queries filter feedbacks with location present.

---

## 8. Core Workflows

8.1 Create Feedback
- User selects mood from deck.
- User enters comment and hashtags; client normalizes hashtags:
  - Strip non-alphanumeric, ensure leading `#`.
- Optional image upload:
  - If authenticated: upload image, retrieve URL, attach to feedback.
  - If unauthenticated: show alert; skip image.
- Optional geolocation:
  - If allowed: attach coordinates; else set null.
- Persist feedback with server timestamp.
- Update hashtag aggregation: increment total and mood-specific counters.
- Show success alert and refresh hashtag list.

8.2 Comment on Feedback
- Ensure comment length <= 140.
- If user is authenticated, include author name (or default fallback) and stakeholder flag if present.
- Persist comment appended to feedback.comments.
- Reset UI input state.

8.3 React to Feedback
- Increment `reactions[reactionType]` by 1 for the selected reaction.

8.4 Wall Browsing and Filtering
- Real-time snapshot feed shows newest first.
- Filter by selection from SearchBar; display only posts whose hashtags include any selected hashtags.
- Lazy load adds more posts progressively.

8.5 Map Exploration
- Render mood-specific layers/icons.
- Filter feed entries with location; create markers.
- Clicking marker opens contextual card overlay.
- Map center defaults to user coords if available; otherwise a default location.

8.6 Analytics
- Compute totals and top categories.
- Build radar datasets from selected hashtags and current feed.
- Reset radar datasets on unmount.

---

## 9. External Integrations

- Authentication: Firebase Auth
- Database: Firestore (collections referenced via string config)
- Storage: Firebase Storage for images
- Geolocation: Browser geolocation and Firestore GeoPoint
- Maps: Mapbox GL (requires access token)
- UI Libraries: React Bootstrap, Recharts/ApexCharts, React Spring, Linkify

---

## 10. Configuration and Secrets

Note: Replace with your own secrets in production.

Firebase (example from original code)
- apiKey
- authDomain
- databaseURL
- projectId
- storageBucket
- messagingSenderId
- appId

Firestore Collections (as constants)
- fbFeeds: default "publicEmocio"
- fbHashtags: default "publicHashtags"
- users: "users"

Mapbox
- accessToken used by mapbox-gl/react-mapbox-gl.

Deployment Manifest (Cloud Foundry)
- `manifest.yml`:
  - name: feedbackapp
  - path: build
  - buildpack: staticfile_buildpack
  - memory: 256M

Engines (original implementation)
- Node: 14.15.4
- npm: 6.14.10

---

## 11. Validation and Business Rules

- Hashtags normalization:
  - Ensure `#` prefix.
  - Remove non-alphanumeric characters (per original regex).
- Comments length: maximum 140 chars; new lines limited for UI height.
- Image uploads: only authenticated users; else show alert.
- Timestamps: server-side authoritative timestamp.

---

## 12. UI and Styling Cues

- Mood emoji representation card background with mood color.
- Stakeholder comments highlighted with a distinct background color.
- Bottom navbar fixed; icons for Feed/Add/Results; active route dims non-selected icons.
- FeedCard displays mood badge, hashtags badges, author, comment (linkified), and timestamp.
- Overlay popover for reactions palette using mood-specific emoji icons.
- Lazy load button text switches when no more posts are available.

---

## 13. Analytics Definitions

- Total Emocios: Count of feedback documents.
- Comments Count: Sum of all comments across feedback.
- Top Emotion: Mood with the highest total occurrence in feedback.
- Top Hashtag: Highest count in hashtags collection.
- Radar Chart: For selected hashtags, display distributions across moods.

---

## 14. Stack-Agnostic Reproduction Blueprint

14.1 Choose Platform
- Front-end: Any SPA or server-rendered framework (e.g., React/Vue/Svelte/Angular, or mobile).
- Backend: Any REST/GraphQL server or BaaS (e.g., Firebase, Supabase, Node/Express, Python/FastAPI).
- Storage: Document DB (Firestore/Mongo) or relational DB (Postgres/MySQL).
- Maps: Mapbox GL, Leaflet, Google Maps.

- Auth: OAuth provider, custom auth, or BaaS auth.

14.2 Endpoints / Operations
- POST /feedback
  - Input: { author?, comment, mood, hashtags[], location?, picture? }
  - Behavior: persist with server timestamp; update hashtag counters.
- GET /feedback?orderBy=timestamp&desc=true&limit=N
- GET /feedback/stream (server-sent events or websocket for real-time)
- POST /feedback/:id/comment
  - Input: { comment, author? }
- POST /feedback/:id/react
  - Input: { reactionType }
- GET /hashtags
  - Output: sorted by count; include mood distributions.
- GET /analytics
  - Output: totals, top emotion, top hashtag, comments count.
- GET /analytics/radar?hashtags=H1,H2
  - Output: per-hashtag mood distributions.

14.3 Data Schemas
- Match the entities in Section 7. Ensure indexes on timestamp and hashtags.

14.4 Permissions
- Anonymous posting allowed except image upload.
- Image upload requires authenticated user.
- Comments and reactions allowed for anonymous users (optional setting).
- Stakeholder flag controlled via user record.

14.5 Client Flows
- Mood selection -> comment -> hashtags -> optional image -> optional geolocation -> submit.
- Filter UI for hashtags; lazy loading for feed.
- Map view toggling; marker click shows overlay card.
- Analytics dashboard computed client/server side.

14.6 Deployment
- Build static assets and serve via CDN or static host.
- Backend deploy on PaaS/IaaS with SSL.
- Environment variables for secrets (Firebase keys, map tokens).

---

## 15. Security, Privacy, and Compliance

- Sanitize user inputs (especially hashtags and comments).
- Prevent XSS by escaping output; linkify safely.
- Limit sensitive data collection; geolocation must be opt-in.
- Store authentication state securely; enforce permissions on server side.
- Use server timestamps; never trust client time for ordering.

---

## 16. Accessibility and Internationalization

- Provide alt text for images.
- Ensure sufficient contrast for mood-themed colors.
- Support keyboard navigation for reactions and comment inputs.
- Consider translations for mood names, UI labels, and messages.

---

## 17. Known Implementation Details (Original Codebase)

- Front-end: React 16.14, Redux, Thunk, React Router 5.
- UI: React Bootstrap, Linkify, React Lazy Load.
- Charts: Chart.js/Recharts/ApexCharts used in various components.
- Maps: React Mapbox GL with hard-coded access token.
- Backend: Firebase (Firestore, Auth, Storage).
- Real-time: Firestore snapshot listeners.
- Deployment: Cloud Foundry static buildpack via `manifest.yml`.
- Node/npm versions pinned in `package.json` engines.

Core modules:
- App.js: Routing and core handlers for add/delete/comment/react.
- config.js: Firebase init and collection names.
- firebaseActions.js: Auth state, listeners, CRUD, aggregation fetches.
- containers/AddFeedback.js: Mood deck, comment modal, image upload, geolocation.
- containers/FeedPage.js: Wall/Map UI, hashtag filter, lazy load.
- components/EmotionMap.js: Map layers and markers per mood; click to show FeedCard.
- components/FeedCard.js: Card UI, reactions popover, comment form, stakeholder highlight.
- containers/Results.js: Analytics UI, radar chart selections.
- Navigation: containers/Navbar.js with bottom nav.

Assets:
- public/emojii/*.svg; public/img/*.jpeg for mood icons and thumbnails.

---

## 18. Edge Cases and Considerations

- Comments over 140 chars should be blocked; UI alerts and textarea line limits.
- Linkify may produce unexpected links; ensure safe handling and rel attributes.
- Geolocation not available: default map center applied; location remains null in feedback.
- Hashtag normalization should handle empty strings and duplicates.
- Reaction increments should be atomic on server side to prevent race conditions.
- Real-time listener handling of modified/added/removed should be robust; ensure client state reconciliation.

---

## 19. Future Enhancements

- Pagination and server-side filtering by hashtags.
- Clustered map markers for high-density areas.
- Rich media previews for links in comments.
- User profiles with history and preferences.
- Moderation tools for inappropriate content.
- Role-based access (admin/stakeholder).
- Server-side analytics and caching for performance.

---

## 20. Runbook and Operations (Original Implementation)

- Development
  - Install dependencies; ensure Node 14.x, npm 6.x.
  - Configure Firebase project and Mapbox token in environment variables or config.
  - Run `npm start` (React Scripts 3.4.4).

- Build
  - `npm run build` creates static assets in `build/`.

- Deploy (Cloud Foundry example)
  - Ensure `manifest.yml` is configured.
  - Push app with staticfile buildpack; serve `build` directory.

- Configuration
  - Update Firebase keys in `src/config.js`.
  - Update Mapbox token in `src/components/EmotionMap.js`.

---

## 21. Appendix: Repository Structure (Key Files)

- `src/App.js` — routing and core handlers
- `src/index.js` — Redux store and bootstrapping
- `src/config.js` — Firebase init and collections
- `src/actions/firebaseActions.js` — auth, realtime, CRUD, aggregation
- `src/containers/AddFeedback.js` — creation UI
- `src/containers/FeedPage.js` — wall/map
- `src/components/EmotionMap.js` — Mapbox layer and markers
- `src/components/FeedCard.js` — card UI, reactions, comments
- `src/containers/Results.js` — analytics dashboard
- `src/reducers/*` — state slices (auth, feed, hashtags, radarChart, etc.)
- `public/emojii/*.svg`, `public/img/*.jpeg` — assets
- `manifest.yml` — CF static deployment config
- `package.json` — dependencies and scripts

---

## 22. Acceptance Criteria

- Users can submit feedback with mood, comment, hashtags; optional image and location.
- Hashtags increment counts and mood distributions accurately.
- Wall updates in real time and supports hashtag filtering.
- Map view displays mood-specific markers and supports details overlay on click.
- Users can comment with enforcement of 140-character limit.
- Reactions increment counters per type and display correctly.
- Analytics page shows totals, top emotion/hashtag, comments count, and radar chart per selected hashtags.

---

## 23. Final Notes

This document is intentionally stack-agnostic while referencing the original implementation for clarity. It should enable a team to re-implement Emocio in any chosen stack while preserving functionality and user experience.
