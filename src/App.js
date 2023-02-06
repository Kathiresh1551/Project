import HomeHeader from './screen/HomeHeader';
import Login from './screen/Login';
// import SignUp from './screen/Sign-Up';
import TrainComponent from './components/TrainComponent';
import ViewRequestedTrains from './admin/ViewRequestedTrains';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MyProfile from './user/MyProfilePage'
import PassengerDetails from './components/PassesngerDetail';

function App() {
    return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/travellerDetails" component={PassengerDetails} />
          <Route exact path="/trains" component={HomeHeader} />
          <Route exact path="/flights" component={HomeHeader} />
          <Route exact path="/addtrains" component={HomeHeader} />
          <Route exact path="/addflights" component={HomeHeader} />
          <Route exact path="/reqtrain" component={HomeHeader} />
          <Route exact path="/reqflights" component={HomeHeader} />
          <Route exact path="/offers" component={HomeHeader} />
          <Route exact path="/mypayanam/train" Redirect="/" component={TrainComponent} />
          <Route exact path="/sign-In" component={Login} />
          <Route exact path="/sign-Up" component={Login} />
          <Route exact path="/neededTrain" component={ViewRequestedTrains} />
          <Route exact path="/myProfile" component={MyProfile} />
          <Route path="/" component={HomeHeader} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
