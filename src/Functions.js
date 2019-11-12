import moment from "moment-timezone";

export function closeToast(index) {
    let msgs = this.state.msgs;
    delete (msgs[index]);
    this.setState({msgs});
}

export function setToast(title, message) {
    let msgs = this.state.msgs;
    let msg = {
        name: 'Set Title',
        time: new moment(),
        body: message
    };
    msg.name = title;
    msgs.push(msg);
    this.setState({msgs});
}

export function barGraphSelector() {
    this.setState({lineGraphBoolean: false, barGraphBoolean: true, bubbleGraphBoolean: false})
}

export function lineGraphSelector() {
    this.setState({lineGraphBoolean: true, barGraphBoolean: false, bubbleGraphBoolean: false})
}

export function toggleFill() {
    let tempConfig = this.state.config
    tempConfig.datasets.map((_, index) => {
        tempConfig.datasets[index].fill = !tempConfig.datasets[index].fill
    })
    this.setState({config: tempConfig})
}

export function bubbleGraphSelector() {
    this.setState({lineGraphBoolean: false, barGraphBoolean: false, bubbleGraphBoolean: true})
}

export function randomColor() {
    let tempConfig = this.state.config
    let favoriteColor
    for (let i = 0; i < tempConfig.datasets.length; i++) {
        favoriteColor = this.state.palette[this.state.config.datasets.length + Math.floor(Math.random() * 10)].hex();
        tempConfig.datasets[i].borderColor = favoriteColor;
    }
    this.setState({config: tempConfig, favoriteColor})

    const {cookies} = this.props;
    const cookie = favoriteColor;
    const date = new Date();
    cookies.set('favoriteColor', cookie, {expires: new Date(date.getFullYear() + 1, date.getMonth(), date.getDay())});
}

export function handleDatePicker(date) {
    // days have changed, reset state
    const defaultConfig = {
        type: 'line',
        datasets: [{
            label: 'ThingSpeak Channel',
            fill: true,
            lineTension: 0,
            pointRadius: 1,
            borderColor: this.state.palette[this.state.config.datasets.length + 1].hex(),
            data: [],
        }]
    }
    // reset graph to line
    this.lineGraphSelector()
    const numDays = this.state.numDays ? this.state.numDays : 1
    const start = moment(date).subtract(numDays, "days");
    this.setState({
        startDate: start, endDate: date, config: defaultConfig, dataSetID: 0, dataSummaryInterval: 0,
        dataSummaryIntervalDescription: ''
    })
}

export function handleTimeZone(timeZone) {
    const {cookies} = this.props;
    const cookie = timeZone;
    const date = new Date();
    cookies.set('timeZone', cookie, {expires: new Date(date.getFullYear() + 1, date.getMonth(), date.getDay())});
    this.setState({timeZone}, () => {
        this.refreshClickHandler()
    })
}

export function handleThingSpeakID(e) {
    console.log(e);
    console.log("clicked");
    this.setState({channelNotVerified: true, thingSpeakID: e.target.value});
}

export function handleThingSpeakFieldID(e) {
    // when field is changed, scrap state of older graphs
    const {cookies} = this.props;
    const cookie = e.target.value;
    const date = new Date();
    cookies.set('thingSpeakFieldID', cookie, {expires: new Date(date.getFullYear() + 1, date.getMonth(), date.getDay())});
    const defaultConfig = {
        type: 'line',
        datasets: [{
            label: 'ThingSpeak Channel',
            fill: true,
            lineTension: 0,
            pointRadius: 1,
            borderColor: this.state.palette[this.state.config.datasets.length + 1].hex(),
            data: [],
        }]
    }
    // reset graph to line
    this.lineGraphSelector()
    this.setState({
        thingSpeakFieldID: e.target.value,
        convertedMSLP: false,
        config: defaultConfig,
        dataSetID: 0,
        dataSummaryInterval: 0,
        dataSummaryIntervalDescription: '',
    }, () => {
        this.refreshClickHandler();
    })

}

export function handleThingSpeakAPIKey(e) {
    const {cookies} = this.props;
    const cookie = e.target.value;
    const date = new Date();
    cookies.set('thingSpeakAPIKey', cookie, {expires: new Date(date.getFullYear() + 1, date.getMonth(), date.getDay())});
    this.setState({channelNotVerified: true, thingSpeakAPIKey: e.target.value});
}

export function handleNumDays(e) {
    console.log(e)
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
        let endDate = this.state.endDate
        if (endDate) {
            endDate = new Date()
        }
            const start = moment(this.state.endDate).subtract(e.target.value, "days");
            this.setState({
                startDate: start, numDays: e.target.value, endDate
            })

    }
}

export function handleThingSpeakPeriod(e) {
    this.setState({thingSpeakPeriod: e.target.value}, () => {
        this.refreshClickHandler()
    })
}

export function setDataSummaryInterval30() {
    this.barGraphSelector()
    let dataset = parseInt(this.state.dataSetID) + 1
    let datainterval = parseInt(30)
    this.setState({
        dataSummaryInterval: datainterval,
        dataSummaryIntervalDescription: '- 30 min Summary',
        dataSetID: dataset
    }, () => {
        this.refreshClickHandler(dataset)
    })
}

export function setDataSummaryInterval60() {
    this.barGraphSelector()
    let dataset = parseInt(this.state.dataSetID) + 1
    let datainterval = parseInt(60)
    this.setState({
        dataSummaryInterval: datainterval,
        dataSummaryIntervalDescription: '- 60 min Summary',
        dataSetID: dataset
    }, () => {
        this.refreshClickHandler(dataset)
    })
}

export function setDataSummaryIntervalDaily() {
    this.barGraphSelector()
    let dataset = parseInt(this.state.dataSetID) + 1
    let datainterval = 'daily'
    this.setState({
        dataSummaryInterval: datainterval,
        dataSummaryIntervalDescription: '- Daily Summary',
        dataSetID: dataset
    }, () => {
        this.refreshClickHandler(dataset)
    })
}

export function convertMSLP() {
    if (!this.state.convertedMSLP) {
        let currentFieldName = this.state['field_'.concat(this.state.thingSpeakFieldID)]
        if (!currentFieldName.toUpperCase().match(/PRESSURE/)) {
            alert("Selected field is not pressure.")
            return
        }

        let temperatureFieldID = 0
        for (let i = 1; i < 9; i++) {
            let fieldName = 'field_'.concat(i)
            if (this.state[fieldName].toUpperCase().match(/TEMPERATURE/)) {
                temperatureFieldID = i
            }
        }
        if (temperatureFieldID != 0) {
            this.setState({isLoading: true})
            const APIKEY = this.state.thingSpeakAPIKey ? `&api_key=${this.state.thingSpeakAPIKey}` : ''
            const SUM = this.state.dataSummaryInterval ? `&sum=${this.state.dataSummaryInterval}` : ''
            const START = this.state.startDate ? `&start=${moment(this.state.startDate).format("YYYY-MM-DD")}%2000:00:00` : `&start=${moment(this.state.endDate).subtract(1, "days").format("YYYY-MM-DD")}%2000:00:00`
            const END = this.state.endDate ? `&end=${moment(this.state.endDate).format("YYYY-MM-DD")}%2023:59:59` : ''
            const STATUS = `&status=${true}`
            const METADATA = `&metadata=${true}`
            const LOCATION = `&location=${true}`
            const TIMEZONE = `&timezone=${this.state.timeZone}`
            const PERIOD = `&minutes=${this.state.thingSpeakPeriod}`
            const thingSpeakQuery = JSON.stringify({url: `https://api.thingspeak.com/channels/${this.state.thingSpeakID}/fields/${temperatureFieldID}.json?${APIKEY}${this.state.thingSpeakPeriod ? PERIOD : START + END}${END}${SUM}${STATUS}${METADATA}${LOCATION}${TIMEZONE}`})
            console.log(thingSpeakQuery)
            fetch('/getJSON', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: thingSpeakQuery,
            }).then((response) => response.json())
                .then((responseJson) => {
                        let tempConfig = this.state.config
                        let dataSetID = tempConfig.datasets.length
                        tempConfig.datasets[dataSetID] = {
                            label: 'MSLP',
                            fill: true,
                            lineTension: 0,
                            pointRadius: 1,
                            borderColor: this.state.favoriteColor ? this.state.favoriteColor : this.state.palette[this.state.config.datasets.length + 1].hex(),
                            data: [],
                        }
                        let hFloat
                        if (!this.state.elevation) {
                            let x;
                            x = prompt("Enter Altitude of Sensor Readings:", "0");
                            hFloat = parseFloat(x);
                            if (hFloat < 0 || hFloat > 10000) {
                                alert("Error. Enter a valid number.")
                            }
                        } else {
                            hFloat = this.state.elevation
                        }

                        for (let j = 0, len = responseJson.map.feeds.myArrayList.length; j < len; j++) {
                            if (tempConfig.datasets[0].data[j].x.isSame(moment(responseJson.map.feeds.myArrayList[j].map.created_at))) {
                                let pSeaLevelFloat = 0.0;
                                const tCelFloat = parseFloat(responseJson.map.feeds.myArrayList[j].map[`field${temperatureFieldID}`])
                                const pAbsFloat = tempConfig.datasets[0].data[j].y
                                let fltP1 = Math.pow((1 - ((0.0065 * hFloat) / (tCelFloat + (0.0065 * hFloat) + 273.15))), -5.257)
                                pSeaLevelFloat = pAbsFloat * fltP1
                                tempConfig.datasets[dataSetID].data.push({
                                    x: moment(responseJson.map.feeds.myArrayList[j].map.created_at),
                                    y: pSeaLevelFloat
                                })
                            } else {
                                console.log("Time differs.")
                                console.log(`Temp: ${moment(responseJson.map.feeds.myArrayList[j].map.created_at)}`)
                                console.log(`Pres: ${tempConfig.datasets[0].data[j].x}`)
                            }
                        }
                        this.setState({config: tempConfig, convertedMSLP: true})
                    }
                )
                .catch((error) => {
                    this.setToast("Error.", "Failed to do sea level pressure conversion.")
                }).finally(() => (this.setState({isLoading: false})));

        }
    } else {
        alert("Mean Sea Level Pressure Conversion already performed.")
    }
}

export function thingSpeakValidatorClickHandler() {
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
                this.setToast("Error invalid settings.", `Either the settings are invalid or no data matches the time period. ${responseJson.toString()}`)
                return
            }
            console.log("Setting states")
            this.setState({channelTitle: responseJson.map.channel.map.name})
            this.setState({channelDescription: responseJson.map.channel.map.description})
            for (let i = 1; i < 9; i++) {
                let fieldName = "field_".concat(i)
                if (responseJson.map.channel.map["field".concat(i)]) {
                    this.setState({[fieldName]: responseJson.map.channel.map["field".concat(i)]})
                } else {
                    this.setState({[fieldName]: undefined})
                }
            }
            console.log(this.state)
            const {cookies} = this.props;
            const thingSpeakIDCookie = this.state.thingSpeakID;
            let thingSpeakIDList = cookies.get('thingSpeakIDList') || [];
            thingSpeakIDList.push(thingSpeakIDCookie);
            thingSpeakIDList = [...new Set(thingSpeakIDList)];
            const date = new Date();
            cookies.set('thingSpeakID', thingSpeakIDCookie, {expires: new Date(date.getFullYear() + 1, date.getMonth(), date.getDay())});
            cookies.set('thingSpeakIDList', thingSpeakIDList, {expires: new Date(date.getFullYear() + 1, date.getMonth(), date.getDay())});
            this.setState({channelNotVerified: false, showOptions: true, showChannel: true, thingSpeakIDList})
            this.refreshClickHandler()
        })
        .catch((error) => {
            this.setToast("Error accessing channel.", error.toString());
            console.log(error);
        }).finally(() => (this.setState({isLoading: false})));
}

export function refreshClickHandler(dID) {
    // update the timezone to match the new one
    moment.tz.setDefault(this.state.timeZone)
    this.setState({isLoading: true})
    let fieldName = "field_".concat(this.state.thingSpeakFieldID)
    if (typeof this.state[fieldName] === "undefined") {
        this.setState({thingSpeakFieldID: 1})
    }
    const dataSetID = parseInt(dID) ? parseInt(dID) : 0
    const APIKEY = this.state.thingSpeakAPIKey ? `&api_key=${this.state.thingSpeakAPIKey}` : ''
    const SUM = this.state.dataSummaryInterval ? `&sum=${this.state.dataSummaryInterval}` : ''
    const START = this.state.startDate ? `&start=${moment(this.state.startDate).format("YYYY-MM-DD")}%2000:00:00` : `&start=${moment(this.state.endDate).subtract(1, "days").format("YYYY-MM-DD")}%2000:00:00`
    const END = this.state.endDate ? `&end=${moment(this.state.endDate).format("YYYY-MM-DD")}%2023:59:59` : ''
    const STATUS = `&status=${true}`
    const METADATA = `&metadata=${true}`
    const LOCATION = `&location=${true}`
    const TIMEZONE = `&timezone=${this.state.timeZone}`
    const PERIOD = `&minutes=${this.state.thingSpeakPeriod}`
    const thingSpeakQuery = JSON.stringify({url: `https://api.thingspeak.com/channels/${this.state.thingSpeakID}/fields/${this.state.thingSpeakFieldID}.json?${APIKEY}${this.state.thingSpeakPeriod ? PERIOD : START + END}${END}${SUM}${STATUS}${METADATA}${LOCATION}${TIMEZONE}`})
    console.log(thingSpeakQuery)
    fetch('/getJSON', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: thingSpeakQuery,
    }).then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            console.log("Dataset ID: ")
            console.log(dataSetID)
            let tempConfig = this.state.config
            tempConfig.datasets[dataSetID] = {
                label: 'Data Summary',
                fill: true,
                lineTension: 0,
                pointRadius: 1.5,
                borderColor: this.state.favoriteColor ? this.state.favoriteColor : this.state.palette[this.state.config.datasets.length + 1].hex(),
                borderWidth: 2,
                data: [],
            };
            if (responseJson.map.feeds.myArrayList.length >= 8000) {
                this.setToast("Too many data points.", "Your query may have exceeded the 8000 point limit and may be incomplete. Choose a smaller time period.")

            }
            for (let i = 0, len = responseJson.map.feeds.myArrayList.length; i < len; i++) {
                tempConfig.datasets[dataSetID].data.push({
                    x: moment(responseJson.map.feeds.myArrayList[i].map.created_at),
                    y: parseFloat(responseJson.map.feeds.myArrayList[i].map[`field${this.state.thingSpeakFieldID}`])
                });

                // update values
                if (typeof tempConfig.datasets[dataSetID].min === "undefined" || typeof tempConfig.datasets[dataSetID].max === "undefined") {
                    tempConfig.datasets[dataSetID].min_time = moment(responseJson.map.feeds.myArrayList[i].map.created_at);
                    tempConfig.datasets[dataSetID].min = parseFloat(responseJson.map.feeds.myArrayList[i].map[`field${this.state.thingSpeakFieldID}`]);
                    tempConfig.datasets[dataSetID].max_time = moment(responseJson.map.feeds.myArrayList[i].map.created_at);
                    tempConfig.datasets[dataSetID].max = parseFloat(responseJson.map.feeds.myArrayList[i].map[`field${this.state.thingSpeakFieldID}`]);

                }
                if (parseFloat(responseJson.map.feeds.myArrayList[i].map[`field${this.state.thingSpeakFieldID}`]) <= tempConfig.datasets[dataSetID].min) {
                    tempConfig.datasets[dataSetID].min_time = moment(responseJson.map.feeds.myArrayList[i].map.created_at);
                    tempConfig.datasets[dataSetID].min = parseFloat(responseJson.map.feeds.myArrayList[i].map[`field${this.state.thingSpeakFieldID}`]);
                }
                if (parseFloat(responseJson.map.feeds.myArrayList[i].map[`field${this.state.thingSpeakFieldID}`]) >= tempConfig.datasets[dataSetID].max) {
                    tempConfig.datasets[dataSetID].max_time = moment(responseJson.map.feeds.myArrayList[i].map.created_at);
                    tempConfig.datasets[dataSetID].max = parseFloat(responseJson.map.feeds.myArrayList[i].map[`field${this.state.thingSpeakFieldID}`]);
                }
            }
            // add latest values
            tempConfig.datasets[dataSetID].latest_time = moment(responseJson.map.feeds.myArrayList[responseJson.map.feeds.myArrayList.length - 1].map.created_at);
            tempConfig.datasets[dataSetID].latest = parseFloat(responseJson.map.feeds.myArrayList[responseJson.map.feeds.myArrayList.length - 1].map[`field${this.state.thingSpeakFieldID}`]);

            tempConfig.datasets[dataSetID].label = this.state.dataSummaryIntervalDescription ? `${responseJson.map.channel.map.name} ${this.state.dataSummaryIntervalDescription}` : responseJson.map.channel.map.name
            const startDate = this.state.startDate ? moment(this.state.startDate).format('MMMM Do YYYY, [12:00:00 am]') : moment(this.state.endDate).subtract(1, 'days').format('MMMM Do YYYY, [12:00:00am]')
            const xLabel = startDate + " to " + moment(this.state.endDate).format('MMMM Do YYYY, [11:59:59 pm]')
            this.setState({
                config: tempConfig,
                key: 'Graph',
                thingSpeakFieldName: responseJson.map.channel.map["field".concat(this.state.thingSpeakFieldID)],
                xLabel: xLabel
            })
            if (responseJson.map.channel.map.latitude) {
                this.setState({latitude: responseJson.map.channel.map.latitude})
            }
            if (responseJson.map.channel.map.longitude) {
                this.setState({longitude: responseJson.map.channel.map.longitude})
            }
            if (responseJson.map.channel.map.metadata) {
                this.setState({metadata: responseJson.map.channel.map.metadata})
            }
            if (responseJson.map.channel.map.elevation) {
                this.setState({elevation: responseJson.map.channel.map.elevation})
            }
            console.log(this.state)
        })
        .catch((error) => {
            this.setToast("Error retrieving channel data.", error.toString())
        }).finally(() => {
            this.setState({isLoading: false});
        }
    );
}

export function updateWindowDimensions() {
    this.setState({dimensions: {width: window.innerWidth, height: window.innerHeight - 150}})
}
