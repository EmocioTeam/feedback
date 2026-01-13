import _ from "lodash";
import { storage, storageBucketName } from "../config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v1 as uuidv1 } from "uuid";

export const uploadImg = picture => dispatch => {
  // If Storage is unavailable (free plan) or explicitly set to base64 mode,
  // return a data URL rather than uploading to Cloud Storage.
  const useBase64 =
    process.env.REACT_APP_PICTURE_MODE === "base64" || !storageBucketName;

  if (useBase64) {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(picture);
      } catch (e) {
        reject(e);
      }
    });
  }

  // Default path: upload to Firebase Storage and return a downloadable URL
  const uuid = uuidv1();
  const storageRef = ref(storage, `images/${uuid}`);
  const metadata = { contentType: picture.type };
  return uploadBytes(storageRef, picture, metadata).then(() =>
    getDownloadURL(storageRef)
  );
};

export const fetchImg = picture => dispatch => {
  const storageRef = ref(storage, `images/${picture}.png`);
  return getDownloadURL(storageRef).then(url => {
    dispatch({
      type: "fetchImg",
      payload: { uuid: picture, url }
    });
  });
};
