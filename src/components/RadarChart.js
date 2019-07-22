import React, { Component } from "react";
import ReactApexChart from "react-apexcharts";
import data from "../data";
import { connect } from "react-redux";
import { getRadarChartData } from "../actions/radarChartData";

class RadarChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        responsive: [
          {
            breakpoint: undefined,
            options: {}
          }
        ],
        chart: {
          dropShadow: {
            enabled: true,
            blur: 1,
            left: 1,
            top: 1
          }
        },
        labels: data.map(data => data.name),
        title: {
          text: "Radar Chart - Multi Series"
        },
        stroke: {
          width: 0
        },
        fill: {
          opacity: 0.4
        },
        markers: {
          size: 0
        }
      }
    };
  }

  render() {
    return (
      <div id="chart" className="radar-chart-container">
        <div className="radar-chart-card">
          <div className="radar-chart-content">
            <h4>Comparison chart</h4>
            <p className="text-muted">
              Select 2 or more hashtags to compare. Default is all Emocios
              Overview
            </p>
            <ReactApexChart
              options={this.state.options}
              series={this.props.series}
              type="radar"
              height="350"
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    series: state.radarChartData.series
  };
};

export default connect(
  mapStateToProps,
  { getRadarChartData }
)(RadarChart);
