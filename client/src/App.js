// React Imports
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Component Imports
import Banner from './components/banner.js';
import NavBar from './components/navBar.js';
import Homepage from './views/homepage.js';
import Promoter from './views/promoters.js';
import Booking from './views/bookings.js';

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
                        <Route path = "/booking" exact component = {Booking}/>
                    </Switch>
                </div>
            </Router>
        )
    }
}

export default App;