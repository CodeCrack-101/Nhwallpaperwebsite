/**
 * Wishlist Controller File
 * Location: backend/controllers/wishlistController.js
 * Description: Manages user-specific wishlist operations in MongoDB.
 *              Uses JWT authenticated user ID to fetch, add, and remove wishlist items.
 */

const Wishlist = require('../models/Wishlist');

/**
 * Get active wishlist items for the logged-in user
 */
exports.getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user._id });

        // If no wishlist exists for this user, initialize an empty document
        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user._id, products: [] });
            await wishlist.save();
        }

        return res.status(200).json({
            success: true,
            products: wishlist.products
        });
    } catch (error) {
        console.error('[GET WISHLIST ERROR] Failed to fetch wishlist:', error.message);
        return res.status(500).json({ success: false, message: 'Server failed to retrieve wishlist.' });
    }
};

/**
 * Add a product to the user's wishlist
 */
exports.addToWishlist = async (req, res) => {
    const { productId, name, price, productImage, category } = req.body;

    try {
        if (!productId) {
            return res.status(400).json({ success: false, message: 'Product ID is required.' });
        }

        let wishlist = await Wishlist.findOne({ user: req.user._id });
        if (!wishlist) {
            wishlist = new Wishlist({ user: req.user._id, products: [] });
        }

        // Check if the product already exists in the wishlist to prevent duplicate entries
        const exists = wishlist.products.some(item => item.productId === productId.toString());

        if (!exists) {
            wishlist.products.push({
                productId: productId.toString(),
                name: name || 'Premium Design',
                price: Number(price) || 0,
                productImage: productImage || '',
                category: category || 'Seating'
            });
            await wishlist.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Product saved to wishlist successfully.',
            products: wishlist.products
        });
    } catch (error) {
        console.error('[ADD TO WISHLIST ERROR] Failed to append item:', error.message);
        return res.status(500).json({ success: false, message: 'Server failed to save product to wishlist.' });
    }
};

/**
 * Remove a product from the user's wishlist
 */
exports.removeFromWishlist = async (req, res) => {
    const { productId } = req.params;

    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id });
        if (!wishlist) {
            return res.status(404).json({ success: false, message: 'Wishlist not found.' });
        }

        // Filter out selected product item
        wishlist.products = wishlist.products.filter(item => item.productId !== productId);
        await wishlist.save();

        return res.status(200).json({
            success: true,
            message: 'Product removed from wishlist successfully.',
            products: wishlist.products
        });
    } catch (error) {
        console.error('[REMOVE FROM WISHLIST ERROR] Failed to delete item:', error.message);
        return res.status(500).json({ success: false, message: 'Server failed to remove product from wishlist.' });
    }
};
