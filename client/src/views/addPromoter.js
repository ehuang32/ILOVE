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

class AddPromoter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            promoter: "",
            freesList: []
        };
        this.addFree = this.addFree.bind(this);
        this.handlePromoterInput = this.handlePromoterInput.bind(this);
        this.handleFreeInput = this.handleFreeInput.bind(this);
        this.handleFreeDropdown = this.handleFreeDropdown.bind(this);
        this.deleteFree = this.deleteFree.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
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

    handlePromoterInput(e) {
        let value = e.target.value;
        this.setState({
            promoter: value
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

    deleteFree(index) {
        var newFreesList = this.state.freesList;
        newFreesList.splice(index, 1);
        this.setState({
            freesList: newFreesList
        })
    }

    handleAdd() {
        const promSchema = {
            'frees': [],
            'guestlist': {
                'name': this.state.promoter,
                'type': "promoter",
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
            promSchema.frees.push(freeSchema)
        })
        axios.post('/api/prom/add', promSchema)
            .then((response) => {
                console.log(response)
            })
            .catch(error => {console.log(error)})
        this.props.history.push('/promoter');
    }

    render() {
        const freeTypes = ["organiser", "normal"];
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
                        <Icon icon={deleteIcon} height = "30px" width = "25px" color = "black"/>
                    </Button>
                </div>
            ))
        )
        return (
            <Content heading = "Add a New Promoter">
                <Form className = "form">
                    <Label className = "label">Promoter Name</Label>
                    <Input className = "input" type = "text" value = {this.state.promoter} onChange = {this.handlePromoterInput}/>
                    {myFrees}
                    <Input className = "addFree" type = "submit" value = "+ Add Free" onClick = {this.addFree}/>
                    <AwesomeButton className = "button" type = "primary" onPress = {this.handleAdd}>Add Promoter</AwesomeButton>
                </Form>
            </Content>
        )
    }
}

export default AddPromoter;