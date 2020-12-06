import React from 'react';
import { Link } from 'react-router-dom'
import '../css/banner.css';

// Banner for homepage.
class Banner extends React.Component {
    render() {
        return (
            <Link to = '/'> 
                <div className='banner' style={bannerStyle}>
                    <div className='bannerContent' style={bannerContentStyle}>
                        <div>
                            <h1 style={h1Style}> ILOVE </h1>
                            <h2 style={h2Style}> every friday </h2>
                        </div>
                    </div>
                 </div>
            </Link>
        )
    }
}

const bannerStyle = {
    color: 'black',
    height: '45vh',
    lineHeight: '45vh',
    textAlign: 'center'
};

const bannerContentStyle = {
    display: 'inline-block',
    verticalAlign: 'middle',
}

const h1Style = {
    display: 'inline',
    fontSize: '15vmin',
    opacity: 0.9,
};

const h2Style = {
    display: 'inline',
    marginRight: '1px',
    fontSize: '5vmin',
    opacity: 0.9,
    textAlign: 'right'
};

export default Banner;