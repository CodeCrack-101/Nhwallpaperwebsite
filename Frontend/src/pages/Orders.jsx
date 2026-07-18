/**
 * My Orders Page Component File
 * Location: frontend/src/pages/Orders.jsx
 * Description: Fetches and displays the logged-in user's order history from MongoDB.
 */

import React, { useState, useEffect } from 'react';
import { getMyOrders } from '../services/orderService';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getMyOrders();
                if (data.success) {
                    setOrders(data.orders || []);
                }
            } catch (err) {
                console.error('[ORDERS PAGE ERROR] Fail to load orders:', err);
                setError('Failed to load order history. Please try refreshing.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Formatter helpers
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="orders-container loading-state">
                <p>Retrieving your order history...</p>
            </div>
        );
    }

    if (error){
        return (
            <div className="orders-container error-state">
                <p className="error-msg">{error}</p>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="orders-container">
                <div className="orders-header">
                    <h1>My <span>Orders</span></h1>
                    <p>Track progress and inspect details of your past wallpaper purchases.</p>
                </div>

                {orders.length === 0 ? (
                    <div className="empty-orders">
                        <div className="empty-icon">📦</div>
                        <h3>No orders found</h3>
                        <p>You haven't placed any orders yet. Explore our luxury wallpapers to get started.</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order._id} className="order-card">
                                
                                {/* Order Metadata Header */}
                                <div className="order-card-header">
                                    <div className="header-col">
                                        <span className="label">Order Placed</span>
                                        <span className="value">{formatDate(order.orderDate)}</span>
                                    </div>
                                    <div className="header-col">
                                        <span className="label">Total Amount</span>
                                        <span className="value total">{formatCurrency(order.totalAmount)}</span>
                                    </div>
                                    <div className="header-col shipping-col">
                                        <span className="label">Ship To</span>
                                        <span className="value shipping-trigger">
                                            {order.shippingAddress?.city || 'User Address'}
                                            <div className="shipping-tooltip">
                                                <strong>{order.shippingAddress?.streetAddress}</strong>
                                                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                                            </div>
                                        </span>
                                    </div>
                                    <div className="header-col order-num-col">
                                        <span className="label">Order #</span>
                                        <span className="value">{order.orderNumber}</span>
                                    </div>
                                </div>

                                {/* Order Status Status-Banner */}
                                <div className="order-status-banner">
                                    <div className="status-indicator">
                                        <span className={`status-dot ${order.orderStatus.toLowerCase().replace(/\s+/g, '-')}`} />
                                        <h4>Status: <span className="status-text">{order.orderStatus}</span></h4>
                                    </div>
                                    {order.orderStatus === 'Delivered' && (
                                        <p className="delivery-info">
                                            Delivered on {formatDate(order.deliveryDate)}
                                        </p>
                                    )}
                                    {order.orderStatus !== 'Delivered' && (
                                        <p className="delivery-info">
                                            Payment: <span className={`payment-badge ${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Order Products List */}
                                <div className="order-items">
                                    {order.products.map((item, idx) => (
                                        <div key={idx} className="item-row">
                                            <div className="item-image-wrapper">
                                                <img src={item.productImage} alt={item.name} className="item-image" />
                                            </div>
                                            <div className="item-details">
                                                <h3>{item.name}</h3>
                                                <div className="item-meta">
                                                    <span>Qty: <strong>{item.quantity}</strong></span>
                                                    <span className="separator">|</span>
                                                    <span>Price: <strong>{formatCurrency(item.price)}</strong></span>
                                                </div>
                                            </div>
                                            <div className="item-total">
                                                <span>{formatCurrency(item.price * item.quantity)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
