// React Imports
import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';

// Component Imports
import Content from '../components/content.js';
import Collapsible from 'react-collapsible';
import { AwesomeButton } from 'react-awesome-button';
import Counter from '../components/counter.js';
import LoadingScreen from '../components/loading.js';
import { Icon } from '@iconify/react';
import deleteIcon from '@iconify/icons-mdi/delete';
import bookEdit from '@iconify/icons-mdi/book-edit';
import viewHeadline from '@iconify/icons-mdi/view-headline';
import { Input } from 'reactstrap';
import Popup from 'reactjs-popup';

// CSS
import "../css/dist/styles.css";
import "../css/random.css";
import '../css/collapsible.css';
import '../css/modal.css';

class Bookings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bookings: null,
            guestlist: 0,
            filter: null
        };
        this.buttonStrikethrough = this.buttonStrikethrough.bind(this);
        this.add = this.add.bind(this);
        this.subtract = this.subtract.bind(this);
        this.deleteProm = this.deleteBooking.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
    }

    componentDidMount() {
        axios.get(`/api/booking/allBookings`)
            .then(response => {
                this.setState({
                    bookings: response.data
                });
            })
            .catch(error => {console.log(error)})
    }
    
    // HELPER FUNCTIONS
    handleFilter(e) {
        let value = e.target.value;
        this.setState({
            filter: value
        })
    }

    buttonStrikethrough(bookIndex, freeIndex) {
        // Change isUsed once database is changed as well
        const oldFrees = this.state.bookings[bookIndex].frees;
        var newBookings = this.state.bookings;
        const currentUsed = oldFrees[freeIndex].isUsed;
        const updatedUsed = !currentUsed;
        newBookings[bookIndex].frees[freeIndex].isUsed = updatedUsed;
        var timeUsed = null;
        if (updatedUsed) {
            timeUsed = Date.now();
        }

        // Change DB
        let free = {
            'name': oldFrees[freeIndex].name,
            'isUsed': updatedUsed,
            'timeUsed': timeUsed,
            'type': oldFrees[freeIndex].type
        }

        var freeSchema = oldFrees;
        freeSchema[freeIndex] = free;

        axios.put(`/api/booking/updateFrees/${this.state.bookings[bookIndex]._id}`, freeSchema)
            .then((response) => {
                this.setState({
                    bookings: newBookings
                })
            })
            .catch(error => {console.log(error)})

    }

    add(bookIndex) {
        // Change guestlist number once database is changed as well
        const oldGL = this.state.bookings[bookIndex].guestlist;
        var newBookings = this.state.bookings;
        const currentNumber = oldGL.number;
        const updatedNumber = currentNumber + 1;
        newBookings[bookIndex].guestlist.number = updatedNumber;
        var newRecord = oldGL.record;
        newRecord.push(Date.now());

        // Change DB
        let GLSchema = {
            'name': oldGL.name,
            'type': oldGL.type,
            'number': updatedNumber,
            'record': newRecord
        }

        axios.put(`/api/bookings/updateGL/${this.state.bookings[bookIndex]._id}`, GLSchema)
            .then((response) => {
                this.setState({
                    bookings: newBookings
                })
            })
            .catch(error => {console.log(error)})
    }

    subtract(bookIndex) {
        // Change guestlist number once database is changed as well
        const oldGL = this.state.bookings[bookIndex].guestlist;
        var newBookings = this.state.bookings;
        const currentNumber = oldGL.number;
        var newRecord = oldGL.record;
        newRecord.pop();
        if (currentNumber > 0) {
            const updatedNumber = currentNumber - 1;
            newBookings[bookIndex].guestlist.number = updatedNumber;

            // Change DB
            let GLSchema = {
                'name': oldGL.name,
                'type': oldGL.type,
                'number': updatedNumber,
                'record': newRecord
            }

            axios.put(`/api/booking/updateGL/${this.state.bookings[bookIndex]._id}`, GLSchema)
                .then((response) => {
                    this.setState({
                        bookings: newBookings
                    })
                })
                .catch(error => {console.log(error)})
        }
    }

    deleteBooking(bookingID) {
        axios.delete(`/api/booking/deleteBooking/${bookingID}`)
            .then((response) => {
                window.location.reload(false);
            })
            .catch(error => {console.log(error)})
    }
    
    // RENDER
    render() {
        if (!this.state.bookings) {
            return <LoadingScreen text = {'Fetching Data...'}/>
        }

        const myBookings = (
            this.state.bookings.map((booking, key) => {
                // Case Insensitive Filter
                const LCName = booking.guestlist.name.toLowerCase();
                var LCFilter = "";
                if (this.state.filter) {
                    LCFilter = this.state.filter.toLowerCase();
                }
                if (LCName.includes(LCFilter)) {
                    return (
                        <SingleBooking
                            booking = {booking}
                            index = {key}
                            button = {this.buttonStrikethrough}
                            delete = {this.deleteBooking}
                            minus = {this.subtract}
                            plus = {this.add}
                        />
                    )
                }
            })
        )

        const addBookingButton = <AwesomeButton href = "/booking/add" type = "secondary">Add Booking</AwesomeButton>
        
        return (
            <Content heading = 'Bookings' headingright = {addBookingButton}>
                <Input
                    type = "text"
                    placeholder = "Filter.."
                    className = "input"
                    value = {this.state.filter}
                    onChange = {this.handleFilter}
                />
                {myBookings}
            </Content>
        )
    }
}

class SingleBooking extends React.Component {
    render() {
        var myFrees = (
            this.props.booking.frees.map((free, key) => {
                var varType = "primary";
                if (free.type === "organiser") {
                    varType = "link";
                }
                if (free.isUsed) {
                    varType = "toggle"
                }
                if (free.timeUsed) {
                    const date = new Date(free.timeUsed);
                    return (
                        <div className = "gonormal">
                            <AwesomeButton type = {varType} onPress = {() => this.props.button(this.props.index, key)}>{free.name}</AwesomeButton>
                            <div className = "date">
                                {date.toString().substr(0,24)}
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <AwesomeButton type = {varType} onPress = {() => this.props.button(this.props.index, key)}>{free.name}</AwesomeButton>
                    )
                }
            })
        )
        return (
            <Collapsible trigger = {this.props.booking.guestlist.name}>
                <div className = "gonormal">
                    {myFrees}
                </div>
                <div className = "edit">
                    <div onClick={() => {if (window.confirm('Are you sure you want to delete this Booking?')) this.props.delete(this.props.booking._id)}}>
                        <Icon icon = {deleteIcon} height = "40px" width = "30px" color = "black"/>
                    </div>
                </div>
                <div className = "edit">
                    <Link to={`/booking/edit/${this.props.booking._id}`}>
                        <Icon icon = {bookEdit} height = "40px" width = "30px" color = "black"/>
                    </Link>
                </div>
                <div className = "goright">
                    <Counter 
                        value = {this.props.booking.guestlist.number} 
                        record = {this.props.booking.guestlist.record}
                        minus = {() => this.props.minus(this.props.index)}
                        plus = {() => this.props.plus(this.props.index)}
                    ></Counter>
                </div>
                <div className = "delete">
                    <Popup
                        trigger = {<Icon icon = {viewHeadline} height = "40px" width = "30px" color = "black"/>}
                        modal
                        nested
                    >
                        {close => {
                            return (
                                <div className = "modal">
                                    <div className = "content">
                                        <b>Booking Type: </b>{this.props.booking.type} <br/>
                                        <b>Date Booked: </b>{this.props.booking.date.toString().substr(0,10)} <br/>
                                        <b>Package: </b>{this.props.booking.package} <br/>
                                        <b>Deposit Paid: </b>{this.props.booking.depositPaid ? "Yes" : "No"} <br/>
                                        <b>Fully Paid: </b>{this.props.booking.fullyPaid ? "Yes" : "No"} <br/>
                                        <b>Time Paid: </b>{this.props.booking.timePaid.toString().substr(0,10)}
                                    </div>
                                </div>
                            )
                        }}

                    </Popup>
                </div>
            </Collapsible>
        )
    }
}

export default Bookings;