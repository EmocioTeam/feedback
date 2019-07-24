import React, { Component } from "react";
import AddComment from "../components/AddCommentModal";
import Header from "../components/Header";
import Deck from "../components/Deck";
import SwipeHints from "../components/SwipeHints";
import moods from "../data.js";
import _ from "lodash";
import { geolocated } from "react-geolocated";
import firebase from "firebase";
import { connect } from "react-redux";
import { uploadImg } from "../actions/firebaseUploadImg";

const data = _.shuffle(moods);

class AddFeedback extends Component {
  state = {
    showAddFeedback: false,
    currentMood: 0,
    comment: "",
    title: "",
    hashtags: [],
    posting: false,
    pictures: []
    // email: "",
    // mood: data[this.state.currentMood].name,
  };

  handleHashtags = list => {
    console.log("state", " => ", this.state);
    const validatedList = [];
    for (let hash of list) {
      hash = hash.replace(/[^A-Z0-9]+/i, "");
      if (hash[0] !== "#") {
        var splittedHash = hash.split("");
        splittedHash.unshift("#");
        var validatedHash = splittedHash.join("");
      }
      validatedList.push(validatedHash);
    }
    this.setState({
      hashtags: validatedList
    });
  };

  handleInput = (e, input) => {
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state);
  };

  onDrop = picture => {
    console.log(picture);
    this.setState({
      pictures: picture
    });
  };

  removePics = () => {
    this.setState({ pictures: [] });
  };

  toggleShowAddFeedback = i => {
    this.setState({
      showAddFeedback: this.state.showAddFeedback ? false : true,
      currentMood: i
    });
  };

  resetState = () => {
    this.setState({
      showAddFeedback: false,
      comment: "",
      title: "",
      hashtags: [],
      posting: false,
      pictures: []
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const pic = this.state.pictures[this.state.pictures.length - 1];
    this.setState({ posting: true });

    const Author =
      this.props.author && this.props.author.user
        ? this.props.author.user
        : false;
    const Comment = this.state.comment;
    const Mood = data[this.state.currentMood].name;
    const Hashtags = this.state.hashtags;
    const Location = this.props.coords
      ? new firebase.firestore.GeoPoint(
          this.props.coords.latitude,
          this.props.coords.longitude
        )
      : false;

    if (this.state.pictures.length <= 0) {
      this.props.addFeedback({
        author: Author,
        comment: Comment,
        mood: Mood,
        hashtags: Hashtags,
        location: Location
      });
      this.resetState();
      return;
    }

    this.props
      .uploadImg(pic)
      .then(res => {
        console.log("UPLOAD IMG RESPONSE", res);
        firebase
          .storage()
          .ref("images")
          .child(res.ref.name)
          .getDownloadURL()
          .then(url => {
            // console.log("URL", url);
            this.props.addFeedback({
              author: Author,
              comment: Comment,
              mood: Mood,
              hashtags: Hashtags,
              location: Location,
              picture: url
            });
            this.resetState();
          })
          .catch(err => {
            console.log(err);
            alert(err);
          });
      })
      .catch(err => alert("You need to be a logged in user to post images"));
  };

  render() {
    return (
      <div>
        <Header header="Add Feedback" />
        <div className="add-feedback-cards">
          {/* <SwipeHints /> */}
          <Deck
            toggleShowAddFeedback={this.toggleShowAddFeedback}
            data={data}
          />
          <AddComment
            data={data}
            toggleShowAddFeedback={this.toggleShowAddFeedback}
            handleHashtags={this.handleHashtags}
            handleInput={this.handleInput}
            handleSubmit={this.handleSubmit}
            state={this.state}
            onDrop={this.onDrop}
            removePics={this.removePics}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  { uploadImg }
)(
  geolocated({
    positionOptions: {
      enableHighAccuracy: false
    },
    watchPosition: false,
    userDecisionTimeout: 5000
  })(AddFeedback)
);
