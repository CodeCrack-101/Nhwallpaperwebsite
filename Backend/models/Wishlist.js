/**
 * Wishlist Model File
 * Location: backend/models/Wishlist.js
 * Description: Mongoose schema representing the user's wishlist items. References the User.
 *              Includes category tracking for each saved item.
 */

const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    products: [{
        productId: {
            type: String,
            required: true
        },
        name: String,
        price: Number,
        productImage: String,
        category: String // Store product category in the database
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Wishlist', WishlistSchema);
