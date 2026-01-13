# Firebase Rules — Emocio (Dev Baseline)

Purpose
- Provide a working, development-friendly rules baseline for the new Firebase project “emocio-legacy”.
- Enable current app behavior: public read of feeds/hashtags, authenticated image uploads, and user profile updates by owner.
- Document hardening recommendations for production.

Important
- Apply these in Firebase Console or via Firebase CLI (preferred) using the respective products (Firestore, Storage).
- For production, move to a least-privilege model (see “Hardening recommendations”).

Firestore Rules (Dev)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Feeds (default: publicEmocio)
    match /publicEmocio/{docId} {
      // Dev: allow public reads (maps/wall/analytics)
      allow read: if true;

      // Dev: allow creates by anyone; consider restricting to authenticated users
      allow create: if true;

      // Dev: allow update/delete only for authenticated users
      // Consider owner-based or server-side enforcement later
      allow update, delete: if request.auth != null;
    }

    // Hashtags (default: publicHashtags)
    match /publicHashtags/{docId} {
      // Dev: allow public reads
      allow read: if true;

      // Dev: allow create/update for now; tighten later
      allow create, update: if true;

      // Dev: prevent delete by clients
      allow delete: if false;
    }

    // Users
    match /users/{uid} {
      // Dev: allow reads by anyone (for stakeholder lookup), or restrict to owner as needed
      allow read: if true;

      // Only owner can write their own profile
      allow create, update: if request.auth != null && request.auth.uid == uid;

      // Prevent deletes by clients
      allow delete: if false;
    }
  }
}

Storage Rules (Dev)
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Images uploaded by users
    match /images/{fileName} {
      // Dev: public read (thumbnails in feed)
      allow read: if true;

      // Dev: only authenticated users can upload
      allow write: if request.auth != null;
    }
  }
}

How to apply using Firebase CLI
1) Install CLI and login:
   - npm i -g firebase-tools
   - firebase login

2) Initialize if needed:
   - firebase init (choose Firestore and Storage; be careful not to overwrite other project files)

3) Deploy rules:
   - Place the rules above into:
     - firestore.rules
     - storage.rules
   - Deploy:
     - firebase deploy --only firestore:rules
     - firebase deploy --only storage:rules

Notes and caveats
- Ensure your .env.local matches the new project/app identifiers.
- The app expects:
  - publicEmocio (feeds) and publicHashtags (hashtags) collections (configurable via env REACT_APP_FB_FEEDS / REACT_APP_FB_HASHTAGS)
- For image uploads, the app writes to /images/{uuid}.
- serverTimestamp() is used for timestamps; UI guards nulls while server values propagate.

Hardening recommendations (Production)
- Feeds:
  - allow read: if true (or restrict to authenticated users if needed)
  - allow create: if request.auth != null (avoid anonymous write abuse)
  - allow update/delete: only by owner or via Cloud Functions (validate ownership)
- Hashtags:
  - Make writes server-side only (Cloud Functions that increment counts on new feed creation)
  - Clients read-only (allow read: if true; allow write: if false)
- Users:
  - allow read: if request.auth != null && request.auth.uid == uid (or public only if field set to public)
  - owner-only write
- Storage:
  - Read: if true only for content intended to be public; otherwise restrict
  - Write: authenticated and optionally validate contentType, size, path patterns
- Add security tests with Firebase Emulator Suite to validate rules (recommended)

Change log snippet (to add to CHANGELOG.md)
- Date: YYYY-MM-DD
- Change: chore(firebase): add dev Firestore/Storage rules baseline; document production hardening strategy
- Files: FIREBASE_RULES_DEV.md
- Rationale: enable new project integration with minimal friction; define next steps for secure production rollout
- Revert: git rm FIREBASE_RULES_DEV.md; git commit -m "revert: remove Firebase rules doc"
