/**
 * Order Controller File
 * Location: backend/controllers/orderController.js
 * Description: Manages user orders, allowing users to fetch their order history
 *              with populated address and product details from MongoDB.
 */

const Order = require('../models/Order');

/**
 * Endpoint: GET /api/orders/my-orders
 * Description: Returns list of orders for the currently logged-in user.
 */
exports.getMyOrders = async (req, res) => {
    try {
        // Find all orders belonging to req.user._id and populate the shippingAddress
        const orders = await Order.find({ user: req.user._id })
            .populate('shippingAddress')
            .sort({ orderDate: -1 }); // Display latest orders first

        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('[GET MY ORDERS ERROR] Fail to fetch user orders:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server failed to retrieve order history.'
        });
    }
};
