/**
 * Cart Controller File
 * Location: backend/controllers/cartController.js
 * Description: Manages user-specific shopping cart operations in MongoDB.
 *              Uses JWT authenticated user ID to fetch, add, update, and clear cart items.
 */

const Cart = require('../models/Cart');

/**
 * Get active shopping cart items for the logged-in user
 */
exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id });
        
        // If no cart exists for this user, initialize an empty cart document
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
            await cart.save();
        }

        return res.status(200).json({
            success: true,
            items: cart.items
        });
    } catch (error) {
        console.error('[GET CART ERROR] Failed to fetch cart:', error.message);
        return res.status(500).json({ success: false, message: 'Server failed to retrieve cart.' });
    }
};

/**
 * Add or increment quantity of a product in user's cart
 */
exports.addToCart = async (req, res) => {
    const { productId, name, price, productImage, category, quantity } = req.body;

    try {
        if (!productId) {
            return res.status(400).json({ success: false, message: 'Product ID is required.' });
        }

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.productId === productId.toString());
        const addQty = parseInt(quantity) || 1;

        if (itemIndex > -1) {
            // Product already exists in cart, increment quantity
            cart.items[itemIndex].quantity += addQty;
        } else {
            // Add new product item
            cart.items.push({
                productId: productId.toString(),
                name: name || 'Premium Product',
                price: Number(price) || 0,
                productImage: productImage || '',
                category: category || 'Seating',
                quantity: addQty
            });
        }

        await cart.save();

        return res.status(200).json({
            success: true,
            message: 'Product added to cart successfully.',
            items: cart.items
        });
    } catch (error) {
        console.error('[ADD TO CART ERROR] Failed to append item:', error.message);
        return res.status(500).json({ success: false, message: 'Server failed to add product to cart.' });
    }
};

/**
 * Update the quantity of a product in the cart
 */
exports.updateQuantity = async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;

    try {
        const updateQty = parseInt(quantity);
        if (isNaN(updateQty) || updateQty < 1) {
            return res.status(400).json({ success: false, message: 'Quantity must be a positive integer.' });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found.' });
        }

        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ success: false, message: 'Product not found in cart.' });
        }

        // Apply new quantity
        cart.items[itemIndex].quantity = updateQty;
        await cart.save();

        return res.status(200).json({
            success: true,
            message: 'Cart quantity updated successfully.',
            items: cart.items
        });
    } catch (error) {
        console.error('[UPDATE CART ERROR] Failed to update quantity:', error.message);
        return res.status(500).json({ success: false, message: 'Server failed to update cart.' });
    }
};

/**
 * Remove a product from the user's cart
 */
exports.removeFromCart = async (req, res) => {
    const { productId } = req.params;

    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found.' });
        }

        // Filter out selected product item
        cart.items = cart.items.filter(item => item.productId !== productId);
        await cart.save();

        return res.status(200).json({
            success: true,
            message: 'Product removed from cart successfully.',
            items: cart.items
        });
    } catch (error) {
        console.error('[REMOVE FROM CART ERROR] Failed to delete item:', error.message);
        return res.status(500).json({ success: false, message: 'Server failed to remove product from cart.' });
    }
};

/**
 * Clear the user's active shopping cart
 */
exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Cart cleared successfully.',
            items: []
        });
    } catch (error) {
        console.error('[CLEAR CART ERROR] Failed to empty cart:', error.message);
        return res.status(500).json({ success: false, message: 'Server failed to clear cart.' });
    }
};
