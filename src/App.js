import React, {Component} from 'react';
import {instanceOf} from 'prop-types';


import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import 'react-bootstrap-timezone-picker/dist/react-bootstrap-timezone-picker.min.css';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Toast from 'react-bootstrap/Toast';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Dropdown from 'react-bootstrap/Dropdown'
import {Bar, Bubble, Line} from 'react-chartjs-2';

import DatePicker from "react-datepicker";
import moment from 'moment-timezone';
import TimezonePicker from 'react-bootstrap-timezone-picker';
import {Activity, BarChart2, Info, Settings, Sliders, TrendingDown, TrendingUp, HelpCircle} from 'react-feather';
import {Cookies, withCookies} from 'react-cookie';

const distinctColors = require('distinct-colors')

/**
 *
 */
import HelpTab from './HelpTab';
import InfoTab from "./InfoTab";
import ConfigTab from "./ConfigTab";

class App extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state = {
            config: {
                type: 'line',
                datasets: [{
                    label: 'ThingSpeak Channel',
                    fill: true,
                    lineTension: 0,
                    pointRadius: 1,
                    borderColor: '#FFFFFF',
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
            thingSpeakID: cookies.get('thingSpeakID') || '645847',
            thingSpeakIDList: cookies.get('thingSpeakIDList') || [],
            thingSpeakAPIKey: cookies.get('thingSpeakAPIKey') || '',
            thingSpeakFieldID: cookies.get('thingSpeakFieldID') || '1',
            thingSpeakFieldName: 'sensor',
            thingSpeakPeriod: '',
            xLabel: 'time',
            startDate: '',
            endDate: new Date(),
            channelTitle: '',
            channelDescription: '',
            showAlert: '',
            numDays: '',
            dataSummaryInterval: 0,
            dataSummaryIntervalDescription: '',
            timeZone: cookies.get('timeZone') || moment.tz.guess(),
            dimensions: {height: 600},
            latitude: '',
            longitude: '',
            metadata: '',
            elevation: '',
            convertedMSLP: false,
            key: 'Config',
            palette: distinctColors({count: 56}),
            favoriteColor: cookies.get('favoriteColor') || '',
            msgs: []

        };
        this.handleDatePicker = this.handleDatePicker.bind(this)
        this.handleTimeZone = this.handleTimeZone.bind(this)
        this.refreshClickHandler = this.refreshClickHandler.bind(this)
        this.thingSpeakValidatorClickHandler = this.thingSpeakValidatorClickHandler.bind(this)
        this.handleThingSpeakID = this.handleThingSpeakID.bind(this)
        this.handleThingSpeakFieldID = this.handleThingSpeakFieldID.bind(this)
        this.handleThingSpeakAPIKey = this.handleThingSpeakAPIKey.bind(this)
        this.handleThingSpeakPeriod = this.handleThingSpeakPeriod.bind(this)
        this.handleNumDays = this.handleNumDays.bind(this)
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
        this.barGraphSelector = this.barGraphSelector.bind(this)
        this.bubbleGraphSelector = this.bubbleGraphSelector.bind(this)
        this.lineGraphSelector = this.lineGraphSelector.bind(this)
        this.setDataSummaryInterval30 = this.setDataSummaryInterval30.bind(this)
        this.setDataSummaryInterval60 = this.setDataSummaryInterval60.bind(this)
        this.setDataSummaryIntervalDaily = this.setDataSummaryIntervalDaily.bind(this)
        this.toggleFill = this.toggleFill.bind(this)
        this.randomColor = this.randomColor.bind(this)
        this.convertMSLP = this.convertMSLP.bind(this)
        this.closeToast = this.closeToast.bind(this)
        this.setToast = this.setToast.bind(this)
    }

    closeToast(index) {
        let msgs = this.state.msgs;
        delete (msgs[index]);
        this.setState({msgs});
    }

    setToast(title, message) {
        let msgs = this.state.msgs;
        let msg = {
            name: 'Set Title',
            time: new moment(),
            body: message
        };
        msg.name = title;
        msgs.push(msg);
        this.setState({msgs});
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
        let favoriteColor
        for (let i = 0; i < tempConfig.datasets.length; i++) {
            favoriteColor = this.state.palette[this.state.config.datasets.length + Math.floor(Math.random() * 10)].hex();
            tempConfig.datasets[i].borderColor = favoriteColor;
        }
        this.setState({config: tempConfig, favoriteColor})

        const {cookies} = this.props;
        const cookie = favoriteColor;
        cookies.set('favoriteColor', cookie);
    }

    handleDatePicker(date) {
        // days have changed, reset state
        const defaultConfig = {
            type: 'line',
            datasets: [{
                label: 'ThingSpeak Channel',
                fill: true,
                lineTension: 0,
                pointRadius: 1,
                borderColor: this.state.palette[this.state.config.datasets.length + 1].hex(),
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

    handleTimeZone(timeZone) {
        const {cookies} = this.props;
        const cookie = timeZone;
        cookies.set('timeZone', cookie);
        this.setState({timeZone}, () => {
            this.refreshClickHandler()
        })
    }

    handleThingSpeakID(e) {
        this.setState({channelNotVerified: true, thingSpeakID: e.target.value});
    }

    handleThingSpeakFieldID(e) {
        // when field is changed, scrap state of older graphs
        const {cookies} = this.props;
        const cookie = e.target.value;
        cookies.set('thingSpeakFieldID', cookie);
        const defaultConfig = {
            type: 'line',
            datasets: [{
                label: 'ThingSpeak Channel',
                fill: true,
                lineTension: 0,
                pointRadius: 1,
                borderColor: this.state.palette[this.state.config.datasets.length + 1].hex(),
                data: [],
            }]
        }
        // reset graph to line
        this.lineGraphSelector()
        this.setState({
            thingSpeakFieldID: e.target.value,
            convertedMSLP: false,
            config: defaultConfig,
            dataSetID: 0,
            dataSummaryInterval: 0,
            dataSummaryIntervalDescription: '',
        }, () => {
            this.refreshClickHandler();
        })

    }

    handleThingSpeakAPIKey(e) {
        const {cookies} = this.props;
        const cookie = e.target.value;
        cookies.set('thingSpeakAPIKey', cookie);
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
                                fill: true,
                                lineTension: 0,
                                pointRadius: 1,
                                borderColor: this.state.favoriteColor ? this.state.favoriteColor : this.state.palette[this.state.config.datasets.length + 1].hex(),
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

                            for (let j = 0, len = responseJson.map.feeds.myArrayList.length; j < len; j++) {
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
                        }
                    )
                    .catch((error) => {
                        this.setToast("Error.", "Failed to do sea level pressure conversion.")
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
                    this.setToast("Error invalid settings.", "Either the settings are invalid or no data matches the time period." + responseJson.toString())
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
                console.log(this.state)
                const {cookies} = this.props;
                const thingSpeakIDCookie = this.state.thingSpeakID;
                let thingSpeakIDList = cookies.get('thingSpeakIDList') || [];
                thingSpeakIDList.push(thingSpeakIDCookie);
                thingSpeakIDList = [...new Set(thingSpeakIDList)];
                cookies.set('thingSpeakID', thingSpeakIDCookie);
                cookies.set('thingSpeakIDList', thingSpeakIDList);
                this.setState({channelNotVerified: false, showOptions: true, showChannel: true, thingSpeakIDList})
                this.refreshClickHandler()
            })
            .catch((error) => {
                this.setToast("Error accessing channel.", error.toString());
                console.log(error);
            }).finally(() => (this.setState({isLoading: false})));
    }

    refreshClickHandler(dID) {
        // update the timezone to match the new one
        moment.tz.setDefault(this.state.timeZone)
        this.setState({isLoading: true})
        let fieldName = "field_".concat(this.state.thingSpeakFieldID)
        if (typeof this.state[fieldName] === "undefined") {
            this.setState({thingSpeakFieldID: 1})
        }
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
                    fill: true,
                    lineTension: 0,
                    pointRadius: 1.5,
                    borderColor: this.state.favoriteColor ? this.state.favoriteColor : this.state.palette[this.state.config.datasets.length + 1].hex(),
                    borderWidth: 2,
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
                    if (parseFloat(responseJson.map.feeds.myArrayList[i].map[`field${this.state.thingSpeakFieldID}`]) <= tempConfig.datasets[dataSetID].min) {
                        tempConfig.datasets[dataSetID].min_time = moment(responseJson.map.feeds.myArrayList[i].map.created_at);
                        tempConfig.datasets[dataSetID].min = parseFloat(responseJson.map.feeds.myArrayList[i].map[`field${this.state.thingSpeakFieldID}`]);
                    }
                    if (parseFloat(responseJson.map.feeds.myArrayList[i].map[`field${this.state.thingSpeakFieldID}`]) >= tempConfig.datasets[dataSetID].max) {
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
                console.log(this.state)
            })
            .catch((error) => {
                this.setToast("Error retrieving channel data.", error.toString())
            }).finally(() => {
                this.setState({isLoading: false});
            }
        );
    }

    componentDidMount() {
        const {cookies} = this.props;
        const cookie = 1;
        const user = parseInt(cookies.get('userBoolean'));
        if (user !== 1) {
            this.setState({key: "Help"})
            this.setToast("Welcome!", "Click on the question mark item for instructions.");
        } else {
            this.setToast("Welcome back!", "Welcome back! Loading your previous session....")
            this.thingSpeakValidatorClickHandler();
        }
        cookies.set('userBoolean', cookie);
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }


    updateWindowDimensions() {
        this.setState({dimensions: {width: window.innerWidth, height: window.innerHeight - 150}})
    }


    render() {
        const thingSpeakIDs = this.state.thingSpeakIDList;
        const fields = [1, 2, 3, 4, 5, 6, 7, 8];
        const xLabel = this.state.xLabel
        const optionItems = fields.map((field) => {
            let fieldName = "field_".concat(field)
            if (this.state[fieldName]) {
                return (<option value={field}>{this.state[fieldName]}</option>)
            }
        })
        const thingSpeakIDList = thingSpeakIDs.map((id) => {
            return (<option key={id} value={id}>{id}</option>)
        })

        const minMaxLatest = this.state.config.datasets.map((_, index) => {
            return (
                <Row key={index}>
                    <Col xs={4}>
                        {((typeof this.state.config.datasets[index].min !== "undefined") && this.state.config.datasets[index].min_time) &&
                        <div>
                            <span><TrendingDown/></span>
                            <mark>
                                <strong>{this.state.config.datasets[index].min.toFixed(2)}, {this.state.config.datasets[index].min_time.fromNow()}</strong>
                            </mark>
                        </div>}
                    </Col>
                    <Col xs={4}>
                        {((typeof this.state.config.datasets[index].max !== "undefined") && this.state.config.datasets[index].max_time) &&
                        <div><span><TrendingUp/></span>
                            <mark>
                                <strong>{this.state.config.datasets[index].max.toFixed(2)}, {this.state.config.datasets[index].max_time.fromNow()} </strong>
                            </mark>
                        </div>
                        }
                    </Col>
                    <Col xs={4}>
                        {((typeof this.state.config.datasets[index].latest !== "undefined") && this.state.config.datasets[index].latest_time) &&
                        <div>
                            <span><Activity/></span>
                            <mark>
                                <strong>{this.state.config.datasets[index].latest.toFixed(2)}, {this.state.config.datasets[index].latest_time.fromNow()} </strong>
                            </mark>
                        </div>}
                    </Col>
                </Row>)
        })
        const messages = this.state.msgs;
        const msgList = messages.map((_, index) => {
            return (
                <Toast key={index + new Date()} show={true} onClose={() => this.closeToast(index)} autohide>
                    <Toast.Header>
                        <img style={{width: 20, height: 20}} src="favicon.png" className="rounded mr-2" alt=""/>
                        <strong className="mr-auto">{messages[index].name}</strong>
                        <small>{messages[index].time.fromNow()}</small>
                    </Toast.Header>
                    <Toast.Body>{messages[index].body}</Toast.Body>
                </Toast>
            )
        });

        return (
            <Container fluid>
                <div style={{
                    position: 'fixed',
                    top: 1,
                    right: 1,
                    zIndex: 100,
                }}>
                    {msgList}
                </div>
                <Tabs
                    id="tabs"
                    activeKey={this.state.key}
                    size="sm"
                    onSelect={key => this.setState({key})}
                >
                    <Tab eventKey="Graph" disabled={(this.state.channelNotVerified || this.state.isLoading)}
                         title={<span> <BarChart2/> {(this.state.isLoading && !this.state.channelNotVerified) ? <Spinner
                             as="span"
                             animation="grow"
                             size="sm"
                             role="status"
                             aria-hidden="true"
                         /> : ''}</span>}>
                        <br/>
                        <Row className="justify-content-md-left">
                            <Col>
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        {<span> <Sliders/> </span>}
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
                                    <Form.Control as="select" value={this.state.thingSpeakFieldID}
                                                  onChange={this.handleThingSpeakFieldID}
                                                  disabled={(this.state.channelNotVerified || this.state.isLoading)}
                                                  type="text" required>
                                        {optionItems}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <div ref="minMaxBox">
                            {minMaxLatest}
                        </div>
                    </Tab>
                    <Tab eventKey="Config"
                         title={<span><Settings/> {(this.state.isLoading && this.state.channelNotVerified) ? <Spinner
                             as="span"
                             animation="grow"
                             size="sm"
                             role="status"
                             aria-hidden="true"
                         /> : ''}</span>}>
                        <br/>
                        <ConfigTab thingSpeakID={this.state.thingSpeakID}
                                   handleThingSpeakID={this.handleThingSpeakID}
                                   thingSpeakIDList={this.state.thingSpeakIDList}
                                   thingSpeakAPIKey={this.state.thingSpeakAPIKey}
                                   handleThingSpeakAPIKey={this.handleThingSpeakAPIKey}
                                   isLoading={this.state.isLoading}
                                   thingSpeakValidatorClickHandler={this.thingSpeakValidatorClickHandler}
                                   channelNotVerified={this.state.channelNotVerified}
                                   thingSpeakPeriod={this.state.thingSpeakPeriod}
                                   endDate={this.state.endDate}
                                   handleDatePicker={this.handleDatePicker}
                                   handleTimeZone={this.handleTimeZone}
                                   numDays={this.state.numDays}
                                   handleNumDays={this.handleNumDays}
                        />
                    </Tab>
                    <Tab eventKey="Info"
                         disabled={(this.state.channelNotVerified || this.state.isLoading)}
                         title={<span> <Info/> </span>}>
                        <br/>
                        <InfoTab
                            isLoading={this.state.isLoading}
                            latitude={this.state.latitude}
                            longitude={this.state.longitude}
                            elevation={this.state.elevation}
                            channelTitle={this.state.channelTitle}
                            channelDescription={this.state.channelDescription}
                            metadata={this.state.metadata}
                        />
                    </Tab>
                    <Tab eventKey="Help"
                         title={<span> <HelpCircle/> </span>}>
                        <br/>
                    <HelpTab/>
                    </Tab>
                </Tabs>
            </Container>
        )
    }
}


export default withCookies(App);
