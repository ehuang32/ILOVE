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
import Toggle from 'react-toggle';

// CSS
import "../css/dist/styles.css";
import "../css/random.css";
import '../css/collapsible.css';
import "../css/toggle.css";

class Promoters extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            week: null,
            promoters: null,
            guestlist: 0,
            filter: null,
            before12: true
        };
        this.buttonStrikethrough = this.buttonStrikethrough.bind(this);
        this.add = this.add.bind(this);
        this.subtract = this.subtract.bind(this);
        this.deleteProm = this.deleteProm.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleFinalise = this.handleFinalise.bind(this);
    }

    componentDidMount() {
        var myWeekId;
        if (this.props.match.params.weekId) {
            myWeekId = this.props.match.params.weekId
        } else {
            myWeekId = '60407bdb89bf23d411a39d77'
        }
        axios.get(`http://localhost:8000/api/week/${myWeekId}`)
            .then(response => {
                console.log(response.data);
                var myPromoters = [];
                response.data.promoterIds.map((promId, key) => {
                    axios.get(`http://localhost:8000/api/prom/${promId}`)
                        .then(response2 => {
                            myPromoters.push(response2.data);
                            this.setState({
                                promoters: myPromoters
                            })
                        })
                        .catch(error2 => {console.log(error2)})
                })
                this.setState({
                    week: response.data,
                    promoters: myPromoters
                })
            })
            .catch(error => {console.log(error)})

    }

    // HELPER FUNCTIONS
    handleFinalise(e) {
        // Create a new Week using promoterIds in Current Week and name for today's date
        const date = new Date(Date.now());
        let weekSchema = {
            'name': 'Week ending ' + date.toString().substr(4,11),
            'promoterIds': this.state.week.promoterIds
        }
        console.log(date);
        console.log(date.toString().substr(4,11))
        axios.post('http://localhost:8000/api/week/add', weekSchema)
            .then(response => {
                console.log(response);
                // Delete current week's promoters if new week finalised successfully
                let emptyWeekSchema = {
                    'name': 'Current Week',
                    'promoterIds': []
                }
                axios.put('http://localhost:8000/api/week/updateWeek/60407bdb89bf23d411a39d77', emptyWeekSchema)
                    .then(response2 => {
                        console.log(response2);
                        
                    })
                    .catch(error2 => {console.log(error2)})
            })
            .catch(error => {console.log(error)})

    }

    handleToggle(e) {
        this.setState({
            before12: !this.state.before12
        })
    }

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
            'timeUsed': timeUsed
        }

        var freeSchema = oldFrees;
        freeSchema[freeIndex] = free;

        axios.put(`http://localhost:8000/api/prom/updateFrees/${this.state.promoters[promIndex]._id}`, freeSchema)
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
        var currentNumber;
        if (this.state.before12) {
            currentNumber = oldGL.numberBefore
        } else {
            currentNumber = oldGL.numberAfter
        }
        const updatedNumber = currentNumber + 1;
        if (this.state.before12) {
            newPromoters[promIndex].guestlist.numberBefore = updatedNumber;
        } else {
            newPromoters[promIndex].guestlist.numberAfter = updatedNumber;
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

        axios.put(`http://localhost:8000/api/prom/updateGL/${this.state.promoters[promIndex]._id}`, GLSchema)
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
                newPromoters[promIndex].guestlist.numberBefore = updatedNumber;
            } else {
                newPromoters[promIndex].guestlist.numberAfter = updatedNumber;
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

            axios.put(`http://localhost:8000/api/prom/updateGL/${this.state.promoters[promIndex]._id}`, GLSchema)
                .then((response) => {
                    this.setState({
                        promoters: newPromoters
                    })
                })
                .catch(error => {console.log(error)})
        }
    }

    deleteProm(promID) {
        axios.delete(`http://localhost:8000/api/prom/deleteProm/${promID}`)
            .then((response) => {
                let promSchema = {
                    'promoterId': promID
                }
                axios.put(`http://localhost:8000/api/week/removePromoter/${this.state.week._id}`, promSchema)
                    .then((response2) => {
                        var newWeek = this.state.week;
                        newWeek.splice(this.state.week.indexOf(promID),1);
                        this.setState({
                            week: newWeek
                        })
                    })
                    .catch(error2 => {console.log(error2)})

                var promIndex;
                var newPromoters = this.state.promoters;
                this.state.promoters.map((prom, key) => {
                    if (prom._id === promID) {
                        promIndex = key
                    }
                })
                newPromoters.splice(promIndex, 1)
                this.setState({
                    promoters: newPromoters
                })
                window.location.reload(false);
            })
            .catch(error => {console.log(error)})
    }

    // RENDER
    render() {
        if (!this.state.promoters) {
            return <LoadingScreen text = {'Fetching Data...'}/>
        }
        var myPromoters = (
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
                            before12 = {this.state.before12}
                            index = {key}
                            button = {this.buttonStrikethrough}
                            delete = {this.deleteProm}
                            minus = {this.subtract}
                            plus = {this.add}
                        />
                    )
                }
            })
        )
        if (this.state.promoters.length === 0) {
            myPromoters = <div className = "noPromoters"> No Promoters, Start by adding some Promoters. </div>
        }

        const addPromoterButton = <AwesomeButton href = {`/promoter/add/${this.state.week._id}`} type = "secondary">Add Promoter</AwesomeButton>
        const toggle = <Toggle checked = {this.state.before12} icons = {false} onChange = {this.handleToggle}/>
        var finaliseButton = ""
        if (this.state.week._id === '60407bdb89bf23d411a39d77') {
            finaliseButton = <AwesomeButton 
                onPress = {() => {if (window.confirm('Are you sure you want to finalise this Week?')) this.handleFinalise()}} 
                type = "primary"
            >Finalise Week</AwesomeButton>
        }
        return (
            <Content heading = {`Promoters - ${this.state.week.name}`} headingright = {addPromoterButton} headingright2 = {toggle}>
                <Input 
                    type = "text" 
                    placeholder = "Filter.."
                    className = "input"
                    value = {this.state.filter}
                    onChange = {this.handleFilter}
                />
                {myPromoters}
                <br/>
                {finaliseButton}

                <Link to = "/history/promoter">
                    <AwesomeButton type = "secondary">View History</AwesomeButton>
                </Link>
            </Content>
        )
    }
}

class SinglePromoter extends React.Component {
    render() {
        var myFrees = (
            this.props.promoter.frees.map((free, key) => {
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
        var myValue = this.props.promoter.guestlist.numberBefore
        if (!this.props.before12) {
            myValue = this.props.promoter.guestlist.numberAfter
        }

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
                    <Link to = {`/promoter/edit/${this.props.promoter._id}`}>
                        <Icon icon={bookEdit} height = "40px" width = "30px" color = "black"/>
                    </Link>
                </div>
                <div className = "goright">
                    <Counter 
                        value = {myValue} 
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