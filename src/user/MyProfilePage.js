import axios from "axios";
import React from "react";
import './MyProfilePage.css';
import { Icon, Segment, Table } from "semantic-ui-react";

class MyProfilePage extends React.Component {
    constructor() {
        super();
        this.state = {
            myProfile: [],
        }
    }

    componentDidMount = () => {
        this.handleUserProfile();
    }
    
    handleUserProfile = () => {
        const userDetails = JSON.parse(localStorage.getItem('userDetail'));
        axios.post('http://localhost:5000/myProfile', {
            username: userDetails.name
        }).then((response) => {
                this.setState({ myProfile: response.data.data })
        }).catch((error) => {
            console.log('error', error);
        })
    }

    handleRedirectToHome = () => {
        const { history } = this.props;
        history.push('/')
    }

    render = () => {
        const { myProfile } = this.state;
        return (
            <>
                    <Segment inverted className="segment">
                        <div className="headerContainer">
                            <div className="titleHeader">
                                <Icon className="backIcon" onClick={this.handleRedirectToHome} size="big" name="arrow left" />
                                <h2 className="addPassengerTittle">My Profile</h2>
                            </div>
                            {/* <div className="homeContainer">
                                <Icon className="homeIcon" name="home" size="large" onClick={this.handleRedirectToHome} />
                            </div> */}
                        </div>
                    </Segment>
                <div className="myProfileTable">
                    <Table celled>
                        <Table.Row>
                            <Table.HeaderCell>S.No</Table.HeaderCell>
                            <Table.HeaderCell>Train Name</Table.HeaderCell>
                            <Table.HeaderCell>From Station</Table.HeaderCell>
                            <Table.HeaderCell>Destination</Table.HeaderCell>
                            <Table.HeaderCell>travelDate</Table.HeaderCell>
                            <Table.HeaderCell>Amount Paid</Table.HeaderCell>
                            <Table.HeaderCell>Ticket Status</Table.HeaderCell>
                        </Table.Row>
                        {
                            myProfile.map((ele, ind) => 
                                (
                                    <>
                                        <Table.Row>
                                            <Table.Cell>{ind + 1}</Table.Cell>
                                            <Table.Cell>{ele.train_name}</Table.Cell>
                                            <Table.Cell>{ele.train_from_stat}</Table.Cell>
                                            <Table.Cell>{ele.train_dest_stat}</Table.Cell>
                                            <Table.Cell>{ele.date_of_travel}</Table.Cell>
                                            <Table.Cell>{ele.total_amount_paid}</Table.Cell>
                                            <Table.Cell><Icon color="green" name="checkmark" />Confirm</Table.Cell>
                                        </Table.Row>
                                    </>
                                )
                            )
                        }
                    </Table>
                </div>
            </>
        )
    }
}
export default MyProfilePage;