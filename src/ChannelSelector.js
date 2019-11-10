import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import {List} from "react-feather";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import React from "react";


const ChannelSelector = (props) => {
console.log(props)
    return (
        <Col xs={10}>
        <Form.Group  controlId="validFieldID">
            <Form.Control as="select" value={props.thingSpeakFieldID}
                          onChange={props.handleThingSpeakFieldID}
                          disabled={(props.channelNotVerified || props.isLoading)}
                          type="text" required>
                {props.optionItems}
            </Form.Control>
        </Form.Group>
        </Col>
    )
}

export default ChannelSelector;