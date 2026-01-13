import _ from "lodash";
import { auth, db, FirestoreHelpers } from "../config";
import { fbFeeds, fbHashtags } from "../config";
import { onAuthStateChanged as firebaseOnAuthStateChanged, signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword, signOut as firebaseSignOut, updateProfile as firebaseUpdateProfile } from "firebase/auth";
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, setDoc, query, orderBy, onSnapshot } from "firebase/firestore";
const users = "users";

/* getUpdatedFeedback: legacy helper removed.
   Rationale: this action referenced component state (this.state) which is invalid in Redux actions.
   If needed later, implement as a thunk that dispatches an update based on getDoc(doc(db, fbFeeds, docId)). */

export const onAuthStateChanged = () => dispatch => {
  firebaseOnAuthStateChanged(auth, function(res) {
    if (res) {
      // User is signed in.
      console.log("userSignedIn", res);
      const userDocRef = doc(db, users, res.uid);
      getDoc(userDocRef).then(async user => {
        // Ensure users/{uid} doc exists for persona metadata (stakeholder flag)
        if (!user.exists()) {
          await setDoc(userDocRef, {
            displayName: res.displayName || "",
            email: res.email || "",
            stakeholder: false,
            createdAt: Date.now()
          });
        }
        dispatch({
          type: "signIn",
          payload: {
            user: res.displayName,
            email: res.email,
            stakeholder: user.exists() ? user.data().stakeholder : false
          }
        });
      });
    } else {
      // No user is signed in.
      console.log("noUser", res);
    }
  });
};

export const signIn = (email, password) => {
  return async dispatch => {
    await firebaseSignInWithEmailAndPassword(auth, email, password)
      .then(res => {
        console.log("actionRes", res);
        getDoc(doc(db, users, res.user.uid)).then(async user => {
          const userDocRef = doc(db, users, res.user.uid);
          if (!user.exists()) {
            await setDoc(userDocRef, {
              displayName: res.user.displayName || "",
              email: res.user.email || "",
              stakeholder: false,
              createdAt: Date.now()
            });
          }
          dispatch({
            type: "signIn",
            payload: {
              user: res.user.displayName,
              email: res.user.email,
              stakeholder: user.exists() ? user.data().stakeholder : false
            }
          });
        });
      })
      .catch(err => {
        console.log("err", err);
        dispatch({
          type: "signInError",
          payload: err.message
        });
      });
  };
};

export const signOut = () => dispatch => {
  firebaseSignOut(auth)
    .then(function() {
      // Sign-out successful.
      dispatch({
        type: "signOut",
        payload: null
      });
    })
    .catch(function(error) {
      // An error happened.
    });
};
export const updateUserName = name => dispatch => {
  const user = auth.currentUser;

  firebaseUpdateProfile(user, {
    displayName: name
    // photoURL: "https://example.com/jane-q-user/profile.jpg"
  })
    .then(function(res) {
      // Update successful.
      console.log("updateUserName", res);
      dispatch({
        type: "updateUserName",
        payload: name
      });
    })
    .catch(function(error) {
      // An error happened.
    });
};

export const getAllFeeds = () => dispatch => {
  getDocs(query(collection(db, fbFeeds), orderBy("timestamp", "desc")))
    .then(res => {
      const dbJSON = {};
      res.docs.forEach(elem => {
        const data = elem.data();
        dbJSON[elem.id] = data;
      });
      console.log(dbJSON);
    });
};

export const realTimeFeedListener = () => (dispatch, getState) => {
  const lastTwoWeeks = new Date();
  lastTwoWeeks.setDate(lastTwoWeeks.getDate() - 10);
  // const n = getState().lastFeed + 15;
  onSnapshot(
    query(collection(db, fbFeeds), orderBy("timestamp", "desc")),
    snapshot => {
      // const lastVisible = snapshot.docs[snapshot.docs.length - 1];
      // dispatch({
      //   type: "getLastFeed",
      //   payload: lastVisible
      // });
      // console.log("SNAPSHOOOOT", snapshot);
      // if (getState().feed.length === 0) {
      /*
        // This is done to update state on first page load
        console.log(snapshot);
        snapshot.docs.forEach(feed => {
          const firstFeedLoad = feed.data();
          firstFeedLoad.id = feed.id;
          dispatch({
            type: "firstFeedLoad",
            payload: firstFeedLoad
          });
        });
        */
      dispatch({
        type: "firstFeedLoad",
        payload: snapshot
      });
      // dispatch({
      //   type: "getRadarChartData",
      //   payload: snapshot
      // });
      // dispatch({
      //   type: "getLastFeed",
      //   payload: n
      // });
      return;
      // }
      // After first page load app listens to changes
      // and updates state
      const changes = snapshot.docChanges();
      console.log("real-time changes", changes);
      changes.forEach(async change => {
        const data = await change.doc.data();
        data.id = change.doc.id;

        if (change.type === "modified") {
          let modifiedFeedList = getState().feed;
          const modifiedFeedIndex = modifiedFeedList.docs.findIndex(
            feed => feed.id === change.doc.id
          );
          modifiedFeedList.docs[modifiedFeedIndex] = data;

          console.log("TIROREEE", modifiedFeedList);
          dispatch({
            type: "modifiedFeedList",
            payload: modifiedFeedList
          });
        } else if (change.type === "added") {
          dispatch({
            type: "addedFeedList",
            payload: changes[0]
            // payload: data
          });
        } else if (change.type === "removed") {
          const removeFeed = getState().feed.filter(feed => {
            return feed.id !== change.doc.id;
          });
          dispatch({
            type: "removedFeedList",
            payload: removeFeed
          });
        }
      });
    });
};

export const getFeedWithLocation = () => dispatch => {
  getDocs(query(collection(db, fbFeeds), orderBy("timestamp", "desc")))
    .then(feed => {
      // console.log("FEEED", feed);
      const feedWithLocation = feed.docs
        .map(elem => {
          const data = elem.data();
          data.id = elem.id;
          return data;
        })
        .filter(f => f.location);
      dispatch({
        type: "feedWithLocation",
        payload: feedWithLocation
      });
    });
};

export const getHashtagList = () => dispatch => {
  getDocs(collection(db, fbHashtags))
    .then(async hashtags => {
      // this.setState({ hashtags: [] });
      const hashList = await hashtags.docs.map(hash => {
        const hashData = hash.data();
        delete hashData.count;
        return { id: hash.id, moods: hashData, count: hash.data().count };
      });
      const sortedHashList = _.orderBy(hashList, ["count"], ["desc"]);

      // sortedHashList.forEach(hash => {
      //   this.setState({ hashtags: [...this.state.hashtags, hash] });
      // });
      // console.log("getHashtagList", sortedHashList);
      dispatch({
        type: "getHashtagList",
        payload: sortedHashList
      });
    });
};

export const addFeedback = data => async dispatch => {
  // Input: data (author, comment, mood, hashtags, location, picture?)
  // Transformation: serverTimestamp for timestamp; ensure hashtag counters updated; create feedback doc
  // Output: Promise<{ id: string }>
  data.timestamp = FirestoreHelpers.serverTimestamp();

  const hashtagListRef = collection(db, fbHashtags);
  const newFeedbackRef = collection(db, fbFeeds);

  // Update hashtag counters (create-if-missing)
  const updateHashtagList = (data.hashtags || []).map(async hash => {
    const hashtagDocRef = doc(hashtagListRef, hash);
    const hashtagExists = await getDoc(hashtagDocRef).then(res => res.exists());
    if (hashtagExists) {
      await updateDoc(hashtagDocRef, {
        count: FirestoreHelpers.increment(1),
        [data.mood]: FirestoreHelpers.increment(1)
      });
    } else {
      await setDoc(hashtagDocRef, {
        count: 1,
        [data.mood]: 1
      });
    }
  });

  // Create feedback entry
  const docRef = await addDoc(newFeedbackRef, data);
  await Promise.all(updateHashtagList);

  // Optional success action for local state consumers
  dispatch({
    type: "feedbackAdded",
    payload: { id: docRef.id, data }
  });

  // Return payload to caller (App.js uses this in alert)
  return { id: docRef.id };
};

export const deleteFeedback = id => dispatch => {
  // Input: id
  // Transformation: delete doc
  // Output: Promise<boolean>
  return deleteDoc(doc(db, fbFeeds, id))
    .then(() => {
      dispatch({ type: "feedbackDeleted", payload: id });
      return true;
    })
    .catch(error => {
      throw error;
    });
  // const updateHashtagList = data.hashtags.map(hash => {
  //   return hashtagListRef.update({
  //     [hash]: firebase.firestore.FieldValue.decrement(1)
  //   });
  // });
};

export const addComment = (id, comment, author) => dispatch => {
  // Input: id, comment, author?
  // Transformation: arrayUnion comment with timestamp and optional author
  // Output: Promise<boolean>
  return updateDoc(doc(db, fbFeeds, id), {
    comments: FirestoreHelpers.arrayUnion({
      timestamp: Date.now(),
      comment,
      author
    })
  }).then(() => {
    dispatch({ type: "commentAdded", payload: { id, comment, author } });
    return true;
  });
};

export const addReaction = (id, reaction) => dispatch => {
  // Input: id, reaction
  // Transformation: increment reactions.{reaction}
  // Output: Promise<boolean>
  const updatedField = `reactions.${reaction}`;
  return updateDoc(doc(db, fbFeeds, id), {
    [updatedField]: FirestoreHelpers.increment(1)
  })
    .then(() => {
      dispatch({ type: "reactionAdded", payload: { id, reaction } });
      return true;
    });
};
