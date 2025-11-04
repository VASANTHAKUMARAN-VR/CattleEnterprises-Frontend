import React from 'react';
import './../../styles/main.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container" style={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
            }}>
                <p style={{ 
                    margin: 0, 
                    fontSize: '1rem',
                    color: '#4a5568'
                }}>
                    &copy; 2025 CattleEnterprise. All rights reserved.
                </p>
                <p style={{ 
                    margin: 0, 
                    fontSize: '0.9rem',
                    color: '#718096'
                }}>
                    Dairy Management System - Streamlining your cattle business
                </p>
            </div>
        </footer>
    );
};

export default Footer;