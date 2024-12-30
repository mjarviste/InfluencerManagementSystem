import React from 'react';
import './Header.scss';

const Header: React.FC = () => {
    return (
        <header id='app-header'>
            <div id='header-logo-wrapper'>
                <img id="header-logo" alt='Company Logo' src='./headerLogo.svg'/>
            </div>
            <div id="header-manager-container">
                <h3 className='manager-name'>John Doe</h3>
                <div className='manager-img-wrapper'>
                    <img className="manager-img" alt="Manager profile image" src="./managerImg.svg" />
                </div>
            </div>
        </header>
    );
}
export default Header