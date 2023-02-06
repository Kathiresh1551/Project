import React from "react";
import { Button, Icon, Segment, Select, Image, Modal } from "semantic-ui-react";
import axios from 'axios';
import './TransportHome.css';
import { DateInput } from 'semantic-ui-calendar-react';

class TransportHome extends React.Component {
    constructor() {
        super();
        this.state = {
            from: '',
            dest: '',
            obtainedTrain: [],
            getTrainDetails: false,
            day: '',
            date: '',
            getValue: false,
            flightModal: true
        }
        this.fromOptions = []
    }


    handleFromStation = ({value}) => {
        this.setState({ from: value })
    }

    handleDestStation = ({value}) => {
        this.setState({ dest: value })
    }

    handleTravleDate = (value) => {
        const date = new Date(value.value);
        const day = date.getDay()
        if (day === 0) {
            this.setState({ day: "Sun" })
        } else if (day === 1) {
            this.setState({ day: "Mon" })
        } else if (day === 2) {
            this.setState({ day: "Tue" })
        } else if (day === 3) {
            this.setState({ day: "Wed" })
        } else if (day === 4) {
            this.setState({ day: "Thr"})
        } else if (day === 5) {
            this.setState({ day: "Fri"})
        } else if (day === 6) {
            this.setState({ day: "Sat"})
        }
        this.setState({ date: value.value })
    }

    trainsBetweenStation = () => {
        const { from, dest, date, day } = this.state;
        const { history } = this.props;
        setTimeout(() => {
            history.push("/mypayanam/train");
        }, 3000);
        
        axios.post("http://localhost:5000/betweenStations", 
        {
            "fromStation": from,
            "destStation": dest,
            "day": day,
            "date": date
        }
        )
        .then((response) => {
            const obtainedData = {
                fromStation: from,
                DestStation: dest,
                dateOfTravel: date,
                dayOfTravel: day,
                transportData: response.data.data,
            }
            localStorage.setItem('travelData', JSON.stringify(obtainedData));
            this.setState({ obtainedTrain: response.data.data, getTrainDetails: true})
        })
        .catch((error) => {
            console.log('error', error);
        })
    }
    
    render = () => {
        const { from, dest, date } = this.state;
        const { trainData, selectedTransport } = this.props;
        const fromData = trainData.map((ele) => ele.from_station);
        const destData = trainData.map((ele) => ele.dest_station);
        const getFromData = fromData.filter((ele) => String(ele).trim());
        const getDestData = destData.map((ele) => String(ele).trimEnd());
        const fromStation =  [...new Set(getFromData)].sort()
        .filter((ele) => ele !== dest);
        const destStation =  [...new Set(getDestData)].sort()
        .filter((ele) => ele !== from);
        const fromOptions = fromStation.map((ele) => (
            {key: ele, value: ele, text: ele}
        ));
        const destOptions = destStation.map((ele) => (
            {key: ele, value: ele, text: ele}
        ));
        const today = new Date()
        return (
            <>
                <div className="container">
                    <div
                        className={selectedTransport === 'trains' ? "trainSegment" : selectedTransport === 'flight' ? "flightSegment" : selectedTransport === 'offers' && "offersSegment"}
                    >
                        <div className="SelectDivision">
                            <Segment inverted>
                                <label className={selectedTransport === 'trains' ? "trainLabel" : "flightLabel"}>From</label>
                                <Select
                                    options={fromOptions}
                                    label="From"
                                    placeholder='From...'
                                    search
                                    value={from}
                                    onChange={(e, value) => this.handleFromStation(value)}
                                />
                            </Segment>
                        </div>
                        <div className="icon">
                            <Icon name='angle double right' color={selectedTransport === 'trains' ? 'red' : 'blue' } size="big" />
                        </div>
                        <div className="SelectDivision">
                        <Segment inverted>
                            <label className={selectedTransport === 'trains' ? "trainLabel" : "flightLabel"}>To</label>
                            <Select
                                options={destOptions}
                                label="To"
                                placeholder='To...'
                                search
                                value={dest}
                                onChange={(e, value) => this.handleDestStation(value)}
                            />
                            </Segment>
                        </div>
                        <div className="SelectDivision">
                            <Segment inverted>
                                <label className={selectedTransport === 'trains' ? "trainLabel" : "flightLabel"}>Date</label>
                                <DateInput
                                    name="date"
                                    placeholder="YYYY-MM-DD"
                                    value={date}
                                    iconPosition="left"
                                    onChange={(e, value) => this.handleTravleDate(value)}
                                    minDate={today}
                                    dateFormat="YYYY-MM-DD"
                                />
                            </Segment>
                        </div>
                        <div className="SelectBtnDivision">
                            <Button color={selectedTransport === 'trains' ? 'red' : 'blue' } onClick={this.trainsBetweenStation} size="huge">
                                <Icon name={selectedTransport === 'trains' ? 'train' : 'plane'} color="black" />
                                Search
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default TransportHome;