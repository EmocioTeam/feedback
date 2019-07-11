import React, { Fragment, Component } from "react";
import { Container } from "react-bootstrap";
import FeedCard from "../components/FeedCard";
import Header from "../components/Header";
import EmotionMap from "../components/EmotionMap";
import SearchBar from "../components/SearchBar";
import LazyLoadButton from "../components/LazyLoadButton";
import Loader from "../components/Loader";
import { connect } from "react-redux";
import {
  getFeedWithLocation,
  realTimeFeedListener
} from "../actions/firebaseActions";
import _ from "lodash";
import LazyLoad from "react-lazy-load";

class FeedPage extends Component {
  state = {
    showFeed: "wall",
    showPosts: 15,
    hashtags: []
  };

  showFeed = status => {
    this.setState({ showFeed: status });
  };

  showPosts = () => {
    this.setState({
      showPosts: this.state.showPosts + 15
    });
  };

  handleHashtags = list => {
    console.log(list);
    this.setState({
      hashtags: list
    });
  };

  renderCards = () => {
    return this.props.feed.docs
      .splice(0, this.state.showPosts)
      .filter(feed => {
        return feed.data().comment;
      })
      .map((data, index) => {
        const feed = data.data();
        feed.id = data.id;
        return (
          <FeedCard
            key={index}
            feed={feed}
            addComment={this.props.addComment}
            addReaction={this.props.addReaction}
            user={this.props.user}
          />
        );
      });
  };

  renderFilteredFeedByHashtag = () => {
    return this.props.feed.docs
      .filter(feed => {
        return feed.data().comment;
      })
      .filter(data => {
        const feed = data.data();
        for (let hash of this.state.hashtags) {
          if (feed.hashtags.includes(hash)) {
            return true;
          }
        }
        return false;
      })
      .map((data, index) => {
        const feed = data.data();
        feed.id = data.id;
        return (
          <FeedCard
            key={index}
            feed={feed}
            addComment={this.props.addComment}
            addReaction={this.props.addReaction}
            user={this.props.user}
          />
        );
      });
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
            <EmotionMap
              feeds={this.props.feed.docs
                .map(elem => {
                  const data = elem.data();
                  data.id = elem.id;
                  return data;
                })
                .filter(f => f.location)}
              // getFeedWithLocation={this.props.getFeedWithLocation}
            />
          ) : this.props.feed.docs && this.props.feed.docs.length == 0 ? (
            <Loader />
          ) : (
            this.props.feed &&
            this.props.feed.docs && (
              <div>
                <div className="results-searchbar">
                  <SearchBar handleHashtags={this.handleHashtags} />
                </div>

                {this.state.hashtags.length > 0 ? (
                  <div style={{ marginBottom: "55px" }}>
                    {this.renderFilteredFeedByHashtag()}
                  </div>
                ) : (
                  <span>
                    {this.renderCards()}
                    <LazyLoad
                      offsetVertical={300}
                      onContentVisible={() => this.showPosts()}
                    >
                      <LazyLoadButton
                        showPosts={this.props.showPosts}
                        lazyButtonText={"Load more Emocios!"}
                      />
                    </LazyLoad>
                  </span>
                )}
              </div>
            )
          )}
        </Container>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  console.log(state.feed);
  return {
    user: state.auth,
    feed: state.feed,
    localizedFeed: state.feedWithLocation
  };
};

export default connect(
  mapStateToProps,
  { getFeedWithLocation, realTimeFeedListener }
)(FeedPage);
