import React from "react";
// import payanamLogo from '../../assets/payanamLogo.svg';
import axios from 'axios';
import AddTransport from '../components/AddTransport';
import TransportHome from '../components/TransportHome';
import RequestTransport from '../components/RequestTransport';
import mypayanamLogo from './payanamLogo.png';
import { ToastContainer, toast } from 'react-toastify';
import { Menu, Image, Dropdown, Icon } from "semantic-ui-react";
import comingSoon from '../assets/image/comingSoon.jpg';
import './HomeHeader.css';
import { Link } from "react-router-dom";

class HomeHeader extends React.Component {
    constructor() {
        super();
        this.state = {
            trainData: [],
            activeItem: 'trains',
            userName: '',
            openOption: false,
            flightModal: true,
            userRole: '',
        };
    }

    componentDidMount = () => {
        const { userRole } = this.state;
        const { match } = this.props;
        if (match.path === '/reqtrain') {
            this.setState({ activeItem: 'reqTrain' })
        } else if (match.path === 'addflights') {
            this.setState({ activeItem: 'reqFlight'})
        }
        const userDetails = JSON.parse(localStorage.getItem('userDetail'));
        (userDetails !== null && userDetails !== undefined && this.setState({ userRole: userDetails.role }))
        this.handleGetAllTrain();
        userDetails !== null && userDetails !== undefined && userDetails.role === 'user' && this.toastmessage(); 
    }
    

    handleGetAllTrain = () => {
        axios.get("http://localhost:5000/availableTrains")
        .then((response) => {
            const { data } = response;
            this.setState({ trainData: data.data })
        })
        .catch((error) => {
            console.log('error', error);
        })
    }

    handleItemClick = (str) => {
        const {history} = this.props
        this.setState({ activeItem: str })
        if (str !== 'reqTrain' && str !== 'reqFlight') {
            history.push('/');
        } else if (str === 'reqTrain') {
            history.push('/reqtrain');
        } else if (str === 'reqFlight') {
            history.push('/reqflights')
        }
    }

    handleLoginPage = () => {
        const {  history } = this.props;
        history.push("/sign-In");
    }

    handleLogoutPage = () => {
        localStorage.removeItem('userDetail')
        this.setState({ openOption: true, userRole: '', activeItem: 'trains' })   
    }

    toastmessage = () => {
        toast("Wow so Easy");
    }

    showRequestedTrains = () => {
        const { history } = this.props;
        history.push('/neededTrain');
    }

    handleProfilePage = () => {
        const { history } = this.props;
        history.push('/myProfile');
    }


    render = () => {
        const { activeItem, trainData, userRole } = this.state;
        const { history } = this.props;
        const userDetails = JSON.parse(localStorage.getItem('userDetail'));
        console.log('userRole', userRole);
        return (
            <>  
                <div className={activeItem === 'trains' ? "trainBG" : activeItem === 'flight' ? "flightBG" : activeItem === 'offers' ? "offersBG" : activeItem === 'addTrain' ? 'trainBG' : activeItem === 'addFlight' ? 'flightBG' : activeItem === 'reqTrain' ? 'trainBG' : activeItem === 'reqFlight' && 'flightBG'}>
                    <div 
                        className={activeItem === 'trains' ? "trainMenu" : activeItem === 'flight' ? "flightMenu" : activeItem === 'offers' ? "offersMenu" : activeItem === 'addTrain' ? "trainMenu" : activeItem === 'addFlight' && "flightMenu"}
                    >
                    <Menu pointing secondary size="massive">
                            <Link to="/">
                                <div className="logoName">
                                    <Image src={mypayanamLogo} alt="logo" />
                                    <h2 className={activeItem === 'trains' ? "trainLogoName" : activeItem === 'flight' ? "flightLogoName" : activeItem === 'offers' ? "offersLogoName" : activeItem === 'addTrain' ? 'trainLogoName' : activeItem === 'addFlight' && 'flightLogoName' }>Mypayanam</h2>
                                </div>
                            </Link>
                            
                            
                        <Menu.Item
                            name='Train'
                            active={activeItem === 'trains'}
                            onClick={() => this.handleItemClick('trains')}
                            className="menu"
                        />
                        <Menu.Item
                            name='Flight'
                            active={activeItem === 'flight'}
                            onClick={() => this.handleItemClick('flight')}
                            className="menu"
                        />
                        <Menu.Item
                            name='Offers'
                            active={activeItem === 'offers'}
                            onClick={() => this.handleItemClick('offers')}
                            className="menu"
                        />
                        <Menu.Menu position='right'>
                            { 
                                userRole !== '' ?
                                (userRole === 'admin' ? (
                                    <>
                                        <Menu.Item
                                            name='Add Train'
                                            active={activeItem === 'addTrain'}
                                            onClick={() => this.handleItemClick('addTrain')}
                                            color="red"
                                        />
                                        <Menu.Item
                                            name='Add Flight'
                                            active={activeItem === 'addFlight'}
                                            onClick={() => this.handleItemClick('addFlight')}
                                            color="blue"
                                        />
                                    </>
                                ) : 
                                <>
                                    <>
                                        <Menu.Item
                                            name='Request Train'
                                            active={activeItem === 'reqTrain'}
                                            onClick={() => this.handleItemClick('reqTrain')}
                                            color="red"
                                        />
                                        <Menu.Item
                                            name='Request Flight'
                                            active={activeItem === 'reqFlight'}
                                            onClick={() => this.handleItemClick('reqFlight')}
                                            color="blue"
                                        />
                                    </>
                                
                                </>) : <></>
                            }
                            
                            {
                                userDetails !== null && userDetails !== undefined ?                             
                                
                                <Dropdown
                                    item
                                    floating
                                    labeled
                                    text={userDetails?.name}
                                    icon='user circle outline'
                                >
                                    <Dropdown.Menu>
                                        {
                                            userRole !== 'admin' ?
                                            <Dropdown.Item onClick={() => this.handleProfilePage('profile')}><Icon name="user" />My Profile</Dropdown.Item> :
                                            <Dropdown.Item onClick={() => this.showRequestedTrains()}><Icon name="train" />Requested Trains</Dropdown.Item>

                                        }
                                        <Dropdown.Item onClick={() => this.handleLogoutPage('logout')}><Icon name="sign-out" />Sign-out</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                : <Menu.Item
                                    icon='sign-in'
                                    name='Login'
                                    active={activeItem === 'login'}
                                    onClick={() => this.handleLoginPage('login')}
                                    color="olive"
                                /> 
                            }                            
                        </Menu.Menu>
                    </Menu>
                    </div>

                    {
                        activeItem === 'addTrain' && <AddTransport selectedTransport={activeItem} />
                    }
                    {
                        activeItem === 'addFlight' && <AddTransport selectedTransport={activeItem} />
                    }
                    {
                        (activeItem === 'reqTrain' || activeItem === 'reqFlight') && <RequestTransport />
                    }
                    {
                        // activeItem !== 'flight' && activeItem !== 'addFlight' && activeItem !== 'addTrain' && activeItem !== 'login' && activeItem !== 'offers'
                        activeItem === 'trains' && <TransportHome selectedTransport={activeItem} trainData={trainData} history={history} />
                    }
                    {activeItem === 'flight' && (
                        <div>
                            <Image className="comingSoonImg" src={comingSoon} />
                        </div>
                    )}
                </div>
            </>
        )
    }
}
export default HomeHeader;