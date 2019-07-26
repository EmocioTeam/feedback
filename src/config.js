// import app from "firebase/app";
// import firebase from "firebase";

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASfTxXQW93Vn4PsDVial2xCMj784UZfko",
  authDomain: "feedback-65ee3.firebaseapp.com",
  databaseURL: "https://feedback-65ee3.firebaseio.com",
  projectId: "feedback-65ee3",
  storageBucket: "feedback-65ee3.appspot.com",
  messagingSenderId: "1047283803748",
  appId: "1:1047283803748:web:839cb1cd713b72e0"
};

export const fb = firebase.initializeApp(firebaseConfig);
export const fbFeeds = "publicEmocio";
export const fbHashtags = "publicHashtags";
// export const fbFeeds = "feedback";
// export const fbHashtags = "hashtags";
// const fbFeeds = "iotWorkshop";
// const fbHashtags = "iotHashtags";
