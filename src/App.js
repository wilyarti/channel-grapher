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
import moment from 'moment-timezone';


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
            showOptions: false,
            optionsHeading: 'Graph Options',
            showChannel: false,
            channelHeading: '',
            channelBody: '',
            thingSpeakID: '645847',
            thingSpeakFieldID: '1',
            thingSpeakFieldName: 'sensor',
            thingSpeakPeriod: '',
            xLabel: 'time',
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
            dimensions: {width: 300, height: 300},
            timeZone: moment.tz.guess(),
            latitude: '',
            longitude: '',
            metadata: '',
            elevation: '',
            virgin: true,
            convertedMSLP: false,
        };
        this.handleDatePicker = this.handleDatePicker.bind(this);
        this.refreshClickHandler = this.refreshClickHandler.bind(this)
        this.thingSpeakValidatorClickHandler = this.thingSpeakValidatorClickHandler.bind(this)
        this.handleThingSpeakID = this.handleThingSpeakID.bind(this)
        this.handleThingSpeakFieldID = this.handleThingSpeakFieldID.bind(this)
        this.handleThingSpeakAPIKey = this.handleThingSpeakAPIKey.bind(this)
        this.handleThingSpeakPeriod = this.handleThingSpeakPeriod.bind(this)
        this.handleNumDays = this.handleNumDays.bind(this)
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.barGraphSelector = this.barGraphSelector.bind(this)
        this.bubbleGraphSelector = this.bubbleGraphSelector.bind(this)
        this.lineGraphSelector = this.lineGraphSelector.bind(this)
        this.setDataSummaryInterval30 = this.setDataSummaryInterval30.bind(this)
        this.setDataSummaryInterval60 = this.setDataSummaryInterval60.bind(this)
        this.setDataSummaryIntervalDaily = this.setDataSummaryIntervalDaily.bind(this)
        this.toggleFill = this.toggleFill.bind(this)
        this.randomColor = this.randomColor.bind(this)
        this.convertMSLP = this.convertMSLP.bind(this)
    }

    barGraphSelector() {
        this.setState({lineGraphBoolean: false, barGraphBoolean: true, bubbleGraphBoolean: false})
    }

    lineGraphSelector() {
        this.setState({lineGraphBoolean: true, barGraphBoolean: false, bubbleGraphBoolean: false})
    }

    toggleFill() {
        let tempConfig = this.state.config
        tempConfig.datasets[0].fill = !tempConfig.datasets[0].fill
        this.setState({config: tempConfig})
    }

    bubbleGraphSelector() {
        this.setState({lineGraphBoolean: false, barGraphBoolean: false, bubbleGraphBoolean: true})
    }

    randomColor() {
        let tempConfig = this.state.config
        for (let i = 0; i < tempConfig.datasets.length; i++) {
            tempConfig.datasets[i].borderColor = getRandomColor()
        }
        this.setState({config: tempConfig})
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
        this.setState({
            startDate: start, endDate: date, config: defaultConfig, dataSetID: 0, dataSummaryInterval: 0,
            dataSummaryIntervalDescription: ''
        })
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
            if (this.state.endDate) {
                const start = moment(this.state.endDate).subtract(e.target.value, "days");
                this.setState({
                    startDate: start, numDays: e.target.value
                })
            }
        }
    }

    handleThingSpeakPeriod(e) {
        this.setState({thingSpeakPeriod: e.target.value}, () => {
            this.refreshClickHandler()
        })
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

    convertMSLP() {
        if (!this.state.convertedMSLP) {
            let currentFieldName = this.state['field_'.concat(this.state.thingSpeakFieldID)]
            if (!currentFieldName.toUpperCase().match(/PRESSURE/)) {
                alert("Selected field is not pressure.")
                return
            }

            let temperatureFieldID = 0
            for (let i = 1; i < 9; i++) {
                let fieldName = 'field_'.concat(i)
                if (this.state[fieldName].toUpperCase().match(/TEMPERATURE/)) {
                    temperatureFieldID = i
                }
            }
            if (temperatureFieldID != 0) {
                this.setState({isLoading: true})
                const APIKEY = this.state.thingSpeakAPIKey ? `&api_key=${this.state.thingSpeakAPIKey}` : ''
                const SUM = this.state.dataSummaryInterval ? `&sum=${this.state.dataSummaryInterval}` : ''
                const START = this.state.startDate ? `&start=${moment(this.state.startDate).format("YYYY-MM-DD")}%2000:00:00` : `&start=${moment(this.state.endDate).subtract(1, "days").format("YYYY-MM-DD")}%2000:00:00`
                const END = this.state.endDate ? `&end=${moment(this.state.endDate).format("YYYY-MM-DD")}%2023:59:59` : ''
                const STATUS = `&status=${true}`
                const METADATA = `&metadata=${true}`
                const LOCATION = `&location=${true}`
                const TIMEZONE = `&timezone=${this.state.timeZone}`
                const PERIOD = `&minutes=${this.state.thingSpeakPeriod}`
                const thingSpeakQuery = JSON.stringify({url: `https://api.thingspeak.com/channels/${this.state.thingSpeakID}/fields/${temperatureFieldID}.json?${APIKEY}${this.state.thingSpeakPeriod ? PERIOD : START + END}${END}${SUM}${STATUS}${METADATA}${LOCATION}${TIMEZONE}`})
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
                            let tempConfig = this.state.config
                            let dataSetID = tempConfig.datasets.length
                            tempConfig.datasets[dataSetID] = {
                                label: 'MSLP',
                                //			backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                                //		borderColor: window.chartColors.red,
                                fill: false,
                                lineTension: 0,
                                pointRadius: 1,
                                borderColor: getRandomColor(),
                                borderWidth: .5,
                                data: [],
                            }
                            let hFloat
                            if (!this.state.elevation) {
                                let x;
                                x = prompt("Enter Altitude of Sensor Readings:", "0");
                                hFloat = parseFloat(x);
                                if (hFloat < 0 || hFloat > 10000) {
                                    alert("Error. Enter a valid number.")
                                }
                            } else {
                                hFloat = this.state.elevation
                            }

                            for (let j = 0,  len = responseJson.map.feeds.myArrayList.length; j < len; j++) {
                                if (tempConfig.datasets[0].data[j].x.isSame(moment(responseJson.map.feeds.myArrayList[j].map.created_at))) {
                                    let pSeaLevelFloat = 0.0;
                                    const tCelFloat = parseFloat(responseJson.map.feeds.myArrayList[j].map[`field${temperatureFieldID}`])
                                    const pAbsFloat = tempConfig.datasets[0].data[j].y
                                    let fltP1 = Math.pow((1 - ((0.0065 * hFloat) / (tCelFloat + (0.0065 * hFloat) + 273.15))), -5.257)
                                    pSeaLevelFloat = pAbsFloat * fltP1
                                    tempConfig.datasets[dataSetID].data.push({
                                        x: moment(responseJson.map.feeds.myArrayList[j].map.created_at),
                                        y: pSeaLevelFloat
                                    })
                                } else {
                                    console.log("Time differs.")
                                    console.log(`Temp: ${moment(responseJson.map.feeds.myArrayList[j].map.created_at)}`)
                                    console.log(`Pres: ${tempConfig.datasets[0].data[j].x}`)
                                }
                            }
                        this.setState({config: tempConfig, convertedMSLP: true})
                        this.forceUpdate()
                        }
                    )
                    .catch((error) => {
                        console.error(error);
                    }).finally(() => (this.setState({isLoading: false})));

            }
        } else {
            alert("Mean Sea Level Pressure Conversion already performed.")
        }
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
                this.setState({channelNotVerified: false, showOptions: true, showChannel: true})
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
        const START = this.state.startDate ? `&start=${moment(this.state.startDate).format("YYYY-MM-DD")}%2000:00:00` : `&start=${moment(this.state.endDate).subtract(1, "days").format("YYYY-MM-DD")}%2000:00:00`
        const END = this.state.endDate ? `&end=${moment(this.state.endDate).format("YYYY-MM-DD")}%2023:59:59` : ''
        const STATUS = `&status=${true}`
        const METADATA = `&metadata=${true}`
        const LOCATION = `&location=${true}`
        const TIMEZONE = `&timezone=${this.state.timeZone}`
        const PERIOD = `&minutes=${this.state.thingSpeakPeriod}`
        const thingSpeakQuery = JSON.stringify({url: `https://api.thingspeak.com/channels/${this.state.thingSpeakID}/fields/${this.state.thingSpeakFieldID}.json?${APIKEY}${this.state.thingSpeakPeriod ? PERIOD : START + END}${END}${SUM}${STATUS}${METADATA}${LOCATION}${TIMEZONE}`})
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

                    // update values
                    if (typeof tempConfig.datasets[dataSetID].min === "undefined" || typeof tempConfig.datasets[dataSetID].max === "undefined") {
                        tempConfig.datasets[dataSetID].min_time = moment(responseJson.map.feeds.myArrayList[i].map.created_at);
                        tempConfig.datasets[dataSetID].min = parseFloat(responseJson.map.feeds.myArrayList[i].map[`field${this.state.thingSpeakFieldID}`]);
                        tempConfig.datasets[dataSetID].max_time = moment(responseJson.map.feeds.myArrayList[i].map.created_at);
                        tempConfig.datasets[dataSetID].max = parseFloat(responseJson.map.feeds.myArrayList[i].map[`field${this.state.thingSpeakFieldID}`]);

                    }
                    if (parseFloat(responseJson.map.feeds.myArrayList[i].map[`field${this.state.thingSpeakFieldID}`]) < tempConfig.datasets[dataSetID].min) {
                        tempConfig.datasets[dataSetID].min_time = moment(responseJson.map.feeds.myArrayList[i].map.created_at);
                        tempConfig.datasets[dataSetID].min = parseFloat(responseJson.map.feeds.myArrayList[i].map[`field${this.state.thingSpeakFieldID}`]);
                    }
                    if (parseFloat(responseJson.map.feeds.myArrayList[i].map[`field${this.state.thingSpeakFieldID}`]) > tempConfig.datasets[dataSetID].max) {
                        tempConfig.datasets[dataSetID].max_time = moment(responseJson.map.feeds.myArrayList[i].map.created_at);
                        tempConfig.datasets[dataSetID].max = parseFloat(responseJson.map.feeds.myArrayList[i].map[`field${this.state.thingSpeakFieldID}`]);
                    }
                }
                // add latest values
                tempConfig.datasets[dataSetID].latest_time = moment(responseJson.map.feeds.myArrayList[responseJson.map.feeds.myArrayList.length - 1].map.created_at);
                tempConfig.datasets[dataSetID].latest = parseFloat(responseJson.map.feeds.myArrayList[responseJson.map.feeds.myArrayList.length - 1].map[`field${this.state.thingSpeakFieldID}`]);

                tempConfig.datasets[dataSetID].label = this.state.dataSummaryIntervalDescription ? `${responseJson.map.channel.map.name} ${this.state.dataSummaryIntervalDescription}` : responseJson.map.channel.map.name
                const startDate = this.state.startDate ? moment(this.state.startDate).format('MMMM Do YYYY, [12:00:00 am]') : moment(this.state.endDate).subtract(1, 'days').format('MMMM Do YYYY, [12:00:00am]')
                const xLabel = startDate + " to " + moment(this.state.endDate).format('MMMM Do YYYY, [11:59:59 pm]')
                this.setState({
                    config: tempConfig,
                    key: 'Graph',
                    thingSpeakFieldName: responseJson.map.channel.map["field".concat(this.state.thingSpeakFieldID)],
                    xLabel: xLabel
                })
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
        if (this.state.virgin) {
            this.setState({dimensions: {width: window.innerWidth, height: window.innerHeight - 60}, virgin: false})
        }

    }


    render() {
        const handleDismiss = () => this.setState({showAlert: false});
        const {thingSpeakFieldID} = this.state.thingSpeakFieldID;
        const {thingSpeakPeriod} = this.state.thingSpeakPeriod;
        const fields = [1, 2, 3, 4, 5, 6, 7, 8];
        const xLabel = this.state.xLabel
        const optionItems = fields.map((field) => {
            let fieldName = "field_".concat(field)
            if (this.state[fieldName]) {
                return (<option value={field}>{this.state[fieldName]}</option>)
            }
        })
        const optionsPeriod = ['', '10', '15', '20', '30', '60', '240', '720', '1440'].map((field) => {
            return (<option value={field}>{field ? field : 'Select'} minutes</option>)
        })

        const minMaxLatest = this.state.config.datasets.map((_, index) => {
            return (
                <Row>
                    <Col>
                        {(this.state.config.datasets[index].min && this.state.config.datasets[index].min_time) && <div
                            className="bg-success small">Min: {this.state.config.datasets[index].min}, {this.state.config.datasets[index].min_time.fromNow()}</div>}
                    </Col>
                    <Col>
                        {(this.state.config.datasets[index].max && this.state.config.datasets[index].max_time) && <div
                            className="bg-danger small">Max: {this.state.config.datasets[index].max}, {this.state.config.datasets[index].max_time.fromNow()}</div>}
                    </Col>
                    <Col>
                        {(this.state.config.datasets[index].latest && this.state.config.datasets[index].latest_time) &&
                        <div
                            className="bg-info small">Latest: {this.state.config.datasets[index].latest}, {this.state.config.datasets[index].latest_time.fromNow()}</div>}
                    </Col>
                </Row>)
        })


        return (
            <Container fluid>
                <Tabs
                    id="tabs"
                    activeKey={this.state.key}
                    onSelect={key => this.setState({key})}
                >
                    <Tab eventKey="Graph" title="Graph">
                        <br/>
                        <Form inline>
                            <Form.Label>ThingSpeak ID: </Form.Label>
                            <Form.Control className="mr-sm-2" value={this.state.thingSpeakID}
                                          onChange={this.handleThingSpeakID}
                                          type="text" placeholder="ThingSpeak ID" required/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid ThingSpeakID.
                            </Form.Control.Feedback>
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
                        </Form>
                        <Row>
                            {this.state.showAlert &&
                            <Alert variant="danger" onClose={handleDismiss} dismissible>
                                <Alert.Heading>{this.state.errorHeading}</Alert.Heading>
                                {this.state.errorBody}
                            </Alert>
                            }
                        </Row>
                        <hr/>
                        <Row className="justify-content-md-left">
                            <Col>
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
                                            onClick={!(this.state.channelNotVerified || this.state.isLoading || !this.state.lineGraphBoolean) ? this.toggleFill : null}>Toggle
                                            Fill
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={!(this.state.channelNotVerified || this.state.isLoading) ? this.randomColor : null}>Random
                                            Color
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={!(this.state.channelNotVerified || this.state.isLoading) ? this.convertMSLP : null}>Convert
                                            to Mean Sea Level Pressure</Dropdown.Item>
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
                            <Col>
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
                        <Row style={{height: this.state.dimensions.height}}>
                            <Col ref="chartDiv" sm={12}>
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
                        {minMaxLatest}
                    </Tab>
                    <Tab eventKey="Config" title="Config">
                        <br/>
                        <Row>
                            <Col sm={4}>
                                <Col>
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
                                                    disabled={(this.state.channelNotVerified || this.state.isLoading || this.state.thingSpeakPeriod)}
                                                    selected={this.state.endDate}
                                                    onChange={this.handleDatePicker}
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="validPeriodSelector">
                                        <Form.Control as="select" value={thingSpeakPeriod}
                                                      onChange={this.handleThingSpeakPeriod}
                                                      type="text" required>
                                            {optionsPeriod}
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group controlId="validNumDays">
                                        <Form.Control value={this.state.numDays} onChange={this.handleNumDays}
                                                      type="text"
                                                      disabled={(this.state.channelNotVerified || this.state.isLoading || this.state.thingSpeakPeriod)}
                                                      placeholder="Number of Days"
                                                      isInvalid={this.state.numDays > 31}
                                                      required/>
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a number less than 31.
                                        </Form.Control.Feedback>
                                    </Form.Group>

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
                            </Col>
                        </Row>
                        <Row>
                            {this.state.showAlert &&
                            <Alert variant="danger" onClose={handleDismiss} dismissible>
                                <Alert.Heading>{this.state.errorHeading}</Alert.Heading>
                                {this.state.errorBody}
                            </Alert>
                            }
                        </Row>
                    </Tab>
                    <Tab eventKey="Info" title="Info">
                        <br/>
                        <Row>
                            <Col>
                                <h5>{this.state.channelTitle} </h5>
                                {this.state.channelDescription}
                                {!this.state.isLoading && this.state.latitude &&
                                <p><br/><b>Latitude:</b> {this.state.latitude}  </p>}

                                {!this.state.isLoading && this.state.longitude &&
                                <p><b>Longitude:</b> {this.state.longitude}</p>}

                                {!this.state.isLoading && this.state.elevation &&
                                <p><b>Elevation:</b> {this.state.elevation}</p>}

                                {!this.state.isLoading && this.state.metadata &&
                                <p><b>Metadata:</b> {this.state.metadata}</p>}

                            </Col>
                        </Row>
                    </Tab>
                </Tabs>
            </Container>
        )
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


export default App;
