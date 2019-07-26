import React, { Component } from "react";

export default class FeedCardExpandedComments extends Component {
  renderComments = comments => {
    return comments.map((comment, index) => {
      console.log(comment);
      return (
        <p key={index}>
          {comment.author ? comment.author.name : ""} {comment.comment}
        </p>
      );
    });
  };

  render() {
    console.log(this.props.comments);
    return (
      <div className="expanded-comments-container">
        <div className="expanded-comments-card" />
        <div className="expanded-comments-header">Comments</div>
        <div className="expanded-comments-body">
          {this.renderComments(this.props.comments)}
        </div>
      </div>
    );
  }
}
