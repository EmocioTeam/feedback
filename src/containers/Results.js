import React, { Component } from "react";
import Recharts from "../components/Rechart";
import SearchBar from "../components/SearchBar";
import Header from "../components/Header";
import FeedCard from "../components/FeedCard";
import { connect } from "react-redux";
import _ from "lodash";
import RadarChart from "../components/RadarChart";
import StatsCard from "../components/StatsCard";
import { getRadarChartDataByHashtag } from "../actions/radarChartData";

class Results extends Component {
  state = {
    hashtags: [],
    graphData: []
  };

  handleHashtags = list => {
    const graphData = list.map(elem => {
      // elem.split(" ")[0] ->> ñapul para obligar a que sea un string
      return _.find(this.props.hashtags, ["id", elem]);
    });
    this.props.getRadarChartDataByHashtag(graphData, this.props.feed, list);
  };

  componentWillUnmount() {
    this.props.getRadarChartDataByHashtag([]);
  }
  render() {
    return (
      <div className="results-container">
        <Header header="Analytics" />
        <div className="results-searchbar">
          <SearchBar handleHashtags={this.handleHashtags} />
        </div>
        <div className="results-stats-cards">
          <StatsCard
            statLabel="Total No Emocios"
            stat={this.props.totalNumberEmocios}
          />
          <StatsCard
            statLabel="Total No Comments"
            stat={this.props.commentsCount}
          />
        </div>
        <div className="results-stats-cards">
          <StatsCard statLabel="Top Emotion" stat={this.props.topEmotion} />
          <StatsCard
            statLabel="Top Hashtag"
            stat={
              this.props.hashtags.length > 0 ? this.props.hashtags[0].id : ""
            }
          />
        </div>
        <RadarChart
          graphData={this.state.graphData}
          selectedHashtags={this.state.hashtags}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    feed: state.feed,
    hashtags: state.hashtags,
    topEmotion: state.radarChartData.topEmotion,
    totalNumberEmocios: state.radarChartData.totalNumberEmocios,
    commentsCount: state.radarChartData.commentsCount
  };
};

export default connect(
  mapStateToProps,
  { getRadarChartDataByHashtag }
)(Results);
