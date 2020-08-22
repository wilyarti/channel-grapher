import Dropdown from "react-bootstrap/Dropdown";
import {CheckSquare, Sliders} from "react-feather";
import React from "react";

const ChartFunctionsMenu = (props) => {
    return (
        <Dropdown>
            <Dropdown.Toggle id="dropdown-basic">
                {<span> <Sliders/> </span>}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item
                    onClick={!(props.channelNotVerified || props.isLoading) ? props.barGraphSelector : null}>{props.barGraphBoolean && <CheckSquare/>} Bar
                    Graph</Dropdown.Item>
                <Dropdown.Item
                    onClick={!(props.channelNotVerified || props.isLoading) ? props.bubbleGraphSelector : null}>{props.bubbleGraphBoolean && <CheckSquare/>} Bubble
                    Graph</Dropdown.Item>
                <Dropdown.Item
                    onClick={!(props.channelNotVerified || props.isLoading) ? props.lineGraphSelector : null}>{props.lineGraphBoolean && <CheckSquare/>} Line
                    Graph</Dropdown.Item>
                <Dropdown.Item
                    onClick={!(props.channelNotVerified || props.isLoading) ? props.toggleFill : null}>Toggle
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
                    onClick={!(props.channelNotVerified || props.isLoading) ? props.setDataSummaryInterval30 : null}>{props.dataSummaryInterval === 30 && <CheckSquare/>} Summarise
                    Data (30min)</Dropdown.Item>
                <Dropdown.Item
                    onClick={!(props.channelNotVerified || props.isLoading) ? props.setDataSummaryInterval60 : null}>{props.dataSummaryInterval === 60 && <CheckSquare/>} Summarise
                    Data (60min)</Dropdown.Item>
                <Dropdown.Item
                    onClick={!(props.channelNotVerified || props.isLoading) ? props.setDataSummaryIntervalDaily : null}>{props.dataSummaryInterval === "daily" && <CheckSquare/>} Summarise
                    Data (daily)</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default ChartFunctionsMenu