import React from 'react';
import '../css/content.css';

// Template for a content page.
export default class Content extends React.Component {
    render() {
        return (
            <div className='contentContainer'>
    
                <p className='contentHeading'> {this.props.heading} </p>
                
                <div className='content'>
                    {this.props.children}
                </div>

            </div>
        )
    }
}