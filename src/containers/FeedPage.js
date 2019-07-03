import React, { Fragment, Component } from "react";
import FeedCard from "../components/FeedCard";
import Header from "../components/Header";
import { Container } from "react-bootstrap";
import EmotionMap from "../components/EmotionMap";

export default class FeedPage extends Component {
  // console.log(props.feeds);
  state = {
    showFeed: "wall"
  };

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

  showFeed = status => {
    this.setState({ showFeed: status });
  };

  render() {
    // console.log("feeds", this.props.feeds);
    return (
      <Fragment>
        <Header
          handleState={this.showFeed}
          navtabs={[
            { label: "Wall", name: "wall", value: "wall" },
            { label: "Map", name: "map", value: "map" }
          ]}
          header={this.props.refreshing ? "Loading new feeds.." : "Feedbacks"}
          className="feed-page-header"
        />
        <Container className="feed-page">
          {this.state.showFeed === "map" ? (
            <EmotionMap feeds={this.props.feeds} />
          ) : (
            this.props.feeds &&
            this.props.feeds
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
                      this.state[feed.id] === undefined
                        ? ""
                        : this.state[feed.id]
                    }
                  />
                );
              })
          )}
        </Container>
      </Fragment>
    );
  }
}
