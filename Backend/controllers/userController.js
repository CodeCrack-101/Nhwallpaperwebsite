/**
 * User Profile Controller File
 * Location: backend/controllers/userController.js
 * Description: Handles profile operations such as retrieving details and updating
 *              profile fields (name, email, shipping address details) in MongoDB.
 */

const User = require('../models/User');
const Address = require('../models/Address');

/**
 * Endpoint: GET /api/users/profile
 * Description: Retrieves fully populated user details (protected route)
 */
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('address');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('[GET PROFILE ERROR] Fail to fetch profile:', error.message);
        return res.status(500).json({ success: false, message: 'Server failed to retrieve profile details.' });
    }
};

/**
 * Endpoint: PUT /api/users/profile
 * Description: Updates the user's name, email, and shipping address details.
 */
exports.updateProfile = async (req, res) => {
    const { name, email, streetAddress, city, state, pincode } = req.body;

    try {
        // Step 1: Find user
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Step 2: Validate fields (custom basic check)
        if (!name || name.trim().length < 2) {
            return res.status(400).json({ success: false, message: 'Valid name is required (min 2 characters).' });
        }
        if (!email) {
            return res.status(400).json({ success: false, message: 'Valid email is required.' });
        }

        // Step 3: Update User fields
        user.name = name;
        user.email = email;

        // Step 4: Handle Address update
        if (user.address) {
            // Update existing address
            await Address.findByIdAndUpdate(user.address, {
                streetAddress,
                city,
                state,
                pincode
            });
        } else {
            // If user somehow doesn't have an address linked, create a new one
            const newAddress = new Address({
                user: user._id,
                streetAddress,
                city,
                state,
                pincode
            });
            await newAddress.save();
            user.address = newAddress._id;
        }

        // Save updated user model
        await user.save();

        // Retrieve fully updated and populated user profile
        const updatedUser = await User.findById(user._id).populate('address');

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully!',
            user: updatedUser
        });

    } catch (error) {
        console.error('[UPDATE PROFILE ERROR] Fail to update profile:', error.message);
        return res.status(500).json({ success: false, message: 'Server failed to save profile changes.' });
    }
};
