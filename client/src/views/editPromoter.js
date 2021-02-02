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

class EditPromoter extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            promoter: null
        };
        this.addFree = this.addFree.bind(this);
        this.handlePromoterInput = this.handlePromoterInput.bind(this);
        this.handleFreeInput = this.handleFreeInput.bind(this);
        this.handleFreeDropdown = this.handleFreeDropdown.bind(this);
        this.deleteFree = this.deleteFree.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    componentDidMount() {
        axios.get(`/api/prom/${this.props.match.params.promId}`)
            .then(response => {
                this.setState({
                    promoter: response.data
                });
            })
            .catch(error => {console.log(error)})
    }

    addFree(e) {
        e.preventDefault();
        var newPromoter = this.state.promoter;
        const blankFree = {
            name: "",
            type: null
        }
        newPromoter.frees.push(blankFree);
        this.setState({
            promoter: newPromoter
        })
    }

    handlePromoterInput(e) {
        let value = e.target.value;
        var newPromoter = this.state.promoter;
        newPromoter.guestlist.name = value;
        this.setState({
            promoter: newPromoter
        })
    }

    handleFreeInput(e, index) {
        let value = e.target.value;
        var newPromoter = this.state.promoter;
        newPromoter.frees[index].name = value;
        this.setState({
            promoter: newPromoter
        })
    }

    handleFreeDropdown(e, index) {
        let value = e.value;
        var newPromoter = this.state.promoter;
        newPromoter.frees[index].type = value;
        this.setState({
            promoter: newPromoter
        })
    }

    deleteFree(index) {
        var newPromoter = this.state.promoter;
        newPromoter.frees.splice(index, 1);
        this.setState({
            promoter: newPromoter
        })
    }

    handleEdit(e) {
        axios.put(`/api/prom/updateProm/${this.props.match.params.promId}`, this.state.promoter)
            .then((response) => {
                console.log(response.data);
            })
            .catch(error => {console.log(error)})
        this.props.history.push('/promoter');
    }

    render() {
        if (!this.state.promoter) {
            return <LoadingScreen text = {'Fetching Data...'}/>
        }
        const freeTypes = ["organiser", "normal"];
        const myFrees = (
            this.state.promoter.frees.map((free, key) => (
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
            <Content heading = "Edit Promoter">
                <Form className = "form">
                    <Label className = "label">Promoter Name</Label>
                    <Input className = "input" type = "text" value = {this.state.promoter.guestlist.name} onChange = {this.handlePromoterInput}/>
                    {myFrees}
                    <Input className = "addFree" type = "submit" value = "+ Add Free" onClick = {this.addFree}/>
                    <AwesomeButton className = "button" type = "primary" onPress = {this.handleEdit}>Finish Editing Promoter</AwesomeButton>
                </Form>
            </Content>
        )
    }
}

export default EditPromoter;