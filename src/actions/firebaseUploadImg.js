import _ from "lodash";
import firebase from "firebase";
import { fb } from "../config";
import { fbFeeds, fbHashtags } from "../config";
import { v1 as uuidv1 } from "uuid";
const db = fb.firestore();
const users = "users";

export const uploadImg = picture => dispatch => {
  const uuid = uuidv1();
  const storageRef = firebase.storage().ref(`images/${uuid}`);

  const metadata = {
    contentType: picture.type
  };

  return storageRef.put(picture);
};

export const fetchImg = picture => dispatch => {
  // Create a reference with an initial file path and name
  var storage = firebase.storage().ref();
  storage
    .child(picture + ".png")
    .getDownloadURL()
    .then(function(url) {
      dispatch({
        type: "fetchImg",
        payload: { uuid: picture, url }
      });
    });
};
