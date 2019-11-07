import {BarChart2, HelpCircle, Info, Settings} from "react-feather";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tab from "react-bootstrap/Tab";
import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Container from "react-bootstrap/Container";

const ConfigTab = () => {
    return (
            <Row>
                <Col>
                    <h3>Welcome!</h3>
                    Welcome to my web app. This app is designed to graph the data from Internet-Of-Things
                    devices which use a service called ThingSpeak.<br/>
                    ThingSpeak is a free to use web platform for time series data from sensors.
                    <p/>
                    I built this web app to draw graphs from my weather stations that I built. I have one in
                    Broome and one in Emerald.
                    <p/>
                    <img className="img-fluid"
                         src="https://cdn.thingiverse.com/renders/24/7e/e4/54/f2/0d4fcecb5e05e6607d283115aead66ec_preview_featured.jpg"
                         alt="" width="628" height="472"/>
                    <p/>
                    My weather station's use the following ThingSpeak IDs:
                    <ul>
                        <li>Broome Weather Station: <strong>703886</strong></li>
                        <li>Emerald Weather Station: <strong>645847</strong></li>
                    </ul>

                    <h3>Instructions</h3>
                    <ol>
                        <li>Click on the <Settings/> icon and enter your ThingSpeak ID and API read key into
                            the fields.
                        </li>
                        <li>Click on the "Load Channel" button. If your setting are valid the app will
                            automatically switch to the <BarChart2/> tab and draw the first field.
                        </li>
                        <li>To switch fields click on the drop down menu on the right.</li>
                        <li>To change dates or the time range click on the <Settings/> tab and modify the
                            appropriate fields.
                        </li>
                        <li>On the <BarChart2/> tab you can also change the chart type to Bar or Bubble and
                            summerize data for a certain perid.<br/>
                            Data summary is very useful for things such as rainfall.
                        </li>
                        <li>To view the channel's metadata such as location, altitude etc. Click on
                            the <Info/> tab.
                        </li>
                        <li>Gray tabs are disabled because there is no data loaded for them to display. Load
                            a channel to view these tabs.
                        </li>
                    </ol>
                    <h3>Technical Overview</h3>
                    This app is build using the following technologies:
                    <ul>
                        <li>ReactJS</li>
                        <li>ChartJS</li>
                        <li>Bootstrap</li>
                        <li>Ktor</li>
                    </ul>
                    To overcome <a
                    href={'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS'}>CORS</a> restrictions
                    this app uses a JSON router on my ktor server to access ThingSpeak.
                    <br/>
                    To keep the app responsive the vertical div that holds the ChartJS chart is resized when
                    ever the window is resized.
                </Col>
            </Row>
    )
}

export default ConfigTab;