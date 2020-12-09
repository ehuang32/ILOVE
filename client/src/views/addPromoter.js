import React from 'react';
import axios from 'axios';
import { Button, Form, Label, Input } from 'reactstrap';
import Dropdown from 'react-dropdown';
import { AwesomeButton } from 'react-awesome-button';

import Content from '../components/content.js';
import '../css/form.css';

class addPromoter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            promoter: null,
            freesList: []
        };
        this.addFree = this.addFree.bind(this);
        this.handleFreeInput = this.handleFreeInput.bind(this);
        this.handleFreeDropdown = this.handleFreeDropdown.bind(this);
        this.deleteFree = this.deleteFree.bind(this);
    }

    addFree(e) {
        e.preventDefault();
        const blankFree = {
            'name': "",
            'type': ""
        }
        this.setState(prevState => ({
            freesList: [...prevState.freesList, blankFree]
        }))
    }

    handleFreeInput(e) {
        let value = e.value;
        let index = e.index;
        var newFreesList = this.state.freesList;
        newFreesList[index].name = value;
        this.setState({
            freesList: newFreesList
        })
    }

    handleFreeDropdown(e) {
        let value = e.value;
        let index = e.index;
        var newFreesList = this.state.freesList;
        newFreesList[index].type = value;
        this.setState({
            freesList: newFreesList
        })
    }

    deleteFree(e) {
        let index = e.index;
        var newFreesList = this.state.freesList;
        newFreesList.splice(index, 1);
        this.setState({
            freesList: newFreesList
        })
    }

    render() {
        const freeTypes = ["organiser", "normal"];
        console.log(this.state.freesList);
        const myFrees = (
            this.state.freesList.map((free, key) => (
                <div className = "row">
                    <div className = "col">
                        <Label className = "label">Name Given for Free</Label>
                        <Input 
                            type = "text" 
                            index = {key}
                            value = {free.name}
                            onChange = {this.handleFreeInput}
                        />
                    </div>
                    <div className = "col">
                        <Label className = "label">Type of Free</Label>
                        <Dropdown
                            className = "form-control"
                            options = {freeTypes} 
                            index = {key}
                            onChange = {this.handleFreeDropdown} 
                            value = {free.type} 
                            placeholder = "Select a Type" 
                        />                    
                    </div>
                    <Button className = "deleteFree" onClick = {this.deleteFree} index = {key}>-</Button>
                </div>
            ))
        )
        return (
            <Content heading = "Add a New Promoter">
                <Form className = "form">
                    <Label className = "label">Promoter Name</Label>
                    <Input type = "text" name = "name"/>
                    {myFrees}
                    <Input className = "addFree" type = "submit" value = "+ Add Free" onClick = {this.addFree}/>
                    <AwesomeButton className = "button" type = "primary">Add Promoter</AwesomeButton>
                </Form>
            </Content>
        )
    }
}

export default addPromoter;