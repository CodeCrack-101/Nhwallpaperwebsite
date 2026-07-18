const User = require('../models/User');
const TempUser = require('../models/TempUser');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// 1. Send OTP via Fast2SMS Quick Route (Live Production)
exports.sendOtp = async (req, res) => {
    const { name, email, address, phone } = req.body;

    // Basic validation to check if phone number exists
    if (!phone) {
        return res.status(400).json({ success: false, message: 'Phone number is required!' });
    }

    try {
        // Step 1: Check if user is already registered in the Main DB
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'This mobile number is already registered!' });
        }

        // Step 2: Generate a secure 6-digit random OTP
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

        // Step 3: Clear any old temporary OTP sessions for this specific number
        await TempUser.deleteMany({ phone });

        // Step 4: Save the fresh data temporarily (expires in 5 mins automatically)
        const newTempUser = new TempUser({ name, email, address, phone, otp: generatedOtp });
        await newTempUser.save();

        console.log(`Sending live OTP ${generatedOtp} to ${phone}...`);

        // Step 5: Fast2SMS Quick SMS API POST Call (No website/DLT verification needed)
        const response = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
            route: 'q', 
            message: `Your NHWallpaper verification code is ${generatedOtp}. Valid for 5 minutes.`,
            numbers: phone.toString() // Standard 10-digit format without +91
        }, {
            headers: {
                'authorization': process.env.FAST2SMS_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        console.log("Fast2SMS Response Data:", response.data);

        // Handle the API gateway response status properly
        if (response.data && response.data.return === true) {
            return res.status(200).json({ 
                success: true, 
                message: 'Real OTP SMS sent successfully to your mobile number!' 
            });
        } else {
            return res.status(400).json({ 
                success: false, 
                message: response.data.message || 'Failed to dispatch message from API Gateway.' 
            });
        }

    } catch (error) {
        console.error("Fast2SMS API Execution Error:", error.response?.data || error.message);
        return res.status(500).json({ 
            success: false, 
            message: 'SMS Provider Error: ' + (error.response?.data?.message || error.message) 
        });
    }
};

// 2. Verify OTP and Commit to Main MongoDB Atlas DB
exports.verifyOtp = async (req, res) => {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
        return res.status(400).json({ success: false, message: 'Phone number and OTP are required!' });
    }

    try {
        // Find temporary record for matching details
        const tempRecord = await TempUser.findOne({ phone });
        if (!tempRecord) {
            return res.status(400).json({ success: false, message: 'OTP expired or session not found. Please resend.' });
        }

        // Validate the incoming OTP with the saved database OTP
        if (tempRecord.otp === otp) {
            
            // Save client profile permanently in MongoDB Atlas
            const finalUser = new User({
                name: tempRecord.name,
                email: tempRecord.email,
                address: tempRecord.address,
                phone: tempRecord.phone
            });
            await finalUser.save();

            // Clear temporary collection record after successful registration
            await TempUser.deleteOne({ phone });

            // Generate Login JWT Token for authorization
            const token = jwt.sign({ id: finalUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            return res.status(200).json({ 
                success: true, 
                message: 'Account verified and created successfully in MongoDB Atlas!',
                token,
                user: finalUser
            });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid OTP code entered!' });
        }
    } catch (error) {
        console.error("Verification Route Error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};