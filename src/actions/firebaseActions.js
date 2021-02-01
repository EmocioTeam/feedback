import _ from "lodash";
import firebase from "firebase/app";
import { fb } from "../config";
import { fbFeeds, fbHashtags } from "../config";
const db = fb.firestore();
const users = "users";

// export const getUpdatedFeedback = doc => {
//   db.collection(fbFeeds)
//     .doc(doc)
//     .get()
//     .then(updatedDoc => {
//       this.state.feeds.findIndex(doc);
//       this.setState({
//         feeds: this.state.feeds
//       });
//     });
// }

export const onAuthStateChanged = () => dispatch => {
  firebase.auth().onAuthStateChanged(function(res) {
    if (res) {
      // User is signed in.
      console.log("userSignedIn", res);
      db.collection(users)
        .doc(res.uid)
        .get()
        .then(user => {
          // console.log("EOOO", user);

          dispatch({
            type: "signIn",
            payload: {
              user: res.displayName,
              email: res.email,
              stakeholder: user.exists ? user.data().stakeholder : false
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
    await fb
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log("actionRes", res);
        db.collection(users)
          .doc(res.user.uid)
          .get()
          .then(user => {
            dispatch({
              type: "signIn",
              payload: {
                user: res.user.displayName,
                email: res.user.email,
                stakeholder: user.exists ? user.data().stakeholder : false
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
  fb.auth()
    .signOut()
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
  var user = firebase.auth().currentUser;

  user
    .updateProfile({
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
  db.collection(fbFeeds)
    .orderBy("timestamp", "desc")
    .get()
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
  db.collection(fbFeeds)
    // .where("timestamp", ">", lastTwoWeeks)
    .orderBy("timestamp", "desc")
    // .limit(n)
    .onSnapshot(snapshot => {
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
  db.collection(fbFeeds)
    // .orderByChild('location')
    // .where("location", "!=", "false")
    .orderBy("timestamp", "desc")
    .get()
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
  db.collection(fbHashtags)
    .get()
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

export const addFeedback = data => {
  data.timestamp = firebase.firestore.FieldValue.serverTimestamp();
  // first: get the Refs for the Hashtag list & the new feedback entry
  const hashtagListRef = db.collection(fbHashtags);
  const newFeedbackRef = db.collection(fbFeeds);
  // get whole hashtag obj from firebase
  const updateHashtagList = data.hashtags.map(async hash => {
    const hashtagDocRef = hashtagListRef.doc(hash);
    const hashtagExists = await hashtagDocRef.get().then(res => res.exists);

    if (hashtagExists) {
      hashtagDocRef.update({
        count: firebase.firestore.FieldValue.increment(1),
        [data.mood]: firebase.firestore.FieldValue.increment(1)
      });
      return;
    } else {
      hashtagDocRef.set({
        count: 1,
        [data.mood]: 1
      });
      return;
    }
  });
  // third: create new feedback entry
  const createFeedback = newFeedbackRef.add(data);
  // resolve all promises
  Promise.all([createFeedback, ...updateHashtagList])
    .then(res => {
      // console.log(res);
      this.setState({
        alert: {
          variant: "success",
          msg: "Thank you for your Feedback!!",
          id: res[0].id,
          hashtags: data.hashtags
        }
      });
      // this.getFeeds();
      this.getHashtagList();
      setTimeout(() => this.setState({ alert: null }), 2000);
    })
    .catch(err => {
      console.log("error", " => ", err);
    });
};

export const deleteFeedback = id => {
  db.collection(fbFeeds)
    .doc(id)
    .delete()
    .then(() => {
      // console.log("Document successfully deleted!");
      // this.getFeeds();
      this.getHashtagList();
    })
    .catch(function(error) {
      // console.error("Error removing document: ", error);
    });
  // const updateHashtagList = data.hashtags.map(hash => {
  //   return hashtagListRef.update({
  //     [hash]: firebase.firestore.FieldValue.decrement(1)
  //   });
  // });
};

export const addComment = (id, comment) => {
  console.log(id);
  db.collection(fbFeeds)
    .doc(id)
    .update({
      comments: firebase.firestore.FieldValue.arrayUnion({
        timestamp: Date.now(),
        comment
      })
    })
    .then(res => {
      console.log(res);
      // this.getFeeds();
    });
};

export const addReaction = (id, reaction) => {
  console.log("id", id, "reaction", reaction);
  const updatedField = `reactions.${reaction}`;
  db.collection(fbFeeds)
    .doc(id)
    .update({
      [updatedField]: firebase.firestore.FieldValue.increment(1)
    })
    .then(res => console.log(res))
    .catch(err => console.log(err));
};
