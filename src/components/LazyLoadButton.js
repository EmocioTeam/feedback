import React, { Component } from "react";
import { connect } from "react-redux";
import { realTimeFeedListener } from "../actions/firebaseActions";

class LazyLoadButton extends Component {
  render() {
    return (
      <div className="lazy-load-button" onClick={() => this.props.showPosts()}>
        Load more Emocios
      </div>
    );
  }
}

export default connect(
  null,
  { realTimeFeedListener }
)(LazyLoadButton);
