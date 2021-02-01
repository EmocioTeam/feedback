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
import { getFeedPageTab } from "../actions/feedPageTab";
import _ from "lodash";
import LazyLoad from "react-lazy-load";
import MapIcon from "../icons/location.svg";
import FeedPageIcon from "../icons/feedPage.svg";

class FeedPage extends Component {
  state = {
    showFeed: "wall",
    showPosts: 15,
    hashtags: [],
    lazyButtonText: "Load more Emocios!"
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
    // console.log(list);
    this.setState({
      hashtags: list
    });
  };

  renderCards = () => {
    return this.props.feed.docs
      .splice(0, this.state.showPosts)
      .filter(feed => {
        return feed.data().comment || feed.data().picture;
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
      <div className="feed-page-container">
        <Header
         handleState={this.props.getFeedPageTab}
         navtabs={[
           {
             label: "Wall",
             name: "wall",
             value: "wall",
             icon: FeedPageIcon
           },
           { label: "Map", name: "map", value: "map", icon: MapIcon }
         ]}
         header={this.props.refreshing ? "Loading new feeds.." : "Feedbacks"}
         className="feed-page-header"
        />
        <Container className="feed-page">
          {this.props.feedPageTab === "map" ? (
            <EmotionMap
              feeds={this.props.feed.docs
                .map(elem => {
                  const data = elem.data();
                  data.id = elem.id;
                  return data;
                })
                .filter(f => f.location)}
               getFeedWithLocation={this.props.getFeedWithLocation}
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
                    {/* {this.state.showPosts < this.props.feed.docs.length && ( */}
                    <LazyLoad
                      offsetVertical={300}
                      onContentVisible={() => this.showPosts()}
                    >
                      <LazyLoadButton
                        showPosts={this.showPosts}
                        lazyButtonText={
                          this.state.showPosts > this.props.feed.docs.length
                            ? "There are no more Emocios! :("
                            : "Load more Emocios! :)"
                        }
                      />
                    </LazyLoad>
                    {/* )} */}
                  </span>
                )}
              </div>
            )
          )}
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth,
    feed: state.feed,
    localizedFeed: state.feedWithLocation,
    feedPageTab: state.feedPageTab
  };
};

export default connect(
  mapStateToProps,
  { getFeedWithLocation, realTimeFeedListener, getFeedPageTab }
)(FeedPage);
