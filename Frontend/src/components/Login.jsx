import React, { useState } from 'react';
import { auth } from '../firebaseConfig'; // Aapka firebase config path
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({ name: '', email: '', address: '', phone: '' });
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [message, setMessage] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {}
            });
        }
    };

    // STEP 1: Firebase OTP Trigger Route
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setMessage("");
        setupRecaptcha();

        const appVerifier = window.recaptchaVerifier;
        const phoneNumber = formData.phone; // Format: +91XXXXXXXXXX

        try {
            // 🌟 DHAYAN DEIN: Yahan naya route `/check-user` use ho raha hai, `/send-otp` nahi!
            const checkRes = await axios.post('http://localhost:5000/api/auth/check-user', { phone: phoneNumber });
            
            if (checkRes.data.exists) {
                setMessage("This number is already registered!");
                return;
            }

            // Firebase SMS Trigger
            const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setConfirmationResult(confirmation);
            setIsOtpSent(true);
            setMessage("OTP sent successfully!");
        } catch (error) {
            console.error(error);
            setMessage("Error sending OTP: " + error.message);
        }
    };

    // STEP 2: Verify and Save to MongoDB Atlas
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            const result = await confirmationResult.confirm(otp);
            const firebaseUser = result.user;

            if (firebaseUser) {
                // 🌟 DHAYAN DEIN: OTP verify hone ke baad register-success route chalega
                const response = await axios.post('http://localhost:5000/api/auth/register-success', {
                    name: formData.name,
                    email: formData.email,
                    address: formData.address,
                    phone: formData.phone,
                    firebaseUid: firebaseUser.uid
                });

                if (response.data.success) {
                    setMessage("Registration Successful!");
                    localStorage.setItem('token', response.data.token);
                }
            }
        } catch (error) {
            setMessage("Invalid OTP! Please check again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Register with OTP</h2>
                {message && <p className="mb-4 text-center text-sm font-semibold text-blue-600 bg-blue-50 p-2 rounded">{message}</p>}
                <div id="recaptcha-container"></div>

                {!isOtpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <input type="text" name="name" placeholder="Full Name" required onChange={handleChange} className="w-full p-2 border rounded" />
                        <input type="email" name="email" placeholder="Email" required onChange={handleChange} className="w-full p-2 border rounded" />
                        <input type="text" name="address" placeholder="Address" required onChange={handleChange} className="w-full p-2 border rounded" />
                        <input type="tel" name="phone" placeholder="+919876543210" required onChange={handleChange} className="w-full p-2 border rounded" />
                        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Send OTP</button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <input type="text" maxLength="6" placeholder="Enter 6-Digit OTP" required onChange={(e) => setOtp(e.target.value)} className="w-full p-2 text-center text-xl border rounded" />
                        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Verify & Register</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;