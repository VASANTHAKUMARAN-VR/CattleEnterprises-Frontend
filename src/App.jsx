import React, { useState, useEffect } from 'react';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import UserDashboard from './components/Dashboard/UserDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import './styles/main.css';
import './styles/auth.css';
import './styles/components.css';

function App() {
    const [currentView, setCurrentView] = useState('login');
    const [currentUser, setCurrentUser] = useState(null);
    const [resetEmail, setResetEmail] = useState('');

    // 👇 Check localStorage on app start
    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            const user = JSON.parse(savedUser);
            setCurrentUser(user);
            setCurrentView('dashboard');
            console.log('✅ User restored from localStorage:', user.email);
        }
    }, []);

    const handleLoginSuccess = (userIdentifier) => {
        // For demo purposes, determine role based on email
        const isAdmin = userIdentifier.includes('admin') || userIdentifier === 'admin';
        const user = {
            email: userIdentifier,
            name: userIdentifier.split('@')[0],
            role: isAdmin ? 'ADMIN' : 'USER'
        };
        
        setCurrentUser(user);
        // 👇 Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentView('dashboard');
        console.log('✅ User logged in and saved to localStorage:', userIdentifier);
    };

    const handleSignupSuccess = () => {
        setCurrentView('login');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        // 👇 Remove from localStorage
        localStorage.removeItem('currentUser');
        setCurrentView('login');
        console.log('✅ User logged out and removed from localStorage');
    };

    const handleSwitchToForgotPassword = () => {
        setCurrentView('forgot-password');
    };

    const handleSwitchToReset = (email) => {
        setResetEmail(email);
        setCurrentView('reset-password');
    };

    const handleSwitchToLogin = () => {
        setCurrentView('login');
    };

    const handleSwitchToSignup = () => {
        setCurrentView('signup');
    };

    const renderCurrentView = () => {
        switch (currentView) {
            case 'login':
                return (
                    <Login
                        onSwitchToSignup={handleSwitchToSignup}
                        onSwitchToForgotPassword={handleSwitchToForgotPassword}
                        onLoginSuccess={handleLoginSuccess}
                    />
                );
            case 'signup':
                return (
                    <Signup
                        onSwitchToLogin={handleSwitchToLogin}
                        onSignupSuccess={handleSignupSuccess}
                    />
                );
            case 'forgot-password':
                return (
                    <ForgotPassword
                        onSwitchToLogin={handleSwitchToLogin}
                        onSwitchToReset={handleSwitchToReset}
                    />
                );
            case 'reset-password':
                return (
                    <ResetPassword
                        email={resetEmail}
                        onSwitchToLogin={handleSwitchToLogin}
                    />
                );
            case 'dashboard':
                if (currentUser?.role === 'ADMIN') {
                    return <AdminDashboard userEmail={currentUser.email} onLogout={handleLogout} />;
                } else {
                    return <UserDashboard userEmail={currentUser.email} onLogout={handleLogout} />;
                }
            default:
                return <Login onSwitchToSignup={handleSwitchToSignup} onLoginSuccess={handleLoginSuccess} />;
        }
    };

    return (
        <div className="App">
            {/* 👇 Show header only when user is logged in */}
            {currentUser && <Header currentUser={currentUser} onLogout={handleLogout} />}
            
            <main>
                {renderCurrentView()}
            </main>
            
            {/* 👇 Show footer only when user is logged in */}
            {currentUser && <Footer />}
        </div>
    );
}

export default App;