// React Imports
import React from 'react';
import axios from 'axios';

// Component Imports
import LoadingScreen from '../components/loading.js';
import Content from '../components/content.js';
import { Link } from 'react-router-dom';

// CSS Imports
import "../css/random.css"

class PromoterHistory extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            weeks: null
        };
    }

    componentDidMount() {
        axios.get(`http://localhost:8000/api/week/allWeeks`)
            .then(response => {
                console.log(response.data);
                this.setState({
                    weeks: response.data
                })
            })
            .catch(error => {console.log(error)})
    }

    render() {
        if (!this.state.weeks) {
            return <LoadingScreen text = {'Fetching Data...'}/>
        }

        const myWeeks = (
            this.state.weeks.map((week, key) => (
                <div className = "noPromoters">
                    <Link to = {`/promoter/week/${week._id}`}>
                        {week.name}
                    </Link>
                    <br/>
                </div>
            ))
        )

        return (
            <Content heading = 'History'>
                {myWeeks}
            </Content>
        )

    }
}

export default PromoterHistory;