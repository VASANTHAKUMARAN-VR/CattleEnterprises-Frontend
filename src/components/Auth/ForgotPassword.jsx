import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import './../../styles/main.css';
import './../../styles/auth.css';
const ForgotPassword = ({ onSwitchToLogin, onSwitchToReset }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await authAPI.forgotPassword( email );
            setMessage('OTP sent to your email. Please check your inbox.');
            setTimeout(() => {
                onSwitchToReset(email);
            }, 2000);
        } catch (error) {
            setMessage(error.response?.data || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="auth-header">
                    <i className="fas fa-key" style={{fontSize: '3rem', color: '#667eea', marginBottom: '1rem'}}></i>
                    <h2>Reset Your Password</h2>
                    <p>Enter your email to receive OTP</p>
                </div>

                {message && (
                    <div className={`message ${message.includes('OTP sent') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">
                            <i className="fas fa-envelope"></i> Email or Mobile Number
                        </label>
                        <input
                            type="text"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email or mobile number"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                </form>

                <div className="auth-links">
                    <p>
                        Remember your password?{' '}
                        <a href="#" onClick={onSwitchToLogin}>
                            Sign in here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;