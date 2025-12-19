# 005 — Platform/Security/Operations — Storage CORS Enablement and Mode Switch

Status: Backlog

Description
Enable Firebase Storage and configure CORS for local/dev origins, then switch image mode from base64 to storage. Verify upload flows and document outcomes.

Why
- Reduce Firestore payload sizes (base64 data URLs).
- Standardize image handling via Storage with proper CORS and permissions.

Scope
- Apply CORS to bucket (gs://<project-id>.appspot.com).
- Switch REACT_APP_PICTURE_MODE=storage for environments with Storage enabled.
- Ensure uploadImg returns storage URLs; deprecate base64 fallback in production contexts.

Steps
1) CORS setup
   - Use storage-cors.json (includes localhost origins and methods GET/POST/PUT/HEAD/DELETE/OPTIONS; headers Content-Type, Authorization, x-goog-resumable, x-goog-meta-*)
   - Apply via Google Cloud Console (Storage → Bucket → CORS → Add JSON) or gsutil:
     gsutil cors set storage-cors.json gs://<project-id>.appspot.com
2) Env and config
   - Set REACT_APP_PICTURE_MODE=storage in .env.local
   - Confirm storageBucket is <project-id>.appspot.com and bound in config (gs://bucket)
3) Upload flow
   - Verify uploadImg returns getDownloadURL result (picture URL)
   - Create a feedback with an image; ensure UI renders Storage URL correctly
4) Docs and validation
   - Update README and docs/governance/TODO_TIMELINE.md with outcomes
   - Record any errors in ERROR_LOG.md with prevention notes

Acceptance Criteria
- Uploads succeed via Storage; no CORS errors observed
- Images visible under gs://bucket and via public URL (as per rules)
- App renders image URLs from Storage correctly

Risks/Dependencies
- CORS misconfiguration may block uploads
- Storage rules must allow authenticated writes; consider public read or tokenized access
- Local origins may vary (3000/3001)

Revert
- Set REACT_APP_PICTURE_MODE=base64
- Remove/adjust CORS settings in bucket if required

For Cline execution (prompt)
"""
Apply commit governance [docs:check]. Enable Storage:
1) Apply storage-cors.json to bucket via Console or gsutil; document the method used.
2) Set REACT_APP_PICTURE_MODE=storage; verify uploads; ensure UI renders Storage URLs.
3) Create small commits; update docs (README, TODO_TIMELINE), and record any errors in ERROR_LOG.
"""

Architect notes
- Keep base64 mode available for free plans/non-Storage environments
- Storage rules: authenticated write; public read only if intended (or use tokenized access)
- Consider caching layer/CDN if scale increases

Links
- EMOCIO_CONTEXT.md (image modes)
- docs/governance/TODO_TIMELINE.md (task entry and AC)
- docs/governance/CHANGELOG.md (per-change record)
- docs/governance/ERROR_LOG.md (issues)
- storage-cors.json (CORS file)
