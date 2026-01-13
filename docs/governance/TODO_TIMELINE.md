# TODO Timeline — Emocio Project

Purpose
- Track plan/act tasks with Acceptance Criteria (AC), risks, outcomes, and links.
- Reflect the current state (Done/Obsolete/Replaced/Planned/Backlog) with “Road so far”.

Road so far (2025-12-19)
- Modular Firebase migration and new project switch via env (Done).
- Redux async fix by converting actions to thunks and adjusting App.js payload handling (Done).
- Runtime fixes: Radar empty reduces; FeedCard timestamp guards (Done).
- Image upload base64 fallback (REACT_APP_PICTURE_MODE) implemented for environments without Storage (Done).
- Governance updated: .clinerules rules/workflow (no-branch commit gating, Docs-Checklist, ask-to-merge approval), and backlog runbook (Done).
- Workspace relocation to C:\farolabs\emocio-legacy; VS Code ENOENT noted for desktop/OneDrive stale refs (Planned resolution logged below).

Legend
- Status: Done | Obsolete | Replaced | Planned | Backlog
- Links: CHANGELOG entry dates, ERROR_LOG IDs, commit SHAs (post-commit), docs references

Tasks

ID: T-Firebase-Modular
Status: Done
Description: Migrate to Firebase modular SDK, switch to new project via env vars.
Why: Modernize and decouple from compat; align with new Firebase project.
Steps:
- Update src/config.js and action modules to modular APIs
- Update App.js to delegate to thunks
AC:
- App runs at localhost with Firebase modular APIs; no compat imports
- Core routes render without runtime errors
Risks:
- API mismatches; environment config issues
Outcome:
- Completed; see CHANGELOG 2025-12-19
Links:
- CHANGELOG: 2025-12-19
- ERROR_LOG: E-20251219-01, E-20251219-02

ID: T-UI-Stability
Status: Done
Description: Fix radar reduce and timestamp guards
AC:
- No reduce-of-empty errors; radar shows defaults when filtered
- FeedCard renders timestamps safely
Outcome:
- Completed; guards added
Links:
- CHANGELOG: 2025-12-19
- ERROR_LOG: E-20251219-03, E-20251219-04

ID: T-Upload-Fallback
Status: Done
Description: Implement base64 upload fallback for environments without Storage
Steps:
- uploadImg returns data URL in base64 mode; AddFeedback consumes URL directly
- .env.local/example include REACT_APP_PICTURE_MODE
AC:
- Upload works without Storage or CORS
Risks:
- Larger Firestore payloads; consider size limits
Outcome:
- Completed; fallback working
Links:
- CHANGELOG: 2025-12-19
- ERROR_LOG: E-20251219-07, E-20251219-08

ID: T-Governance-No-Branch
Status: Done
Description: Enforce commit naming/description segregation; Docs-Checklist; ask-to-merge gate
AC:
- .clinerules rules/workflow updated
- Backlog runbook added
Outcome:
- Completed; policy encoded
Links:
- .clinerules/CLINE_RULES.md, .clinerules/CLINE_WORKFLOW.md
- backlog/commit-governance-and-approval.md

ID: T-Workspace-Relocation-Fix
Status: Planned
Description: Resolve VS Code ENOENT and document workspace relocation
Why:
- Error: ENOENT accessing C:\Users\<USER>\Desktop due to stale refs; active repo path moved
Steps:
- Add .vscode/settings.json excludes for user profile/OneDrive/desktop
- Update README Workspace instructions
- Log ERROR_LOG entry E-20251219-09 with Prevention notes
AC:
- VS Code opens and operates without ENOENT; correct workspace loaded
Risks:
- Over-exclusion in VSCode settings; maintain repo-search visibility
Links:
- ERROR_LOG: E-20251219-09
- STABILIZATION_README “Known Issues”

ID: T-Mapbox-Guard
Status: Planned
Description: Read REACT_APP_MAPBOX_TOKEN; warn if missing; doc setup
Steps:
- EmotionMap renders warning banner if token empty
- README and .env.local.example document token acquisition/setup
AC:
- Map renders when token is set; no crashing if missing
Risks:
- Token misconfiguration
Links:
- README setup section

ID: T-Docs-Reorg
Status: Planned
Description: Move governance docs into docs/ and update README links
Steps:
- git mv STABILIZATION_README.md, TODO_TIMELINE.md, CHANGELOG.md, ERROR_LOG.md, FIREBASE_RULES_DEV.md into docs/governance
- Update README to link to new paths
AC:
- Docs consistently accessible under docs/ with master README index
Risks:
- Broken links if not updated
Links:
- STABILIZATION_README, TODO_TIMELINE, CHANGELOG, ERROR_LOG, FIREBASE_RULES_DEV

ID: T-Personas-Verify
Status: Planned
Description: Validate personas (Anonymous/Authenticated/Stakeholder)
Steps:
- Ensure users/{uid} exists on sign-in; stakeholder highlighting works
- Smoke test flows across personas
AC:
- Stakeholder comments visually distinguished; flows verified
Risks:
- Inconsistent hydration if user doc missing
Links:
- README personas section

ID: T-Storage-CORS
Status: Backlog
Description: If Storage is enabled later, apply CORS and switch mode to “storage”
Steps:
- Apply storage-cors.json via Console/gsutil
- Switch REACT_APP_PICTURE_MODE=storage
AC:
- Uploads to Storage work without CORS errors
Risks:
- Misconfigured CORS or bucket
Links:
- storage-cors.json runbook in docs/runbooks (to be added)

Next Best Actions
- Implement Mapbox token guard and README guidance
- Reorganize governance docs under docs/ and update links
- Add .vscode/settings.json excludes; log workspace ENOENT with Prevention
- Validate flows; update summaries and timeline with outcomes

Revert Notes
- Docs changes can be reverted via git restore; moved files via git mv back
- EmotionMap guard and env example can be restored to prior revision
- Always include revert commands in commit bodies per .clinerules
