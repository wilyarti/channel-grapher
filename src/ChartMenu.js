import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import {Sliders} from "react-feather";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import React from "react";


const ChartMenu = (props) => {

    return (
        <Row className="justify-content-md-left">
            <Col>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {<span> <Sliders/> </span>}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item
                            onClick={!(props.channelNotVerified || props.isLoading) ? props.barGraphSelector : null}>Bar
                            Graph</Dropdown.Item>
                        <Dropdown.Item
                            onClick={!(props.channelNotVerified || props.isLoading) ? props.bubbleGraphSelector : null}>Bubble
                            Graph</Dropdown.Item>
                        <Dropdown.Item
                            onClick={!(props.channelNotVerified || props.isLoading) ? props.lineGraphSelector : null}>Line
                            Graph</Dropdown.Item>
                        <Dropdown.Item
                            onClick={!(props.channelNotVerified || props.isLoading || !props.lineGraphBoolean) ? props.toggleFill : null}>Toggle
                            Fill
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={!(props.channelNotVerified || props.isLoading) ? props.randomColor : null}>Random
                            Color
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={!(props.channelNotVerified || props.isLoading) ? props.convertMSLP : null}>Convert
                            to Mean Sea Level Pressure</Dropdown.Item>
                        <Dropdown.Item
                            onClick={!(props.channelNotVerified || props.isLoading) ? props.setDataSummaryInterval30 : null}>Summarise
                            Data (30min)</Dropdown.Item>
                        <Dropdown.Item
                            onClick={!(props.channelNotVerified || props.isLoading) ? props.setDataSummaryInterval60 : null}>Summarise
                            Data (60min)</Dropdown.Item>
                        <Dropdown.Item
                            onClick={!(props.channelNotVerified || props.isLoading) ? props.setDataSummaryIntervalDaily : null}>Summarise
                            Data (daily)</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Col>
            <Col>
                <Form.Group controlId="validFieldID">
                    <Form.Control as="select" value={props.thingSpeakFieldID}
                                  onChange={props.handleThingSpeakFieldID}
                                  disabled={(props.channelNotVerified || props.isLoading)}
                                  type="text" required>
                        {props.optionItems}
                    </Form.Control>
                </Form.Group>
            </Col>
        </Row>
    )
}

export default ChartMenu;