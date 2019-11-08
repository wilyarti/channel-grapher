import Col from "react-bootstrap/Col";
import {Bar, Bubble, Line} from "react-chartjs-2";
import Row from "react-bootstrap/Row";
import React from "react";



const ChartTab = (props) => {
    const chartOptions = {
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
                    labelString: "Time",
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
                    labelString: props.thingSpeakFieldName
                }
            }]
        }
    }
    return (
        <Row style={{height: props.dimensions.height}}>
            <Col style={{height: props.dimensions.height}} sm={12}>
                {props.lineGraphBoolean && !(props.channelNotVerified) &&
                <Line
                    data={props.config}
                    options={chartOptions}
                />
                }
                {props.bubbleGraphBoolean && !(props.channelNotVerified) &&
                <Bubble
                    data={props.config}
                    options={chartOptions}
                />
                }
                {props.barGraphBoolean && !(props.channelNotVerified) &&
                <Bar
                    data={props.config}
                    options={chartOptions}
                />
                }
            </Col>
        </Row>
    )
}

export default ChartTab;