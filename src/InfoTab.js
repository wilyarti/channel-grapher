import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import React from "react";

const InfoTab = (props) => {
    return (
        <Row>
            <Col>
                <h5>{props.channelTitle} </h5>
                {props.channelDescription}
                {!props.isLoading && props.latitude &&
                <p><br/><b>Latitude:</b> {props.latitude}  </p>}

                {!props.isLoading && props.longitude &&
                <p><b>Longitude:</b> {props.longitude}</p>}

                {!props.isLoading && props.elevation &&
                <p><b>Elevation:</b> {props.elevation}</p>}

                {!props.isLoading && props.metadata &&
                <p><b>Metadata:</b> {props.metadata}</p>}

            </Col>
        </Row>
    )
}

export default InfoTab;