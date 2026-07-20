/**
 * Cart Page Component File
 * Location: frontend/src/pages/Cart.jsx
 * Description: Premium Cart details page providing item quantities adjusters,
 *              checkout redirection, totals, and continue shopping options.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import './Cart.css';

const Cart = () => {
    const { cart, totalPrice, updateQuantity, removeFromCart, clearCart, refreshCart } = useCart();

    React.useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const handleQuantityAdjust = (itemId, newQty) => {
        updateQuantity(itemId, newQty);
        
        // ===============================
        // DATABASE INTEGRATION (FUTURE)
        // TODO: Update MongoDB
        // PUT /api/cart/:id
        // ===============================
    };

    const handleItemRemove = (itemId) => {
        removeFromCart(itemId);

        // ===============================
        // DATABASE INTEGRATION (FUTURE)
        // TODO: Delete from MongoDB
        // DELETE /api/cart/:id
        // ===============================
    };

    const handleClearAll = () => {
        if (window.confirm("Are you sure you want to empty your shopping cart?")) {
            clearCart();

            // ===============================
            // DATABASE INTEGRATION (FUTURE)
            // TODO: Delete from MongoDB
            // DELETE /api/cart
            // ===============================
        }
    };

    if (cart.length === 0) {
        return (
            <div className="cart-page-container">
                <div className="empty-cart-view">
                    <div style={{ display: 'inline-flex', padding: '25px', backgroundColor: '#faf6f0', color: '#C89B5B', borderRadius: '50%', fontSize: '40px', marginBottom: '20px' }}>
                        <FiShoppingBag />
                    </div>
                    <h2 className="empty-cart-title">Your shopping cart is empty</h2>
                    <p className="empty-cart-subtitle">Discover our premium wallpapers and find the perfect theme for your spaces.</p>
                    <Link to="/shop" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 30px',
                        backgroundColor: '#C89B5B',
                        color: '#fff',
                        fontWeight: '600',
                        borderRadius: '30px',
                        textDecoration: 'none',
                        boxShadow: '0 4px 15px rgba(200, 155, 91, 0.3)'
                    }}>
                        <FiArrowLeft /> Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page-container">
            <h1 className="cart-title">Your Shopping <span>Cart</span></h1>

            <div className="cart-content-layout">
                {/* Left: Cart Items List */}
                <div className="cart-items-list">
                    {cart.map((item) => (
                        <div key={item.id} className="cart-item-row">
                            <img src={item.img || ''} alt={item.name || 'Product'} className="cart-item-image" />
                            
                            <div className="cart-item-info">
                                <span className="cart-item-category">{item.category || 'Seating'}</span>
                                <h3 className="cart-item-name">{item.name || 'Premium Item'}</h3>
                                <div className="cart-item-price">
                                    ₹{(item.price || 0).toLocaleString('en-IN')} / roll
                                </div>
                            </div>

                            <div className="cart-item-actions">
                                <div className="qty-btn-group">
                                    <button 
                                        className="qty-adjust-btn" 
                                        onClick={() => handleQuantityAdjust(item.id, (item.quantity || 1) - 1)}
                                        disabled={(item.quantity || 1) <= 1}
                                    >
                                        -
                                    </button>
                                    <input 
                                        type="number" 
                                        value={item.quantity || 1} 
                                        onChange={(e) => handleQuantityAdjust(item.id, parseInt(e.target.value) || 1)}
                                        className="qty-input"
                                    />
                                    <button 
                                        className="qty-adjust-btn" 
                                        onClick={() => handleQuantityAdjust(item.id, (item.quantity || 1) + 1)}
                                    >
                                        +
                                    </button>
                                </div>

                                <div style={{ minWidth: '90px', textAlign: 'right', fontWeight: '700', color: '#111', fontSize: '15px' }}>
                                    ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                                </div>

                                <button 
                                    className="cart-item-remove-btn" 
                                    onClick={() => handleItemRemove(item.id)}
                                    title="Remove item"
                                  >
                                      <FiTrash2 />
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>
  
                  {/* Right: Cart Summary Column */}
                  <div className="cart-summary-card">
                      <h2 className="summary-title">Order Summary</h2>
                      
                      <div className="summary-row">
                          <span>Cart Subtotal</span>
                          <span>₹{(totalPrice || 0).toLocaleString('en-IN')}</span>
                      </div>
                      
                      <div className="summary-row">
                          <span>Shipping Cost</span>
                          <span style={{ color: '#1f7a45', fontWeight: '600' }}>FREE Shipping</span>
                      </div>
  
                      <div className="summary-row total">
                          <span>Grand Total</span>
                          <span>₹{(totalPrice || 0).toLocaleString('en-IN')}</span>
                      </div>

                    <div className="cart-action-btn-group">
                        <Link to="/checkout" className="btn-checkout">
                            Proceed to Checkout
                        </Link>
                        
                        <Link to="/shop" className="btn-continue-shopping">
                            Continue Shopping
                        </Link>

                        <button className="btn-clear-cart" onClick={handleClearAll}>
                            Clear Shopping Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
