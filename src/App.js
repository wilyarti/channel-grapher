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

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                    {
                        label: 'My First dataset',
                        backgroundColor: 'rgba(255,99,132,0.2)',
                        borderColor: 'rgba(255,99,132,1)',
                        borderWidth: 1,
                        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                        hoverBorderColor: 'rgba(255,99,132,1)',
                        data: [65, 59, 80, 81, 56, 55, 40]
                    }]
            },
            isLoading: false,
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
            timeZone: '',
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

    }

    handleDatePicker(date) {
        this.setState({
            startDate: date
        });
    }

    handleThingSpeakID(e) {
        this.setState({thingSpeakID: e.target.value});
    }

    handleThingSpeakFieldID(e) {
        this.setState({thingSpeakFieldID: e.target.value});
    }

    handleThingSpeakAPIKey(e) {
        this.setState({thingSpeakAPIKey: e.target.value});
    }

    handleNumResults(e) {
        this.setState({numResults: e.target.value});
    }

    handleNumDays(e) {
        this.setState({numDays: e.target.value});
    }

    handleNumMinutes(e) {
        this.setState({numMinutes: e.target.value});
    }

    handleTimeZone(timezone) {
        this.setState({timeZone: timezone});
    }

    handleDateRange(date) {
        this.setState({startDate: date.start})
        this.setState({endDate: date.end})
        console.log(this.state)
    }

    thingSpeakValidatorClickHandler() {
        this.setState({isLoading: true})
        console.log(this.state.thingSpeakID)
        let tempConfig = this.state.config
        tempConfig.datasets[0].label = "updated"
        this.setState({config: tempConfig})
        const thingSpeakQuery = `https://api.thingspeak.com/channels/${this.state.thingSpeakID}/feeds.json?&api_key=${this.state.thingSpeakAPIKey}`;
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
                for (let i = 1; i < 8; i++) {
                    let fieldName = "field_".concat(i)
                    console.log("Field idea: " + responseJson.map.channel.map["field".concat(i)])
                    if (responseJson.map.channel.map["field".concat(i)]) {
                        this.setState({[fieldName]: responseJson.map.channel.map["field".concat(i)]})
                    } else {
                        this.setState({[fieldName]: undefined})
                    }
                }
                console.log(this.state)
                this.forceUpdate()
            })
            .catch((error) => {
                console.error(error);
                this.setState({'showAlert': 'true'})
                this.setState({'errorHeading': "Invalid settings"})
                this.setState({'errorBody': "Error" + error})

            }).finally(() => (this.setState({isLoading: false})));

        //this.state.config.datasets[0].label = 'updated field name'
        //this.forceUpdate()
    }

    //test

    refreshClickHandler() {
        this.setState({isLoading: true})
        console.log(this.state.thingSpeakID)
        let tempConfig = this.state.config
        tempConfig.datasets[0].label = "updated"
        this.setState({config: tempConfig})
        const thingSpeakQuery = `https://api.thingspeak.com/channels/${this.state.thingSpeakID}/feeds.json?&api_key=${this.state.thingSpeakAPIKey}&minutes=300&timezone=Australia/Brisbane`;
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
            })
            .catch((error) => {
                console.error(error);
            }).finally(() => (this.setState({isLoading: false})));

        //this.state.config.datasets[0].label = 'updated field name'
        //this.forceUpdate()
    }

    render() {
        const {isLoading} = this.state.isLoading;
        const handleDismiss = () => this.setState({showAlert: false});
        const handleShow = () => this.setState({showAlert: true});
        const fields = [1, 2, 3, 4, 5, 6, 7, 8];
        const optionItems = fields.map((field) => {
            let fieldName = "field_".concat(field)
            if (this.state[fieldName]) {
                console.log(this.state[fieldName])
                return (<option id={field}>{this.state[fieldName]}</option>)
            }
        })
        console.log("Option Items: " + optionItems)
        return (
            <Container fluid>
                <Navbar bg="dark" variant="dark"> <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        <Menu/> OpenS3
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown></Navbar>
                <br/>
                <Card>
                    <Card.Header>Configurator</Card.Header>
                    <Card.Body>
                        <p><br/>
                            start - YYYY-MM-DD%20HH:NN:SS <br/>
                            end - as above <br/>
                            timezone - identifier <br/>
                            offsett - timezone offset <br/>
                            status include status updtes <br/>
                            metadata - get metadata <br/>
                            location - get feed location <br/>
                            min - min values to include <br/>
                            max - max values to include <br/>
                            round - round to this many places <br/>
                            timescale - get first value in this many minutes <br/>
                            sum -get the sum of this many minutes <br/>
                            average - get the average of this many minutes <br/>
                            median - get the median of this many minutes <br/>
                        </p>
                        <Form.Row>
                            <Form.Group controlId="validThingSpeak">
                                <Form.Label>ThingSpeak ID</Form.Label>
                                <Form.Control value={this.state.thingSpeakID} onChange={this.handleThingSpeakID}
                                              type="text" placeholder="645847" required/>
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid ThingSpeakID.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group controlId="validFieldID">
                                <Form.Label>Field ID</Form.Label>
                                <Form.Control as="select" value={this.state.thingSpeakFieldID}
                                              onChange={this.handleThingSpeakFieldID}
                                              type="text" placeholder="optional" required>
                                    {optionItems}
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group controlId="validThingSpeakFieldID">
                                <Form.Label>Read API Key</Form.Label>
                                <Form.Control value={this.state.thingSpeakAPIKey} onChange={this.handleThingSpeakAPIKey}
                                              type="text" placeholder="optional" required/>
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid ThingSpeak API key.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>

                        <Button variant="primary" disabled={isLoading}
                                onClick={!isLoading ? this.thingSpeakValidatorClickHandler : null}>
                            {isLoading ? <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            /> : 'Refresh'}
                        </Button>

                        {this.state.showAlert &&
                        <Alert variant="danger" onClose={handleDismiss} dismissible>
                            <Alert.Heading>{this.state.errorHeading}</Alert.Heading>
                            {this.state.errorBody}
                        </Alert>
                        }

                        <hr/>

                        <Form.Row>
                            <Form.Group controlId="validNumResults">
                                <Form.Label>Number of Results</Form.Label>
                                <Form.Control value={this.state.numResults} onChange={this.handleNumResults}
                                              type="text" required/>
                                <Form.Control.Feedback type="invalid">
                                    Please provide a number less than 8000.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group controlId="validNumDays">
                                <Form.Label>Number of Days</Form.Label>
                                <Form.Control value={this.state.numDays} onChange={this.handleNumDays}
                                              type="text" required/>
                                <Form.Control.Feedback type="invalid">
                                    Please provide a number less than 31.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group controlId="validNumMinutes">
                                <Form.Label>Number of Minutes</Form.Label>
                                <Form.Control value={this.state.numMinutes} onChange={this.handleNumMinutes}
                                              type="text" required/>
                                <Form.Control.Feedback type="invalid">
                                    Please provide a number less than 1440.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group controlId="validDateRange">
                                <Form.Label>Select Date Range</Form.Label>
                                <DatetimeRangePicker
                                    onChange={this.handleDateRange}/>
                            </Form.Group>
                        </Form.Row>

                        <Form.Row>
                            <Form.Group controlId="validTimeZone">
                                <Form.Label>Select Time Zone</Form.Label>
                                <TimezonePicker
                                    absolute={false}
                                    defaultValue="Australia/Brisbane"
                                    placeholder="Select timezone..."
                                    onChange={this.handleTimeZone}
                                />
                            </Form.Group>
                        </Form.Row>

                        <Button variant="primary" disabled={isLoading}
                                onClick={!isLoading ? this.refreshClickHandler : null}>
                            {isLoading ? <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            /> : 'Refresh'}
                        </Button>
                        <hr/>
                        <h1>{!isLoading && this.state.channelTitle}</h1>
                        <h2>{!isLoading && this.state.channelDescription}</h2>


                    </Card.Body>
                </Card>
                <br/>
                <Card>
                    <Card.Header>Graph</Card.Header>
                    <Card.Body>
                        <Line
                            data={this.state.config}
                            width={100}
                            height={500}
                            options={{
                                maintainAspectRatio: false
                            }}
                        /> </Card.Body>
                </Card>
            </Container>
        )
    }
}

export default App;
