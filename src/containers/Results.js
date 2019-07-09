import React, { Component } from "react";
import Recharts from "../components/Rechart";
import SearchBar from "../components/SearchBar";
import Header from "../components/Header";
import FeedCard from "../components/FeedCard";
import { connect } from "react-redux";
import _ from "lodash";

class Results extends Component {
  state = {
    hashtags: [],
    graphData: []
  };

  handleHashtags = list => {
    // console.log("eEAJSDÑFLASJ", list);
    const graphData = list.map(elem => {
      return _.find(this.props.hashtags, ["id", elem.split(" ")[0]]);
    });
    console.log(graphData);
    this.setState({
      hashtags: list,
      graphData
    });
  };

  render() {
    return (
      <div className="results-container">
        <Header header="Analytics" />
        <div className="results-searchbar">
          <SearchBar
            handleHashtags={this.handleHashtags}
            // hashtags={this.props.hashtags}
          />
        </div>
        <Recharts
          currentHashtags={this.state.hashtags}
          graphData={this.state.graphData}
          hashtagList={this.props.hashtags}
        />

        {this.state.hashtags.length > 0 &&
          this.props.feeds
            .filter(feed => {
              return feed.comment;
            })
            .filter((feed, index, arr) => {
              for (let hash of this.state.hashtags) {
                if (feed.hashtags.includes(hash)) {
                  return true;
                }
              }
              return false;
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    hashtags: state.hashtags
  };
};

export default connect(mapStateToProps)(Results);
