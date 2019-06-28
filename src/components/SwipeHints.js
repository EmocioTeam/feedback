import React, { Component } from "react";

export default class SwipeHints extends Component {
  render() {
    return (
      <div className="swipe-hints-wrapper">
        <div className="swipe-label">
          {/* <span className="arrow-left" /> */}
          Swipe Left to <strong>Discard</strong>
        </div>
        <div className="swipe-label">
          {/* <span className="arrow-left" /> */}
          Swipe Right to <strong>Add</strong>
        </div>
      </div>
      // <div style="clear: both;"></div>
    );
  }
}
