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
import ChartComponent, {Bar, Bubble, Line} from 'react-chartjs-2';

import DatePicker from "react-datepicker";
import moment from 'moment-timezone';
import TimezonePicker from 'react-bootstrap-timezone-picker';
import {Activity, BarChart2, Info, Settings, Sliders, TrendingDown, TrendingUp, HelpCircle} from 'react-feather';
import {Cookies, withCookies} from 'react-cookie';

const distinctColors = require('distinct-colors')

/**
 * Tab contents and functions.
 */
import HelpTab from './HelpTab';
import InfoTab from "./InfoTab";
import ConfigTab from "./ConfigTab";
import ChartTab from "./ChartTab";
import ChartMenu from "./ChartMenu";
import {
    handleDatePicker,
    handleTimeZone,
    refreshClickHandler,
    thingSpeakValidatorClickHandler,
    handleThingSpeakID,
    handleThingSpeakFieldID,
    handleThingSpeakAPIKey,
    handleThingSpeakPeriod,
    handleNumDays,
    updateWindowDimensions,
    barGraphSelector,
    bubbleGraphSelector,
    lineGraphSelector,
    setDataSummaryInterval30,
    setDataSummaryInterval60,
    setDataSummaryIntervalDaily,
    toggleFill,
    randomColor,
    convertMSLP,
    closeToast,
    setToast
} from "./Functions";

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
        this.handleDatePicker = handleDatePicker.bind(this)
        this.handleTimeZone = handleTimeZone.bind(this)
        this.refreshClickHandler = refreshClickHandler.bind(this)
        this.thingSpeakValidatorClickHandler = thingSpeakValidatorClickHandler.bind(this)
        this.handleThingSpeakID = handleThingSpeakID.bind(this)
        this.handleThingSpeakFieldID = handleThingSpeakFieldID.bind(this)
        this.handleThingSpeakAPIKey = handleThingSpeakAPIKey.bind(this)
        this.handleThingSpeakPeriod = handleThingSpeakPeriod.bind(this)
        this.handleNumDays = handleNumDays.bind(this)
        this.updateWindowDimensions = updateWindowDimensions.bind(this)
        this.barGraphSelector = barGraphSelector.bind(this)
        this.bubbleGraphSelector = bubbleGraphSelector.bind(this)
        this.lineGraphSelector = lineGraphSelector.bind(this)
        this.setDataSummaryInterval30 = setDataSummaryInterval30.bind(this)
        this.setDataSummaryInterval60 = setDataSummaryInterval60.bind(this)
        this.setDataSummaryIntervalDaily = setDataSummaryIntervalDaily.bind(this)
        this.toggleFill = toggleFill.bind(this)
        this.randomColor = randomColor.bind(this)
        this.convertMSLP = convertMSLP.bind(this)
        this.closeToast = closeToast.bind(this)
        this.setToast = setToast.bind(this)
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

    render() {
        const thingSpeakIDs = this.state.thingSpeakIDList;
        const thingSpeakIDList = thingSpeakIDs.map((id) => {
            return (<option key={id} value={id}>{id}</option>)
        })
        const fields = [1, 2, 3, 4, 5, 6, 7, 8];
        const optionItems = fields.map((field) => {
            let fieldName = "field_".concat(field)
            if (this.state[fieldName]) {
                return (<option value={field}>{this.state[fieldName]}</option>)
            }
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
                         /> : ''}</span>

                         }>
                        <ChartMenu isLoading={this.state.isLoading}
                                   channelNotVerified={this.state.channelNotVerified}
                                   barGraphSelector={this.barGraphSelector}
                                   bubbleGraphSelector={this.bubbleGraphSelector}
                                   lineGraphSelector={this.lineGraphSelector}
                                   toggleFill={this.toggleFill}
                                   randomColor={this.randomColor}
                                   convertMSLP={this.convertMSLP}
                                   setDataSummaryInterval30={this.setDataSummaryInterval30}
                                   setDataSummaryInterval60={this.setDataSummaryInterval60}
                                   setDataSummaryIntervalDaily={this.setDataSummaryIntervalDaily}
                                   thingSpeakFieldID={this.state.thingSpeakFieldID}
                                   handleThingSpeakFieldID={this.handleThingSpeakFieldID}
                                   optionItems={optionItems}

                        />

                        <ChartTab dimensions={this.state.dimensions}
                                  lineGraphBoolean={this.state.lineGraphBoolean}
                                  barGraphBoolean={this.state.barGraphBoolean}
                                  bubbleGraphBoolean={this.state.bubbleGraphBoolean}
                                  channelNotVerified={this.state.channelNotVerified}
                                  config={this.state.config}

                        />
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
