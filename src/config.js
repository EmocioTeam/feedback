// import app from "firebase/app";
import firebase from "firebase";


require('firebase/auth');
require('firebase/database');

//var firebase = require('firebase/app');
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

var fbb = firebase.initializeApp(firebaseConfig);
export const fb = fbb
//export const fbFeeds = "publicEmocio";
//export const fbHashtags = "publicHashtags";
 export const fbFeeds = "designClub";
 export const fbHashtags = "designClubHashtags";
//export const fbFeeds = "august";
//export const fbHashtags = "augustHashtags";
//export const fbFeeds = "feedback";
//export const fbHashtags = "hashtags";

