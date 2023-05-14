import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
    return (

        <div style={{display: 'flex', justifyContent: 'flex-start', padding: '20px'}}>
            <Tilt
                className="parallax-effect br2 shadow-2 pa3-ns logo-bg"
                perspective={600}
            >
            <div className='inner-element'> 
                <img alt='brain logo' src={brain}></img>
            </div>
            </Tilt>
        </div>

    );
}

export default Logo;