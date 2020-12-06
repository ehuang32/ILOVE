import React from 'react';
import '../css/button.css';

const Button = (props) => {
    return (
    <button className="simple" onClick = {props.action} {...props}>
        {props.title}
    </button>
    )
}
export default Button;