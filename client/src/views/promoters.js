import React from 'react';
import Content from '../components/content.js';
import '../css/collapsible.css';
import Collapsible from 'react-collapsible';
import {AwesomeButton} from 'react-awesome-button';
import "../css/dist/styles.css";
import "../css/random.css";
import Counter from '../components/counter.js';

class Promoters extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            testST1: true,
            testST2: true,
            guestlist: 0
        };
        this.buttonStrikethrough = this.buttonStrikethrough.bind(this);
        this.add = this.add.bind(this);
        this.subtract = this.subtract.bind(this);
    }

    buttonStrikethrough(number) {
        if (number === 1) {
            this.setState({
                testST1: !this.state.testST1
            })
        }
        if (number === 2) {
            this.setState({
                testST2: !this.state.testST2
            })
        }
    }

    add() {
        this.setState({
            guestlist: this.state.guestlist + 1
        })
    }

    subtract() {
        if (this.state.guestlist > 0) {
            this.setState({
                guestlist: this.state.guestlist - 1
            })
        }
    }

    render() {
        var ABT1 = <AwesomeButton type = "toggle" onPress = {() => {this.buttonStrikethrough(1);}}>Jeff Wong</AwesomeButton>
        if (this.state.testST1) {
            ABT1 = <AwesomeButton type = "primary" onPress = {() => {this.buttonStrikethrough(1);}}>Jeff Wong</AwesomeButton>
        }
        var ABT2 = <AwesomeButton type = "toggle" onPress = {() => {this.buttonStrikethrough(2);}}>Chris Li</AwesomeButton>
        if (this.state.testST2) {
            ABT2 = <AwesomeButton type = "primary" onPress = {() => {this.buttonStrikethrough(2);}}>Chris Li</AwesomeButton>
        }
        return (
            <Content heading = 'Promoters'>
                <Collapsible trigger = "Huy Tran" >
                    <div className = "gonormal">
                        {ABT1}
                        {ABT2}
                    </div>
                    <div className = "goright">
                        <Counter 
                            value = {this.state.guestlist} 
                            minus = {this.subtract} 
                            plus = {this.add}
                        ></Counter>
                    </div>
                </Collapsible>
                <Collapsible trigger = "TJ Gulfan">

                </Collapsible>
            </Content>
        )
    }
}

export default Promoters;