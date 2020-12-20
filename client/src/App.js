// React Imports
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Component Imports
import Banner from './components/banner.js';
import NavBar from './components/navBar.js';

// View Imports
import Homepage from './views/homepage.js';
import Promoter from './views/promoters.js';
import Booking from './views/bookings.js';
import AddPromoter from './views/addPromoter.js';
import EditPromoter from './views/editPromoter.js';

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
                        <Route path = "/promoter/add" component = {AddPromoter}/>
                        <Route path = "/promoter/edit/:promId" render = {(props) => <EditPromoter {...props}/>}/>
                        <Route path = "/booking" exact component = {Booking}/>
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default App;