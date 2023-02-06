import React from "react";
import { Button, Icon, Input, Segment } from "semantic-ui-react";
import axios from 'axios';
import './AddTransport.css';

class AddTransport extends React.Component {
    constructor() {
        super();
        this.state = {
            enableAdding: false,
            daysSelected: [],
            fromStation: '',
            destStation: '',
            trainName: '',
            isSelected: false,
            arrivalTime: null,
            departureTime: null,
            ticketRate: null,
        }
    }

    // schema = yup.object().shape({
    //     newTransport:yup.array().of(
    //         yup.object().shape({
    //             vehicleName: yup.string().max(15).required("vehicleName is required"),
    //             fromStation: yup.string().required("From station is required"),
    //             destStation: yup.string().required("DestStation is required"),
    //             daysSelected: yup.array().min(1).required("choose available days"),
    //             arrivalTime: yup.number().required("Time is required"),
    //             departureTime: yup.number().required("Time is required"),
    //             generalRate: yup.number().required("General class rate is required"),
    //             acRate: yup.number().required("AC class rate is required"),
    //         })
    //     ),
        
    // })

    handleAddTransport = () => {
        this.setState({ enableAdding: true })
    }

    addTrainsArrivalTimeStation = (e) => {
        this.setState({ arrivalTime: e.target.value })
    }

    addTrainsDepartureTimeStation = (e) => {
        this.setState({ departureTime: e.target.value })
    }

    addTrainsFromStation = (e) => {
        this.setState({ fromStation: e.target.value })
    }

    addTrainsDestStation = (e) => {
        this.setState({ destStation: e.target.value })
    }

    addTrainsNameStation = (e) => {
        this.setState({ trainName: e.target.value })
    }

    selectedDays = (str) => {
        const { daysSelected } = this.state;
        this.setState({ daysSelected: daysSelected.push(str) })
    }

    handleTicketRate = (e) => {
        this.setState({ ticketRate: e.target.value })
    }

    handleAddTrains = () => {
        const { fromStation, destStation, trainName, daysSelected, arrivalTime, departureTime, ticketRate } = this.state;
        axios.post("http://localhost:5000/addNewTrain", 
        {
            "trainName": trainName,
            "fromStation": fromStation,
            "destStation": destStation,
            "daysSelected": daysSelected,
            "arrivalTime": arrivalTime,
            "departureTime": departureTime,
            "ticketRate": ticketRate
        }
        ).then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.log('error', error);
        })
    }

    handleSelectedDays = (id) => {
        let { daysSelected } = this.state;
        if (daysSelected.includes(id)) {
          daysSelected = daysSelected.filter((ele) => ele !== id);
          if (daysSelected.length === 0) {
            this.setState({
              daysSelected: [],
            });
          }
        } else {
          daysSelected.push(id);
          if (daysSelected.length > 0) {
            this.setState({
              daysSelected,
            });
          }
        }
        this.setState({ daysSelected });
        this.setState((prevState) => (
          {
            isSelected: !prevState.isSelected,
            daysSelected,
          }
        ));
      }

    render = () => {
        const { selectedTransport } = this.props;
        const { enableAdding, arrivalTime, daysSelected, departureTime, ticketRate } = this.state;
        const days = ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"];
        return (
            <>
                <div className={selectedTransport === 'addTrain' ? "trainContainer" : "flightContainer"}>
                    <div className="AddTransport">
                        <Button size="huge" fluid color={selectedTransport === 'addTrain' ? 'red' : 'blue'} disabled={selectedTransport==='addFlight'} onClick={this.handleAddTransport}>
                            <Icon name={selectedTransport === 'addTrain' ? 'train' : 'plane'} />
                            {`Add ${selectedTransport === 'addTrain' ? 'Train' : 'Flight'}`}
                        </Button>
                    </div>
                    <div className="AddTransportContainer">
                        {enableAdding &&
                            (
                                <>
                                        <Input
                                            className="addTransport"
                                            placeholder={`${selectedTransport === 'addTrain' ? 'Train' : 'Flight'} Name`}
                                            size="huge" 
                                            icon
                                            color={selectedTransport === 'addTrain' ? 'red' : 'blue'}
                                            onChange={(e) => this.addTrainsNameStation(e)}
                                        >
                                            <input />
                                            <Icon name={selectedTransport === 'addTrain' ? 'train' : 'plane'} color={selectedTransport === 'addTrain' ? 'red' : 'blue'} />
                                        </Input>
                                    <div className="addingInput">
                                        <Input 
                                            placeholder="From...."
                                            size="huge" 
                                            icon
                                            color={selectedTransport === 'addTrain' ? 'red' : 'blue'}
                                            onChange={(e) => this.addTrainsFromStation(e)}
                                        >
                                            <input />
                                            <Icon name={selectedTransport === 'addTrain' ? 'train' : 'plane'} color={selectedTransport === 'addTrain' ? 'red' : 'blue'} />
                                        </Input>
                                        <Input 
                                            placeholder="To...."
                                            size="huge" 
                                            icon
                                            color={selectedTransport === 'addTrain' ? 'red' : 'blue'}
                                            onChange={(e) => this.addTrainsDestStation(e)}
                                        >
                                            <input />
                                            <Icon name={selectedTransport === 'addTrain' ? 'train' : 'plane'} color={selectedTransport === 'addTrain' ? 'red' : 'blue'} />
                                        </Input>
                                    </div>
                                    <div className="daysContainer">
                                        <Segment className="daysPicker">
                                        <label className="daysLabel">Train Available Days</label>
                                        {
                                            <div className="daysDiv">
                                                {
                                                    days.map((ele) => <div onClick={() => this.handleSelectedDays(ele)} className={selectedTransport === 'addTrain' ? (daysSelected.includes(ele) ? "trainDaySelected" : "days") : (daysSelected.includes(ele) ? "flightDaySelected" : "days")}>{ele}</div>)
                                                }
                                            </div>
                                        }
                                        </Segment>
                                        <div>
                                        <label className="arrivalTimeLabel">Arrival Time...</label>
                                        <Input
                                            className="arrivalTime"
                                            type="time"
                                            placeholder="Arrival Time..."
                                            size="huge" 
                                            icon
                                            value={arrivalTime}
                                            color={selectedTransport === 'addTrain' ? 'red' : 'blue'}
                                            onChange={(e) => this.addTrainsArrivalTimeStation(e)}
                                        >
                                            <input />
                                            <Icon name={selectedTransport === 'addTrain' ? 'train' : 'plane'} color={selectedTransport === 'addTrain' ? 'red' : 'blue'} />
                                        </Input>
                                        </div>
                                        <div>
                                        <label className="deptTimeLabel">Departure Time...</label>
                                        <Input
                                            className="departureTime"
                                            type="time"
                                            placeholder="Departure Time..."
                                            size="huge" 
                                            icon
                                            value={departureTime}
                                            color={selectedTransport === 'addTrain' ? 'red' : 'blue'}
                                            onChange={(e) => this.addTrainsDepartureTimeStation(e)}
                                        >
                                            <input />
                                            <Icon name={selectedTransport === 'addTrain' ? 'train' : 'plane'} color={selectedTransport === 'addTrain' ? 'red' : 'blue'} />
                                        </Input>
                                        </div>
                                        <div>
                                        <label className="deptTimeLabel">Ticket Rate</label>
                                        <Input
                                            className="generalRate"
                                            type="number"
                                            placeholder="Ticket Rate"
                                            size="huge" 
                                            icon
                                            value={ticketRate}
                                            color={selectedTransport === 'addTrain' ? 'red' : 'blue'}
                                            onChange={(e) => this.handleTicketRate(e)}
                                        >
                                            <input />
                                            <Icon name={selectedTransport === 'addTrain' ? 'train' : 'plane'} color={selectedTransport === 'addTrain' ? 'red' : 'blue'} />
                                        </Input>
                                        </div>

                                    </div>

                                    <div className="submit">
                                        <Button size="large" type="submit" onClick={this.handleAddTrains} color={selectedTransport === 'addTrain' ? 'red' : 'blue'} >Submit</Button>
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
            </>
        )
    }
}
export default AddTransport;
