import React from "react";
import { Button, Icon, Menu, Segment } from "semantic-ui-react";
import './TrainComponent.css';

const TrainComponent = (props) => {
    const travelData = JSON.parse(localStorage.getItem('travelData'));
    const userDetails = JSON.parse(localStorage.getItem('userDetail'));
    const { fromStation,
        DestStation,
        transportData
    } = travelData;

    const handleTicketBooking = (train) => {
        const { history } = props;
        localStorage.setItem('selectedTrain', JSON.stringify(train));
        if (userDetails?.role === 'user' && userDetails !== null) {
            history.push('/travellerDetails')
        } else {
            history.push('/sign-In')
        }
    }

    const handleRequestTransport = () => {
        const { history } = props;
        history.push('/reqtrain');
    }

    const handleBack = () => {
        const { history } = props;
        history.push('/')
    }

    const handleRedirectToHome = () => {
        const { history } = props;
        history.push('/')
    }
    

    return (
        <>
            <div>
                <Segment inverted className="segment">
                    <div className="headerContainer">
                        <div className="titleHeader">
                            <Icon className="backIcon" onClick={handleBack} size="big" name="arrow left" />
                            <h2 className="addPassengerTittle">{`Train For ${fromStation} - ${DestStation} `}</h2>
                        </div>
                        <div className="homeContainer">
                            <Icon className="homeIcon" name="home" size="large" onClick={handleRedirectToHome} />
                        </div>
                    </div>
                </Segment>
                {
                transportData === 'no train available' ? 
                <>
                
                    <div className="noTrainContent">
                        <h1>Sorry...</h1>
                        <h3>No Trains Available</h3>

                        <Button color="red" onClick={handleRequestTransport}>Request Train</Button>
                    </div>
                
                </> : 
                    transportData.map((train) => {
                        return (
                            <>
                                <div className="transportDetailsContainer">
                                    <div className="container1">
                                        <div className="trainName">
                                            <h4>{train.train_name}</h4>
                                            <div className="daysAvaliable">S M T W T F S</div>
                                        </div>
                                    </div>
                                    
                                    <div className="container2">
                                        <div className="btwStation">
                                            <h4>{fromStation} - {DestStation}</h4>
                                            <div className="trainTiming">{train.arrival_time} - {train.departure_time}</div>
                                        </div>
                                    </div>
    
                                    <div  className="bookTicketBTN">
                                        <Button color="red" onClick={() => handleTicketBooking(train)}>Book Ticket</Button>
                                    </div>
                                </div>
                            </>
                        )
                    })
                }
                
                
            </div>
        </>
    )
}
export default TrainComponent;