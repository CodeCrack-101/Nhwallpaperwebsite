/**
 * Payment Model File
 * Location: backend/models/Payment.js
 * Description: Mongoose schema representing online transaction records.
 */

const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        enum: ['Online', 'COD'],
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Success', 'Failed'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', PaymentSchema);
