import React from 'react';
import '../../styles/main.css';

const Header = ({ currentUser, onLogout }) => {
    const handleLogoutClick = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            onLogout();
        }
    };

    return (
        <header>
          
        </header>
    );
};

export default Header;