import React, { Component } from "react";
import Charts from "../components/Radar";
import Recharts from "../components/Rechart";
import SearchBar from "../components/SearchBar";
import Header from "../components/Header";
import FeedCard from "../components/FeedCard";
import Geomap from "../components/Geomap";
import { Figure } from "react-bootstrap";
import _ from "lodash";

export default class Results extends Component {
  state = {
    showMap: false,
    hashtags: [],
    graphData: []
  };

  handleHashtags = list => {
    const graphData = list.map(elem => {
      return _.find(this.props.hashtags, ["id", elem.split(" ")[0]]);
    });

    console.log(graphData);

    this.setState({
      hashtags: list,
      graphData
    });
  };

  showMap = status => {
    this.setState({ showMap: status });
    console.log(this.state.showMap);
  };

  render() {
    return (
      <div className="results-container">
        <Header header="Analytics" />
        <div className="results-searchbar">
          <SearchBar
            handleHashtags={this.handleHashtags}
            hashtags={this.props.hashtags}
          />
        </div>
        <Figure className="results-figure-options">
          <Figure.Image
            onClick={() => this.showMap(false)}
            className="results-figure-options-item"
            width={171}
            height={180}
            src="https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1895&q=80"
          />
          <Figure.Image
            onClick={() => this.showMap(true)}
            className="results-figure-options-item"
            width={171}
            height={180}
            src="https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
          />
        </Figure>

        {this.state.showMap ? (
          <Geomap />
        ) : (
          <Recharts
            currentHashtags={this.state.hashtags}
            graphData={this.state.graphData}
            hashtagList={this.props.hashtags}
          />
        )}

        {this.state.hashtags.length > 0 &&
          this.props.feeds
            .filter(feed => {
              return feed.comment || feed.title;
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
