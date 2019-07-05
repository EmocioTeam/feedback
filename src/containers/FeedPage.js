import React, { Fragment, Component } from "react";
import FeedCard from "../components/FeedCard";
import Header from "../components/Header";
import { Container } from "react-bootstrap";
import EmotionMap from "../components/EmotionMap";
import { connect } from "react-redux";

class FeedPage extends Component {
  state = {
    showFeed: "wall"
  };

  handleInput = (e, id) => {
    // console.log(e.target.value, id);
    this.setState({ [id]: e.target.value });
  };

  addComment = (e, id) => {
    e.preventDefault();

    const author = {};
    // first get if user is logged in
    if (this.props.user.email) {
      this.props.user.user
        ? (author.name = this.props.user.user)
        : (author.name = "SpookyMaster");
    }
    this.props.user.stakeholder
      ? (author.stakeholder = true)
      : (author.stakeholder = false);

    // console.log("id", id);
    // dafuq did I do here
    const stateObjectKeys = Object.keys(this.state);
    stateObjectKeys.forEach(state => {
      console.log("stateKey", state);
      this.setState({
        [state]: ""
      });
    });
    this.props.addComment(id, this.state[id], author);
  };

  showFeed = status => {
    this.setState({ showFeed: status });
  };

  render() {
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
            <EmotionMap feeds={this.props.feed} />
          ) : (
            this.props.feed &&
            this.props.feed
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

const mapStateToProps = state => {
  console.log(state);
  return {
    user: state.auth,
    feed: state.feed
  };
};

export default connect(mapStateToProps)(FeedPage);
