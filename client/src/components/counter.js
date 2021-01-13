import React from 'react';
import Popup from 'reactjs-popup';
import '../css/counter.css';
import '../css/modal.css';

const Counter = (props) => {
    return (
        <div className = "counter">
            <button className = "counter-button" onClick = {props.minus}>-</button>
            <Popup
                trigger = {<button className = "counter-display">{props.value}</button>}
                modal
                nested
            >
                {close => {
                    const myDates = props.record.map((date, key) => {
                        const formattedDate = new Date(date);
                        return (
                            <div>
                                {formattedDate.toString().substr(0,24)}
                            </div>
                        )
                    })
                    return (
                        <div className = "modal">
                            <div className = "content">
                                {myDates}
                            </div>
                        </div>
                    )
                    }
                }
            </Popup>
            <button className = "counter-button" onClick = {props.plus}>+</button>
        </div>
    )
}

export default Counter;