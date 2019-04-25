import React, { Component } from 'react';
import { Radar, HorizontalBar } from 'react-chartjs-2';
import { Button, Container, Jumbotron } from 'react-bootstrap';
import '../styles/Radar.css'

const data = {
    labels: ['Happy', 'Sad', 'Angry', 'Excited', 'Amused', 'Indifferent'],
    datasets: [
        {
            label: 'Week Average',
            backgroundColor: 'rgba(179,181,198,0.2)',
            borderColor: 'rgba(179,181,198,1)',
            pointBackgroundColor: 'rgba(179,181,198,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(179,181,198,1)',
            data: [65, 59, 90, 81, 56, 55]
        },
        {
            label: "Today's Average",
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            pointBackgroundColor: 'rgba(255,99,132,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255,99,132,1)',
            data: [100, 48, 40, 19, 96, 27]
        }
    ]
};

const horizontalBarData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'Number of votes',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: [65, 59, 80, 81, 56, 55, 40]
        }
    ]
};

export default class RadarExample extends Component {
    render() {
        const style = {
            jumbotron: {
                marginTop: 10,
                marginBottom: 10,
            },
            header: {
                fontSize: '24px',
            }
        }
        return (
            <div className='radar-container'>
                <Button
                    onClick={() => this.props.goToDeck()}
                    variant="secondary"
                    block>Go back</Button>
                <Container fluid>
                    <Jumbotron style={style.jumbotron}>
                        <h4 style={style.header}>This is how SAP Employees are feeling today!</h4>
                        <br></br>
                        <div style={{ height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Radar
                                data={data}
                                // width={100}
                                responsive={true}
                                options={{
                                    legend: {
                                        position: 'bottom',
                                        maintainAspectRatio: false
                                    }
                                }}
                            // maintainAspectRatio={false}
                            // height={100}
                            />
                        </div>
                    </Jumbotron>
                </Container>
                {/* <Container fluid>
                    <Jumbotron style={style.jumbotron}>
                        <h4 style={style.header}>Collected data from past 6 months</h4>
                        <br></br>
                        <HorizontalBar
                            data={horizontalBarData}
                        // width={100}
                        // height={100}
                        />
                    </Jumbotron>
                </Container> */}
            </div>
        );
    }
};