import React, { Fragment, Component } from "react";
import FeedCard from "../components/FeedCard";
import Header from "../components/Header";
import { Container } from "react-bootstrap";

export default class FeedPage extends Component {
  // console.log(props.feeds);
  state = {};

  handleInput = (e, id) => {
    // console.log(e.target.value, id);
    this.setState({ [id]: e.target.value });
  };

  addComment = (e, id) => {
    e.preventDefault();
    // console.log("id", id);
    const stateKeys = Object.keys(this.state);
    stateKeys.forEach(state => {
      console.log("stateKey", state);
      this.setState({
        [state]: ""
      });
    });
    this.props.addComment(id, this.state[id]);
  };

  render() {
    // console.log("feeds", this.props.feeds);
    return (
      <Fragment>
        <Header
          header={this.props.refreshing ? "Loading new feeds.." : "Feedbacks"}
          className="feed-page-header"
        />
        {/* <img
          src="./img/feedback.jpg"
          style={{ height: "150px", width: "100vw", objectFit: "cover" }}
        /> */}
        <Container className="feed-page">
          {this.props.feeds
            .filter(feed => {
              return feed.comment;
            })
            .map((feed, index) => {
              return (
                <FeedCard
                  key={index}
                  feed={feed}
                  handleInput={this.handleInput}
                  addComment={this.addComment}
                  addReaction={this.props.addReaction}
                  commentValue={
                    this.state[feed.id] === undefined ? "" : this.state[feed.id]
                  }
                />
              );
            })}
        </Container>
      </Fragment>
    );
  }
}
