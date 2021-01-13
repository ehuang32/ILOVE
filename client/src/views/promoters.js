// React Imports
import React from 'react';
import axios from 'axios';
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
import { Input } from 'reactstrap';

// CSS
import "../css/dist/styles.css";
import "../css/random.css";
import '../css/collapsible.css';

class Promoters extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            promoters: null,
            testST1: true,
            testST2: true,
            guestlist: 0,
            filter: null
        };
        this.buttonStrikethrough = this.buttonStrikethrough.bind(this);
        this.add = this.add.bind(this);
        this.subtract = this.subtract.bind(this);
        this.deleteProm = this.deleteProm.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
    }

    componentDidMount() {
        axios.get(`/api/prom/allProms`)
            .then(response => {
                this.setState({
                    promoters: response.data
                });
            })
            .catch(error => {console.log(error)})
    }

    // HELPER FUNCTIONS
    handleFilter(e) {
        let value = e.target.value;
        this.setState({
            filter: value
        });
    }

    buttonStrikethrough(promIndex, freeIndex) {
        // Change isUsed once database is changed as well
        const oldFrees = this.state.promoters[promIndex].frees;
        var newPromoters = this.state.promoters;
        const currentUsed = oldFrees[freeIndex].isUsed;
        const updatedUsed = !currentUsed;
        newPromoters[promIndex].frees[freeIndex].isUsed = updatedUsed;
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

        axios.put(`/api/prom/updateFrees/${this.state.promoters[promIndex]._id}`, freeSchema)
            .then((response) => {
                this.setState({
                    promoters: newPromoters
                })
            })
            .catch(error => {console.log(error)})

    }

    add(promIndex) {
        // Change guestlist number once database is changed as well
        const oldGL = this.state.promoters[promIndex].guestlist;
        var newPromoters = this.state.promoters;
        const currentNumber = oldGL.number;
        const updatedNumber = currentNumber + 1;
        newPromoters[promIndex].guestlist.number = updatedNumber;
        var newRecord = oldGL.record;
        newRecord.push(Date.now());

        // Change DB
        let GLSchema = {
            'name': oldGL.name,
            'type': oldGL.type,
            'number': updatedNumber,
            'record': newRecord
        }

        axios.put(`/api/prom/updateGL/${this.state.promoters[promIndex]._id}`, GLSchema)
            .then((response) => {
                this.setState({
                    promoters: newPromoters
                })
            })
            .catch(error => {console.log(error)})
    }

    subtract(promIndex) {
        // Change guestlist number once database is changed as well
        const oldGL = this.state.promoters[promIndex].guestlist;
        var newPromoters = this.state.promoters;
        const currentNumber = oldGL.number;
        var newRecord = oldGL.record;
        newRecord.pop();
        if (currentNumber > 0) {
            const updatedNumber = currentNumber - 1;
            newPromoters[promIndex].guestlist.number = updatedNumber;

            // Change DB
            let GLSchema = {
                'name': oldGL.name,
                'type': oldGL.type,
                'number': updatedNumber,
                'record': newRecord
            }

            axios.put(`/api/prom/updateGL/${this.state.promoters[promIndex]._id}`, GLSchema)
                .then((response) => {
                    this.setState({
                        promoters: newPromoters
                    })
                })
                .catch(error => {console.log(error)})
        }
    }

    deleteProm(promID) {
        axios.delete(`/api/prom/deleteProm/${promID}`)
            .then((response) => {
                window.location.reload(false);
            })
            .catch(error => {console.log(error)})
    }

    // RENDER
    render() {
        if (!this.state.promoters) {
            return <LoadingScreen text = {'Fetching Data...'}/>
        }
        const myPromoters = (
            this.state.promoters.map((prom, key) => {
                // Case Insensitive Filter
                const LCName = prom.guestlist.name.toLowerCase();
                var LCFilter = "";
                if (this.state.filter) {
                    LCFilter = this.state.filter.toLowerCase();
                }
                if (LCName.includes(LCFilter)) {
                    return (
                        <SinglePromoter 
                            promoter = {prom} 
                            index = {key}
                            button = {this.buttonStrikethrough}
                            delete = {this.deleteProm}
                            minus = {this.subtract}
                            plus = {this.add}
                        />
                    )
                }
            }
            )
        )
        const addPromoterButton = <AwesomeButton href = "/promoter/add" type = "secondary">Add Promoter</AwesomeButton>
        return (
            <Content heading = 'Promoters' headingright = {addPromoterButton}>
                <Input 
                    type = "text" 
                    placeholder = "Filter.."
                    className = "input"
                    value = {this.state.filter}
                    onChange = {this.handleFilter}
                />
                {myPromoters}
            </Content>
        )
    }
}

class SinglePromoter extends React.Component {
    render() {
        var myFrees = (
            this.props.promoter.frees.map((free, key) => {
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
                                {date.toString().substr(16,8)}
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
            <Collapsible trigger = {this.props.promoter.guestlist.name}>
                <div className = "gonormal">
                    {myFrees}
                </div>
                <div className = "delete">
                    <div onClick={() => {if (window.confirm('Are you sure you want to delete this Promoter?')) this.props.delete(this.props.promoter._id)}}>
                        <Icon icon={deleteIcon} height = "40px" width = "30px" color = "black"/>
                    </div>
                </div>
                <div className = "edit">
                    <Link to={`/promoter/edit/${this.props.promoter._id}`}>
                        <Icon icon={bookEdit} height = "40px" width = "30px" color = "black"/>
                    </Link>
                </div>
                <div className = "goright">
                    <Counter 
                        value = {this.props.promoter.guestlist.number} 
                        record = {this.props.promoter.guestlist.record}
                        minus = {() => this.props.minus(this.props.index)}
                        plus = {() => this.props.plus(this.props.index)}
                    ></Counter>
                </div>
            </Collapsible>
        )
    }
}

export default Promoters;