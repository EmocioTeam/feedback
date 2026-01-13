# Emocio
“Share your emotions.. feels nice.” — Turutupa, 2019

Emocio is a lightweight social feedback application where users:
- Post emotions with mood categorization, text, hashtags, optional image, and optional geolocation.
- Browse a real-time wall and a geospatial map view of emotions.
- Interact with posts via comments and reactions.
- Explore analytics with totals, top emotion/hashtag, and radar charts for selected hashtags.

Demo
- https://www.emocio.io (legacy link; may be offline)

Motivation
- “Share your emotions.. feels nice.” This captures Emocio’s ethos: quick, simple expression and collective insight. The UX emphasizes low-friction posting and immediate visualization (wall/map/analytics) to promote lightweight participation and discovery.

Tech Stack
- Frontend: React 16, Redux, Thunk, React Router 5
- Data/Realtime: Firebase (Auth, Firestore, Storage)
- Maps: Mapbox GL via react-mapbox-gl
- UI/Charts: React Bootstrap, Chart.js, Recharts, ApexCharts
- Build: react-scripts 3.4.x
- Deployment: Cloud Foundry staticfile buildpack (serves build/)

Prerequisites
- Node 14.15.4 and npm 6.14.10 (as per package.json engines)
- Firebase project (Firestore, Auth, Storage)
- Mapbox access token
- Optional: Cloud Foundry CLI for CF deployments

Getting Started (Local)
1) Install dependencies
- npm install
2) Configure environment
- Recommended: use environment variables via .env.local
  - REACT_APP_FIREBASE_API_KEY=your-key
  - REACT_APP_FIREBASE_AUTH_DOMAIN=your-domain
  - REACT_APP_FIREBASE_DATABASE_URL=your-db-url
  - REACT_APP_FIREBASE_PROJECT_ID=your-project-id
  - REACT_APP_FIREBASE_STORAGE_BUCKET=your-bucket
  - REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
  - REACT_APP_FIREBASE_APP_ID=your-app-id
  - REACT_APP_MAPBOX_TOKEN=your-mapbox-token
- Legacy (not recommended): hard-code values in src/config.js and src/components/EmotionMap.js. Do not commit secrets.
3) Start the app
- npm start (http://localhost:3000)

Build
- npm run build (outputs build/)

Deployment (Cloud Foundry example)
- Ensure build/ is present (npm run build).
- manifest.yml serves build/ via staticfile buildpack:
  - name: feedbackapp
  - path: build
  - memory: 256M
  - buildpack: staticfile_buildpack
- Deploy: cf push

Core Features
- Create Feedback: select mood, write comment, add hashtags; optional image (auth required) and geolocation.
- Realtime Wall: live updates ordered by timestamp; hashtag filtering; lazy loading.
- Map View: mood-specific markers; click to preview card; centers on user location (fallback defaults).
- Analytics: totals, comments count, top emotion, top hashtag; radar chart per selected hashtags.
- Reactions & Comments: mood-based reactions; 140-char comment limit; stakeholder comments highlighted.

Architecture Overview
- Routing and Pages (src/App.js):
  - /add-feed, /add-feed/:hashtag, /feed-page (Wall/Map tabs), /analytics, /profile; root redirects to /add-feed.
  - Bottom navigation: Feed (/feed-page), Add (/add-feed), Results (/analytics).
- State:
  - Redux store with thunk (src/index.js).
  - Reducers (src/reducers/*): auth, feed, hashtags, feedWithLocation, lastFeed, feedPageTab, radarChartData, feedCardImg, defaultHashtag, hideKeyboard.
  - Actions (src/actions/firebaseActions.js): auth listener; realtime feed via Firestore onSnapshot; hashtag list; CRUD for comments/reactions.
- Config and Collections:
  - src/config.js initializes Firebase; defaults: fbFeeds="publicEmocio", fbHashtags="publicHashtags".
  - users collection: stakeholder flag used to highlight comments.
- Maps:
  - src/components/EmotionMap.js uses react-mapbox-gl and requires access token.

Data Model (Simplified)
- Feedback: id, author?, comment, mood, hashtags[], location?(GeoPoint), picture?, reactions{mood:count}, comments[], timestamp(server).
- Comment: timestamp, comment, author? { name?, stakeholder? }.
- Hashtag: id (#Tag), count, moods{mood:count}.
- User: uid, displayName?, email?, stakeholder?.

Validation and Business Rules
- Hashtags normalized to ensure # prefix and alphanumerics.
- Comment length: 140 characters max.
- Image uploads require authenticated user.
- Server-side timestamps used for ordering.

Scripts
- start: react-scripts start
- build: react-scripts build
- test: react-scripts test
- eject: react-scripts eject

Troubleshooting
- Ensure Node 14.15.4 and npm 6.14.10 to avoid react-scripts issues.
- If map is blank: verify Mapbox token and that your token is injected (env or source).
- If realtime updates fail: check Firestore rules and FieldValue.serverTimestamp usage.
- If image upload fails: ensure auth status and Storage rules for authenticated writes.
- If hashtags list is empty: validate fbHashtags collection and increment logic on create.

Privacy, Security, and Compliance
- Geolocation is opt-in; store minimal PII.
- Sanitize and safely linkify user inputs to avoid XSS.
- Do not commit secrets; prefer environment variables and key rotation.

Contributing and Coding Standards
- Keep components small; document assumptions inline.
- Document functions with input, transformation, and output.
- Optimize code paths if unit tests exceed 100ms.
- Commit with detailed changelogs identifying author (human vs automation).

Project Structure (Key Paths)
- src/App.js — routing and handlers (add/delete/comment/react).
- src/index.js — Redux store/bootstrap.
- src/config.js — Firebase init and collections.
- src/actions/firebaseActions.js — auth, realtime, CRUD, aggregations.
- src/containers/AddFeedback.js — creation UI and flows.
- src/containers/FeedPage.js — wall/map with filters.
- src/components/EmotionMap.js — Mapbox layers/markers.
- src/components/FeedCard.js — card UI, reactions, comments.
- src/containers/Results.js — analytics/radar.
- public/emojii/*, public/img/* — assets.
- manifest.yml — CF deployment.

Roadmap (Selected)
- Pagination and server-side hashtag filtering.
- Marker clustering at scale.
- Rich link previews.
- Moderation and role-based access.
- Server-side analytics/caching.

License
- See LICENSE.

Stabilization and Modernization Plan (2025)

Objectives and principles
- Stabilize-first: run the legacy app locally with the smallest possible code/dep changes.
- Security and sanitization: move secrets to env; avoid committing sensitive data; document rotation.
- Incremental modernization: small, focused PRs with clear revert paths.
- Documentation-first: every change is recorded with rationale, files touched, and revert instructions.
- Test guardrails: add light smoke tests/manual checklists before major refactors.

Phase 0 — Stabilize (minimal changes to run locally)
- Why: unblock local development quickly; reduce risk by limiting scope of change.
- Tasks:
  - Remove grpc dependency (native build failures; unnecessary for browser app).
  - Install/run with matching Node/npm or set legacy peer deps:
    - Preferred: Node 14.15.4 and npm 6.14.10 (per engines) to match CRA 3.4.x.
    - Alternative: Modern Node with npm config set legacy-peer-deps=true (transitional only).
  - Environment fallbacks:
    - src/config.js: read Firebase config from process.env with a temporary fallback to existing values (inline security notes).
    - src/components/EmotionMap.js: use process.env.REACT_APP_MAPBOX_TOKEN with a temporary fallback (inline security notes).
  - OneDrive mitigation: pause sync or use a non-synced path to avoid file locking during install.
- Acceptance criteria:
  - npm install completes without native module errors.
  - npm start runs at http://localhost:3000; core routes work: /add-feed, /feed-page (Wall/Map), /analytics.
- Revert:
  - Each commit includes revert instructions. Typical: git revert <sha> or git restore <files>.

Phase 1 — Guardrails (baseline behavior capture)
- Add a smoke test checklist (and/or light automated tests):
  - Add Feedback flow (mood, comment, hashtags, image if auth, geolocation).
  - Wall updates in real time; hashtag filtering.
  - Map markers show and card opens on click; centers properly.
  - Analytics totals, top emotion/hashtag, radar chart populate.
- Document outcomes in STABILIZATION_README.md.

Phase 2+ — Modernization tracks (iterative)
- Track A: Router v5 → v6
  - Replace Switch with Routes; Route render/component → element; Redirect → Navigate; update route props usage.
- Track B: Firebase 8 → 10 modular API
  - initializeApp, getFirestore/getAuth/getStorage; use addDoc/updateDoc/onSnapshot/serverTimestamp/increment/arrayUnion/GeoPoint.
- Track C: Maps stack refresh
  - Replace react-mapbox-gl with react-map-gl + mapbox-gl 2.x (or MapLibre); rewrite EmotionMap with <Map/> and <Marker/>.
- Track D: Tooling upgrade
  - Option 1: CRA 5.0.1; Option 2: migrate to Vite; bump React to 18; update redux/react-redux/tooling.
- Track E: Library cleanups/replacements
  - uuid 3 → 9 (import { v4 as uuidv4 } from 'uuid'); react-linkify → linkify-react; react-images-upload → react-dropzone; react-with-gesture → @use-gesture/react; react-lazy-load → react-intersection-observer or native lazy; rationalize charting to one library (Recharts 2.x recommended).
- Each track ships as a separate PR with:
  - API diffs and code changes
  - Updated README and TODO_TIMELINE.md
  - CHANGELOG.md entry with files touched and rationale
  - Revert instructions

Governance and documentation
- STABILIZATION_README.md (live operational log)
  - Scope, environment, risks, status table, revert instructions.
- TODO_TIMELINE.md (plan and act task timeline)
  - Task IDs (T-XXX), Description, Why, Steps, Acceptance Criteria, Risks, Dependencies, Owner, Outcome, Links (commit SHA, CHANGELOG entry).
- CHANGELOG.md (per-change log)
  - Date, Commit SHA, files touched, rationale, revert instructions.
- ERROR_LOG.md (error knowledge base)
  - ID, Timestamp, Environment, Action, Error summary, Log excerpts, Analysis, Resolution steps, Status, Links, Revert.
- TASK_COMPLETION_SUMMARIES.md (task completion summaries)
  - Per task, capture a concise summary and “explain changes” details, AC verification, and links (commits, CHANGELOG, TODO_TIMELINE, ERROR_LOG), with revert instructions.
- Project Brain — Cline Memory Bank
  - Persist key context, decisions, dependency maps, and common remedies for rapid retrieval in future tasks.
- Documentation formatting pass
  - At each task completion and substantive documentation change, reformat for readability: prefer narrative paragraphs; use bullets only for checklists and clear enumerations; avoid deep nesting; normalize headings and cross-links.

Mapbox Setup
- Obtain a Mapbox access token at https://account.mapbox.com/
- Add the token to your .env.local file:
  - REACT_APP_MAPBOX_TOKEN=your-mapbox-token
- Behavior when missing:
  - The app will show a non-blocking warning banner in the map view indicating that REACT_APP_MAPBOX_TOKEN is not set.
  - A temporary fallback token remains only for Phase 0 stabilization and should be removed/rotated in later phases.

Security notes
- Prefer environment variables for Firebase and Mapbox; rotate any previously exposed keys.
- Keep .env.local out of VCS; use .env.local.example as a template.

Revert policy
- Every commit/PR must include “Run-this-to-revert” steps in CHANGELOG.md.
- Use git revert <sha> to back out changes; keep stabilization branch separate from main during Phase 0.
