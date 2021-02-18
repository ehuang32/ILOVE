import React from 'react';
import axios from 'axios';
import { Button, Form, Label, Input } from 'reactstrap';
import Dropdown from 'react-dropdown';
import { AwesomeButton } from 'react-awesome-button';
import LoadingScreen from '../components/loading.js';
import { Icon } from '@iconify/react';
import deleteIcon from '@iconify/icons-mdi/delete';

import Content from '../components/content.js';
import '../css/form.css';
import '../css/dropdown.css';
import '../css/random.css';

class EditBooking extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            booking: null
        }
        this.addFree = this.addFree.bind(this);
        this.handleBookingInput = this.handleBookingInput.bind(this);
        this.handleBookingDropdown = this.handleBookingDropdown.bind(this);
        this.handleFreeInput = this.handleFreeInput.bind(this);
        this.handleFreeDropdown = this.handleFreeDropdown.bind(this);
        this.deleteFree = this.deleteFree.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    componentDidMount() {
        axios.get(`/api/booking/${this.props.match.params.bookingId}`)
            .then(response => {
                this.setState({
                    booking: response.data
                });
            })
            .catch(error => {console.log(error)})
    }

    addFree(e) {
        e.preventDefault();
        var newBooking = this.state.booking;
        const blankFree = {
            name: "",
            type: null
        }
        newBooking.frees.push(blankFree);
        this.setState({
            booking: newBooking
        })
    }

    handleBookingInput(e) {
        let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        let name = e.target.name;
        var newBooking = this.state.booking;
        switch (name) {
            case 'name':
                newBooking.guestlist.name = value;
                break;
            case 'date':
                newBooking.date = value;
                break;
            case 'package':
                newBooking.package = value;
                break;
            case 'depositPaid':
                newBooking.depositPaid = value;
                break;
            case 'fullyPaid':
                newBooking.fullyPaid = value;
                break;
            case 'timePaid':
                newBooking.timePaid = value;
                break;
            default:
                console.log('Invalid Name');
        }
        this.setState({
            booking: newBooking
        })
    }

    handleBookingDropdown(e) {
        let value = e.value;
        var newBooking = this.state.booking;
        newBooking.type = value;
        this.setState({
            booking: newBooking
        })
    }

    handleFreeInput(e, index) {
        let value = e.target.value;
        var newBooking = this.state.booking;
        newBooking.frees[index].name = value;
        this.setState({
            booking: newBooking
        })
    }

    handleFreeDropdown(e, index) {
        let value = e.value;
        var newBooking = this.state.booking;
        newBooking.frees[index].type = value;
        this.setState({
            booking: newBooking
        })
    }

    deleteFree(index) {
        var newBooking = this.state.booking;
        newBooking.frees.splice(index, 1);
        this.setState({
            booking: newBooking
        })
    }

    handleEdit(e) {
        console.log(this.state.booking);
        axios.put(`/api/booking/updateBooking/${this.props.match.params.bookingId}`, this.state.booking)
            .then((response) => {
                console.log(response.data);
            })
            .catch(error => {console.log(error)})
        this.props.history.push('/booking');
    }

    render() {
        if (!this.state.booking) {
            return <LoadingScreen text = {'Fetching Data...'}/>
        }
        const freeTypes = ["organiser", "normal"];
        const bookingTypes = ["Table/Booth Booking", "Birthday Bottle", "Birthday List"]
        const myFrees = (
            this.state.booking.frees.map((free, key) => (
                <div className = "row">
                    <div className = "col">
                        <Label className = "label">Name Given for Free</Label>
                        <Input 
                            className = "input"
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
                        <Icon icon={deleteIcon} height = "30px" width = "25px" color = "black"/>
                    </Button>
                </div>
            ))
        )
        return (
            <Content heading = "Edit Booking">
                <Form className = "form">
                    <Label className = "label">Booking Name</Label>
                    <Input className = "input" type = "text" name = "name" value = {this.state.booking.guestlist.name} onChange = {this.handleBookingInput}/>
                    <Label className = "label">Type</Label>
                    <Dropdown
                        className = "form-control"
                        value = {this.state.booking.type}
                        options = {bookingTypes}
                        onChange = {this.handleBookingDropdown}
                        placeholder = "Select a Booking Type"
                        name = "type"
                    />
                    <Label className = "label">Booking Date</Label>
                    <Input className = "input" type = "date" name = "date" value = {this.state.booking.date.toString().substr(0,10)} onChange = {this.handleBookingInput}/>
                    <Label className = "label">Package</Label>
                    <Input className = "input" type = "text" name = "package" value = {this.state.booking.package} onChange = {this.handleBookingInput}/>
                    <Label className = "label">Deposit Paid</Label>
                    <Input type = "checkbox" name = "depositPaid" checked = {this.state.booking.depositPaid} onChange = {this.handleBookingInput}/>
                    <br></br>
                    <Label className = "label">Fully Paid</Label>
                    <Input type = "checkbox" name = "fullyPaid" checked = {this.state.booking.fullyPaid} onChange = {this.handleBookingInput}/>
                    <br></br>
                    <Label className = "label">Time Paid</Label>
                    <Input className = "input" type = "date" name = "timePaid" value = {this.state.booking.timePaid.toString().substr(0,10)} onChange = {this.handleBookingInput}/>
                    {myFrees}
                    <Input className = "addFree" type = "submit" value = "+ Add Free" onClick = {this.addFree}/>
                    <AwesomeButton className = "button" type = "primary" onPress = {this.handleEdit}>Finish Editing Promoter</AwesomeButton>
                </Form>
            </Content>
        )
    }
}

export default EditBooking;