import React, {Component} from 'react';
import {instanceOf} from 'prop-types';


import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-datepicker/dist/react-datepicker.css";
import 'react-bootstrap-timezone-picker/dist/react-bootstrap-timezone-picker.min.css';
import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Toast from 'react-bootstrap/Toast';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import moment from 'moment-timezone';
import {Activity, BarChart2, HelpCircle, Info, Settings, Share2, TrendingDown, TrendingUp} from 'react-feather';
import {Cookies, withCookies} from 'react-cookie';
import distinctColors from 'distinct-colors';
import TZLookup from 'tz-lookup';

/**
 * Tab contents and functions.
 */
import HelpTab from './HelpTab';
import InfoTab from "./InfoTab";
import ConfigTab from "./ConfigTab";
import ChartTab from "./ChartTab";
import ChannelSelector from "./ChannelSelector";
import {
    barGraphSelector,
    bubbleGraphSelector,
    closeToast,
    convertMSLP,
    getLatestData,
    handleDatePicker,
    handleNumDays,
    handleThingSpeakAPIKey,
    handleThingSpeakFieldID,
    handleThingSpeakID,
    handleThingSpeakPeriod,
    handleTimeZone,
    lineGraphSelector,
    randomColor,
    refreshClickHandler,
    setDataSummaryInterval30,
    setDataSummaryInterval60,
    setDataSummaryIntervalDaily,
    setToast,
    thingSpeakValidatorClickHandler,
    toggleFill,
    toggleLiveUpdates,
    updateWindowDimensions
} from "./Functions";
import ChartFunctionsMenu from "./ChartFunctionsMenu";
import Share from "./Share";


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
            thingSpeakFieldID: 1, //cookies.get('thingSpeakFieldID') || '1',
            thingSpeakFieldName: 'sensor',
            thingSpeakPeriod: '',
            xLabel: 'time',
            startDate: '',
            //endDate: new Date(), // Don't set as we will not get the latest data without page reload.
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
            msgs: [],
            multipleQueries: false,
            finalEntry: '',
            liveUpdates: false
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
        this.toggleLiveUpdates = toggleLiveUpdates.bind(this)
        this.getLatestData = getLatestData.bind(this)
        this.tz_lookup = TZLookup.bind(this)

    }

    componentDidMount() {
        // Get our windows dimensions and use it to size the Div that contains our graph.
        // If you size the graph directly it will continue to enlarge and act strange during scroll events.
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        // Run out getLatestData() function from the beginning. It will only fire if the liveUpdates is not false.
        this.timer = setInterval(() => this.getLatestData(), 15000)

        // Get URL parameters. These allow graph to be shared or to open up graphs from Channel Browser.
        const windowUrl = window.location.search;
        const params = new URLSearchParams(windowUrl)
        if (params.get('startDate')) {
            this.setState({startDate: new Date(moment(params.get('startDate')))})
        }
        if (params.get('endDate')) {
            this.setState({endDate: new Date(moment(params.get('endDate')))})
        }
        if (params.get('fieldID')) {
            this.setState({thingSpeakFieldID: params.get('fieldID')})
        }
        if (params.get)
            if (params.get('id')) {
                // If we have an ID. Run the graph.
                this.setState({thingSpeakID: params.get('id')}, () => {
                    this.thingSpeakValidatorClickHandler()
                })
            } else {
                // Else if we have a cookie run that.
                const {cookies} = this.props;
                if (cookies.get('thingSpeakID')) {
                    this.thingSpeakValidatorClickHandler();
                }
            }

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

        const xLabel = (this.state.config.datasets[0].data.length > 0) ? moment(this.state.config.datasets[0].data[this.state.config.datasets[0].data.length - 1].x).format("MMM DD, YYYY HH:mm:ss a") + " to " + moment(this.state.config.datasets[0].data[0].x).format("MMM DD, YYYY HH:mm:ss a") : "Time"

        const minMaxLatest = this.state.config.datasets.map((_, index) => {
            return (
                <Row key={index}>
                    {((typeof this.state.config.datasets[index].min !== "undefined") && this.state.config.datasets[index].min_time) &&
                    <Col xs={4}>
                        <span><TrendingDown/></span>
                        <mark>
                            <strong>{this.state.config.datasets[index].min.toFixed(2)}, {this.state.config.datasets[index].min_time.fromNow()}</strong>
                        </mark>
                    </Col>}
                    {((typeof this.state.config.datasets[index].max !== "undefined") && this.state.config.datasets[index].max_time) &&
                    <Col xs={4}><span><TrendingUp/></span>
                        <mark>
                            <strong>{this.state.config.datasets[index].max.toFixed(2)}, {this.state.config.datasets[index].max_time.fromNow()} </strong>
                        </mark>
                    </Col>
                    }
                    {((typeof this.state.config.datasets[index].latest !== "undefined") && this.state.config.datasets[index].latest_time) &&
                    <Col xs={4}>
                        <span><Activity/></span>
                        <mark>
                            <strong>{this.state.config.datasets[index].latest.toFixed(2)}, {this.state.config.datasets[index].latest_time.fromNow()} </strong>
                        </mark>
                    </Col>}
                </Row>
            )
        })
        // These are the Toast messages. They auto timeout.
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
        // This is for sharing graphs. It grabs the first and last entries in the graph and converts them to ISO as other types cannot be sent in a URL.
        const firstEntry = (this.state.config.datasets[0].data.length > 0) ? this.state.config.datasets[0].data[this.state.config.datasets[0].data.length - 1].x.toISOString() : ''
        const lastEntry = (this.state.config.datasets[0].data.length > 0) ? this.state.config.datasets[0].data[length].x.toISOString() : ''
        const thingSpeakID = this.state.thingSpeakID ? `id=${this.state.thingSpeakID}` : ''
        const fieldID = this.state.thingSpeakFieldID ? `&fieldID=${this.state.thingSpeakFieldID}` : ''
        const startDate = firstEntry ? `&startDate=${firstEntry}` : ''
        const endDate = lastEntry ? `&endDate=${lastEntry}` : ''
        const urlBuilder = encodeURI(`https://opens3.net/channel-grapher.html?${thingSpeakID}${fieldID}${startDate}${endDate}`)
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
                    style={{outline: 'none'}}
                >
                    <Tab eventKey="Graph"
                         disabled={(this.state.channelNotVerified || this.state.isLoading)}
                         title={<span> <BarChart2
                             size={(this.state.key === "Graph") ? 30 : 24}/> {(this.state.isLoading && !this.state.channelNotVerified) ?
                             <Spinner
                                 as="span"
                                 animation="grow"
                                 size="sm"
                                 role="status"
                                 aria-hidden="true"
                             /> : ''}</span>

                         }>
                        <Row style={{marginTop: 5,}}>
                            <Col xs={2}>
                                <ChartFunctionsMenu isLoading={this.state.isLoading}
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
                                                    lineGraphBoolean={this.state.lineGraphBoolean}
                                                    barGraphBoolean={this.state.barGraphBoolean}
                                                    bubbleGraphBoolean={this.state.bubbleGraphBoolean}
                                                    dataSummaryInterval={this.state.dataSummaryInterval}
                                />
                            </Col>
                            <Col>
                                <ChannelSelector isLoading={this.state.isLoading}
                                                 channelNotVerified={this.state.channelNotVerified}
                                                 thingSpeakFieldID={this.state.thingSpeakFieldID}
                                                 handleThingSpeakFieldID={this.handleThingSpeakFieldID}
                                                 optionItems={optionItems}
                                />
                            </Col>
                        </Row>
                        <ChartTab dimensions={this.state.dimensions}
                                  lineGraphBoolean={this.state.lineGraphBoolean}
                                  barGraphBoolean={this.state.barGraphBoolean}
                                  bubbleGraphBoolean={this.state.bubbleGraphBoolean}
                                  channelNotVerified={this.state.channelNotVerified}
                                  thingSpeakFieldName={this.state.thingSpeakFieldName}
                                  config={this.state.config}
                                  channelTitle={this.state.channelTitle}
                                  xLabel={xLabel}
                        />
                        {minMaxLatest}
                    </Tab>

                    <Tab eventKey="Config"
                         title={<span><Settings
                             size={(this.state.key === "Config") ? 30 : 24}/> {(this.state.isLoading && this.state.channelNotVerified) ?
                             <Spinner
                                 as="span"
                                 animation="grow"
                                 size="sm"
                                 role="status"
                                 aria-hidden="true"
                             /> : ''}</span>}>
                        <br/>
                        <ConfigTab thingSpeakID={this.state.thingSpeakID}
                                   handleThingSpeakID={this.handleThingSpeakID}
                                   thingSpeakIDList={thingSpeakIDList}
                                   thingSpeakAPIKey={this.state.thingSpeakAPIKey}
                                   handleThingSpeakAPIKey={this.handleThingSpeakAPIKey}
                                   isLoading={this.state.isLoading}
                                   thingSpeakValidatorClickHandler={this.thingSpeakValidatorClickHandler}
                                   channelNotVerified={this.state.channelNotVerified}
                                   endDate={this.state.endDate}
                                   handleDatePicker={this.handleDatePicker}
                                   handleTimeZone={this.handleTimeZone}
                                   numDays={this.state.numDays}
                                   handleNumDays={this.handleNumDays}
                                   refreshClickHandler={this.refreshClickHandler}
                                   thingSpeakPeriod={this.thingSpeakPeriod}
                                   handleThingSpeakPeriod={this.handleThingSpeakPeriod}
                                   toggleLiveUpdates={this.toggleLiveUpdates}
                                   timeZone={this.state.timeZone}
                        />
                    </Tab>
                    <Tab eventKey="Info"
                         disabled={(this.state.channelNotVerified || this.state.isLoading)}
                         title={<span> <Share2 size={(this.state.key === "Info") ? 30 : 24}/> </span>}>
                        <br/>
                        <h3>Info</h3>
                        <InfoTab
                            isLoading={this.state.isLoading}
                            latitude={this.state.latitude}
                            longitude={this.state.longitude}
                            elevation={this.state.elevation}
                            channelTitle={this.state.channelTitle}
                            channelDescription={this.state.channelDescription}
                            metadata={this.state.metadata}
                        />
                        <h3>Share</h3>
                        Share this channel including the date range and the selected field.
                        <Share url={urlBuilder} name={this.state.channelTitle} image='https://opens3.net/favicon.png'
                               size={24}/>
                    </Tab>
                    <Tab eventKey="Help"
                         title={<span> <HelpCircle size={(this.state.key === "Help") ? 30 : 24}/> </span>}>
                        <br/>
                        <HelpTab/>
                    </Tab>
                </Tabs>
            </Container>
        )
    }
}


export default withCookies(App);
