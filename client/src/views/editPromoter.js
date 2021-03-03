import React from 'react';
import axios from 'axios';
import { Button, Form, Label, Input } from 'reactstrap';
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
        this.deleteFree = this.deleteFree.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    componentDidMount() {
        axios.get(`http://localhost:8000/api/prom/${this.props.match.params.promId}`)
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
            name: ""
        }
        newPromoter.frees.push(blankFree);
        this.setState({
            promoter: newPromoter
        })
    }

    handlePromoterInput(e) {
        let value = e.target.value;
        let name = e.target.name;
        var newPromoter = this.state.promoter;
        switch (name) {
            case 'name':
                newPromoter.guestlist.name = value;
                break;
            case 'freesLimit':
                newPromoter.freesLimit = value;
                break;
            default:
                console.log('Invalid Name');
        }
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

    deleteFree(index) {
        var newPromoter = this.state.promoter;
        newPromoter.frees.splice(index, 1);
        this.setState({
            promoter: newPromoter
        })
    }

    handleEdit(e) {
        axios.put(`http://localhost:8000/api/prom/updateProm/${this.props.match.params.promId}`, this.state.promoter)
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
                    <Input className = "input" type = "text" name = "name" value = {this.state.promoter.guestlist.name} onChange = {this.handlePromoterInput}/>
                    <Label className = "label">Frees Limit</Label>
                    <Input className = "input" type = "number" name = "freesLimit" value = {this.state.promoter.freesLimit} onChange = {this.handlePromoterInput}/>
                    {myFrees}
                    <Input className = "addFree" type = "submit" value = "+ Add Free" onClick = {this.addFree}/>
                    <AwesomeButton className = "button" type = "primary" onPress = {this.handleEdit}>Finish Editing Promoter</AwesomeButton>
                </Form>
            </Content>
        )
    }
}

export default EditPromoter;