// React Imports
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Component Imports
import Banner from './components/banner.js';
import NavBar from './components/navBar.js';

// View Imports
import Homepage from './views/homepage.js';
import Promoter from './views/promoters.js';
import AddPromoter from './views/addPromoter.js';
import EditPromoter from './views/editPromoter.js';
import Booking from './views/bookings.js';
import AddBooking from './views/addBooking.js';
import EditBooking from './views/editBooking.js';
import Report from './views/report.js';
import PromoterHistory from './views/promoterHistory.js'

// CSS
import './App.css';


class App extends React.Component {
    render() {
        return (
            <Router>
                <div className="header">
                    <Banner/>
                    <NavBar/>
                </div>
                <div className="container">
                    <Switch>
                        <Route path = "/" exact component = {Homepage}/>
                        <Route path = "/promoter" exact component = {Promoter}/>
                        <Route path = "/promoter/week/:weekId" render = {(props) => <Promoter {...props}/>}/>
                        <Route path = "/promoter/add/:weekId" component = {AddPromoter}/>
                        <Route path = "/promoter/edit/:promId" render = {(props) => <EditPromoter {...props}/>}/>
                        <Route path = "/booking" exact component = {Booking}/>
                        <Route path = "/booking/add" component = {AddBooking}/>
                        <Route path = "/booking/edit/:bookingId" render = {(props) => <EditBooking {...props}/>}/>
                        <Route path = "/history/promoter" exact component = {PromoterHistory}/>
                        <Route path = "/report" exact component = {Report}/>
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default App;