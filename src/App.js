import React, {Component} from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Dropdown from 'react-bootstrap/Dropdown'
import {Line} from 'react-chartjs-2';
import {Bubble} from 'react-chartjs-2';
import {Bar} from 'react-chartjs-2';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'react-bootstrap-timezone-picker/dist/react-bootstrap-timezone-picker.min.css';
import moment from 'moment';
import 'moment-timezone';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: {
                type: 'line',
                datasets: [{
                    label: 'ThingSpeak Channel',
                    //			backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                    //		borderColor: window.chartColors.red,
                    fill: false,
                    lineTension: 0,
                    pointRadius: 1,
                    borderColor: getRandomColor(),
                    borderWidth: .5,
                    data: [],
                }]
            },
            isLoading: false,
            channelNotVerified: true,
            barGraphBoolean: false,
            bubbleGraphBoolean: false,
            lineGraphBoolean: true,
            dataSetID: 0,
            thingSpeakID: '645847',
            thingSpeakFieldID: '1',
            thingSpeakFieldName: 'Sensor ID',
            thingSpeakAPIKey: '',
            startDate: '',
            endDate: new Date(),
            channelTitle: '',
            channelDescription: '',
            showAlert: '',
            errorHeading: '',
            errorBody: '',
            numDays: '',
            dataSummaryInterval: 0,
            dataSummaryIntervalDescription: '',
            selectedTab: 'config',
            dimensions: {width: 600, height: 800},
            latitude: '',
            longitude: '',
            metadata: '',
            elevation: '',
        };
        this.handleDatePicker = this.handleDatePicker.bind(this);
        this.refreshClickHandler = this.refreshClickHandler.bind(this)
        this.thingSpeakValidatorClickHandler = this.thingSpeakValidatorClickHandler.bind(this)
        this.handleThingSpeakID = this.handleThingSpeakID.bind(this)
        this.handleThingSpeakFieldID = this.handleThingSpeakFieldID.bind(this)
        this.handleThingSpeakAPIKey = this.handleThingSpeakAPIKey.bind(this)
        this.handleNumDays = this.handleNumDays.bind(this)
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.barGraphSelector = this.barGraphSelector.bind(this)
        this.bubbleGraphSelector = this.bubbleGraphSelector.bind(this)
        this.lineGraphSelector = this.lineGraphSelector.bind(this)
        this.setDataSummaryInterval30 = this.setDataSummaryInterval30.bind(this)
        this.setDataSummaryInterval60 = this.setDataSummaryInterval60.bind(this)
        this.setDataSummaryIntervalDaily = this.setDataSummaryIntervalDaily.bind(this)


    }

    barGraphSelector() {
        this.setState({lineGraphBoolean: false, barGraphBoolean: true, bubbleGraphBoolean: false})
    }

    lineGraphSelector() {
        this.setState({lineGraphBoolean: true, barGraphBoolean: false, bubbleGraphBoolean: false})
    }

    bubbleGraphSelector() {
        this.setState({lineGraphBoolean: false, barGraphBoolean: false, bubbleGraphBoolean: true})
    }

    handleDatePicker(date) {
        // days have changed, reset state
        const defaultConfig = {
            type: 'line',
            datasets: [{
                label: 'ThingSpeak Channel',
                //			backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                //		borderColor: window.chartColors.red,
                fill: false,
                lineTension: 0,
                pointRadius: 1,
                borderColor: getRandomColor(),
                borderWidth: .5,
                data: [],
            }]
        }
        // reset graph to line
        this.lineGraphSelector()
        const numDays = this.state.numDays ? this.state.numDays : 1
        const start = moment(date).subtract(numDays, "days");
        this.setState({startDate: start, endDate: date, config: defaultConfig, dataSetID: 0, dataSummaryInterval: 0,
            dataSummaryIntervalDescription: ''})
    }

    handleThingSpeakID(e) {
        this.setState({channelNotVerified: true, thingSpeakID: e.target.value});
    }

    handleThingSpeakFieldID(e) {
        // when field is changed, scrap state of older graphs
        const defaultConfig = {
            type: 'line',
            datasets: [{
                label: 'ThingSpeak Channel',
                //			backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                //		borderColor: window.chartColors.red,
                fill: false,
                lineTension: 0,
                pointRadius: 1,
                borderColor: getRandomColor(),
                borderWidth: .5,
                data: [],
            }]
        }
        // reset graph to line
        this.lineGraphSelector()
        this.setState({
            thingSpeakFieldID: e.target.value, config: defaultConfig, dataSetID: 0, dataSummaryInterval: 0,
            dataSummaryIntervalDescription: '',
        }, () => {
            this.refreshClickHandler();
        })

    }

    handleThingSpeakAPIKey(e) {
        this.setState({channelNotVerified: true, thingSpeakAPIKey: e.target.value});
    }

    handleNumDays(e) {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            // when field is changed, scrap state of older graphs
            const defaultConfig = {
                type: 'line',
                datasets: [{
                    label: 'ThingSpeak Channel',
                    //			backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                    //		borderColor: window.chartColors.red,
                    fill: false,
                    lineTension: 0,
                    pointRadius: 1,
                    borderColor: getRandomColor(),
                    borderWidth: .5,
                    data: [],
                }]
            }
            // reset graph to line
            this.lineGraphSelector()
            this.setState({numDays: e.target.value})
            if (this.state.endDate) {
                const start = moment(this.state.endDate).subtract(e.target.value, "days");
                this.setState({startDate: start, config: defaultConfig, dataSetID: 0, dataSummaryInterval: 0,
                    dataSummaryIntervalDescription: ''})
            }
        }
    }

    setDataSummaryInterval30() {
        this.barGraphSelector()
        let dataset = parseInt(this.state.dataSetID) + 1
        let datainterval = parseInt(30)
        this.setState({
            dataSummaryInterval: datainterval,
            dataSummaryIntervalDescription: '- 30 min Summary',
            dataSetID: dataset
        }, () => {
            this.refreshClickHandler(dataset)
        })
    }

    setDataSummaryInterval60() {
        this.barGraphSelector()
        let dataset = parseInt(this.state.dataSetID) + 1
        let datainterval = parseInt(60)
        this.setState({
            dataSummaryInterval: datainterval,
            dataSummaryIntervalDescription: '- 60 min Summary',
            dataSetID: dataset
        }, () => {
            this.refreshClickHandler(dataset)
        })
    }

    setDataSummaryIntervalDaily() {
        this.barGraphSelector()
        let dataset = parseInt(this.state.dataSetID) + 1
        let datainterval = 'daily'
        this.setState({
            dataSummaryInterval: datainterval,
            dataSummaryIntervalDescription: '- Daily Summary',
            dataSetID: dataset
        }, () => {
            this.refreshClickHandler(dataset)
        })
    }

    thingSpeakValidatorClickHandler() {
        this.setState({isLoading: true})
        const APIKEY = this.state.thingSpeakAPIKey ? `&api_key=${this.state.thingSpeakAPIKey}` : ''
        const thingSpeakQuery = `https://api.thingspeak.com/channels/${this.state.thingSpeakID}/feeds.json?&${APIKEY}`;
        console.log(JSON.stringify({url: thingSpeakQuery}))
        fetch('/getJSON', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({url: thingSpeakQuery}),
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson.success == false) {
                    this.setState({'showAlert': 'true'})
                    this.setState({'errorHeading': "Invalid settings"})
                    this.setState({'errorBody': "Either the settings are invalid or no data matches the time period."})
                    console.log("Error returning")
                    return
                }
                console.log("Setting states")
                this.setState({channelTitle: responseJson.map.channel.map.name})
                this.setState({channelDescription: responseJson.map.channel.map.description})
                for (let i = 1; i < 9; i++) {
                    let fieldName = "field_".concat(i)
                    if (responseJson.map.channel.map["field".concat(i)]) {
                        this.setState({[fieldName]: responseJson.map.channel.map["field".concat(i)]})
                    } else {
                        this.setState({[fieldName]: undefined})
                    }
                }
                this.setState({channelNotVerified: false})
                console.log(this.state)
                this.forceUpdate()
                this.refreshClickHandler()
            })
            .catch((error) => {
                console.error(error);
                this.setState({'showAlert': 'true'})
                this.setState({'errorHeading': "Invalid settings"})
                this.setState({'errorBody': "Error" + error})

            }).finally(() => (this.setState({isLoading: false})));
    }

    refreshClickHandler(dID) {
        this.setState({isLoading: true})
        console.log(dID)
        const dataSetID = parseInt(dID) ? parseInt(dID) : 0
        const APIKEY = this.state.thingSpeakAPIKey ? `&api_key=${this.state.thingSpeakAPIKey}` : ''
        const SUM = this.state.dataSummaryInterval ? `&sum=${this.state.dataSummaryInterval}` : ''
        const START = this.state.startDate ? `&start=${moment(this.state.startDate).format("YYYY-MM-DD")}` : `&start=${moment(this.state.endDate).subtract(1, "days").format("YYYY-MM-DD")}`
        const END = this.state.endDate ? `&end=${moment(this.state.endDate).format("YYYY-MM-DD")}` : ''
        const STATUS = `&status=${true}`
        const METADATA = `&metadata=${true}`
        const LOCATION = `&location=${true}`
        const thingSpeakQuery = JSON.stringify({url: `https://api.thingspeak.com/channels/${this.state.thingSpeakID}/fields/${this.state.thingSpeakFieldID}.json?${APIKEY}${START}${END}${SUM}${STATUS}${METADATA}${LOCATION}`})
        console.log(thingSpeakQuery)
        fetch('/getJSON', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: thingSpeakQuery,
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                console.log("Dataset ID: ")
                console.log(dataSetID)
                let tempConfig = this.state.config
                tempConfig.datasets[dataSetID] = {
                    label: 'Data Summary',
                    //			backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                    //		borderColor: window.chartColors.red,
                    fill: false,
                    lineTension: 0,
                    pointRadius: 1,
                    borderColor: getRandomColor(),
                    borderWidth: .5,
                    data: [],
                };
                for (let i = 0, len = responseJson.map.feeds.myArrayList.length; i < len; i++) {
                    tempConfig.datasets[dataSetID].data.push({
                        x: moment(responseJson.map.feeds.myArrayList[i].map.created_at),
                        y: parseFloat(responseJson.map.feeds.myArrayList[i].map[`field${this.state.thingSpeakFieldID}`])
                    });
                }
                tempConfig.datasets[dataSetID].label = this.state.dataSummaryIntervalDescription ? `${responseJson.map.channel.map.name} ${this.state.dataSummaryIntervalDescription}` : responseJson.map.channel.map.name
                this.setState({config: tempConfig})
                console.log(this.state)
                if (responseJson.map.channel.map.latitude) {
                    this.setState({latitude: responseJson.map.channel.map.latitude})
                }
                if (responseJson.map.channel.map.longitude) {
                    this.setState({longitude: responseJson.map.channel.map.longitude})
                }
                if (responseJson.map.channel.map.metadata) {
                    this.setState({metadata: responseJson.map.channel.map.metadata})
                }
                if (responseJson.map.channel.map.elevation) {
                    this.setState({elevation: responseJson.map.channel.map.elevation})
                }
                this.setState({selectedTab: "graph"})
                this.forceUpdate()
            })
            .catch((error) => {
                console.error(error);
            }).finally(() => (this.setState({isLoading: false})));
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({dimensions: {width: window.innerWidth, height: (window.innerHeight - 80)}});
    }

    render() {
        const handleDismiss = () => this.setState({showAlert: false});
        const {thingSpeakFieldID} = this.state.thingSpeakFieldID;
        const fields = [1, 2, 3, 4, 5, 6, 7, 8];
        const optionItems = fields.map((field) => {
            let fieldName = "field_".concat(field)
            if (this.state[fieldName]) {
                return (<option value={field}>{this.state[fieldName]}</option>)
            }
        })
        return (
            <Container fluid>
                <Tabs defaultActiveKey="config" id="tabs" activeKey={this.state.selectedTab}
                      onSelect={key => this.setState({selectedTab: key})}>
                    <Tab eventKey="config" title="Configurator">
                        <Form.Row>
                            <Col sm={4}>
                                <Form.Label>ThingSpeak ID</Form.Label>
                                <Form.Group controlId="validThingSpeak">
                                    <Form.Control value={this.state.thingSpeakID} onChange={this.handleThingSpeakID}
                                                  type="text" placeholder="ThingSpeak ID" required/>
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid ThingSpeakID.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="validThingSpeakFieldID">
                                    <Form.Control value={this.state.thingSpeakAPIKey}
                                                  onChange={this.handleThingSpeakAPIKey}
                                                  type="text" placeholder="Read API Key" required/>
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid ThingSpeak API key.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="validDate">
                                    <Form.Label>Select Date: </Form.Label>
                                    <DatePicker dateFormat="yyyy-MM-dd"
                                                selected={this.state.endDate}
                                                onChange={this.handleDatePicker}
                                    />
                                </Form.Group>

                                <Form.Group controlId="validNumDays">
                                    <Form.Control value={this.state.numDays} onChange={this.handleNumDays}
                                                  type="text"
                                                  placeholder="Number of Days"
                                                  isInvalid={this.state.numDays > 31}
                                                  required/>
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a number less than 31.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button variant="primary" disabled={this.state.isLoading}
                                        onClick={!this.state.isLoading ? this.thingSpeakValidatorClickHandler : null}>
                                    {this.state.isLoading ? <Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    /> : 'Load Channel'}
                                </Button>
                                <Button variant={!this.state.channelNotVerified ? 'primary' : 'danger'}
                                        disabled={(this.state.channelNotVerified || this.state.isLoading)}
                                        onClick={!(this.state.channelNotVerified || this.state.isLoading) ? this.refreshClickHandler : null}>
                                    {(this.state.isLoading) ? <Spinner
                                        as="span"
                                        animation="grow"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    /> : ''}
                                    {(this.state.channelNotVerified) ? 'Load Channel First' : 'Load Data'}
                                </Button>
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            {this.state.showAlert &&
                            <Alert variant="danger" onClose={handleDismiss} dismissible>
                                <Alert.Heading>{this.state.errorHeading}</Alert.Heading>
                                {this.state.errorBody}
                            </Alert>
                            }
                        </Form.Row>
                        <hr/>
                        {!this.state.isLoading && this.state.channelDescription &&
                        <p><h5>Channel Description</h5>{this.state.channelDescription} </p>}
                        {!this.state.isLoading && this.state.latitude &&
                        <p><b>Latitude:</b> {this.state.latitude}  </p>}
                        {!this.state.isLoading && this.state.longitude &&
                        <p><b>Longitude:</b> {this.state.longitude}</p>}
                        {!this.state.isLoading && this.state.metadata && <p><b>Metadata:</b> {this.state.metadata}</p>}
                        {!this.state.isLoading && this.state.elevation &&
                        <p><b>Longitude:</b> {this.state.elevation}</p>}
                    </Tab>
                    <Tab id="graph" eventKey="graph"
                         style={{height: this.state.dimensions.height, width: this.state.dimensions.width}}
                         title="Graph">
                        <Row className="justify-content-md-left">
                            <Col sm={1}>
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        Options
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item
                                            onClick={!(this.state.channelNotVerified || this.state.isLoading) ? this.barGraphSelector : null}>Bar
                                            Graph</Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={!(this.state.channelNotVerified || this.state.isLoading) ? this.bubbleGraphSelector : null}>Bubble
                                            Graph</Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={!(this.state.channelNotVerified || this.state.isLoading) ? this.lineGraphSelector : null}>Line
                                            Graph</Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={!(this.state.channelNotVerified || this.state.isLoading) ? this.setDataSummaryInterval30 : null}>Summarise
                                            Data (30min)</Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={!(this.state.channelNotVerified || this.state.isLoading) ? this.setDataSummaryInterval60 : null}>Summarise
                                            Data (60min)</Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={!(this.state.channelNotVerified || this.state.isLoading) ? this.setDataSummaryIntervalDaily : null}>Summarise
                                            Data (daily)</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Col sm={4}>
                                <Form.Group controlId="validFieldID">
                                    <Form.Control as="select" value={thingSpeakFieldID}
                                                  onChange={this.handleThingSpeakFieldID}
                                                  disabled={(this.state.channelNotVerified || this.state.isLoading)}
                                                  type="text" required>
                                        {optionItems}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        {this.state.lineGraphBoolean &&
                        <Line
                            data={this.state.config}
                            height={this.state.dimensions.height}
                            width={this.state.dimensions.width}
                            options={{
                                maintainAspectRatio: false,
                                responsive: true,
                                title: {
                                    display: true,
                                    text: `ESP8266 `
                                },
                                scales: {
                                    xAxes: [{
                                        type: 'time',
                                        display: true,
                                        scaleLabel: {
                                            display: true,
                                            labelString: "time",
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
                        {this.state.bubbleGraphBoolean &&
                        <Bubble
                            data={this.state.config}
                            height={this.state.dimensions.height}
                            width={this.state.dimensions.width}
                            options={{
                                maintainAspectRatio: false,
                                responsive: true,
                                title: {
                                    display: true,
                                    text: `ESP8266 `
                                },
                                scales: {
                                    xAxes: [{
                                        type: 'time',
                                        display: true,
                                        scaleLabel: {
                                            display: true,
                                            labelString: "time",
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
                        {this.state.barGraphBoolean &&
                        <Bar
                            data={this.state.config}
                            height={this.state.dimensions.height}
                            width={this.state.dimensions.width}
                            options={{
                                maintainAspectRatio: false,
                                responsive: true,
                                title: {
                                    display: true,
                                    text: `ESP8266 `
                                },
                                scales: {
                                    xAxes: [{
                                        type: 'time',
                                        display: true,
                                        scaleLabel: {
                                            display: true,
                                            labelString: "time",
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


                    </Tab>
                </Tabs>
            </Container>
        )
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


export default App;
