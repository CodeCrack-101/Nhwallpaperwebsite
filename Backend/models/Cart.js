/**
 * Cart Model File
 * Location: backend/models/Cart.js
 * Description: Mongoose schema representing the user's active shopping cart. References the User.
 */

const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [{
        productId: {
            type: String, // String ID for flexibility (e.g. if wallpapers have external catalog IDs)
            required: true
        },
        name: String,
        price: Number,
        productImage: String,
        quantity: {
            type: Number,
            required: true,
            default: 1,
            min: 1
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', CartSchema);
