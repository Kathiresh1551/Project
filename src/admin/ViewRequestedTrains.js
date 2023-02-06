import React from "react";
import axios from 'axios';
import './ViewRequestedTrains.css';
import { Icon, Segment, Table } from "semantic-ui-react";

class ViewRequestedTrains extends React.Component {
    constructor() {
        super();
        this.state = {
            trainData: []
        }
    }


    componentDidMount = () => {
        this.viewAllRequestedTrain();
    }

    viewAllRequestedTrain = () => {
        axios.get("http://localhost:5000/requestedTrains").then((response) => {
            this.setState({ trainData: response.data.data })
        }).catch((error) => {
            console.log('error', error)
        })
    }

    handleRedirectToHome = () => {
        const { history } = this.props;
        history.push('/')
    }

    render = () => {
        const { trainData } = this.state;
        console.log(trainData, 'trainData')
        return (
            <>

                    <Segment inverted className="segment">
                        <div className="headerContainer">
                            <div className="titleHeader">
                                <Icon className="backIcon" onClick={this.handleRedirectToHome} size="big" name="arrow left" />
                                <h2 className="addPassengerTittle">Train Requests</h2>
                            </div>
                            {/* <div className="homeContainer">
                                <Icon className="homeIcon" name="home" size="large" onClick={this.handleRedirectToHome} />
                            </div> */}
                        </div>
                    </Segment>
                <div className="requestTrainContainer">
                    <Table celled>
                        <Table.Row>
                            <Table.HeaderCell>S.No</Table.HeaderCell>
                            <Table.HeaderCell>From Station</Table.HeaderCell>
                            <Table.HeaderCell>Destination</Table.HeaderCell>
                            <Table.HeaderCell>Arrival Time(Prefers)</Table.HeaderCell>
                            <Table.HeaderCell>Departure Time(prefers)</Table.HeaderCell>
                            <Table.HeaderCell>Request Count</Table.HeaderCell>
                        </Table.Row>
                        {
                            trainData.map((ele, ind) => (
                                <Table.Row>
                                    <Table.Cell>{ind + 1}</Table.Cell>
                                    <Table.Cell>{ele.from_station}</Table.Cell>
                                    <Table.Cell>{ele.dest_station}</Table.Cell>
                                    <Table.Cell>{ele.arrival_time}</Table.Cell>
                                    <Table.Cell>{ele.departure_time}</Table.Cell>
                                    <Table.Cell>{ele.request_count}</Table.Cell>
                                </Table.Row>
                            ))
                        }
                    </Table>
                </div>
            </>
        )
    }
    
}
export default ViewRequestedTrains;