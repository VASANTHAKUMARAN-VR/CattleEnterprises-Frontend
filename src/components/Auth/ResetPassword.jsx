import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import './../../styles/main.css';
import './../../styles/auth.css';
const ResetPassword = ({ email, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        otp: '',
        newPassword: '',
        confirmPassword: ''
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

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await authAPI.resetPassword(formData);
            setMessage('Password reset successfully! You can now login with your new password.');
            setTimeout(() => {
                onSwitchToLogin();
            }, 2000);
        } catch (error) {
            setMessage(error.response?.data || 'Password reset failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="auth-header">
                    <i className="fas fa-lock" style={{fontSize: '3rem', color: '#667eea', marginBottom: '1rem'}}></i>
                    <h2>Set New Password</h2>
                    <p>Enter OTP and your new password</p>
                </div>

                {message && (
                    <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="otp">
                            <i className="fas fa-key"></i> OTP Code
                        </label>
                        <input
                            type="text"
                            id="otp"
                            name="otp"
                            className="form-control"
                            value={formData.otp}
                            onChange={handleChange}
                            required
                            placeholder="Enter OTP sent to your email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">
                            <i className="fas fa-lock"></i> New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            className="form-control"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            placeholder="Enter new password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">
                            <i className="fas fa-lock"></i> Confirm New Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-control"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Confirm new password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Resetting Password...' : 'Reset Password'}
                    </button>
                </form>

                <div className="auth-links">
                    <p>
                        Back to{' '}
                        <a href="#" onClick={onSwitchToLogin}>
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;