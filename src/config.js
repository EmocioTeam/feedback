// import app from "firebase/app";
import firebase from "firebase";


require('firebase/auth');
require('firebase/database');

//var firebase = require('firebase/app');
// Required for side-effects
require("firebase/firestore");

/**
 * Firebase configuration
 * Input: environment variables (REACT_APP_FIREBASE_*) or legacy constants below as fallback.
 * Transformation: prefer process.env values to avoid committing secrets; keep fallback only for Phase 0 stabilization.
 * Output: firebaseConfig object used to initialize Firebase app.
 *
 * Assumptions:
 * - .env.local is provided for local runs. Fallback values remain temporarily for stabilization and must be rotated and removed in Phase 2.
 */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyASfTxXQW93Vn4PsDVial2xCMj784UZfko",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "feedback-65ee3.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://feedback-65ee3.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "feedback-65ee3",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "feedback-65ee3.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "1047283803748",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:1047283803748:web:839cb1cd713b72e0"
};

var fbb = firebase.initializeApp(firebaseConfig);
export const fb = fbb
// Collections (phase 0): prefer env with fallback; remove fallback in Phase 2.
export const fbFeeds = process.env.REACT_APP_FB_FEEDS || "publicEmocio";
export const fbHashtags = process.env.REACT_APP_FB_HASHTAGS || "publicHashtags";
// export const fbFeeds = "designClub";
// export const fbHashtags = "designClubHashtags";
// export const fbFeeds = "august";
// export const fbHashtags = "augustHashtags";
//export const fbFeeds = "feedback";
//export const fbHashtags = "hashtags";
