// Firebase modular configuration (v9+) — uses environment variables and exports modular instances
// Input: REACT_APP_FIREBASE_* env vars (see .env.local.example)
// Transformation: initializeApp with env values; export Auth/Firestore/Storage (modular APIs)
// Output: app, auth, db, storage, GeoPoint, and collection names (fbFeeds, fbHashtags)
// Assumptions:
// - .env.local is present with the provided new project values
// - Collection names default to publicEmocio/publicHashtags unless overridden by env
// - Never commit real secrets; use env vars only

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  GeoPoint,
  serverTimestamp,
  increment,
  arrayUnion
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Read config from environment (do not hard-code secrets in code)
const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
const rawBucket = (process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "").trim();
// Normalize storage bucket to <project-id>.appspot.com if misconfigured
let normalizedBucket = rawBucket;
if (!normalizedBucket && projectId) {
  normalizedBucket = `${projectId}.appspot.com`;
} else if (normalizedBucket && /firebasestorage\.app$/i.test(normalizedBucket) && projectId) {
  normalizedBucket = `${projectId}.appspot.com`;
}
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: projectId,
  // Note: storageBucket must be "<project-id>.appspot.com"
  storageBucket: normalizedBucket,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  // Optional: measurement ID if using analytics
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

// Warn in dev if any critical env values are missing
if (process.env.NODE_ENV !== "production") {
  const missing = Object.entries(firebaseConfig)
    .filter(([k, v]) => !v)
    .map(([k]) => k);
  if (missing.length > 0) {
    // eslint-disable-next-line no-console
    console.warn(
      "[Firebase Config] Missing environment variables:",
      missing.join(", ")
    );
  }
}

// Initialize modular Firebase app
export const app = initializeApp(firebaseConfig);

// Export modular instances
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storageBucketName = firebaseConfig.storageBucket || "";
export const storage = (() => {
  // Ensure we bind storage to the correct bucket (gs://<project-id>.appspot.com)
  const bucket = firebaseConfig.storageBucket;
  try {
    const instance = bucket ? getStorage(app, `gs://${bucket}`) : getStorage(app);
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn("[Firebase Storage] Bound to bucket:", bucket ? `gs://${bucket}` : "<default>");
    }
    return instance;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[Firebase Storage] Falling back to default bucket due to error:", e && e.message);
    return getStorage(app);
  }
})();

// Export helpers used throughout the app (modular equivalents of FieldValue.*)
export const FirestoreHelpers = {
  serverTimestamp,
  increment,
  arrayUnion,
  GeoPoint
};

// Collections (prefer env; default retained if not set)
export const fbFeeds = process.env.REACT_APP_FB_FEEDS || "publicEmocio";
export const fbHashtags = process.env.REACT_APP_FB_HASHTAGS || "publicHashtags";
