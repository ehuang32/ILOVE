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
import Dropdown from 'react-dropdown';
import Toggle from 'react-toggle';

// CSS
import "../css/dist/styles.css";
import "../css/random.css";
import '../css/collapsible.css';
import '../css/modal.css';
import "../css/toggle.css";

class Bookings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bookings: null,
            guestlist: 0,
            filter: null,
            filterType: "No Filter",
            before12: true
        };
        this.buttonStrikethrough = this.buttonStrikethrough.bind(this);
        this.add = this.add.bind(this);
        this.subtract = this.subtract.bind(this);
        this.deleteProm = this.deleteBooking.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleDropdownFilter = this.handleDropdownFilter.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
    }

    componentDidMount() {
        axios.get(`http://localhost:8000/api/booking/allBookings`)
            .then(response => {
                this.setState({
                    bookings: response.data
                });
            })
            .catch(error => {console.log(error)})
    }
    
    // HELPER FUNCTIONS
    handleToggle(e) {
        this.setState({
            before12: !this.state.before12
        })
    }

    handleFilter(e) {
        let value = e.target.value;
        this.setState({
            filter: value
        })
    }

    handleDropdownFilter(e) {
        let value = e.value;
        this.setState({
            filterType: value
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
            'timeUsed': timeUsed
        }

        var freeSchema = oldFrees;
        freeSchema[freeIndex] = free;

        axios.put(`http://localhost:8000/api/booking/updateFrees/${this.state.bookings[bookIndex]._id}`, freeSchema)
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
        var currentNumber;
        if (this.state.before12) {
            currentNumber = oldGL.numberBefore
        } else {
            currentNumber = oldGL.numberAfter
        }
        const updatedNumber = currentNumber + 1;
        if (this.state.before12) {
            newBookings[bookIndex].guestlist.numberBefore = updatedNumber;
        } else {
            newBookings[bookIndex].guestlist.numberAfter = updatedNumber;
        }
        var newRecord = oldGL.record;
        newRecord.push(Date.now());

        // Change DB
        var GLSchema;
        if (this.state.before12) {
            GLSchema = {
                'name': oldGL.name,
                'type': oldGL.type,
                'numberBefore': updatedNumber,
                'numberAfter': oldGL.numberAfter,
                'record': newRecord
            }
        } else {
            GLSchema = {
                'name': oldGL.name,
                'type': oldGL.type,
                'numberBefore': oldGL.numberBefore,
                'numberAfter': updatedNumber,
                'record': newRecord
            }
        }

        axios.put(`http://localhost:8000/api/bookings/updateGL/${this.state.bookings[bookIndex]._id}`, GLSchema)
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
        var currentNumber;
        if (this.state.before12) {
            currentNumber = oldGL.numberBefore
        } else {
            currentNumber = oldGL.numberAfter
        }
        var newRecord = oldGL.record;
        newRecord.pop();
        if (currentNumber > 0) {
            const updatedNumber = currentNumber - 1;
            if (this.state.before12) {
                newBookings[bookIndex].guestlist.numberBefore = updatedNumber;
            } else {
                newBookings[bookIndex].guestlist.numberAfter = updatedNumber;
            }

            // Change DB
            var GLSchema;
            if (this.state.before12) {
                GLSchema = {
                    'name': oldGL.name,
                    'type': oldGL.type,
                    'numberBefore': updatedNumber,
                    'numberAfter': oldGL.numberAfter,
                    'record': newRecord
                }
            } else {
                GLSchema = {
                    'name': oldGL.name,
                    'type': oldGL.type,
                    'numberBefore': oldGL.numberBefore,
                    'numberAfter': updatedNumber,
                    'record': newRecord
                }
            }

            axios.put(`http://localhost:8000/api/booking/updateGL/${this.state.bookings[bookIndex]._id}`, GLSchema)
                .then((response) => {
                    this.setState({
                        bookings: newBookings
                    })
                })
                .catch(error => {console.log(error)})
        }
    }

    deleteBooking(bookingID) {
        axios.delete(`http://localhost:8000/api/booking/deleteBooking/${bookingID}`)
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

        const filterTypes = ["No Filter", "Table/Booth Booking", "Birthday Bottle", "Birthday List"];

        const myBookings = (
            this.state.bookings.map((booking, key) => {
                // Case Insensitive Filter
                const LCName = booking.guestlist.name.toLowerCase();
                var LCFilter = "";
                if (this.state.filter) {
                    LCFilter = this.state.filter.toLowerCase();
                }
                if (LCName.includes(LCFilter)) {
                    if (this.state.filterType === "No Filter" || this.state.filterType === booking.type) {
                        return (
                            <SingleBooking
                                booking = {booking}
                                before12 = {this.state.before12}
                                index = {key}
                                button = {this.buttonStrikethrough}
                                delete = {this.deleteBooking}
                                minus = {this.subtract}
                                plus = {this.add}
                            />
                        )
                    }
                }
            })
        )

        const addBookingButton = <AwesomeButton href = "/booking/add" type = "secondary">Add Booking</AwesomeButton>
        const toggle = <Toggle checked = {this.state.before12} icons = {false} onChange = {this.handleToggle}/>
        
        return (
            <Content heading = 'Bookings' headingright = {addBookingButton} headingright2 = {toggle}>
                <Input
                    type = "text"
                    placeholder = "Filter.."
                    className = "input"
                    value = {this.state.filter}
                    onChange = {this.handleFilter}
                />
                <Dropdown
                    className = "dropdown"
                    value = {this.state.filterType}
                    options = {filterTypes}
                    onChange = {(e) => this.handleDropdownFilter(e)}
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
                if (free.isUsed) {
                    varType = "toggle"
                }
                if (free.timeUsed) {
                    const date = new Date(free.timeUsed);
                    return (
                        <div className = "gonormal">
                            <div className = "date">
                                {date.toString().substr(16,8)}
                            </div>
                            <AwesomeButton type = {varType} onPress = {() => this.props.button(this.props.index, key)}>{free.name}</AwesomeButton>
                        </div>
                    )
                } else {
                    return (
                        <AwesomeButton type = {varType} onPress = {() => this.props.button(this.props.index, key)}>{free.name}</AwesomeButton>
                    )
                }
            })
        )
        var myValue = this.props.booking.guestlist.numberBefore
        if (!this.props.before12) {
            myValue = this.props.booking.guestlist.numberAfter
        }

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
                        value = {myValue} 
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
                                        <b>Time Paid: </b>{this.props.booking.timePaid.toString().substr(0,10)} <br/>
                                        <b>Frees Limit: </b>{this.props.booking.freesLimit}
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