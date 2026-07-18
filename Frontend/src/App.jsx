import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [formData, setFormData] = useState({ name: '', email: '', address: '', phone: '' });
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Step 1: Hit backend to send real SMS OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            const response = await axios.post('http://localhost:5000/api/auth/send-otp', formData);
            if (response.data.success) {
                setIsOtpSent(true);
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong");
        }
    };

    // Step 2: Hit backend to verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            const response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
                phone: formData.phone, // 🌟 Ensure kijiye yahan wahi exact phone state jaa rahi hai jo send ke time thi
                otp: otp
            });
            if (response.data.success) {
                setMessage("Welcome! Verification Successful.");
                localStorage.setItem('token', response.data.token);
                // Agla page/dashboard redirect ka logic yahan daal sakte hain
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Invalid OTP");
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', fontFamily: 'Arial' }}>
            <h2 style={{ textAlign: 'center' }}>Client Registration</h2>
            {message && <p style={{ color: 'blue', fontWeight: 'bold', textAlign: 'center' }}>{message}</p>}

            {!isOtpSent ? (
                <form onSubmit={handleSendOtp}>
                    <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} style={inputStyle} /><br/>
                    <input type="email" name="email" placeholder="Email Address" required onChange={handleChange} style={inputStyle} /><br/>
                    <input type="text" name="address" placeholder="Full Address" required onChange={handleChange} style={inputStyle} /><br/>
                    {/* Fast2SMS ke liye normal 10-digit number bina +91 ke chalega */}
                    <input type="tel" name="phone" placeholder="10-Digit Mobile Number" required onChange={handleChange} style={inputStyle} /><br/>
                    <button type="submit" style={btnStyle}>Send OTP via Fast2SMS</button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp}>
                    <p style={{ textAlign: 'center' }}>Enter 6-digit OTP sent to {formData.phone}</p>
                    <input type="text" maxLength="6" placeholder="Enter OTP" required onChange={(e) => setOtp(e.target.value)} style={{ ...inputStyle, textAlign: 'center' }} /><br/>
                    <button type="submit" style={{ ...btnStyle, backgroundColor: '#28a745' }}>Verify & Register</button>
                    <button type="button" onClick={() => setIsOtpSent(false)} style={{ ...btnStyle, backgroundColor: '#6c757d', marginTop: '5px' }}>Back</button>
                </form>
            )}
        </div>
    );
};

const inputStyle = { width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' };

export default App;