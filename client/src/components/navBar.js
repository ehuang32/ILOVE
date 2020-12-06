import React from 'react';
import { Link } from 'react-router-dom'
import '../css/navBar.css';

// Header navigation bar.

class NavBar extends React.Component {
    render() {
        return (
            <div className='navBar'>
                <ul className='navBarList'>
                    
                    <li className='navBar-item'> 
                        <Link to = "/promoter" className = "navLink"> Promoters </Link>
                    </li>

                    <li className='navBar-item'> 
                        <Link to = "/booking" className = "navLink"> Bookings </Link>
                    </li>
                    
                </ul>
            </div>
        )
    }
}


export default NavBar;