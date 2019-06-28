import React, { Component } from 'react';
import { Card, Container } from 'react-bootstrap';
import moods from '../data';
import _ from 'lodash';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend
  // ResponsiveContainer
} from 'recharts';

const style = {
  container: {
    height: 'calc(100vh - 176px)',
    width: 'auto',
    display: 'flex',
    justifyContent: 'center',
    marginLeft: '15px',
    marginRight: '15px'
  }
};

export default class Rechart extends Component {
  getGraph = graphData => {
    // const countArr = graphData.map(elem => elem.count);
    // const maxValue = graphData.length === 0 ? 100 : _.max(countArr);
    // console.log(graphData);
    let MAX = 0;
    for (let elem of graphData) {
      for (let mood in elem.moods) {
        if (elem.moods[mood] === undefined) {
          continue;
        }
        if (elem.moods[mood] > MAX) MAX = elem.moods[mood];
      }
    }
    const data = moods.map((mood, index) => {
      // console.log(parseInt(graphData[0].moods[mood.name]));
      return {
        subject: mood.name,
        A:
          graphData[0] && graphData[0].moods[mood.name]
            ? parseInt(graphData[0].moods[mood.name])
            : 0,
        B:
          graphData[1] && graphData[1].moods[mood.name]
            ? parseInt(graphData[1].moods[mood.name])
            : 0,
        C:
          graphData[2] && graphData[2].moods[mood.name]
            ? parseInt(graphData[2].moods[mood.name])
            : 0,
        fullMark: MAX
      };
    });
    return (
      // <ResponsiveContainer width="100%" height="100%">
      <RadarChart
        data={data}
        className='radar-chart'
        margin={{ left: 40, right: 40, top: 40, bottom: 0 }}
        padding={{ left: 0, right: 0, top: 0, bottom: 0 }}
        width={window.innerWidth}
        height={window.innerHeight / 1.5}
        outerRadius={90}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey='subject' />
        {/* <PolarRadiusAxis angle={162} domain={["dataMin", "dataMax"]} /> */}
        <PolarRadiusAxis angle={162} domain={[-1, MAX === 0 ? 100 : MAX]} />
        {graphData[0] && (
          <Radar
            name={graphData[0] && graphData[0].id ? graphData[0].id : ' - '}
            dataKey='A'
            stroke='#8884d8'
            fill='#8884d8'
            fillOpacity={0.2}
          />
        )}
        {graphData[1] && (
          <Radar
            name={graphData[1] && graphData[1].id ? graphData[1].id : ' - '}
            dataKey='B'
            stroke='#82ca9d'
            fill='#82ca9d'
            fillOpacity={0.2}
          />
        )}
        {graphData[2] && (
          <Radar
            name={graphData[2] && graphData[2].id ? graphData[2].id : ' - '}
            dataKey='C'
            stroke='#630'
            fill='#630'
            fillOpacity={0.2}
          />
        )}
        <Legend />
      </RadarChart>
      //</ResponsiveContainer>
    );
  };

  render() {
    const { currentHashtag, graphData } = this.props;
    return (
      <div className='radar-card-container'>
        <Card className='radar-card'>
          <Card.Body className='radar-card-body'>
            {this.getGraph(graphData)}
          </Card.Body>
        </Card>
      </div>
    );
  }
}
