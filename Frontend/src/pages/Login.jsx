/**
 * Login Page Component File
 * Location: frontend/src/pages/Login.jsx
 * Description: Standard Email or Mobile and Password login screen. Handles auto-redirects,
 *              forgot password OTP verification, and routes unverified users back to activation.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { authToasts, showError, showWarning } from '../utils/toast';
import { useAuth } from '../context/AuthContext';
import { loginUser, forgotPassword, resetPassword } from '../services/authService';
import ButtonLoader from '../components/common/ButtonLoader';
import './Login.css';

const Login = () => {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // View sub-modes: 'login' | 'forgot' | 'reset'
    const [mode, setMode] = useState('login');

    // Fields states
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [forgotEmail, setForgotEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' | 'error'
    const [loading, setLoading] = useState(false);

    // Redirect home (or back to calling details page) if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from || '/';
            navigate(from);
        }
    }, [isAuthenticated, navigate, location.state]);

    /**
     * Submit login credentials
     */
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        setLoading(true);

        try {
            const data = await loginUser(loginId.trim(), password);
            if (data.success) {
                const userName = data.user?.name || 'Valued Customer';
                authToasts.loginSuccess(userName);
                login(data.token, data.user);
                const from = location.state?.from || '/';
                const action = location.state?.action || null;
                const productId = location.state?.productId || null;
                const quantity = location.state?.quantity || 1;

                setTimeout(() => {
                    if (from !== '/') {
                        navigate(from, { state: { performAction: action, productId, quantity } });
                    } else {
                        navigate('/');
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('[LOGIN ERROR] Authentication failed:', error);

            // Check if the user is registered but unverified
            if (error.response?.data?.unverified) {
                const unverifiedEmail = error.response.data.email;
                showWarning('Your account is not verified yet. Redirecting to OTP activation...');
                setMessage({
                    text: 'Your account is not verified yet. Redirecting to OTP activation page...',
                    type: 'error'
                });

                // Redirect user to register verification OTP view
                setTimeout(() => {
                    navigate('/register', {
                        state: {
                            email: unverifiedEmail,
                            pendingVerification: true
                        }
                    });
                }, 1500);
            } else {
                authToasts.invalidLogin();
                setMessage({
                    text: 'Invalid email or password.',
                    type: 'error'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    /**
     * Submit forgot password email OTP request
     */
    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        setLoading(true);

        try {
            const data = await forgotPassword(forgotEmail.trim());
            if (data.success) {
                authToasts.otpSent();
                setMessage({
                    text: 'Verification code sent to your email. Please enter details below to reset password.',
                    type: 'success'
                });
                setMode('reset');
            }
        } catch (error) {
            console.error('[FORGOT PASSWORD ERROR] Request failed:', error);
            const errMsg = error.response?.data?.message || 'Failed to request reset OTP. Try again.';
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
     * Submit reset password with OTP
     */
    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (newPassword !== confirmPassword) {
            showError('Passwords do not match.');
            setMessage({ text: 'Passwords do not match.', type: 'error' });
            return;
        }

        setLoading(true);

        try {
            const data = await resetPassword(forgotEmail.trim(), otpCode.trim(), newPassword, confirmPassword);
            if (data.success) {
                authToasts.passwordUpdated();
                setMessage({ text: 'Password reset successful! You can now sign in.', type: 'success' });
                setNewPassword('');
                setConfirmPassword('');
                setOtpCode('');
                setForgotEmail('');
                setTimeout(() => {
                    setMode('login');
                    setMessage({ text: '', type: '' });
                }, 2000);
            }
        } catch (error) {
            console.error('[RESET PASSWORD ERROR] Request failed:', error);
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

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <h2>WALL<span>ART</span></h2>
                    <p>Elevate Your Interior Aesthetic</p>
                </div>

                {message.text && (
                    <div className={`auth-message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                {mode === 'login' && (
                    <form onSubmit={handleLoginSubmit} className="auth-form">
                        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>Sign In</h3>
                            <p style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>Sign in with Email or Mobile number</p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="loginId">Email Address or Mobile Number</label>
                            <input
                                type="text"
                                id="loginId"
                                placeholder="Enter email or 10-digit number"
                                required
                                value={loginId}
                                onChange={(e) => setLoginId(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label htmlFor="password">Password</label>
                                <button
                                    type="button"
                                    style={{ background: 'none', border: 'none', color: '#C89B5B', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}
                                    onClick={() => {
                                        setMode('forgot');
                                        setMessage({ text: '', type: '' });
                                    }}
                                    disabled={loading}
                                >
                                    Forgot Password?
                                </button>
                            </div>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Enter password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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

                        <ButtonLoader
                            type="submit"
                            className="submit-btn"
                            loading={loading}
                            color="#ffffff"
                            size="small"
                        >
                            Sign In
                        </ButtonLoader>

                        <p style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginTop: '15px' }}>
                            New Customer? <Link to="/register" style={{ color: '#C89B5B', fontWeight: '600', textDecoration: 'none' }}>Register</Link>
                        </p>
                    </form>
                )}

                {mode === 'forgot' && (
                    <form onSubmit={handleForgotSubmit} className="auth-form">
                        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>Forgot Password</h3>
                            <p style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>Enter your email to request a reset OTP code</p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="forgotEmail">Email Address</label>
                            <input
                                type="email"
                                id="forgotEmail"
                                placeholder="Enter your email address"
                                required
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Requesting OTP...' : 'Send Reset OTP'}
                        </button>

                        <button
                            type="button"
                            className="back-btn"
                            onClick={() => {
                                setMode('login');
                                setMessage({ text: '', type: '' });
                            }}
                            disabled={loading}
                        >
                            Back to Sign In
                        </button>
                    </form>
                )}

                {mode === 'reset' && (
                    <form onSubmit={handleResetSubmit} className="auth-form">
                        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>Set New Password</h3>
                            <p style={{ fontSize: '13px', color: '#666', marginTop: '5px' }}>Enter OTP code and configure new password</p>
                        </div>

                        <div className="form-group">
                            <label htmlFor="otpCode">6-Digit OTP Code</label>
                            <input
                                type="text"
                                id="otpCode"
                                maxLength="6"
                                placeholder="******"
                                required
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.target.value)}
                                disabled={loading}
                                className="otp-input"
                                style={{ letterSpacing: '6px', fontSize: '20px', textAlign: 'center' }}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    id="newPassword"
                                    placeholder="Minimum 6 characters"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    tabIndex="-1"
                                >
                                    {showNewPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    placeholder="Re-enter password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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

                        <button
                            type="submit"
                            className="submit-btn verify-btn"
                            disabled={loading}
                        >
                            {loading ? 'Updating Password...' : 'Reset Password'}
                        </button>

                        <button
                            type="button"
                            className="back-btn"
                            onClick={() => {
                                setMode('forgot');
                                setMessage({ text: '', type: '' });
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

export default Login;
