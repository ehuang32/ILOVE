import React from 'react';
import axios from 'axios';
import { Button, Form, Label, Input } from 'reactstrap';
import Dropdown from 'react-dropdown';
import { AwesomeButton } from 'react-awesome-button';
import { Icon } from '@iconify/react';
import deleteIcon from '@iconify/icons-mdi/delete';

import Content from '../components/content.js';
import '../css/form.css';
import '../css/dropdown.css';

class AddBooking extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            booking: "",
            freesList: [],
            type: "",
            date: Date.now(),
            package: "",
            depositPaid: false,
            fullyPaid: false,
            timePaid: Date.now()
        };
        this.addFree = this.addFree.bind(this);
        this.handleBookingInput = this.handleBookingInput.bind(this);
        this.handleFreeInput = this.handleFreeInput.bind(this);
        this.handleFreeDropdown = this.handleFreeDropdown.bind(this);
        this.deleteFree = this.deleteFree.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleBookingDropdown = this.handleBookingDropdown.bind(this);
    }

    addFree(e) {
        e.preventDefault();
        const blankFree = {
            name: "",
            type: null
        }
        this.setState(prevState => ({
            freesList: [...prevState.freesList, blankFree]
        }))
    }

    handleBookingInput(e) {
        let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        let name = e.target.name;
        this.setState({
            [name]: value
        })
    }

    handleFreeInput(e, index) {
        let value = e.target.value;
        var newFreesList = this.state.freesList;
        newFreesList[index].name = value;
        this.setState({
            freesList: newFreesList
        })
    }

    handleFreeDropdown(e, index) {
        let value = e.value;
        var newFreesList = this.state.freesList;
        newFreesList[index].type = value;
        this.setState({
            freesList: newFreesList
        })
    }

    handleBookingDropdown(e) {
        let value = e.value;
        this.setState({
            type: value
        })
    }

    deleteFree(index) {
        var newFreesList = this.state.freesList;
        newFreesList.splice(index, 1);
        this.setState({
            freesList: newFreesList
        })
    }

    handleAdd() {
        const bookingSchema = {
            'type': this.state.type,
            'date': this.state.date,
            'package': this.state.package,
            'depositPaid': this.state.depositPaid,
            'fullyPaid': this.state.fullyPaid,
            'timePaid': this.state.timePaid,
            'frees': [],
            'guestlist': {
                'name': this.state.booking,
                'type': "booking",
                'number': 0,
                'record': []
            }
        }
        // Use for each instead here.
        this.state.freesList.forEach((free, key) => {
            let freeSchema = {
                'name': free.name,
                'isUsed': false,
                'timeUsed': null,
                'type': free.type
            }
            bookingSchema.frees.push(freeSchema)
        })
        axios.post('http://localhost:8000/api/booking/add', bookingSchema)
            .then((response) => {
                console.log(response)
            })
            .catch(error => {console.log(error)})
        this.props.history.push('/booking');
    }

    render() {
        const freeTypes = ["organiser", "normal"];
        const bookingTypes = ["Table/Booth Booking", "Birthday Bottle", "Birthday List"]
        const myFrees = (
            this.state.freesList.map((free, key) => (
                <div className = "row">
                    <div className = "col">
                        <Label className = "label">Name Given for Free</Label>
                        <Input
                            type = "text"
                            value = {free.name}
                            onChange = {(e) => this.handleFreeInput(e, key)}
                        />
                    </div>
                    <div className = "col">
                        <Label className = "label">Type of Free</Label>
                        <Dropdown
                            className = "form-control"
                            value = {free.type}
                            options = {freeTypes}
                            onChange = {(e) => this.handleFreeDropdown(e, key)}
                            placeholder = "Select a Type"
                        />
                    </div>
                    <Button className = "deleteFree" onClick = {() => this.deleteFree(key)}>
                        <Icon icon = {deleteIcon} height = "30px" width = "25px" color = "black"/>
                    </Button>
                </div>
            ))
        )
        return (
            <Content heading = "Add a New Booking">
                <Form className = "form">
                    <Label className = "label">Booking Name</Label>
                    <Input className = "input" type = "text" name = "booking" value = {this.state.booking} onChange = {this.handleBookingInput}/>
                    <Label className = "label">Type</Label>
                    <Dropdown
                        className = "form-control"
                        value = {this.state.type}
                        options = {bookingTypes}
                        onChange = {this.handleBookingDropdown}
                        placeholder = "Select a Booking Type"
                    />
                    <Label className = "label">Booking Date</Label>
                    <Input className = "input" type = "date" name = "date" value = {this.state.date} onChange = {this.handleBookingInput}/>
                    <Label className = "label">Package</Label>
                    <Input className = "input" type = "text" name = "package" value = {this.state.package} onChange = {this.handleBookingInput}/>
                    <Label className = "label">Deposit Paid</Label>
                    <Input type = "checkbox" name = "depositPaid" checked = {this.state.depositPaid} onChange = {this.handleBookingInput}/>
                    <br></br>
                    <Label className = "label">Fully Paid</Label>
                    <Input type = "checkbox" name = "fullyPaid" checked = {this.state.fullyPaid} onChange = {this.handleBookingInput}/>
                    <br></br>
                    <Label className = "label">Time Paid</Label>
                    <Input className = "input" type = "date" name = "timePaid" value = {this.state.timePaid} onChange = {this.handleBookingInput}/>
                    {myFrees}
                    <Input className = "addFree" type = "submit" value = "+ Add Free" onClick = {this.addFree}/>
                    <AwesomeButton className = "button" type = "primary" onPress = {this.handleAdd}>Add Booking</AwesomeButton>
                </Form>
            </Content>
        )
    }
}

export default AddBooking;