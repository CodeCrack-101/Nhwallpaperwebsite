/**
 * Register Page Component File
 * Location: frontend/src/pages/Register.jsx
 * Description: Client registration form collecting standard credentials and shipping address
 *              details. Dispatches 6-digit OTP codes to the user's email for account verification.
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { authToasts, validationToasts, showError } from '../utils/toast';
import { useAuth } from '../context/AuthContext';
import { registerUser, verifyRegistration, resendOtp } from '../services/authService';
import ButtonLoader from '../components/common/ButtonLoader';
import './Login.css'; // Reuses auth layout styling

const Register = () => {
    const { login, isAuthenticated } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // View modes: 'details' | 'otp'
    const [mode, setMode] = useState('details');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Fields state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        streetAddress: '',
        city: '',
        state: '',
        pincode: ''
    });

    const [otpCode, setOtpCode] = useState('');
    const [timer, setTimer] = useState(0);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    // Redirect to home if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Handle auto-routing state for pending unverified accounts attempting login
    useEffect(() => {
        if (location.state && location.state.pendingVerification) {
            setFormData(prev => ({ ...prev, email: location.state.email }));
            setMode('otp');
            setTimer(600); // 10 minutes validity
            setMessage({ 
                text: 'Your email is not verified. Please enter the OTP verification code sent to your registered email.', 
                type: 'success' 
            });
        }
    }, [location]);

    // OTP Countdown Timer
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validatePassword = (pw) => {
        return pw && pw.length >= 6;
    };

    /**
     * Submit details and trigger OTP send to email
     */
    const handleDetailsSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        const cleanPhone = formData.phone.trim();
        const cleanEmail = formData.email.toLowerCase().trim();

        if (!/^\+?\d{7,15}$/.test(cleanPhone)) {
            validationToasts.invalidPhone();
            setMessage({ text: 'Please enter a valid mobile number.', type: 'error' });
            return;
        }

        if (!validatePassword(formData.password)) {
            showError('Password must be at least 6 characters.');
            setMessage({ 
                text: 'Password must be at least 6 characters.', 
                type: 'error' 
            });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            showError('Passwords do not match.');
            setMessage({ text: 'Passwords do not match.', type: 'error' });
            return;
        }

        if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
            showError('Please enter a valid 6-digit pin code.');
            setMessage({ text: 'Please enter a valid 6-digit pin code.', type: 'error' });
            return;
        }

        setLoading(true);

        try {
            const data = await registerUser({
                name: formData.name.trim(),
                email: cleanEmail,
                phone: cleanPhone,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                streetAddress: formData.streetAddress.trim(),
                city: formData.city.trim(),
                state: formData.state.trim(),
                pincode: formData.pincode.trim()
            });

            if (data.success) {
                authToasts.otpSent();
                setTimer(600); // 10 minutes validity
                setMode('otp');
                setMessage({ text: 'Registration details saved! OTP has been sent to your email.', type: 'success' });
            }
        } catch (error) {
            console.error('[REGISTER DETAILS ERROR] Dispatch failed:', error);
            const errMsg = error.response?.data?.message || 'Registration failed. Email or phone number might already be in use.';
            showError(errMsg);
            setMessage({ 
                text: errMsg, 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    /**
     * Resend verification OTP code to email
     */
    const handleResendOtpSubmit = async () => {
        setMessage({ text: '', type: '' });
        setLoading(true);

        try {
            const data = await resendOtp(formData.email.toLowerCase().trim());
            if (data.success) {
                authToasts.otpSent();
                setTimer(600); // 10 minutes validity
                setMessage({ text: 'A new 6-digit OTP code has been successfully sent to your registered email.', type: 'success' });
            }
        } catch (error) {
            console.error('[RESEND OTP ERROR] Fail:', error);
            const errMsg = error.response?.data?.message || 'Failed to resend OTP. Please try again.';
            showError(errMsg);
            setMessage({ 
                text: errMsg, 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    /**
     * Submit OTP verification code to activate account
     */
    const handleVerifySubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        setLoading(true);

        try {
            const data = await verifyRegistration(formData.email.toLowerCase().trim(), otpCode.trim());
            if (data.success) {
                authToasts.otpVerified();
                authToasts.registerSuccess();
                login(data.token, data.user);
                setMessage({ text: 'Email verification successful! Logging you in...', type: 'success' });
                setTimeout(() => {
                    navigate('/');
                }, 1200);
            }
        } catch (error) {
            console.error('[REGISTER OTP ERROR] Verification failed:', error);
            const errMsg = error.response?.data?.message || 'Invalid or expired OTP. Please try again.';
            showError(errMsg);
            setMessage({ 
                text: errMsg, 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div className="auth-page">
            <div className="auth-card" style={{ maxWidth: '600px' }}>
                <div className="auth-brand">
                    <h2>WALL<span>ART</span></h2>
                    <p>Elevate Your Interior Aesthetic</p>
                </div>

                {message.text && (
                    <div className={`auth-message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                {mode === 'details' ? (
                    <form onSubmit={handleDetailsSubmit} className="auth-form">
                        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>Sign Up</h3>
                            <p style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>Register to start collecting wallpapers</p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                placeholder="Enter your full name" 
                                required 
                                value={formData.name} 
                                onChange={handleInputChange} 
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                placeholder="Enter your email address" 
                                required 
                                value={formData.email} 
                                onChange={handleInputChange} 
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Mobile Number</label>
                            <input 
                                type="tel" 
                                id="phone" 
                                name="phone" 
                                placeholder="10-digit mobile number" 
                                required 
                                pattern="[6-9][0-9]{9}"
                                value={formData.phone} 
                                onChange={handleInputChange} 
                                disabled={loading}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="password-input-wrapper">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        id="password" 
                                        name="password" 
                                        placeholder="Min 6 characters" 
                                        required 
                                        value={formData.password} 
                                        onChange={handleInputChange} 
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex="-1"
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className="password-input-wrapper">
                                    <input 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        id="confirmPassword" 
                                        name="confirmPassword" 
                                        placeholder="Re-enter password" 
                                        required 
                                        value={formData.confirmPassword} 
                                        onChange={handleInputChange} 
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        tabIndex="-1"
                                    >
                                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Optional Address section */}
                        <div style={{ marginTop: '10px', fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>
                            Optional: Primary Shipping Address
                            <hr style={{ border: 'none', borderTop: '1px solid #eee', marginTop: '5px' }} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="streetAddress">Street Address</label>
                            <input 
                                type="text" 
                                id="streetAddress" 
                                name="streetAddress" 
                                placeholder="House No, Building, Area" 
                                value={formData.streetAddress} 
                                onChange={handleInputChange} 
                                disabled={loading}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input 
                                    type="text" 
                                    id="city" 
                                    name="city" 
                                    placeholder="City" 
                                    value={formData.city} 
                                    onChange={handleInputChange} 
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="state">State</label>
                                <input 
                                    type="text" 
                                    id="state" 
                                    name="state" 
                                    placeholder="State" 
                                    value={formData.state} 
                                    onChange={handleInputChange} 
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="pincode">Pincode</label>
                                <input 
                                    type="text" 
                                    id="pincode" 
                                    name="pincode" 
                                    placeholder="6-digit PIN" 
                                    pattern="[0-9]{6}"
                                    value={formData.pincode} 
                                    onChange={handleInputChange} 
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <ButtonLoader 
                            type="submit" 
                            className="submit-btn"
                            loading={loading}
                            color="#ffffff"
                            size="small"
                        >
                            Register
                        </ButtonLoader>

                        <p style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginTop: '15px' }}>
                            Already Registered? <Link to="/login" style={{ color: '#C89B5B', fontWeight: '600', textDecoration: 'none' }}>Sign In</Link>
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleVerifySubmit} className="auth-form">
                        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>Verify OTP Code</h3>
                            <p style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>Enter the 6-digit OTP sent to: <strong>{formData.email}</strong></p>
                            <p className="countdown">Expires in: <span>{formatTime(timer)}</span></p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="otp">Enter 6-Digit OTP</label>
                            <input 
                                type="text" 
                                id="otp" 
                                maxLength="6" 
                                placeholder="******" 
                                required 
                                value={otpCode} 
                                onChange={(e) => setOtpCode(e.target.value)} 
                                className="otp-input"
                                disabled={loading}
                                style={{ letterSpacing: '6px', fontSize: '20px', textAlign: 'center' }}
                            />
                        </div>

                        <ButtonLoader 
                            type="submit" 
                            className="submit-btn verify-btn"
                            loading={loading}
                            disabled={otpCode.length !== 6}
                            color="#ffffff"
                            size="small"
                        >
                            Verify & Register
                        </ButtonLoader>

                        <button 
                            type="button" 
                            className="resend-btn" 
                            disabled={timer > 0 || loading}
                            onClick={handleResendOtpSubmit}
                        >
                            {timer > 0 ? `Resend OTP in ${formatTime(timer)}` : 'Resend OTP'}
                        </button>

                        <button 
                            type="button" 
                            className="back-btn"
                            onClick={() => {
                                setMode('details');
                                setMessage({ text: '', type: '' });
                                setOtpCode('');
                            }}
                            disabled={loading}
                        >
                            Back
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Register;
