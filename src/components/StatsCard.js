import React, { Component } from "react";

export default class StatsCard extends Component {
  render() {
    return (
      <div className="stats-card">
        <div className="stats-content">
          <p className="text-muted stats-label">{this.props.statLabel}</p>
          <div className="stats-big-number">{this.props.stat}</div>
        </div>
      </div>
    );
  }
}
