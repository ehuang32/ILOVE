import React from 'react';
import axios from 'axios';
import { Button, Form, Label, Input } from 'reactstrap';
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
            freesList: [],
            freesLimit: 0
        };
        this.addFree = this.addFree.bind(this);
        this.handlePromoterInput = this.handlePromoterInput.bind(this);
        this.handleFreeInput = this.handleFreeInput.bind(this);
        this.deleteFree = this.deleteFree.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
    }

    addFree(e) {
        e.preventDefault();
        const blankFree = {
            name: ""
        }
        this.setState(prevState => ({
            freesList: [...prevState.freesList, blankFree]
        }))
    }

    handlePromoterInput(e) {
        let value = e.target.value;
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
                'numberBefore': 0,
                'numberAfter': 0,
                'record': []
            },
            'freesLimit': this.state.freesLimit
        }
        // Use for each instead here.
        this.state.freesList.forEach((free, key) => {
            let freeSchema = {
                'name': free.name,
                'isUsed': false,
                'timeUsed': null
            }
            promSchema.frees.push(freeSchema)
        })
        axios.post('http://localhost:8000/api/prom/add', promSchema)
            .then((response) => {
                let addPromSchema = {
                    'promoterId': response.data._id
                }
                axios.put(`http://localhost:8000/api/week/addPromoter/${this.props.match.params.weekId}`, addPromSchema)
                    .then((response2) => {
                        console.log(response2);
                    })
                    .catch(error2 => {console.log(error2)})
            })
            .catch(error => {console.log(error)})
        this.props.history.push(`/promoter/week/${this.props.match.params.weekId}`);
    }

    render() {
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
                    <Input className = "input" type = "text" name = "promoter" value = {this.state.promoter} onChange = {this.handlePromoterInput}/>
                    <Label className = "label">Frees Limit</Label>
                    <Input className = "input" type = "number" name = "freesLimit" value = {this.state.freesLimit} onChange = {this.handlePromoterInput}/>
                    {myFrees}
                    <Input className = "addFree" type = "submit" value = "+ Add Free" onClick = {this.addFree}/>
                    <AwesomeButton className = "button" type = "primary" onPress = {this.handleAdd}>Add Promoter</AwesomeButton>
                </Form>
            </Content>
        )
    }
}

export default AddPromoter;