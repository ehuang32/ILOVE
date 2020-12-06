import React from 'react';
import '../css/counter.css';

const Counter = (props) => {
    return (
        <div className = "counter">
            <button className = "counter-button" onClick = {props.minus}>-</button>
            <span className = "counter-display">{props.value}</span>
            <button className = "counter-button" onClick = {props.plus}>+</button>
        </div>
    )
}

export default Counter;