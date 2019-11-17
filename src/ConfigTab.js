import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import DatePicker from "react-datepicker";
import TimezonePicker from "react-bootstrap-timezone-picker";
import React from "react";


const ConfigTab = (props) => {
    const optionsPeriod = ['', '10', '15', '20', '30', '60', '240', '720', '1440'].map((field) => {
        return (<option key={field} value={field}>{field ? field : 'Select'} minutes</option>)
    })

    return (
        <Row>
            <Col sm={4}>
                <Col>
                    <Form.Label>ThingSpeak ID</Form.Label>
                    <Form.Group controlId="validThingSpeak">
                        <Form.Control value={props.thingSpeakID}  onChange={props.handleThingSpeakID}
                                      type="text" placeholder="ThingSpeak ID" required/>
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid ThingSpeakID.
                        </Form.Control.Feedback>
                    </Form.Group>
                    {(props.thingSpeakIDList.length > 0) &&
                    <Form.Group controlId="Prefill">
                        <Form.Control type="test" as="select"
                                      onChange={props.handleThingSpeakID}>
                            {props.thingSpeakIDList}
                        </Form.Control>
                    </Form.Group>
                   }

                    <Form.Group controlId="validThingSpeakFieldID">
                        <Form.Control value={props.thingSpeakAPIKey}
                                      onChange={props.handleThingSpeakAPIKey}
                                      type="text" placeholder="Read API Key" required/>
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid ThingSpeak API key.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Check type="checkbox" label="Live Updates"
                                checked={props.liveUpdates}
                                onChange={props.toggleLiveUpdates}/>
                    <Button variant="primary" disabled={props.isLoading}
                            onClick={!props.isLoading ? props.thingSpeakValidatorClickHandler : null}>
                        {props.isLoading ? <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        /> : 'Load Channel'}
                    </Button>
                    <hr/>

                    {!props.channelNotVerified &&
                    <div>
                        <Form.Group controlId="validDate">
                            <Form.Label>End Date: </Form.Label>
                            <DatePicker dateFormat="yyyy-MM-dd"
                                        disabled={(props.channelNotVerified || props.isLoading || props.thingSpeakPeriod)}
                                        selected={props.endDate}
                                        onChange={props.handleDatePicker}
                            />
                        </Form.Group>
                        <Form.Group>
                            <TimezonePicker
                                absolute={false}
                                disabled={(props.channelNotVerified || props.isLoading)}
                              //  defaultValue={props.timeZone}
                                value={props.timeZone}
                              placeholder="Change timezone..."
                                onChange={props.handleTimeZone}
                            />
                        </Form.Group>
                        Period:
                        <hr/>
                        <Form.Group controlId="validPeriodSelector">
                            <Form.Control as="select" value={props.thingSpeakPeriod}
                                          disabled={(props.channelNotVerified || props.isLoading)}
                                          onChange={props.handleThingSpeakPeriod}
                                          type="text" required>
                                {optionsPeriod}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="validNumDays">
                            <Form.Control value={props.numDays} onChange={props.handleNumDays}
                                          type="text"
                                          disabled={(props.channelNotVerified || props.isLoading || props.thingSpeakPeriod)}
                                          placeholder="Number of Days"
                                          isInvalid={props.numDays > 90}
                                          required/>
                            <Form.Control.Feedback type="invalid">
                                Please provide a number less than 90.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button variant={!props.channelNotVerified ? 'primary' : 'danger'}
                                disabled={(props.channelNotVerified || props.isLoading)}
                                onClick={!(props.channelNotVerified || props.isLoading) ? props.refreshClickHandler : null}>
                            {(props.isLoading) ? <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            /> : ''}
                            {(props.channelNotVerified) ? 'Load Channel First' : 'Load Data'}
                        </Button>
                    </div>}
                </Col>
            </Col>
        </Row>
    )
}

export default ConfigTab;