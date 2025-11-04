import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import './../../styles/main.css';
import './../../styles/auth.css';
import './../../styles/components.css';

const Login = ({ onSwitchToSignup, onSwitchToForgotPassword, onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        usernameOrMobileOrEmail: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await authAPI.login(formData);
            setMessage('Login successful! Redirecting...');
            setTimeout(() => {
                onLoginSuccess(formData.usernameOrMobileOrEmail);
            }, 2000);
        } catch (error) {
            setMessage(error.response?.data || 'Invalid credentials or account not enabled');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="auth-header">
                    <i className="fas fa-sign-in-alt" style={{fontSize: '3rem', color: '#667eea', marginBottom: '1rem'}}></i>
                    <h2>Welcome Back</h2>
                    <p>Sign in to your CattleEnterprise account</p>
                </div>

                {message && (
                    <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="usernameOrMobileOrEmail">
                            <i className="fas fa-user"></i> Mobile Number
                        </label>
                        <input
                            type="text"
                            id="usernameOrMobileOrEmail"
                            name="usernameOrMobileOrEmail"
                            className="form-control"
                            value={formData.usernameOrMobileOrEmail}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email or mobile number"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            <i className="fas fa-lock"></i> Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-links">
                    <p>
                        <a href="#" onClick={onSwitchToForgotPassword}>
                            Forgot your password?
                        </a>
                    </p>
                    <p>
                        Don't have an account?{' '}
                        <a href="#" onClick={onSwitchToSignup}>
                            Sign up here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;