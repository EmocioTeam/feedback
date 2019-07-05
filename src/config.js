// import app from "firebase/app";
// import firebase from "firebase";

const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuiOSUU4jHaJ8asNraba3FZgc1kR-R0dY",
  authDomain: "feedback-65ee3.firebaseapp.com",
  databaseURL: "https://feedback-65ee3.firebaseio.com",
  projectId: "feedback-65ee3",
  storageBucket: "feedback-65ee3.appspot.com",
  messagingSenderId: "1047283803748",
  appId: "1:1047283803748:web:839cb1cd713b72e0"
};

export const fb = firebase.initializeApp(firebaseConfig);

// class Firebase {
//   constructor() {
//     app.initializeApp(config);
//   }
// }

// export default Firebase;
