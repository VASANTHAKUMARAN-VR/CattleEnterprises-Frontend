import React, { useState } from 'react';
import { authAPI } from '../../services/api';
import './../../styles/main.css';
import './../../styles/auth.css';

const Signup = ({ onSwitchToLogin, onSignupSuccess }) => {
    const [step, setStep] = useState(1); // 1: Signup form, 2: OTP verification
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNumber: '',
        password: '',
        confirmPassword: ''
    });
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // -------------------------------
    // STEP 1 → HANDLE SIGNUP
    // -------------------------------
    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (formData.password !== formData.confirmPassword) {
            setMessage('❌ Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const signupData = {
                name: formData.name,
                email: formData.email,
                mobileNumber: formData.mobileNumber,
                password: formData.password,
                role: 'USER'
            };

            const res = await authAPI.signup(signupData);

            // handle text or json response
            const msg = typeof res.data === 'string' ? res.data : res.data.message || 'OTP sent successfully.';
            setMessage(msg);
            setStep(2);
        } catch (error) {
            console.error('Signup Error:', error);
            setMessage(error.response?.data || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------
    // STEP 2 → HANDLE OTP VERIFY
    // -------------------------------
    const handleOtpVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await authAPI.verifyOtp({ code: otp });
            const msg = typeof res.data === 'string' ? res.data : res.data.message || 'Account verified successfully!';
            setMessage(msg);

            // Redirect to login after success
            setTimeout(() => {
                onSignupSuccess();
            }, 2000);
        } catch (error) {
            console.error('OTP Verify Error:', error);
            setMessage(error.response?.data || 'OTP verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------
    // STEP 1 → SIGNUP FORM
    // -------------------------------
    if (step === 1) {
        return (
            <div className="auth-container">
                <div className="auth-box">
                    <div className="auth-header">
                        <i className="fas fa-user-plus" style={{ fontSize: '3rem', color: '#667eea', marginBottom: '1rem' }}></i>
                        <h2>Join CattleEnterprise</h2>
                        <p>Create your account to get started</p>
                    </div>

                    {message && (
                        <div className={`message ${message.toLowerCase().includes('otp') ? 'success' : 'error'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSignup}>
                        <div className="form-group">
                            <label htmlFor="name"><i className="fas fa-user"></i> Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email"><i className="fas fa-envelope"></i> Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="mobileNumber"><i className="fas fa-phone"></i> Mobile Number</label>
                            <input
                                type="tel"
                                id="mobileNumber"
                                name="mobileNumber"
                                className="form-control"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                required
                                placeholder="Enter your mobile number"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password"><i className="fas fa-lock"></i> Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-control"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Create a password"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword"><i className="fas fa-lock"></i> Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="form-control"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                placeholder="Confirm your password"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="auth-links">
                        <p>
                            Already have an account?{' '}
                            <a href="#" onClick={onSwitchToLogin}>Sign in here</a>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // -------------------------------
    // STEP 2 → OTP VERIFY FORM
    // -------------------------------
    return (
        <div className="auth-container">
            <div className="auth-box">
                <div className="auth-header">
                    <i className="fas fa-shield-alt" style={{ fontSize: '3rem', color: '#667eea', marginBottom: '1rem' }}></i>
                    <h2>Verify Your Account</h2>
                    <p>Enter the OTP sent to your email</p>
                </div>

                {message && (
                    <div className={`message ${message.toLowerCase().includes('success') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleOtpVerify}>
                    <div className="form-group">
                        <label htmlFor="otp"><i className="fas fa-key"></i> OTP Code</label>
                        <input
                            type="text"
                            id="otp"
                            className="form-control"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            placeholder="Enter 6-digit OTP"
                            maxLength="6"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>

                <div className="auth-links">
                    <p>
                        Didn’t receive OTP?{' '}
                        <a href="#" onClick={() => setStep(1)}>Resend OTP</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
