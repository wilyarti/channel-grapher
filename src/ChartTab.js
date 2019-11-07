import Col from "react-bootstrap/Col";
import {Bar, Bubble, Line} from "react-chartjs-2";
import Row from "react-bootstrap/Row";
import React from "react";


const ChartTab () => (props) {
    return (
        <Row style={{height: this.state.dimensions.height}}>
            <Col ref="chartDiv" style={{height: this.state.dimensions.height}} sm={12}>
                {this.state.lineGraphBoolean && !(this.state.channelNotVerified) &&
                <Line
                    ref="chart"
                    data={this.state.config}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        title: {
                            display: true,
                            text: `ThingSpeak Data`
                        },
                        scales: {
                            xAxes: [{
                                type: 'time',
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: xLabel,
                                },
                                ticks: {
                                    major: {
                                        fontStyle: 'bold',
                                        fontColor: '#FF0000'
                                    }
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: this.state.thingSpeakFieldName
                                }
                            }]
                        }
                    }}
                />
                }
                {this.state.bubbleGraphBoolean && !(this.state.channelNotVerified) &&
                <Bubble
                    ref="chart"
                    data={this.state.config}
                    options={{
                        maintainAspectRatio: false,
                        responsive: true,
                        title: {
                            display: true,
                            text: `ThingSpeak Data`
                        },
                        scales: {
                            xAxes: [{
                                type: 'time',
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: xLabel,
                                },
                                ticks: {
                                    major: {
                                        fontStyle: 'bold',
                                        fontColor: '#FF0000'
                                    }
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: this.state.thingSpeakFieldName
                                }
                            }]
                        }
                    }}
                />
                }
                {this.state.barGraphBoolean && !(this.state.channelNotVerified) &&
                <Bar
                    ref="chart"
                    data={this.state.config}
                    options={{
                        maintainAspectRatio: false,
                        responsive: true,
                        title: {
                            display: true,
                            text: `ThingSpeak Data`
                        },
                        scales: {
                            xAxes: [{
                                type: 'time',
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: xLabel,
                                },
                                ticks: {
                                    major: {
                                        fontStyle: 'bold',
                                        fontColor: '#FF0000'
                                    }
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: this.state.thingSpeakFieldName
                                }
                            }]
                        }
                    }}
                />
                }
            </Col>
        </Row>
    )
}

export default ChartTab;