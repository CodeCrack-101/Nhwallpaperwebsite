/**
 * Address Model File
 * Location: backend/models/Address.js
 * Description: Mongoose schema representing standard shipping and contact addresses for users.
 */

const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    streetAddress: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    pincode: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true // Auto-manages createdAt and updatedAt
});

module.exports = mongoose.model('Address', AddressSchema);
