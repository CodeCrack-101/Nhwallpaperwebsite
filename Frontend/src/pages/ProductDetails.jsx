/**
 * Product Details Page Component File
 * Location: frontend/src/pages/ProductDetails.jsx
 * Description: Premium detail view showing product image, details, specifications,
 *              quantity selectors, and Add to Cart/Wishlist integration.
 */

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProductById } from '../data/products';
import { FiHeart, FiShoppingBag, FiArrowLeft, FiStar } from 'react-icons/fi';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    
    // ===============================
    // DATABASE INTEGRATION (FUTURE)
    // TODO: Fetch from MongoDB
    // GET /api/products/:id
    // ===============================
    const product = getProductById(id);

    const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('features');

    if (!product) {
        return (
            <div className="product-details-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
                <h2 style={{ fontSize: '28px', color: '#333', marginBottom: '20px' }}>Wallpaper Not Found</h2>
                <p style={{ color: '#666', marginBottom: '30px' }}>The item you are searching for does not exist in our collections.</p>
                <Link to="/shop" className="btn-add-cart" style={{ display: 'inline-flex', width: 'auto', textDecoration: 'none' }}>
                    <FiArrowLeft /> Back to Shop
                </Link>
            </div>
        );
    }

    const isFav = isInWishlist(product.id);

    const handleQuantityChange = (val) => {
        if (val < 1) return;
        setQuantity(val);
    };

    const handleWishlistToggle = () => {
        if (isFav) {
            removeFromWishlist(product.id);
            
            // ===============================
            // DATABASE INTEGRATION (FUTURE)
            // TODO: Delete from MongoDB
            // ===============================
        } else {
            addToWishlist(product);

            // ===============================
            // DATABASE INTEGRATION (FUTURE)
            // TODO: Save to MongoDB
            // ===============================
        }
    };

    const handleCartSubmit = () => {
        addToCart(product, quantity);

        // ===============================
        // DATABASE INTEGRATION (FUTURE)
        // TODO: Save to MongoDB
        // ===============================
    };

    return (
        <div className="product-details-container">
            <Link to="/shop" className="back-link">
                <FiArrowLeft style={{ marginRight: '5px' }} /> Back to Collections
            </Link>

            <div className="product-grid">
                {/* Left side: High-resolution Product image */}
                <div className="product-image-section">
                    <img src={product.img} alt={product.name} className="product-main-image" />
                </div>

                {/* Right side: Detailed descriptions & purchasing actions */}
                <div className="product-info-section">
                    <span className="product-category">{product.category} Wallpaper</span>
                    <h1 className="product-name">{product.name}</h1>
                    
                    <div className="product-rating">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <FiStar 
                                    key={i} 
                                    fill={i < Math.floor(product.rating) ? "#C89B5B" : "none"} 
                                    color="#C89B5B" 
                                />
                            ))}
                        </div>
                        <span className="reviews-count">({product.reviewsCount} verified reviews)</span>
                    </div>

                    <div className="product-price">
                        ₹{product.price.toLocaleString('en-IN')}
                    </div>

                    <p className="product-desc">{product.description}</p>

                    <div className="purchase-section">
                        <div className="quantity-control">
                            <span className="quantity-label">Select Roll Quantity</span>
                            <div className="qty-btn-group">
                                <button 
                                    className="qty-adjust-btn" 
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <input 
                                    type="number" 
                                    value={quantity} 
                                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                    className="qty-input"
                                />
                                <button 
                                    className="qty-adjust-btn" 
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="action-buttons-group">
                            <button className="btn-add-cart" onClick={handleCartSubmit}>
                                <FiShoppingBag /> Add To Cart
                            </button>
                            
                            <button 
                                className={`btn-wishlist-toggle ${isFav ? 'active' : ''}`}
                                onClick={handleWishlistToggle}
                            >
                                <FiHeart fill={isFav ? "#ffffff" : "none"} /> 
                                {isFav ? 'In Wishlist' : 'Add To Wishlist'}
                            </button>
                        </div>
                    </div>

                    {/* Specifications / Features Accordion Tabs */}
                    <div className="tabs-section">
                        <div className="tab-headers">
                            <button 
                                className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
                                onClick={() => setActiveTab('features')}
                            >
                                Key Features
                            </button>
                            <button 
                                className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
                                onClick={() => setActiveTab('specifications')}
                            >
                                Specifications
                            </button>
                        </div>

                        <div className="tab-pane-content">
                            {activeTab === 'features' ? (
                                <ul className="features-list">
                                    {product.features.map((feat, idx) => (
                                        <li key={idx}>{feat}</li>
                                    ))}
                                </ul>
                            ) : (
                                <table className="specs-table">
                                    <tbody>
                                        {Object.entries(product.specifications).map(([label, val], idx) => (
                                            <tr key={idx}>
                                                <td className="specs-label">{label}</td>
                                                <td className="specs-val">{val}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
