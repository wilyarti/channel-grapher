import React, {Component} from 'react';
import DatePicker from "react-datepicker";

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Menu} from 'react-feather';
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import {Line} from 'react-chartjs-2';
import FormControl from 'react-bootstrap/FormControl'
import "react-datepicker/dist/react-datepicker.css";
import DatetimeRangePicker from 'react-datetime-range-picker';
import TimezonePicker from 'react-bootstrap-timezone-picker';
import 'react-bootstrap-timezone-picker/dist/react-bootstrap-timezone-picker.min.css';
import moment from 'moment';
import 'moment-timezone';
import ContainerDimensions from 'react-container-dimensions'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: {
                type: 'line',
                datasets: [{
                    label: 'ESP8266',
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
            thingSpeakID: '645847',
            thingSpeakFieldID: '1',
            thingSpeakAPIKey: '',
            startDate: '',
            endDate: '',
            channelTitle: '',
            channelDescription: '',
            showAlert: '',
            errorHeading: '',
            errorBody: '',
            numResults: '',
            numDays: '',
            numMinutes: '',
            timeZone: 'Australia/Brisbane',
            booleanStatus: false,
            booleanLocation: false,
            booleanMetaData: false,
            minValues: '',
            maxValues: '',
            roundPlaces: '',
            timeScale: '',
            sumMinutes: '',
            averageMinutes: '',
            medianMinutes: '',
            selectedTab: 'config',
            dimensions: {width: 600, height: 800}
        };
        this.handleDatePicker = this.handleDatePicker.bind(this);
        this.refreshClickHandler = this.refreshClickHandler.bind(this)
        this.thingSpeakValidatorClickHandler = this.thingSpeakValidatorClickHandler.bind(this)
        this.handleThingSpeakID = this.handleThingSpeakID.bind(this)
        this.handleThingSpeakFieldID = this.handleThingSpeakFieldID.bind(this)
        this.handleThingSpeakAPIKey = this.handleThingSpeakAPIKey.bind(this)
        this.handleNumResults = this.handleNumResults.bind(this)
        this.handleNumDays = this.handleNumDays.bind(this)
        this.handleNumMinutes = this.handleNumMinutes.bind(this)
        this.handleTimeZone = this.handleTimeZone.bind(this)
        this.handleDateRange = this.handleDateRange.bind(this)
        this.handleBooleanStatus = this.handleBooleanStatus.bind(this)
        this.handleBooleanMetaData = this.handleBooleanMetaData.bind(this)
        this.handleBooleanLocation = this.handleBooleanLocation.bind(this)
        this.handleMinValues = this.handleMinValues.bind(this)
        this.handleMaxValues = this.handleMaxValues.bind(this)
        this.handleRoundPlaces = this.handleRoundPlaces.bind(this)
        this.handleTimeScale = this.handleTimeScale.bind(this)
        this.handleSumMinutes = this.handleSumMinutes.bind(this)
        this.handleAverageMinutes = this.handleAverageMinutes.bind(this)
        this.handleMedianMinutes = this.handleMedianMinutes.bind(this)
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    handleDatePicker(date) {
        this.setState({
            startDate: date
        });
    }

    handleThingSpeakID(e) {
        this.setState({channelNotVerified: true})
        this.setState({thingSpeakID: e.target.value});
    }

    handleThingSpeakFieldID(e) {
        this.setState({thingSpeakFieldID: e.target.value});
    }

    handleThingSpeakAPIKey(e) {
        this.setState({channelNotVerified: true})
        this.setState({thingSpeakAPIKey: e.target.value});
    }

    handleNumResults(e) {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.setState({numResults: e.target.value})
        }
    }

    handleNumDays(e) {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.setState({numDays: e.target.value})
        }
    }

    handleNumMinutes(e) {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.setState({numMinutes: e.target.value})
        }
    }

    handleTimeZone(timezone) {
        this.setState({timeZone: timezone});
    }

    handleDateRange(date) {
        this.setState({startDate: date.start})
        this.setState({endDate: date.end})
        console.log(this.state)
    }

    handleBooleanStatus() {
        this.setState({booleanStatus: !this.state.booleanStatus});
    }

    handleBooleanMetaData() {
        this.setState({booleanMetaData: !this.state.booleanMetaData});
    }

    handleBooleanLocation() {
        this.setState({booleanLocation: !this.state.booleanLocation});
    }

    handleMinValues(e) {
        const re = /^[0-9\b\.]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.setState({minValues: e.target.value})
        }
    }

    handleMaxValues(e) {
        const re = /^[0-9\b\.]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.setState({maxValues: e.target.value})
        }
    }

    handleRoundPlaces(e) {
        const re = /^[0-9\b\.]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.setState({roundPlaces: e.target.value})
        }
    }

    handleTimeScale(e) {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.setState({timeScale: e.target.value})
        }
    }

    handleSumMinutes(e) {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.setState({sumMinutes: e.target.value})
        }
    }

    handleAverageMinutes(e) {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.setState({averageMinutes: e.target.value})
        }
    }

    handleMedianMinutes(e) {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.setState({medianMinutes: e.target.value})
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
                this.setState({channelTitle: responseJson.map.channel.map.name})
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
            })
            .catch((error) => {
                console.error(error);
                this.setState({'showAlert': 'true'})
                this.setState({'errorHeading': "Invalid settings"})
                this.setState({'errorBody': "Error" + error})

            }).finally(() => (this.setState({isLoading: false})));
    }

    //test

    refreshClickHandler() {
        this.setState({isLoading: true})
        const APIKEY = this.state.thingSpeakAPIKey ? `&api_key=${this.state.thingSpeakAPIKey}` : ''
        const RESULTS = this.state.numResults ? `&results=${this.state.numResults}` : ''
        const DAYS = this.state.numDays ? `&days=${this.state.numDays}` : ''
        const MINUTES = this.state.numMinutes ? `&minutes=${this.state.numMinutes}` : ''
        const START = this.state.startDate ? `&start=${this.state.startDate}` : ''
        const END = this.state.endDate ? `&end=${this.state.endDate}` : ''
        const TIMEZONE = this.state.timeZone ? `&timezone=${this.state.timeZone}` : ''
        const STATUS = this.state.booleanStatus ? `&status=${this.state.booleanStatus}` : ''
        const METADATA = this.state.booleanMetaData ? `&metadata=${this.state.booleanMetaData}` : ''
        const LOCATION = this.state.booleanLocation ? `&location=${this.state.booleanLocation}` : ''
        const MIN = this.state.minValues ? `&min=${this.state.minValues}` : ''
        const MAX = this.state.maxValues ? `&max=${this.state.maxValues}` : ''
        const ROUND = this.state.roundPlaces ? `&round=${this.state.roundPlaces}` : ''
        const TIMESCALE = this.state.timeScale ? `&timescale=${this.state.timeScale}` : ''
        const SUM = this.state.sumMinutes ? `&sum=${this.state.sumMinutes}` : ''
        const AVERAGE = this.state.averageMinutes ? `&average=${this.state.averageMinutes}` : ''
        const MEDIAN = this.state.medianMinutes ? `&median=${this.state.medianMinutes}` : ''
        const thingSpeakQuery = `https://api.thingspeak.com/channels/${this.state.thingSpeakID}/fields/${this.state.thingSpeakFieldID}.json?${APIKEY}${RESULTS}${DAYS}${MINUTES}${START}${END}${TIMEZONE}${STATUS}${METADATA}${LOCATION}${MIN}${MAX}${ROUND}${TIMESCALE}${SUM}${AVERAGE}${MEDIAN}`;
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
                let tempConfig = this.state.config
                let fieldID = this.state.thingSpeakFieldID
                tempConfig.datasets[0].data = []
                for (let i = 0, len = responseJson.map.feeds.myArrayList.length; i < len; i++) {
                    console.log(moment(responseJson.map.feeds.myArrayList[i].map.created_at))
                    tempConfig.datasets[0].data.push({
                        x: moment(responseJson.map.feeds.myArrayList[i].map.created_at),
                        y: parseFloat(responseJson.map.feeds.myArrayList[i].map["field" + fieldID.toString()])
                    });
                }
                this.setState({config: tempConfig})
                console.log(this, this.state)
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
        this.setState({ dimensions: { width: window.innerWidth, height: (window.innerHeight-50) }});
    }

    render() {
        const handleDismiss = () => this.setState({showAlert: false});
        const handleShow = () => this.setState({showAlert: true});
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

                                <Form.Group controlId="validFieldID">
                                    <Form.Control as="select" value={this.state.thingSpeakFieldID}
                                                  onChange={this.handleThingSpeakFieldID}
                                                  type="text" required>
                                        {optionItems}
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group controlId="validTimeZone">
                                    <br/>
                                    <TimezonePicker
                                        absolute={false}
                                        defaultValue="Australia/Brisbane"
                                        placeholder="Select timezone..."
                                        onChange={this.handleTimeZone}
                                    />
                                </Form.Group>

                                <Form.Group controlId="validDateRange">
                                    <Form.Label>Select Date Range</Form.Label>
                                    <DatetimeRangePicker
                                        onChange={this.handleDateRange}/>
                                </Form.Group>

                            </Col>

                            <Col sm={3}>
                                <Form.Group controlId="validNumResults">
                                    <Form.Label></Form.Label>
                                    <Form.Control value={this.state.numResults} onChange={this.handleNumResults}
                                                  type="text"
                                                  placeholder="Number of Results"
                                                  isInvalid={this.state.numResults > 8000}
                                                  disabled={this.state.numDays || this.state.numMinutes}
                                                  required/>
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a number less than 8000. Do not use in combination with other
                                        selectors.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="validNumDays">
                                    <Form.Control value={this.state.numDays} onChange={this.handleNumDays}
                                                  type="text"
                                                  placeholder="Number of Days"
                                                  isInvalid={this.state.numDays > 31}
                                                  disabled={this.state.numResults || this.state.numMinutes}
                                                  required/>
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a number less than 31. Do not use in combination with other
                                        selectors.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="validNumMinutes">
                                    <Form.Control value={this.state.numMinutes} onChange={this.handleNumMinutes}
                                                  type="text"
                                                  placeholder="Number of Minutes"
                                                  isInvalid={this.state.numMinutes > 1440}
                                                  disabled={this.state.numDays || this.state.numResults}
                                                  required/>
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a number less than 1440. Do not use in combination with other
                                        selectors.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="validTimeScale">
                                    <Form.Control value={this.state.timeScale} onChange={this.handleTimeScale}
                                                  type="text" isInvalid={this.state.timeScale > 1440}
                                                  placeholder="Value every x minutes"
                                                  disabled={(this.state.sumMinutes || this.state.averageMinutes || this.state.medianMinutes)}
                                                  required/>
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a number less than 1440. Do not use in combination with other
                                        selectors.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="validSumMinutes">
                                    <Form.Control value={this.state.sumMinutes} onChange={this.handleSumMinutes}
                                                  type="text" isInvalid={this.state.sumMinutes > 1440}
                                                  placeholder="Sum of x minutes"
                                                  disabled={(this.state.timeScale || this.state.averageMinutes || this.state.medianMinutes)}
                                                  required/>
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a number less than 1440. Do not use in combination with other
                                        selectors.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="validAverageMinutes">
                                    <Form.Control value={this.state.averageMinutes} onChange={this.handleAverageMinutes}
                                                  type="text" isInvalid={this.state.averageMinutes > 1440}
                                                  placeholder="Average of x minutes"
                                                  disabled={(this.state.sumMinutes || this.state.timeScale || this.state.medianMinutes)}
                                                  required/>
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a number less than 1440. Do not use in combination with other
                                        selectors.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="validMedianMinutes">
                                    <Form.Control value={this.state.medianMinutes} onChange={this.handleMedianMinutes}
                                                  type="text" isInvalid={this.state.medianMinutes > 1440}
                                                  placeholder="Median of x minutes"
                                                  disabled={(this.state.sumMinutes || this.state.averageMinutes || this.state.timeScale)}
                                                  required/>
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a number less than 1440. Do not use in combination with other
                                        selectors.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>

                            <Col sm={4}>
                                <Form.Group controlId="booleanStatus">
                                    <Form.Check
                                        id={`booleanStatus`}
                                        label={`Display Channel Status`}
                                        onChange={this.handleBooleanStatus}
                                        value={this.state.booleanStatus}
                                    />
                                </Form.Group>

                                <Form.Group controlId="booleanMetadata">
                                    <Form.Check
                                        id={`booleanStatus`}
                                        label={`Display Channel Metadata`}
                                        onChange={this.handleBooleanMetaData}
                                        value={this.state.booleanMetaData}
                                    />
                                </Form.Group>

                                <Form.Group controlId="booleanLocation">
                                    <Form.Check
                                        id={`booleanStatus`}
                                        label={`Display Channel Location`}
                                        onChange={this.handleBooleanLocation}
                                        value={this.state.booleanLocation}
                                    />
                                </Form.Group>
                                <Form.Group controlId="validRoundPlaces">
                                    <Form.Control value={this.state.roundPlaces}
                                                  placeholder="Round To This Many Decimal Places"
                                                  onChange={this.handleRoundPlaces}
                                                  type="text" required/>
                                </Form.Group>

                                <Form.Group controlId="validMinValues">
                                    <Form.Control value={this.state.minValues} placeholder="Minimum Values To Include"
                                                  onChange={this.handleMinValues}
                                                  type="text" required/>
                                </Form.Group>

                                <Form.Group controlId="validMaxValues">
                                    <Form.Control value={this.state.maxValues} placeholder="Maximum Values To Include"
                                                  onChange={this.handleMaxValues}
                                                  type="text" required/>
                                </Form.Group>

                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Col>
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
                        <br/>
                        <Form.Row>
                            {this.state.showAlert &&
                            <Alert variant="danger" onClose={handleDismiss} dismissible>
                                <Alert.Heading>{this.state.errorHeading}</Alert.Heading>
                                {this.state.errorBody}
                            </Alert>
                            }
                        </Form.Row>
                        {!this.state.isLoading && this.state.channelDescription}
                    </Tab>
                    <Tab id="graph" eventKey="graph" style={{height: this.state.dimensions.height}} title="Graph">
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
                                            labelString: this.state.thingSpeakFieldID
                                        }
                                    }]
                                }
                            }}
                        />
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
